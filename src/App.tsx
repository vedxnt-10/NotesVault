import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SemesterDashboard from "./pages/SemesterDashboard"
import SubjectPage from "./pages/SubjectPage"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageSubject from "./pages/admin/ManageSubject"
import Layout from "./components/Layout"

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-fallback-123"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/semester/:semNumber" element={<SemesterDashboard />} />
        <Route path="/semester/:semNumber/subject/:subjectId" element={<SubjectPage />} />
        
        {/* Admin Routes */}
        <Route path={`/${ADMIN_PATH}`} element={<AdminLogin />} />
        <Route path={`/${ADMIN_PATH}/dashboard`} element={<AdminDashboard />} />
        <Route path={`/${ADMIN_PATH}/dashboard/subject/:subjectId`} element={<ManageSubject />} />
      </Route>
    </Routes>
  )
}
