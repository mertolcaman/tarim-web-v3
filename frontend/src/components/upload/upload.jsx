import { useState } from "react";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleUpload = async () => {
        if (!file) return alert("Please select a file.");

        setStatus("Requesting upload URL...");

        // Step 1: Get pre-signed PUT URL from backend
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/aws/generate-upload-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filename: "firmware.bin", // filename to overwrite in S3
                content_type: file.type,
            }),
        });

        if (!res.ok) {
            setStatus("Failed to get upload URL.");
            return;
        }

        const { upload_url } = await res.json();

        // Step 2: Upload the file to S3
        setStatus("Uploading to S3...");

        const uploadRes = await fetch(upload_url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
                "x-amz-acl": "bucket-owner-full-control", // 👈 Match your S3 bucket policy
            },
            body: file,
        });

        if (uploadRes.ok) {
            setStatus("✅ Upload successful! `firmware.bin` updated.");
        } else {
            setStatus("❌ Upload failed.");
        }
    };

    return (
        <div>
            <h2>Upload Firmware to S3</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload firmware.bin</button>
            <p>{status}</p>
        </div>
    );
}
