# upload_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
import os


router = APIRouter(prefix="/aws", tags=["Aws"])

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key= os.getenv("AWS_SECRET_ACCESS_KEY")
    
    
    )

class UploadRequest(BaseModel):
    filename: str
    content_type: str



@router.post("/generate-upload-url")
def generate_presigned_upload_url(req: UploadRequest):
    try:
        url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": "ota-firmware-tarim-app",
                "Key": req.filename,
                "ContentType": req.content_type,
                "ACL": "bucket-owner-full-control"
            },
            ExpiresIn=300
        )
        return {"upload_url": url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate upload URL: {str(e)}")
    


