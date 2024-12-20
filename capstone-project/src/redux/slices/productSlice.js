import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('https://fakestoreapi.com/products');
  return response.data.map(product => ({ ...product, stock: 20 }));
});

// Update stock ketika item sudah di-checkout
export const updateStock = createAsyncThunk('products/updateStock', async ({ id, quantity }, { getState }) => {
  const state = getState();
  const product = state.product.items.find(product => product.id === id);

  if (product && product.stock >= quantity) {
    // Mengurangi stock setelah checkout
    const updatedStock = product.stock - quantity;
    return { id, updatedStock };
  }

  return null;
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const { id, updatedStock } = action.payload;
        if (updatedStock !== null) {
          state.items = state.items.map(product =>
            product.id === id ? { ...product, stock: updatedStock } : product
          );
        }
      });
  },
});

export default productSlice.reducer;
