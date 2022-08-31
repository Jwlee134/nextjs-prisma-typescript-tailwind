import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "../../../../../lib/server/withHandler";
import withSession from "../../../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id, lastId },
      session: { user },
    } = req;
    const comments = await db?.comment.findMany({
      where: { tweetId: parseInt(id as string), parentId: null },
      include: {
        user: { select: { name: true } },
        _count: { select: { commentLikes: true, children: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      ...(lastId && { skip: 1, cursor: { id: parseInt(lastId as string) } }),
    })!;
    const commentsWithLike = await Promise.all(
      comments?.map(async (comment) => {
        const isLiked = Boolean(
          await db?.commentLike.findFirst({
            where: { userId: user?.id, commentId: comment.id },
          })
        );
        return { ...comment, isLiked };
      })
    );
    res.status(200).json({ ok: true, res: commentsWithLike });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      query: { id },
      body: { comment, parentId },
    } = req;
    const tweet = await db?.tweet.findUnique({
      where: { id: parseInt(id as string) },
    });
    if (!tweet) {
      res.status(404).json({ ok: false, message: "Tweet doesn't exist." });
      return;
    }
    await db?.comment.create({
      data: {
        content: comment,
        user: { connect: { id: user?.id } },
        tweet: { connect: { id: tweet.id } },
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      },
    });
    res.status(200).json({ ok: true });
  }
}

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["GET", "POST"] })
);
