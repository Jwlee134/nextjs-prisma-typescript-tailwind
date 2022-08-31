import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "../../../../../../lib/server/withHandler";
import withSession from "../../../../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, cid, lastId },
    session: { user },
  } = req;
  const tweet = await db?.tweet.findUnique({
    where: { id: parseInt(id as string) },
    include: {
      _count: { select: { likes: true, comments: true } },
      user: { select: { name: true } },
    },
  });
  if (!tweet) {
    res.status(404).json({ ok: false, message: "Tweet doesn't exist." });
    return;
  }
  const comments = await db?.comment.findMany({
    where: { parentId: +(cid as string), tweetId: +(id as string) },
    include: {
      user: { select: { name: true } },
      _count: { select: { commentLikes: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 5,
    ...(lastId && {
      skip: 1,
      cursor: { id: +(lastId as string) },
    }),
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

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["GET"] })
);
