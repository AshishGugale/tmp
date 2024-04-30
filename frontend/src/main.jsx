import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Homepage from "./pages/Homepage.jsx";
import Content from './components/Content.jsx'
import AddListing from "./pages/GetRides.jsx";
import CreateBid from "./pages/CreateBid.jsx";
import ErrorHandler from "./pages/ErrorHandler.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
  path:'/',
    element: <Homepage />,
  errorElement: <ErrorHandler />,
  children: [
    { path: '/', element: <Content/>}, 
    { path: '/getrides', element: <AddListing /> },
],
 },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
  </RouterProvider>
);
