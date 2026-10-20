import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { prisma } from "../lib/prisma.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (user) return done(null, user);
      return done(false);
    } catch (err) {
      return done(err);
    }
  }),
);
