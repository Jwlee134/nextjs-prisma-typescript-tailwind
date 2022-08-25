import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withSession from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandler";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const user = await db?.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ ok: false, message: "User doesn't exist." });
    return;
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    res.status(403).json({ ok: false, message: "Password doesn't match." });
    return;
  }
  req.session.user = { id: user.id };
  await req.session.save();
  res.status(200).json({ ok: true, res: user });
}

export default withSession(withHandler(handler, { methods: ["POST"] }));
