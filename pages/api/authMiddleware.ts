import { NextApiRequest, NextApiResponse } from 'next';

export const authMiddleware = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const token = req.headers.authorization;

    if (token !== process.env.ADMIN_AUTH_SECRET) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    next();
};
