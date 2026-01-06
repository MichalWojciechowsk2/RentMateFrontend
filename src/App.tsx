import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PrivateRoute from "./router/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertiesPage from "./pages/PropertiesPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import MenagePropertyPage from "./pages/MenagePropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import EditPropertyCreateForm from "./pages/EditPropretyWhileCreate";
import AddPhotos from "./pages/AddPhotos";
import ProfilePage from "./pages/ProfilePage";
import MyRentalPage from "./pages/MyRentalPage";
import InboxPage from "./pages/InboxPage";
import MessagePage from "./pages/MessagePage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Publiczne */}
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="property/:id" element={<PropertyDetailPage />} />

        {/* Chronione (Wymagają logowania) */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />

        <Route
          path="my-properties"
          element={
            <PrivateRoute>
              <MyPropertiesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="my-properties/:id/menage"
          element={
            <PrivateRoute>
              <MenagePropertyPage />
            </PrivateRoute>
          }
        />

        <Route
          path="add-property"
          element={
            <PrivateRoute>
              <AddPropertyPage />
            </PrivateRoute>
          }
        />

        <Route
          path=":propertyId/add-photo"
          element={
            <PrivateRoute>
              <AddPhotos />
            </PrivateRoute>
          }
        />

        <Route
          path=":propertyId/edit-propertyCreate"
          element={
            <PrivateRoute>
              <EditPropertyCreateForm />
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
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

        <Route
          path="inbox"
          element={
            <PrivateRoute>
              <InboxPage />
            </PrivateRoute>
          }
        />

        <Route
          path="chats"
          element={
            <PrivateRoute>
              <MessagePage />
            </PrivateRoute>
          }
        />

        <Route
          path="chats/:chatId"
          element={
            <PrivateRoute>
              <MessagePage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;