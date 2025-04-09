import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    
  // Public routes
  index("routes/landing.tsx"),
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
  route("unauthorized", "routes/Unauthorized.tsx"),
  
  // Protected routes - will be wrapped in ProtectedRoute component
  // route("dashboard", "routes/dashboard.tsx"),
  // route("explore", "routes/explore.tsx") // Add this line

]satisfies RouteConfig;
