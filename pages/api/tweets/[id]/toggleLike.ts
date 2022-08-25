import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/server/db";
import withHandler from "../../../../lib/server/withHandler";
import withSession from "../../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const tweet = await db.tweet.findUnique({
    where: { id: parseInt(id as string) },
  });
  if (!tweet) {
    res.status(404).json({ ok: false, message: "Tweet doesn't exist." });
    return;
  }
  const like = await db.like.findFirst({
    where: { userId: user?.id, tweetId: tweet.id },
  });
  if (like) {
    await db.like.delete({ where: { id: like.id } });
  } else {
    await db.like.create({
      data: {
        user: { connect: { id: user?.id } },
        tweet: { connect: { id: tweet.id } },
      },
    });
  }
  res.status(200).json({ ok: true });
}

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["POST"] })
);
