import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      maxlength: [
        20,
        "Please provide firstname less than or equal 20 characters",
      ],
      minlength: [
        3,
        "Please provide fristname more than or equal 3 characters",
      ],
      required: [true, "Please provide your firstname"],
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: [
        20,
        "Please provide lastname less than or equal 20 characters",
      ],
      minlength: [3, "Please provide lastname more than or equal 3 characters"],
      required: [true, "Please provide your lastname"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: [6, "Please provide password more than 5 characters"],
    },
    gender: {
      type: String
    },
    job: {
      type: String,
      required: [true, "Please provide your job title"],
      enum: {
        values: [
          "Software Engineer",
          "Data Scientist",
          "Product Manager",
          "UX Designer",
          "Marketing Manager",
          "Accountant",
          "HR Specialist",
          "Sales Representative",
          "Customer Service Representative",
          "Operations Manager",
        ],
        message: "Please provide a correct job title",
      },
    },
    role: {
      type: String,
      required: [true, "Pleaser provide user type"],
      enum: {
        values: ["user", "manager", "admin"],
        message: "Please provide correct role for user",
      },
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password , salt)
})
UserSchema.methods.CreateJWT = function () {
  return jsonwebtoken.sign({
    id: this._id,
    firstname: this.firstname,
    lastname: this.lastname}, process.env.JWT_SECRET , {expiresIn : '30d'})
}
export const UserModel = mongoose.model('User', UserSchema);

