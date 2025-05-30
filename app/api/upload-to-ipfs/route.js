// app/api/upload-to-ipfs/route.js

import { NextResponse } from 'next/server';
import { create } from 'ipfs-http-client';
import { readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request) {
  try {
    // Read uploaded file (expecting base64)
    const { filename, contentBase64 } = await request.json();

    if (!filename || !contentBase64) {
      return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
    }

    const buffer = Buffer.from(contentBase64, 'base64');
    const tempPath = join(tmpdir(), filename);
    await writeFile(tempPath, buffer);

    // Connect to your local IPFS daemon
    const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });
    const fileBuffer = await readFile(tempPath);
    const result = await ipfs.add(fileBuffer);

    return NextResponse.json({ cid: result.path }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
