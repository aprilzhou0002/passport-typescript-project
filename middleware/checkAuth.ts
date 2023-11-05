import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && userModel.isAdmin(req.user.id)) {
    return next();
  } else {
    res.status(403).send('Access denied');
  }
};
