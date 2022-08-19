import React, { Suspense, lazy, Fragment } from "react";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import HomePage from "./Pages/Home";
import Dashboard from "./Pages/Dashboards";
import History from "./Pages/History";
import CourseDetail from "./Pages/CourseDetail";

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <HomePage></HomePage>,
    auth: false,
  },
  {
    path: "/course/:id",
    main: () => <CourseDetail/>,
    auth: false,
  },
  {
    path: "/login",
    exact: true,
    main: () => <LoginPage></LoginPage>,
    auth: false,
  },
  {
    path: "/register",
    exact: true,
    main: () => <RegisterPage></RegisterPage>,
    auth: false,
  },
  {
    path: "/dashboard",
    exact: true,
    main: () => <History></History>,
    auth: false,
  },
];

export default routes;
