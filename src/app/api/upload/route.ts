import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(
  req: Request
) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    const folder =
      formData.get(
        "folder"
      ) as string;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No file provided",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const base64 =
      `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder,
        }
      );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}