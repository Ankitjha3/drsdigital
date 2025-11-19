import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, originalPrice, salePrice, discount, imageUrl, fileUrl, isActive } =
      await request.json();

    if (!title || !originalPrice || !salePrice) {
      return NextResponse.json(
        { error: "Title, original price, and sale price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        description: description || null,
        originalPrice: parseFloat(originalPrice),
        salePrice: parseFloat(salePrice),
        discount: discount || 0,
        imageUrl: imageUrl || null,
        fileUrl: fileUrl || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

