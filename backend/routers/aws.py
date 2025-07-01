# upload_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
import os


router = APIRouter(prefix="/aws", tags=["Aws"])

s3 = boto3.client("s3")

class UploadRequest(BaseModel):
    filename: str
    content_type: str


#with IAM role
@router.post("/generate-upload-url")
def generate_presigned_upload_url(req: UploadRequest):
    try:
        presigned_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": "ota-firmware-tarim-app",
                "Key": req.filename,
                "ContentType": req.content_type,
                "ACL": "public-read",  # Allows public read access
            },
            ExpiresIn=300  # URL valid for 5 minutes
        )
        return {"upload_url": presigned_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate upload URL: {str(e)}")
    

#with IAM user
# @router.post("/generate-upload-url")
# def generate_presigned_upload_url(req: UploadRequest):
#     try:
#         url = s3.generate_presigned_url(
#             "put_object",
#             Params={
#                 "Bucket": "ota-firmware-tarim-app",
#                 "Key": f"firmware.bin",
#                 "ContentType": req.content_type,
#                 "ACL": "bucket-owner-full-control"
#             },
#             ExpiresIn=300  # 5 minutes
#         )
#         return {"upload_url": url}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
