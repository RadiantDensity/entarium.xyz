import { NextResponse } from 'next/server';

export const config = {
  api: { bodyParser: false }
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 });
  }

  // Pinata endpoint and headers
  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const body = new FormData();
  body.append('file', file.stream(), file.name);

  const res = await fetch(pinataEndpoint, {
    method: 'POST',
    headers: {
      'pinata_api_key': process.env.PINATA_API_KEY,
      'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
    },
    body,
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  const data = await res.json();

  // Optionally: log to Notion here...

  return NextResponse.json({ ok: true, cid: data.IpfsHash });
}


