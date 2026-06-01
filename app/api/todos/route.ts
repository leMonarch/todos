import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  const todo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(todo);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { id, done } = await request.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: { done },
  });
  return NextResponse.json(todo);
}