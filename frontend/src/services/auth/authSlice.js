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
export const getUserInformation = createAsyncThunk('auth/getUserInformation', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getUserInfo`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const getFollowedCompanies = createAsyncThunk('auth/getFollowedCompanies', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/get_following_companies`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const getFollowedInterviews = createAsyncThunk('auth/getFollowedInterviews', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/get_following_interviews`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const fetchAllEmails = createAsyncThunk('auth/fetchAllEmails', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/get_emails?page=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
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
    email: "",
    role: "",
    image: "",
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
            localStorage.setItem('isManager', action.payload.isManager)
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
            builder.addCase(getUserInformation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    });
    builder.addCase(getUserInformation.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.firstname = payload.firstname;
        state.lastname = payload.lastname;
        state.email = payload.email;
        state.role = payload.role;
        state.image = payload.image;
    });
    builder.addCase(getUserInformation.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
    });
    builder.addCase(getFollowedCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    });
    builder.addCase(getFollowedCompanies.fulfilled, (state, { payload }) => {
        state.isLoading = false;
    });
    builder.addCase(getFollowedCompanies.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
    });
    builder.addCase(getFollowedInterviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    });
    builder.addCase(getFollowedInterviews.fulfilled, (state, { payload }) => {
        state.isLoading = false;
    });
    builder.addCase(getFollowedInterviews.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
    });
    builder.addCase(fetchAllEmails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    });
    builder.addCase(fetchAllEmails.fulfilled, (state) => {
        state.isLoading = false;
    });
    builder.addCase(fetchAllEmails.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
    });
    }
    
})
export const Error = (state) => state.User.error
export const { logout } = userSlice.actions
export default userSlice.reducer