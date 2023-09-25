import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query.slug as string;
  const fields = (req.query.fields as string)?.split(",");

  if (req.method === "GET") {
    try {
      const fieldsParam = req.query.fields as string | undefined;
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
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: "Unable to fetch post" });
    }
  }

  if (req.method === "PUT") {
    authMiddleware(req, res, async () => {
      const { title, content, description } = req.body;

      try {
        const post = await prisma.post.update({
          where: { slug },
          data: { title, content, description },
        });
        return res.status(200).json(post);
      } catch (error) {
        return res.status(500).json({ error: "Unable to update post" });
      }
    });
  }

  if (req.method === "DELETE") {
    authMiddleware(req, res, async () => {
      try {
        await prisma.post.delete({
          where: { slug },
        });
        return res.status(204).end(); // No content to send
      } catch (error) {
        return res.status(500).json({ error: "Unable to delete post" });
      }
    });
  }
}
