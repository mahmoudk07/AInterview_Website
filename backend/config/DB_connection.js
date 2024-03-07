import mongoose from "mongoose";

export const database_connection = (url) => {
    mongoose.connect(url)
}