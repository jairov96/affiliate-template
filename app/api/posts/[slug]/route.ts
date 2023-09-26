import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: NextRequest, { params }: { params: { slug: string } }, res: NextResponse ) {

    const slug = params.slug
  
  const fields = (req.nextUrl.searchParams.get("fields") as string)?.split(",");

  try {
    const fieldsParam = req.nextUrl.searchParams.get("fields") as string | undefined;
    const fields = fieldsParam?.split(",") || [];

    let selectFields: { [key: string]: boolean } | undefined;

    if (fields.length > 0) {
      selectFields = fields.reduce(
        (acc: { [key: string]: boolean }, field) => {
          acc[field] = true;
          return acc;
        },
        {}
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      select: selectFields || undefined, // if selectFields is empty, it will return the whole object
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, {status: 404});
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch post" }, {status: 500});
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const slug = req.nextUrl.searchParams.get("slug") as string;
  const { title, content, description } = await req.json();

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { title, content, description },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Unable to update post" }, {status: 500});
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const slug = req.nextUrl.searchParams.get("slug") as string;

  try {
    await prisma.post.delete({
      where: { slug },
    });
    return NextResponse.json({status: 204}); // No content to send
  } catch (error) {
    return NextResponse.json({ error: "Unable to delete post" }, {status: 500});
  }
}
