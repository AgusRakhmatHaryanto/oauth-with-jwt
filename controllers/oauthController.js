const passport = require("passport");
// require("../middleware/passport");
require("dotenv").config();
const jwtUtils = require("../utils/jwtUtils");
const api = process.env.API;
const authMiddleware = require("../middleware/auth");
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

exports.authenticateGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`/${api}/oauth/auth/failure`);

    // Setelah otentikasi sukses, buat token JWT dan kirimkan ke client
    const token = jwtUtils.generateJwt(user);
    return res.redirect(`/${api}/oauth/protected?token=${token}`);
  })(req, res, next);
};

exports.protectedRoute = (req, res) => {
  res.send(`Hello! <a href="/${api}/oauth/logout">Logout</a>`);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.send(
        `Logged out successfully <a href="/${api}/oauth">Go back to home page</a>`
      );
    });
  });
};

exports.authFailure = (req, res) => {
  res.send("Failed to authenticate..");
};
