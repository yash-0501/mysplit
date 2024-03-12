import passport, { use } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../user/user.models";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      // if user exists or not
      const user = await User.findOne({ email });

      // validate creds

      // @ts-ignore
      if (user && (await user.comparePassword(password))) done(null, user);
      else done(null, false);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
