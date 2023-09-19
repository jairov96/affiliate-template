import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const slug = req.query.slug as string;

    if (req.method === 'GET') {
        try {
            const post = await prisma.post.findUnique({
                where: { slug },
            });
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ error: 'Unable to fetch post' });
        }
    }

    if (req.method === 'PUT') {
        authMiddleware(req, res, async () => {
            const { title, content, description } = req.body;
    
            try {
                const post = await prisma.post.update({
                    where: { slug },
                    data: { title, content, description },
                });
                return res.status(200).json(post);
            } catch (error) {
                return res.status(500).json({ error: 'Unable to update post' });
            }
        });
    }

    if (req.method === 'DELETE') {
        authMiddleware(req, res, async () => {
            try {
                await prisma.post.delete({
                    where: { slug },
                });
                return res.status(204).end(); // No content to send
            } catch (error) {
                return res.status(500).json({ error: 'Unable to delete post' });
            }
        });
    }

}
