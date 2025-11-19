import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashed, isAdmin: true, name: name || "Admin" },
      create: { email, password: hashed, isAdmin: true, name: name || "Admin" },
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
  } catch {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}