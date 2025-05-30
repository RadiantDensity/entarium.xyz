"use client";
import { useState } from "react";

export default function EssenceUploadPage() {
  const [cid, setCid] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-to-ipfs", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCid(data.cid);
    console.log("✅ CID:", data.cid);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload to IPFS</h2>
      <input type="file" onChange={handleUpload} />
      {cid && (
        <p className="mt-4">
          Uploaded CID:{" "}
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            {cid}
          </a>
        </p>
      )}
    </div>
  );
}

