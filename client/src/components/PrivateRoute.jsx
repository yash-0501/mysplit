import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader/Loader";

const PrivateRoute = () => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <Loader />;
  }
  return user ? <Outlet /> : <Navigate to={"/login"} replace  />;
};

export default PrivateRoute;
