import { getFile } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const img = await getFile(params.id);
    const imgBlob = await fetch(img).then((res) => res.blob());
    const buffer = await imgBlob.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error, {
      headers: {
        "Content-Type": "text/plain",
      },
      status: 404,
    });
  }
}
