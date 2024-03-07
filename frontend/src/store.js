import { configureStore } from "@reduxjs/toolkit"
import User from './services/auth/authSlice'
export const store = configureStore({
    reducer: {
        User,
    }
})