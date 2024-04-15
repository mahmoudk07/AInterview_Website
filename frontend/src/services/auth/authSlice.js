import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const SignupUser = createAsyncThunk('user/signup', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/register`, data)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const LoginUser = createAsyncThunk('user/login', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, data);
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const initialState = {
    firstname: "",
    lastname: "",
    token: "",
    isLoggedIn: false,
    isLoading: false,
    error: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state , action) => {
            state.isLoggedIn = false
            localStorage.removeItem('token')
            localStorage.removeItem('type')
            localStorage.removeItem('isManager')
        },
    },
    extraReducers: (builder) => {
        builder.addCase(SignupUser.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(SignupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null
        });
        builder.addCase(SignupUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
        builder.addCase(LoginUser.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.firstname = action.payload.firstname
            state.lastname = action.payload.lastname
            state.token = action.payload.token
            state.isLoggedIn = true
            state.isLoading = false
            state.error = null
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('type', action.payload.type)
            localStorage.setItem('isManager', action.payload.ismanager)
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
    }
})
export const Error = (state) => state.User.error
export const { logout } = userSlice.actions
export default userSlice.reducer