const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy; 
const Model = require("../models");
const User = Model.User;
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existDataUser = await User.findOne({
          where: { googleId: profile.id },
        });

        if (existDataUser) {
          return done(null, existDataUser);
        }

        const baseUsername = profile.displayName
          .toLowerCase()
          .replace(/\s/g, "");

        function findUniqueUsername(baseUsername, counter) {
          const candidateUsername =
            counter === 0
              ? baseUsername
              : generateUniqueUsername(baseUsername, counter);

          return User.findOne({ where: { username: candidateUsername } }).then(
            (existingUser) => {
              if (existingUser) {
                return findUniqueUsername(baseUsername, counter + 1);
              } else {
                return candidateUsername;
              }
            }
          );
        }

        function generateUniqueUsername(baseUsername, counter) {
          return `${baseUsername}${counter}`;
        }

        const uniqueUsername = await findUniqueUsername(baseUsername, 0);

        const user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (user) {
          done(null, user);
        } else {
          const newUser = await User.create({
            googleId: profile.id,
            username: uniqueUsername,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });

          done(null, newUser);
        }
      } catch (error) {
        console.error("Error during GoogleStrategy:", error);
        done(error, null);
      }
    }
  )
);
