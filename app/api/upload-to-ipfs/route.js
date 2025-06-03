export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { create } from "ipfs-http-client";
import formidable from "formidable";
import fs from "fs";
import { logUpload } from "@/lib/cidLogger";

export const config = {
  api: {
    bodyParser: false,
  },
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

    const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
    const data = fs.readFileSync(file.filepath);
    const result = await ipfs.add(data);

    logUpload({
      cid: result.path,
      filename: file.originalFilename,
    });

    return NextResponse.json({ cid: result.path });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
