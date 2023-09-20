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

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create post' });
    }
  }
  
  if (req.method === 'GET') {
   try {
      const posts = await prisma.post.findMany();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch posts.' });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
