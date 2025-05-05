from fastapi import APIRouter, HTTPException, Query
from database import get_connection
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserRegister(BaseModel):
    org_email: EmailStr
    username: str
    email: EmailStr
    password: str
    phone: str
    address: str


@router.post("/register")
def register(user: UserRegister):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            # ✅ Check if email already exists
            cur.execute("SELECT * FROM users WHERE email = %s", (user.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Email already registered")
            
            # ✅ Check if organization email exists
            cur.execute("SELECT email FROM organizations WHERE email = %s", (user.org_email,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=400, detail="Organization email is not found!")
            
            # ✅ Get organization id
            cur.execute("SELECT organization_id FROM organizations WHERE email = %s", (user.org_email,))
            organization_id=cur.fetchone()

            # ✅ Hash password
            hashed_pw = bcrypt.hash(user.password)

            # ✅ Insert into users table
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
            conn.commit()
    
        conn.close()
        return {
                    "message": "User registered successfully",
                    "email": user.email,
                    "username": user.username
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
def login(user: UserLogin):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            # 🔍 Check if user exists
            cur.execute("SELECT user_name, email, password FROM users WHERE email = %s", (user.email,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Email is not registered")

            username, email, hashed_pw = result

            # 🔐 Check password
            if not bcrypt.verify(user.password, hashed_pw):
                raise HTTPException(status_code=401, detail="Incorrect password")

        conn.close()

        return {
            "message": "Login successful",
            "email": email,
            "username": username
        }

    except HTTPException:
        raise  # Let known HTTP errors propagate
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

