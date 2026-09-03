import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

function assetDirectory() {
  const candidates = [
    path.join(process.cwd(), "assets", "visual", "editorial", "sub-batch-01"),
    path.join(process.cwd(), "..", "..", "assets", "visual", "editorial", "sub-batch-01"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

export async function GET(
  _request: Request,
  { params }: { params: { filename: string } },
) {
  const filename = path.basename(params.filename);
  if (filename !== params.filename || !/^[a-zA-Z0-9._-]+\.(?:jpg|jpeg|png|webp)$/.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const directory = assetDirectory();
  if (!directory) return new NextResponse("Not found", { status: 404 });

  const filePath = path.join(directory, filename);
  if (!existsSync(filePath)) return new NextResponse("Not found", { status: 404 });

  const body = await readFile(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
