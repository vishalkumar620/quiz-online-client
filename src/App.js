import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./stylesheets/theme.css";
import "./stylesheets/Alinment.css";
import "./stylesheets/textelement.css";
import "./stylesheets/custom_component.css";
import "./stylesheets/form_element.css";
import "./stylesheets/layout.css";
import Login from "./Pages/Common/Login";
import Register from "./Pages/Common/Register";
import Home from "./Pages/Common/Home";
import Exams from "./Pages/Admin/Exams/Index";
import AddEditExam from "./Pages/Admin/Exams/AddEditExam";
import ProtectedRoute from "./Component/ProtectedRoute";
import Loader from "./Component/Loader";
import WriteExam from "./Pages/user/WriteExam";
import UserReports from "./Pages/user/UserReports";
import AdminReports from "./Pages/Admin/AdminReports";
import AdminProfile from "./Pages/Admin/AdminProfile";
import UserProfile from "./Pages/user/UserProfile";

function App() {
  const { loading } = useSelector((state) => state.loader);

  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
