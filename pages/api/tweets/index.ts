import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/db";
import withHandler from "../../../lib/server/withHandler";
import withSession from "../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { lastId },
      session: { user },
    } = req;
    const parsedId = parseInt(lastId as string);
    const tweets = await db?.tweet.findMany({
      take: 10,
      ...(parsedId && { skip: 1, cursor: { id: parsedId } }),
      include: {
        _count: { select: { likes: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const tweetsWithLiked = await Promise.all(
      tweets.map(async (tweet) => {
        const isLiked = Boolean(
          await db?.like.findFirst({
            where: { tweetId: tweet.id, userId: user?.id },
          })
        );
        return { ...tweet, isLiked };
      })
    );
    res.status(200).json({ ok: true, res: tweetsWithLiked || [] });
  }
  if (req.method === "POST") {
    const {
      body: { title, content },
      session: { user },
    } = req;
    const tweet = await db?.tweet.create({
      data: { title, content, user: { connect: { id: user?.id } } },
      select: { id: true },
    });
    res.status(200).json({ ok: true, res: { id: tweet?.id } });
  }
}

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["GET", "POST"] })
);
