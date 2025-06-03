'use client';
import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef(null);
  const [cid, setCid] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    setCid("");
    setProgress(0);
    const file = fileInputRef.current.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    // Use XMLHttpRequest for progress
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload-to-ipfs");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = async () => {
      setLoading(false);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setCid(data.cid || "Upload failed");
          setProgress(100);

          // POST to n8n webhook for Notion logging (fire-and-forget)
          fetch("https://radiantdensity.app.n8n.cloud/webhook/7cbd8b05-e947-42d5-b115-e96098df5038", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              cid: data.cid,
              uploadedAt: new Date().toISOString(),
            }),
          });

        } catch (err) {
          setError("Upload completed but invalid response.");
        }
      } else {
        setError("Upload failed. Server error.");
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setError("Upload failed. Network error.");
    };

    xhr.send(formData);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4 w-full max-w-sm">
        <input type="file" ref={fileInputRef} className="border p-2 w-full" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload to IPFS"}
        </button>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded h-3 mt-2">
            <div
              className="bg-blue-600 h-3 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </form>
      {cid && (
        <div className="mt-4 p-4 bg-green-100 text-green-900 rounded w-full max-w-sm text-center">
          <div className="font-bold">Upload Successful!</div>
          <div className="break-all">
            CID: <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">{cid}</a>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-900 rounded w-full max-w-sm text-center">
          {error}
        </div>
      )}
    </main>
  );
}
