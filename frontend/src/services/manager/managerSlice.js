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
export const fetchInterviews = createAsyncThunk('manager/fetchInterviews', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interviews?page=${page}`, {
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
export const fetchingCompanyInfo = createAsyncThunk('manager/CompanyInfo', async (_, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/get_company`, {
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
export const fetchingInterviewsStatus = createAsyncThunk('manager/InterviewsStatus', async (_, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interviews_status`, {
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
export const fetchingFollowers = createAsyncThunk('manager/companyFollowers', async (page, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/followers?page=${page}`, {
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
export const fetchingInterviewees = createAsyncThunk('manager/interviewees', async (data, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interviewees/${data.id}?page=${data.page}`, {
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
export const getAllScores = createAsyncThunk('manager/getAllScores', async (data, thunkAPI) => { 
    const { rejectWithValue } = thunkAPI
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/scores/get_scores/${data.id}?page=${data.active}`, {
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
        builder.addCase(fetchInterviews.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(fetchInterviews.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(fetchInterviews.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
        builder.addCase(fetchingCompanyInfo.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(fetchingCompanyInfo.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(fetchingCompanyInfo.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
        builder.addCase(fetchingInterviewsStatus.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(fetchingInterviewsStatus.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(fetchingInterviewsStatus.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
        builder.addCase(fetchingFollowers.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(fetchingFollowers.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(fetchingFollowers.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
        builder.addCase(fetchingInterviewees.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(fetchingInterviewees.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(fetchingInterviewees.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
        builder.addCase(getAllScores.pending, (state, action) => {
          state.isLoading = true;
        });
        builder.addCase(getAllScores.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
        });
        builder.addCase(getAllScores.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.detail;
        });
    }
})
export const Error = (state) => state.Manager.error;
export default managerSlice.reducer