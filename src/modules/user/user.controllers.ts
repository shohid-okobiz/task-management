import { NextFunction, Request, Response } from "express";
import UserServices from "./user.services";
import logger from "../../configs/logger.configs";
import { IFindStaffRequestQuery, IUser } from "./user.interfaces";
import cookieOption from "../../utils/cookie.utils";
import mongoose, { Types } from "mongoose";
import { documentPerPage } from "../../const";

const {
  processSignup,
  processVerify,
  processLogin,
  processTokens,
  processLogout,
  processResend,
  processForgotPassword,
  processResetPassword,
  processResendForgotPasswordOtp
} = UserServices;

const UserControllers = {
  handleSignup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await processSignup(req.body);
      res
        .status(201)
        .json({ status: "success", message: "User Signup Successfully", data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleVerify: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const data = await processVerify(email);
      if (!data) {
        res.status(400).json({ status: "error", message: "Bad Request" });
        return;
      } else {
        const { accessToken, refreshToken } = data;
        res.clearCookie("refreshtoken");
        res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
        res.status(200).json({
          status: "success",
          message: "Email verification successfully",
          accessToken,
        });
        return;
      }
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleLogin: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processLogin(req.user as IUser);
      res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
      res.status(200).json({
        status: "success",
        message: "Login successful",
        accessToken,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCheck: (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = req.authenticateTokenDecoded;
      res.status(204).send(decoded)
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRefreshTokens: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processTokens(
        req.authenticateTokenDecoded
      );
      res.clearCookie("refreshtoken");
      res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
      res.status(200).json({
        status: "success",
        message: "Token refreshed",
        accessToken,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const accesstoken = authHeader?.split(" ")[1] as string;
      await processLogout(accesstoken);
      res.clearCookie("refreshtoken");
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleResend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.user as IUser;
      await processResend({ email, name });
      res
        .status(200)
        .json({ status: "success", message: "Otp resend successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },


  handleForgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          status: "error",
          message: "Email is required",
        });
        return;
      }

      const result = await processForgotPassword(email);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleResetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        res.status(400).json({
          status: "error",
          message: "Email, OTP, and newPassword are required",
        });
        return;
      }

      const result = await processResetPassword({ email, otp, newPassword });

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleResendForgotPasswordOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body as IUser;

      if (!email) {
        res.status(400).json({
          status: "error",
          message: "Email is required",
        });
        return;
      }

      const result = await processResendForgotPasswordOtp(email);

      res.status(200).json({
        status: "success",
        message: result?.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },




};

export default UserControllers;
