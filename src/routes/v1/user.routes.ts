import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import UserControllers from "../../modules/user/user.controllers";

const router = Router();

const {
  signupInputValidation,
  isSignupUserExist,
  isUserExistAndVerified,
  isUserExist,
  checkVerificationOtp,
  checkAccessToken,
  checkRefreshToken,
  checkPassword,

} = UserMiddlewares;
const {
  handleSignup,
  handleVerify,
  handleLogin,
  handleCheck,
  handleRefreshTokens,
  handleLogout,
  handleResend,
  handleForgotPassword,
  handleResetPassword,
  handleResendForgotPasswordOtp
} = UserControllers;

router
  .route("/signup")
  .post(signupInputValidation, isSignupUserExist, handleSignup);
router.route("/verify").post(checkVerificationOtp, handleVerify);
router.route("/resend").post(isUserExist, handleResend);
router.route("/login").post(isUserExistAndVerified, checkPassword, handleLogin);
router.route("/refresh").post(checkRefreshToken, handleRefreshTokens);
router.route("/check").post(checkAccessToken, handleCheck);
router.route("/logout").post(checkAccessToken, handleLogout);

router.route("/forgot-password").post(handleForgotPassword);
router.route("/reset-password").post(handleResetPassword);
router.route("/resend-forgot-password").post(handleResendForgotPasswordOtp);

export default router;
