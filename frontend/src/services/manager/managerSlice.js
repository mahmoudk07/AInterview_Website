import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const createCompany = createAsyncThunk('manager/createCompany', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/company/create`, data, {
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
export const createInterview = createAsyncThunk('manager/createInterview', async (data, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/interview/create`, data, {
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
    website: "",
    name: "",
    address: "",
    country: "",
    isLoading: false,
    error: null
}
const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createCompany.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(createCompany.fulfilled, (state, action) => {
            state.isLoading = false
            state.error = null
            state.name = action.payload.company.name
            state.website = action.payload.company.website
            state.address = action.payload.company.address
            state.country = action.payload.company.country
        })
        builder.addCase(createCompany.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload.detail
        })
    }
})
export const Error = (state) => state.Manager.error;
export default managerSlice.reducer