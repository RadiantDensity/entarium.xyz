import { NextResponse } from 'next/server';

export const config = {
  api: { bodyParser: false }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 });
    }

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
    return NextResponse.json({ ok: true, cid: data.IpfsHash });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
