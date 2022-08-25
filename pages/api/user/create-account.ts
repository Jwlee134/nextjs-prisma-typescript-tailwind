import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withHandler from "../../../lib/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;
  const exists = await db?.user.findUnique({ where: { email } });
  if (exists) {
    res
      .status(409)
      .json({ ok: false, message: "This email is already taken." });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  await db?.user.create({
    data: { name, email, password: hashed },
  });
  res.status(200).json({ ok: true });
}

export default withHandler(handler, { methods: ["POST"] });
