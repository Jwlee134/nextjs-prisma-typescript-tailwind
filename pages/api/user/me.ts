import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../../../lib/server/withSession";
import db from "../../../lib/server/db";
import withHandler from "../../../lib/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id || 0;
  const user = await db.user.findUnique({ where: { id } });
  res.status(200).json({ ok: true, res: user });
}

export default withSession(withHandler(handler, { methods: ["GET"] }));
