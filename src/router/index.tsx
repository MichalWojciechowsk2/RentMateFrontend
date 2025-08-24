import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PropertiesPage from "../pages/PropertiesPage";
import AddPropertyPage from "../pages/AddPropertyPage";
import AddPhotos from "../pages/AddPhotos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "properties", element: <PropertiesPage /> },
      {
        path: "add-property",
        element: (
          <PrivateRoute>
            <AddPropertyPage />
          </PrivateRoute>
        ),
      },
      {
        path: ":propertyId/add-photo",
        element: (
          <PrivateRoute>
            <AddPhotos />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
