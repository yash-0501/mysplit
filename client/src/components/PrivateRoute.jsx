import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default PrivateRoute;
