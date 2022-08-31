import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "../../../../../lib/server/withHandler";
import withSession from "../../../../../lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
      query: { id },
      body: { id: commentId },
    } = req;
    const tweet = await db?.tweet.findUnique({
      where: { id: parseInt(id as string) },
    });
    if (!tweet) {
      res.status(404).json({ ok: false, message: "Tweet doesn't exist." });
      return;
    }
    const like = await db?.commentLike.findFirst({
      where: { userId: user?.id, commentId },
    });
    if (like) {
      await db?.commentLike.delete({ where: { id: like.id } });
    } else {
      await db?.commentLike.create({
        data: {
          user: { connect: { id: user?.id } },
          comment: { connect: { id: commentId } },
        },
      });
    }
    res.status(200).json({ ok: true });
  }
}

export default withSession(
  withHandler(handler, { isPrivate: true, methods: ["POST"] })
);
