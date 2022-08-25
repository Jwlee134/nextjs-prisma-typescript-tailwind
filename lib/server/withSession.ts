import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

export default function (handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, {
    cookieName: "mini_twitter",
    password: "DkPXNVnET0io9pYVveVFAouDCHGgByft",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
