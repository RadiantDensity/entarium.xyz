'use client';
import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef(null);
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    setLoading(true);
    const file = fileInputRef.current.files[0];
    if (!file) {
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-to-ipfs", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setCid(data.cid || "Error uploading");
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4">
        <input type="file" ref={fileInputRef} className="border p-2" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload to IPFS"}
        </button>
      </form>
      {cid && (
        <div className="mt-4">
          <div className="font-bold">CID:</div>
          <div className="break-all">{cid}</div>
        </div>
      )}
    </main>
  );
}
