import { NextResponse } from 'next/server'
import { create } from 'ipfs-http-client'
import { Client } from '@notionhq/client'
import formidable from 'formidable'
import fs from 'fs-extra'

export const config = {
  api: { bodyParser: false }
}

const ipfs = create({ url: process.env.IPFS_API })
const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_DB_ID

export async function POST(req) {
  const form = formidable({ multiples: false })
  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
  const { fields, files } = data
  const file = files.file
  const buffer = await fs.readFile(file.filepath)
  const ipfsResult = await ipfs.add(buffer)
  const hash = ipfsResult.cid.toString()
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: file.originalFilename } }] },
      Email: fields.email ? { email: fields.email } : undefined,
      Description: fields.description ? { rich_text: [{ text: { content: fields.description } }] } : undefined,
      Hash: { rich_text: [{ text: { content: hash } }] },
      Timestamp: { date: { start: new Date().toISOString() } }
    }
  })
  return NextResponse.json({ ok: true, hash })
}
