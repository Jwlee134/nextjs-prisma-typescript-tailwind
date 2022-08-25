import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "../../../../lib/server/withHandler";
import withSession from "../../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const tweet = await db?.tweet.findUnique({
    where: { id: parseInt(id as string) },
    include: {
      _count: { select: { likes: true } },
      user: { select: { name: true } },
    },
  });
  if (!tweet) {
    res.status(404).json({ ok: false, message: "Tweet doesn't exist." });
    return;
  }
  const isLiked = Boolean(
    await db?.like.findFirst({
      where: { tweetId: parseInt(id as string), userId: user?.id },
    })
  );

  res.status(200).json({ ok: true, res: { ...tweet, isLiked } });
}

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["GET"] })
);
