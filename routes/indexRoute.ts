import express from "express";
const router = express.Router();
const app = express();
import session from "express-session";
import { ensureAuthenticated } from "../middleware/checkAuth";
import { userModel } from '../models/userModel'; 
import { v4 as uuidv4 } from 'uuid';

app.use(session({
  genid: function(req) {
    return uuidv4();
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const userId = req.user?.id || 0;
  const isAdmin = userModel.isAdmin(userId);
  if (!isAdmin) {
    res.render("dashboard", {
      user: req.user,
    });
    return
  }else{
    const redisStore = req.sessionStore as any;

    redisStore.all((err: any, sessions: { [key: string]: any }) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred while retrieving sessions.");
      }
      
      const sessionInfo = Object.keys(sessions).map((id) => {
        return {
          sessionId: id,
          userId: sessions[id].passport?.user,
        };
      });

      res.render("dashboard", {
        user: req.user,
        isAdmin: isAdmin,
        sessions: sessionInfo,
      });
    });
  }
});



export default router;
