import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const initialCartState = {
  cart: [],
};

const cartReducer = (state = initialCartState.cart, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload.id);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

export default rootReducer;
