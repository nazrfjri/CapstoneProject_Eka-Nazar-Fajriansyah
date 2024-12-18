import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const { email, password } = userData;
    const response = await fetch('https://fakestoreapi.com/users');
    const users = await response.json();

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');

    const token = 'fake-auth-token';
    localStorage.setItem('token', token);

    return { email: user.email, username: user.username, token };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
