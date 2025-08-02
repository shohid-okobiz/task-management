export const corsWhiteList = [
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://192.168.0.180:3000",
  "*"
];
export const accessTokenExpiresIn = "4h";
export const refreshTokenExpiresIn = "30d";
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: "/api/v1",
};
export const documentPerPage = 9;
export const rejectionEmailSubject =
  "";
export const approvedEmailSubject =
  "";
export const accountSuspendedEmailSubject =
  "";
