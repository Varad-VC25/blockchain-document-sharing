const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    avatar: { type: String, default: null },
    bio: { type: String, maxlength: 500, default: "" },
    walletAddress: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    stats: {
      totalUploads: { type: Number, default: 0 },
      totalShared: { type: Number, default: 0 },
      totalReceived: { type: Number, default: 0 },
      totalDownloads: { type: Number, default: 0 },
      storageUsed: { type: Number, default: 0 },
    },
    lastLogin: { type: Date, default: null },
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ walletAddress: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    walletAddress: this.walletAddress,
    role: this.role,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    stats: this.stats,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select("+password");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
