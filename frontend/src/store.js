import { configureStore } from "@reduxjs/toolkit"
import User from './services/auth/authSlice'
import Manager from "./services/manager/managerSlice"
export const store = configureStore({
    reducer: {
        User, Manager
    }
})