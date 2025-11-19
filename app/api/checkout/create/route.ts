import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    const totalAmount = product.salePrice * quantity;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "pending",
        totalAmount,
        items: {
          create: {
            productId: product.id,
            quantity,
            price: product.salePrice,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

