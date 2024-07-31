import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window!=="undefined"? localStorage.getItem('token'):"",
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://trello-backend-zx3d.onrender.com/api/v1/auth/login', credentials);
      toast.success('Logged in successfully');
      return response.data.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: { fullName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://trello-backend-zx3d.onrender.com/api/v1/auth/signup', userData);
      toast.success('Signed up successfully');
      return response.data.data;
    } catch (error:any) {
      
      toast.error(error.response?.data?.message[0].message || 'Signup failed');
      return rejectWithValue(error.response?.data);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
     typeof window!=="undefined" && localStorage.removeItem('token');
      toast.info('Logged out successfully');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
       typeof window!=="undefined" && localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
       typeof window!=="undefined"&& localStorage.setItem('token', action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;