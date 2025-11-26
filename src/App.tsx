import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
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
import EditPropertyCreateForm from "./pages/EditPropretyWhileCreate";
import AddPhotos from "./pages/AddPhotos";
import InboxPage from "./pages/InboxPage";
import MessagePage from "./pages/MessagePage";
import AddReviewComponent from "./components/review/addReviewComponent";

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
          path="chats/"
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
        <Route
          path="rewiev"
          element={
              <AddReviewComponent/>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
