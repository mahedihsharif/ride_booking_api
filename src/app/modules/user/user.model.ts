import { model, Schema } from "mongoose";
import { Driver } from "../driver/driver.model";
import { Blocked, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isBlocked: {
      type: String,
      enum: Object.values(Blocked),
      default: Blocked.UN_BLOCKED,
    },
    driver: { type: Schema.Types.ObjectId, ref: "Driver" },
    // admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true, versionKey: false }
);

// // create Rider Model at the time of Creating User Model because user role by default rider
// userSchema.post("save", async function (doc, next) {
//   try {
//     if (doc.role === Role.RIDER) {
//       const existingRider = await Rider.findOne({ user: doc._id });
//       if (!existingRider) {
//         await Rider.create({ user: doc._id });
//       }
//     }
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// change role from rider to driver this hook will work
userSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc?.role === Role.DRIVER) {
      const existingDriver = await Driver.findOne({ user: doc._id });

      if (!existingDriver) {
        await Driver.create({
          user: doc._id,
        });
      }
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// // change role from driver to rider then this hook will work
// userSchema.post("findOneAndUpdate", async function (doc, next) {
//   try {
//     if (doc?.role === Role.RIDER) {
//       const existingRider = await Rider.findOne({ user: doc._id });

//       if (!existingRider) {
//         await Rider.create({
//           user: doc._id,
//         });
//         await Driver.findOneAndDelete({
//           user: doc._id,
//         });
//       }
//     }

//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// change role from RIDER or DRIVER to ADMIN then this hook will work
userSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc?.role === Role.ADMIN) {
      await Driver.findOneAndDelete({
        user: doc._id,
      });
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<IUser>("User", userSchema);
