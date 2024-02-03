const passport = require("passport");
require("../middleware/passport");
require("dotenv").config();
const jwtUtils = require("../utils/jwtUtils");
const api = process.env.API;
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

exports.authenticateGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

// exports.handleGoogleCallback = passport.authenticate("google", {
//   failureRedirect: `/${api}/auth/failure`,
//   successRedirect: `/${api}/protected`,
// });
exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`/${api}/auth/failure`);

    // Setelah otentikasi sukses, buat token JWT dan kirimkan ke client
    const token = jwtUtils.generateJwt(user);
    return res.redirect(`/${api}/protected?token=${token}`);
  })(req, res, next);
};

// exports.protectedRoute = (req, res) => {
//   res.send(`Hello, ${req.user.username}! <a href="/${api}/logout">Logout</a>`);
// };

exports.protectedRoute = (req, res) => {
  const token = req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Periksa waktu kadaluarsa token
  const decodedToken = jwtUtils.verifyJwt(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }

  // Lanjutkan ke endpoint yang dilindungi
  res.send(
    `Hello, ${decodedToken.user.username}! <a href="/${api}/logout">Logout</a>`
  );
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
        `Logged out successfully <a href="/${api}">Go back to home page</a>`
      );
    });
  });
};

exports.authFailure = (req, res) => {
  res.send("Failed to authenticate..");
};
