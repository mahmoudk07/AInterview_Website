import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const Signup = createAsyncThunk('user/signup', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, data)
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response)
    }
})
export const Login = createAsyncThunk('user/login', async (data, thunkAPI) => {
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
        builder.addCase(Signup.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(Signup.fulfilled, (state, action) => {
          state.isLoading = false;
        });
        builder.addCase(Signup.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
        builder.addCase(Login.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(Login.fulfilled, (state, action) => {
            state.firstname = action.payload.firstname
            state.lastname = action.payload.lastname
            state.token = action.payload.token
            state.isLoggedIn = true
            state.isLoading = false
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('firstname', action.payload.firstname)
            localStorage.setItem('lastname', action.payload.lastname)
        })
        builder.addCase(Login.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
    }
})
export const { logout } = userSlice.actions
export default userSlice.reducer