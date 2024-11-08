import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { showToastMessage } from "../features/common/uiSlice";

const PrivateRoute = ({ permissionLevel }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  if(!isAuthenticated) dispatch(showToastMessage({message:"Please log in first", status:"error"}));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
