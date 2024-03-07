import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    maxlength: [
      20,
      "Please provide firstname less than or equal 20 characters",
    ],
    minlength: [3, "Please provide fristname more than or equal 3 characters"],
    required: [true, "Please provide your firstname"],
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: [20, "Please provide lastname less than or equal 20 characters"],
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
    required: [true, 'Please provide your password'],
    minlength: [6, 'Please provide password more than 5 characters'],
    },
  role: {
    type: String,
    required: [true , 'Pleaser provide user type'],
    enum: {
        values: ['user', 'manager' , 'admin'],
        message: 'Please provide correct role for user'
    }
  }
},
{
    timestamps: true
}
);
export const UserModel = mongoose.model('User', UserSchema);
