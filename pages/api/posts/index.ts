import { Prisma, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import matter from 'gray-matter';


const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { markdown } = req.body;

      // Extract data using gray-matter
      const { data, content } = matter(markdown);
      
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

      res.status(201).json(post);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle duplicate slug error
        res.status(409).json({ error: 'A post with the same slug already exists.' });
      } else {
        // Handle other errors
        res.status(500).json({ error: 'Unable to create post.', details: error.message });
      }
    }
  }
  
  if (req.method === 'GET') {
    const all = req.query.all === 'true'; // Check if 'all' query parameter is set to true

    try {
      let posts;
      if (all) {
        // Fetch all posts if 'all' is true
        posts = await prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } else {
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 5;

        // Fetch posts with pagination if 'all' is not true
        posts = await prisma.post.findMany({
          skip: skip,
          take: take,
          orderBy: { createdAt: 'desc' },
        });
      }

      const totalPosts = await prisma.post.count();
      return res.status(200).json({ posts, totalPosts });
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch posts.' });
    }
  }
}
