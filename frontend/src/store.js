import { configureStore } from "@reduxjs/toolkit"
import User from './services/auth/authSlice'
import Manager from "./services/manager/managerSlice"
import Admin from './services/admin/adminSlice'
export const store = configureStore({
    reducer: {
        User, Manager, Admin
    }
})