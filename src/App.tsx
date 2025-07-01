import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute";
import AppLayout from "./layouts/AppLayout";
import PropertiesPage from "./pages/PropertiesPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import HomePage from "./pages/HomePage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
// import EditPropertyPage from "./EditPropertyPage";
import RegisterPage from "./pages/RegisterPage";
import MyRentalPage from "./pages/MyRentalPage";
import MenagePropertyPage from "./pages/MenagePropertyPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route
          path="/my-properties"
          element={
            <PrivateRoute>
              <MyPropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-properties/:id/menage"
          element={
            <PrivateRoute>
              <MenagePropertyPage />
            </PrivateRoute>
          }
        />

        {/* <Route path="/edit-property/:id" element={<EditPropertyPage />} /> */}
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route
          path="add-property"
          element={
            <PrivateRoute>
              <AddPropertyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="my-rental"
          element={
            <PrivateRoute>
              <MyRentalPage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
