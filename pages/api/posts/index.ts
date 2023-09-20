import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import matter from 'gray-matter';


const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { markdown } = req.body;

      // Extract data using gray-matter
      const { data, content } = matter(markdown);

      // Store the post in the database
      const post = await prisma.post.create({
        data: {
          title: data.title,
          description: data.description,
          content: content,
          slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
          // Add other fields like createdAt, tags, etc. from `data` as needed
        },
      });

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create post' });
    }
  }
  
  if (req.method === 'GET') {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 5;

    try {
      const posts = await prisma.post.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' }, // Assuming you have a 'createdAt' column. Order them by latest.
      });
      const totalPosts = await prisma.post.count();
      return res.status(200).json({ posts, totalPosts });
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch posts.' });
    }
  }
}
