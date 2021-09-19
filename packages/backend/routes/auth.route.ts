import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import {
  HandleLogin,
  HandleRefreshToken,
  HandleRegister,
} from "controllers/auth.controller";
import { signin_schema, signup_schema } from "routes/schemas/auth.schema";

import { logger } from "../util/logger";

import type { API } from "@pms-alpha/types";

const router = Router();

// /auth/login endpoint
router.post(
  "/login",
  checkSchema(signin_schema),
  async (req: Request, res: Response<API.Response<API.Auth.LoginResponse>>) => {
    logger("/auth/login");

    // schema validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // concat array of errors to one string
      const err = errors
        .array()
        .map((i) => `${i.param}: ${i.msg}`)
        .join("\n");
      logger("Login schema validation failed", "info");
      return res.status(400).json({ success: false, err });
    }

    try {
      const { user, access_token, refresh_token } = await HandleLogin(
        req.body.username,
        req.body.password
      );

      // send response
      res.status(200).json({
        success: true,
        data: {
          user,
          access: access_token,
          refresh: refresh_token,
        },
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

// /auth/register endpoint
router.post(
  "/create",
  checkSchema(signup_schema),
  async (req: Request, res: Response<API.Response>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, err: errors.array().join("\n") });
    }

    try {
      const { access_token, refresh_token } = await HandleRegister(req.body);

      // send response
      // set refresh token in cookie
      res.cookie("token", refresh_token, {
        domain: "localhost:3001",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true, // https or localhost
      });
      res.status(200).json({ success: true, data: access_token });
    } catch (error) {
      logger(`Error occured while creating user ${req.body.email}`, "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

// /auth/refresh endpoint
router.post(
  "/refresh",
  async (
    req: Request,
    res: Response<
      API.Response<{ access_token: string; user: API.Auth.UserData }>
    >
  ) => {
    logger("/auth/refresh");

    // 403 if token not found
    const token = req.body.refresh_token;
    if (!token) {
      logger("Token not found in req body", "info");
      res.sendStatus(403);
      return;
    }

    try {
      const { ok, access, user } = await HandleRefreshToken(token);

      if (!ok || !access) {
        logger(`Token status is ${ok}`, "info");
        res.status(400).json({
          success: false,
          err: "Invalid data to refresh access token",
        });
        return;
      }

      if (!user) {
        res.status(400).json({ success: false, err: "No matching user found" });
        return;
      }

      logger("Token refreshed", "success");

      res
        .status(200)
        .json({ success: true, data: { access_token: access, user } });
    } catch (error) {
      logger("Error occured in /auth/refresh", "error");
      console.log(error);

      res.sendStatus(500);
    }
  }
);

export default router;