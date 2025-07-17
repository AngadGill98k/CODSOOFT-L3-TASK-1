import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Search from './components/search/search.js';
import App from './App';
import Product from './components/product/product.js';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './redux/store.js'
import Cart from './components/cart/cart.js';
import Payment from './components/payment/payment.js';
import Login from './components/login/login.js';
import Store from './components/add_p/store.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
   {
    path: '/home',
    element: <Search />,
  },
  {
    path: '/add',
    element: <Store />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/payment',
    element: <Payment />,
  },
  {
    path: '/login',
    element: <Login />, 
  }
])
root.render(
    <Provider store={store}>
 <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
