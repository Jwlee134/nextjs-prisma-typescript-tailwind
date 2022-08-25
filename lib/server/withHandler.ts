import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Method = "GET" | "POST";

interface Config {
  isPrivate?: boolean;
  methods: Method[];
}

export default function withHandler(
  handler: NextApiHandler,
  { isPrivate, methods }: Config
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as Method)) {
      res.status(405).json({ ok: false, message: "Invalid request." });
      return;
    }
    if (isPrivate && !req.session.user?.id) {
      res.status(401).json({ ok: false, message: "Unauthorized." });
      return;
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Please try again later." });
    }
  };
}
