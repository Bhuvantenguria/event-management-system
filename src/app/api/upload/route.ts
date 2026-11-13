import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  const configured = isCloudinaryConfigured();
  return NextResponse.json({
    status: configured ? "ready" : "fallback_mode",
    isCloudinaryConfigured: configured,
    message: configured
      ? "Cloudinary image service is active and connected."
      : "Operating in local data URL fallback mode. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env to enable direct cloud uploads.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle multipart form-data file upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "rangmanch26/payments";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form-data." },
          { status: 400 }
        );
      }

      // Check file size (max 8MB)
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "File size exceeds 8MB limit." },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToCloudinary(buffer, folder);

      if (!result.success && !result.url) {
        return NextResponse.json(
          { success: false, error: result.error || "Failed to upload image." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
        format: result.format,
      });
    }

    // 2. Handle JSON payload with base64 data URL
    const body = await req.json();
    const { image, folder = "rangmanch26/payments" } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing 'image' string in request body." },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(image, folder);

    if (!result.success && !result.url) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to upload image." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      format: result.format,
    });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error during upload." },
      { status: 500 }
    );
  }
}
