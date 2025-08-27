import { model, Schema } from "mongoose";
import { Driver } from "../driver/driver.model";
import { ActiveStatus, IUser, Role } from "./user.interface";

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
      enum: Object.values([Role.RIDER, Role.DRIVER]),
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: String,
      enum: Object.values(ActiveStatus),
      default: ActiveStatus.ACTIVE,
    },
    cancelAttempts: {
      type: Number,
      default: 0,
    },
    lastCancelDate: {
      type: Date,
    },
    driver: { type: Schema.Types.ObjectId, ref: "Driver" },
  },
  { timestamps: true, versionKey: false }
);

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
userSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (!doc) return next();

    if (doc.role === Role.DRIVER) {
      const existingDriver = await Driver.findOne({ user: doc._id });
      if (!existingDriver) {
        await Driver.create({ user: doc._id });
      }
    } else {
      await Driver.findOneAndDelete({ user: doc._id });
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

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
