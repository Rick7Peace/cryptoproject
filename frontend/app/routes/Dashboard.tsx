import ProtectedRoute from "~/components/auth/protectedroute";
import Dashboard from "~/components/dashboard/dashboard";



export default function DashboardDOOM() {
  return (
  

    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
)}