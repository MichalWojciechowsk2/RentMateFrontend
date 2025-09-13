import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PropertiesPage from "../pages/PropertiesPage";
import AddPropertyPage from "../pages/AddPropertyPage";
import AddPhotos from "../pages/AddPhotos";
import ProfilePage from "../pages/ProfilePage";

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
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
