import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchin_interviewees = createAsyncThunk('admin/fetchingInterviewees', async (page, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getAllUsers?page=${page}`, {
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
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/deleteUser/${id}`, {
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
export const fetching_companies = createAsyncThunk('admin/fetchingCompanies', async (page, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/get_companies?page=${page}`, {
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
export const deleteCompany = createAsyncThunk('admin/deleteCompany', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/deleteCompany/${id}`, {
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
  email: "",
  role: "",
  isLoading: false,
  error: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
    builder.addCase(fetchin_interviewees.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchin_interviewees.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.firstname = payload.firstname;
      state.lastname = payload.lastname;
      state.email = payload.email;
      state.role = payload.role;
    });
    builder.addCase(fetchin_interviewees.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});
export const Error = (state) => state.Admin.error;
export default adminSlice.reducer;
