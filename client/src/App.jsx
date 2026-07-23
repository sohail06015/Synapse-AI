import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import ReviewResume from "./pages/ReviewResume";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Upgrade from "./pages/Upgrade";
import Community from "./pages/Community";
import Chat from "./pages/Chat";


const App = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { fontSize: "14px" },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected AI Routes */}
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
         <Route path="chat" element={<Chat />} />   


          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="profile" element={<Profile />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="payment" element={<Payment />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="community" element={<Community />} />

        </Route>
      </Routes>
    </div>
  );
};

export default App;
