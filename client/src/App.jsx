import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/landing/landing";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import PrivateRoute from "./components/PrivateRoute";
import { CssBaseline } from "@mui/material";
import ExpenseInfo from "./pages/expense/expenseInfo";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0);

  return (
    <UserContextProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 2000 }}
      ></Toaster>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="expenses/:id" element={<ExpenseInfo />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
