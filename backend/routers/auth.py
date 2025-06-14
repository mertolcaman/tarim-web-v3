from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel, EmailStr, model_validator
from passlib.hash import bcrypt
from typing import Optional


router = APIRouter(prefix="/auth", tags=["Auth"])

class UserRegister(BaseModel):
    account_type: str
    org_email: Optional[EmailStr] = None
    username: str
    email: Optional[EmailStr] = None
    password: str
    phone: str
    address: str
    @model_validator(mode="after")
    def validate_emails(self):
        if self.account_type == "user" and not self.email:
            raise ValueError("User registration requires a personal email.")
        if self.account_type == "organization" and not self.org_email:
            raise ValueError("Organization registration requires an organization email.")
        return self

@router.post("/register")
def register(user: UserRegister):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            if user.account_type == "user":
                # ✅ Check if user email already exists
                cur.execute("SELECT * FROM users WHERE email = %s", (user.email,))
                if cur.fetchone():
                    raise HTTPException(status_code=400, detail="Email already registered")

                organization_id = None

                # ✅ Only try to fetch organization_id if org_email is provided
                if user.org_email:
                    cur.execute("SELECT organization_id FROM organizations WHERE email = %s", (user.org_email,))
                    org_row = cur.fetchone()
                    if not org_row:
                        raise HTTPException(status_code=400, detail="Organization email is not found!")
                    organization_id = org_row[0]

                # ✅ Hash password
                hashed_pw = bcrypt.hash(user.password)

                # ✅ Insert into users table (organization_id may be null)
                cur.execute("""
                    INSERT INTO users (organization_id, user_name, email, password, phone_number, address)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    organization_id,
                    user.username,
                    user.email,
                    hashed_pw,
                    user.phone,
                    user.address
                ))
                

            elif user.account_type == "organization":
                # ✅ Check if org email already exists
                cur.execute("SELECT * FROM organizations WHERE email = %s", (user.org_email,))
                if cur.fetchone():
                    raise HTTPException(status_code=400, detail="Organization email already registered")

                # ✅ Hash password
                hashed_pw = bcrypt.hash(user.password)

                # ✅ Insert into organizations table
                cur.execute("""
                    INSERT INTO organizations (email, organization_name, password, phone_number, address)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    user.org_email,
                    user.username,
                    hashed_pw,
                    user.phone,
                    user.address
                ))

            else:
                raise HTTPException(status_code=400, detail="Invalid account type")

            conn.commit()

        conn.close()
        return {
            "message": "Registration successful",
            "type": user.account_type,
            "username": user.username,
            "email": user.email if user.account_type == "user" else user.org_email
        }

    except HTTPException:
        raise  # re-raise known exceptions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






class UserLogin(BaseModel):
    account_type: str
    email: EmailStr
    password: str

@router.post("/login")
def login(user: UserLogin):
    try:
        conn = get_connection()
        with conn.cursor() as cur:

            if user.account_type == "user":
                cur.execute("SELECT user_name, email, password FROM users WHERE email = %s", (user.email,))
                result = cur.fetchone()
                if not result:
                    raise HTTPException(status_code=404, detail="User email is not registered")
                username, email, hashed_pw = result

            elif user.account_type == "organization":
                cur.execute("SELECT organization_name, email, password FROM organizations WHERE email = %s", (user.email,))
                result = cur.fetchone()
                if not result:
                    raise HTTPException(status_code=404, detail="Organization email is not registered")
                username, email, hashed_pw = result

            else:
                raise HTTPException(status_code=400, detail="Invalid account type")

            # 🔐 Check password
            if not bcrypt.verify(user.password, hashed_pw):
                raise HTTPException(status_code=401, detail="Incorrect password")

        conn.close()

        return {
            "message": f"{user.account_type.capitalize()} login successful",
            "email": email,
            "username": username
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
