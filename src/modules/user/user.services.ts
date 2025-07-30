import redisClient from "../../configs/redis.configs";
import { join } from "path";
import { promises as fs } from "fs";
import { TokenPayload } from "../../interfaces/jwtPayload.interfaces";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.utils";
import sendVerificationEmail from "../../utils/sendVerificationEmail.utils";
import {
  ISignupPayload,
  IUser,
  ITokenProcessReturn,
  IProcessDeleteUserPayload,
  IProcessResendEmailPayload,
  IIdentityDocument,
  IFindStaffRequestQuery,
  IFindStaffQuery,
  IUserPayload,
} from "./user.interfaces";
import UserRepositories from "./user.repositories";
import otpGenerator from "otp-generator";


const {
  createUser,
  verifyUser,
  findUserByEmailPassword,
  findUserByEmailResetPass,
  findUserByEmailForResetOtp,
  resendForgotPasswordOtp
} = UserRepositories;
const UserServices = {
  processSignup: async (payload: ISignupPayload) => {
    try {
      const createdUser = await createUser(payload);
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await redisClient.set(
        `user:profile:${createdUser._id}`,
        JSON.stringify(createdUser),
        "EX",
        86400
      );
      await redisClient.set(`user:otp:${createdUser.email}`, otp, "EX", 2 * 60);
      await sendVerificationEmail({
        email: createdUser.email,
        expirationTime: 2,
        name: createdUser.name,
        otp,
      });
      return createdUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Signup Service");
      }
    }
  },
  processVerify: async (email: string): Promise<ITokenProcessReturn | null> => {
    const data = await verifyUser(email);
    try {
      if (data) {
        const { email, isVerified,  id, name,  } = data;
        const accessToken = generateAccessToken({
          email,
          isVerified,
          userId: id,
          name,
          
        }) as string;
        const refreshToken = generateRefreshToken({
          email,
          isVerified,
          userId: id,
          name,
         
        }) as string;

        return { accessToken, refreshToken } as ITokenProcessReturn;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In verify user service");
      }
    }
  },
  processLogin: (payload: IUser): ITokenProcessReturn => {
    const { email, isVerified, role, id, name } = payload;
    const accessToken = generateAccessToken({
      email,
      isVerified,
      role,
      userId: id,
      name,
       
    }) as string;
    const refreshToken = generateRefreshToken({
      email,
      isVerified,
      role,
      userId: id,
      name,
       
    }) as string;

    return { accessToken, refreshToken } as ITokenProcessReturn;
  },
  processTokens: (payload: TokenPayload): ITokenProcessReturn => {
    const { email, isVerified, role, userId, name } = payload;

    const accessToken = generateAccessToken({
      email,
      isVerified,
      role,
      userId,
      name,
      
    }) as string;

    const refreshToken = generateRefreshToken({
      email,
      isVerified,
      role,
      userId,
      name,
      
    }) as string;

    return { accessToken, refreshToken } as ITokenProcessReturn;
  },
  processLogout: async (payload: string) => {
    try {
      await redisClient.set(`blacklist:${payload}`, payload);
    } catch (error) {
      throw error;
    }
  },
 
  processResend: async ({ email, name }: IProcessResendEmailPayload) => {
    try {
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await redisClient.set(`user:otp:${email}`, otp, "EX", 2 * 60);
      await sendVerificationEmail({
        email: email,
        expirationTime: 2,
        name: name,
        otp,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Resend Otp Operation");
      }
    }
  },
  
 
 
  processForgotPassword: async (email: string) => {
    try {
      const user = await findUserByEmailPassword(email);
      if (!user) {
        throw new Error("If this email exists, an OTP has been sent.");
      }

      const resendKey = `user:otp:resend-limit:${email}`;
      const isLimited = await redisClient.get(resendKey);

      if (isLimited) {
        throw new Error("Please wait a minute before requesting another OTP.");
      }

      await redisClient.set(resendKey, "1", "EX", 60);
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });


      await redisClient.set(`user:reset-otp:${email}`, otp, "EX", 2 * 60);
      await sendVerificationEmail({
        email,
        expirationTime: 2,
        name: user.name,
        otp,
      });

      return {
        message: "An OTP has been sent.",
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Forgot password OTP request failed.");
    }
  },
  processResetPassword: async ({
    email,
    otp,
    newPassword,
  }: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    try {
      const savedOtp = await redisClient.get(`user:reset-otp:${email}`);
      if (!savedOtp || savedOtp !== otp) {
        throw new Error("Invalid or expired OTP");
      }

      const updatedUser = await findUserByEmailResetPass(email, newPassword);
      if (!updatedUser) {
        throw new Error("User not found");
      }

      await redisClient.del(`user:reset-otp:${email}`);

      return { message: "Password reset successfully" };
    } catch (error) {
      throw error instanceof Error ? error : new Error("Password reset failed");
    }
  },
  processResendForgotPasswordOtp: async (email: string) => {
    try {
      const user = await findUserByEmailForResetOtp(email);
      if (!user) {
        throw new Error(" An OTP has been sent.");
      }

      await resendForgotPasswordOtp(user);

      return { message: "OTP has been resent to your email." };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to resend OTP");
    }
  },
 
};


export default UserServices;
