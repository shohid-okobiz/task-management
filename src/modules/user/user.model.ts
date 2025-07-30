import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { IIdentityDocument, IUser } from "./user.interfaces";
import { hashPassword } from "../../utils/password.utils";


const UserSchema = new Schema<IUser>(
  {
    
    
    avatar: { type: String, default: null },
    email: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    // accountStatus: { type: String, default: AccountStatus.INACTIVE },
    name: { type: String, required: true },
    phone: { type: String },
    password: { type: String, minlength: 8, required: true },
    role: { type: String },
    
  },
  { timestamps: true }
);

 
UserSchema.index({ identityDocument: 1 }, { unique: true, sparse: true });
 

UserSchema.pre("save", async function (next) {
  const user = this as HydratedDocument<IUser>;
  if (user.isModified("password") || user.isNew) {
    try {
      user.password = (await hashPassword(user.password)) as string;
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
});

 

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;
