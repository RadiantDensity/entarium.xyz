'use client'
import { useState } from 'react'

export default function EssenceUpload() {
  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('Uploading...')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    formData.append('description', desc)
    const res = await fetch('/api/essence-upload', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const { hash } = await res.json()
      setStatus(`Success! Uploaded to IPFS: ${hash}`)
    } else {
      setStatus('Upload failed')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Essence Upload</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="file" onChange={e => setFile(e.target.files[0])} required className="text-black bg-white px-4 py-2 rounded" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required className="text-black px-4 py-2 rounded" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your essence (optional)" className="text-black px-4 py-2 rounded" />
          <button type="submit" className="px-6 py-2 rounded-2xl bg-white text-black font-bold shadow hover:bg-gray-200" disabled={!file}>Upload Essence</button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </main>
  )
}

