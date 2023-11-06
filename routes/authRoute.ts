import express from "express";
import passport from 'passport';
import { forwardAuthenticated,ensureAuthenticated } from "../middleware/checkAuth";
import { userModel } from "../models/userModel";
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const showError = req.query.error === 'true';
  const errorMessage = showError ? "Your login details are not valid. Please try again" : "";
  res.render("login", { errorMessage });
});


/* FIX ME: 😭 failureMsg needed when login fails */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      if (err.message.startsWith("Couldn't find user with email:")) {
        return res.render("login", { errorMessage: err.message });
      }
      return next(err);
    }
    if (!user) {
      return res.render("login", { errorMessage: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

router.post("/revoke-session", ensureAuthenticated, async (req, res) => {
  const sessionIdToRevoke = req.body.sessionId;
  const redisStore = req.sessionStore as any;

  redisStore.destroy(sessionIdToRevoke, (err: any) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred while revoking the session.");
    }
    redisStore.all((err: any, sessions: { [key: string]: any }) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred while retrieving sessions.");
      }

      if (Object.keys(sessions).length > 0) {
        res.redirect("/dashboard");
      } else {
        req.logout((err) => {
          if (err) console.log(err);
          res.redirect("/auth/login");
        });
      }
    });
  });
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/callback', 
  passport.authenticate('github',{ 
    failureRedirect: '/auth/login', 
    successRedirect: "/dashboard" 
  }),
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
