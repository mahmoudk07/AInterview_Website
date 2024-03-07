import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const SignupUser = createAsyncThunk('user/signup', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, data)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response)
    }
})
export const LoginUser = createAsyncThunk('user/login', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, data)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response)
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SignupUser.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(SignupUser.fulfilled, (state, action) => {
          state.isLoading = false;
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
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('firstname', action.payload.firstname)
            localStorage.setItem('lastname', action.payload.lastname)
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