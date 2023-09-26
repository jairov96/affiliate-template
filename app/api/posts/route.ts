import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import matter from 'gray-matter';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  const all = req.nextUrl.searchParams.get("all");

  try {
    let posts;
    if (all) {
      // Fetch all posts if 'all' is true
      posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const skip = Number(req.nextUrl.searchParams.get("skip")) || 0;
      const take = Number(req.nextUrl.searchParams.get("get")) || 5;

      // Fetch posts with pagination if 'all' is not true
      posts = await prisma.post.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
      });
    }

    const totalPosts = await prisma.post.count();
    return NextResponse.json(posts, {status: 200})

  } catch (error) {
    return NextResponse.json({"error": "Unable to fetch posts"}, {status: 500})
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  // body must have object "markdown"
  try {
    const body = await req.json();

    // Extract data using gray-matter
    const { data, content } = matter(body.markdown);
    
    // Generate slug
    const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-');

    // Store the post in the database
    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        content: content,
        slug: slug,
        // Add other fields like createdAt, tags, etc. from `data` as needed
      },
    });

    return NextResponse.json(post, {status: 201})

  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Handle duplicate slug error
      return NextResponse.json({ error: 'A post with the same slug already exists.' }, {status: 409})
    } else {
      // Handle other errors
      return NextResponse.json({ error: 'Unable to create post.', details: error.message }, {status: 500})
    }
  }
}