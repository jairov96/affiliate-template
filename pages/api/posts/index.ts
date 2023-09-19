import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
