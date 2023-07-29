import { getFile } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const img = await getFile(params.id);
    const imgBlob = await fetch(img).then((res) => res.blob());
    return new NextResponse(imgBlob, {
      headers: {
        "Content-Type": "image/*",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `attachment; filename="${params.id}.png"`,
      },
      status: 200,
    });
  } catch (error) {}
}
