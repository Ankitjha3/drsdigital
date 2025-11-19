import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const link = await prisma.downloadLink.findUnique({
      where: { id: params.id },
    });

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!link.isActive) {
      return NextResponse.json({ error: "Inactive download link" }, { status: 410 });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json({ error: "Download link expired" }, { status: 410 });
    }

    return NextResponse.redirect(link.downloadUrl);
  } catch {
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}