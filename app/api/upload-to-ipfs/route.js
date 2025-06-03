export const runtime = "nodejs";

import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { logUpload } from "@/lib/cidLogger";

export const config = {
  api: { bodyParser: false },
};

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { files } = await parseForm(req);
    const file = files.file;
    if (!file || !file.filepath) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const fileBuffer = fs.readFileSync(file.filepath);

    // Modern Helia upload: just pass the Buffer!
    const helia = await createHelia();
    const fsys = unixfs(helia);
    const cid = await fsys.addFile(fileBuffer);

    logUpload({ cid: cid.toString(), filename: file.originalFilename });

    return NextResponse.json({ cid: cid.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
