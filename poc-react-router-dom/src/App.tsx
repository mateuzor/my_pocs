import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import LongContent from "./pages/LongContent";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import {
  AuthProvider,
  ProtectedRoute,
  LoginPage,
  ProtectedDashboard,
} from "./pages/ProtectedRoute";
import {
  RoleAuthProvider,
  RoleBasedRoute,
  RoleDemoPage,
  PublicAreaPage,
  UserAreaPage,
  AdminPanelPage,
} from "./pages/RoleBasedRoute";
import RouteTransitionsDemo from "./pages/RouteTransitionsDemo";
import BreadcrumbsDemo from "./pages/BreadcrumbsDemo";
import MultiStepForm from "./pages/MultiStepForm";
import {
  RouterErrorElement,
  RouteErrorBoundaryDemo,
} from "./pages/RouteErrorBoundary";
import { productsLoader } from "./loaders/productsLoader";
import { contactAction } from "./actions/contactAction";
import { UsersQuery } from "./pages/UsersQuery";
import { UserDetailsQuery } from "./pages/UserDetailsQuery";
import "./App.css";

function App() {
  const location = useLocation();

  // Pegamos o background se existir
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  return (
    <AuthProvider>
      <RoleAuthProvider>
        <Routes location={background || location}>
          <Route path="/" element={<Layout />}>
            {/* index = rota filha padrão dentro do Layout (equivale a "/") */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserDetails />} />
            <Route path="admin" element={<Admin />} />
            <Route path="long" element={<LongContent />} />
            {/* Rota com loader function - dados carregados antes de renderizar */}
            <Route path="products" element={<Products />} loader={productsLoader} />
            {/* Rota com action function - processa formulários sem useState */}
            <Route path="contact" element={<Contact />} action={contactAction} />
            {/* Rotas demonstrando navegação programática com state */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="success" element={<Success />} />

            {/* TanStack Query demos */}
            <Route path="users-query" element={<UsersQuery />} />
            <Route path="users-query/:userId" element={<UserDetailsQuery />} />

            {/* Demo: Login page for protected routes */}
            <Route path="login-demo" element={<LoginPage />} />

            {/* Demo: Protected routes — redirect to /login-demo if not authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="protected-dashboard" element={<ProtectedDashboard />} />
            </Route>
          </Route>

          {/* Demo: Role-based routes — rendered outside Layout to avoid nesting issues */}
          <Route path="role-demo" element={<RoleDemoPage />} />
          <Route path="role-public" element={<PublicAreaPage />} />

          {/* User and Admin routes protected by RoleBasedRoute */}
          <Route element={<RoleBasedRoute allowedRoles={["user", "admin"]} redirectTo="/role-demo" />}>
            <Route path="role-user" element={<UserAreaPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} redirectTo="/role-demo" />}>
            <Route path="role-admin" element={<AdminPanelPage />} />
          </Route>

          {/* Demo: Animated route transitions — sub-routes at /transitions/* */}
          <Route path="transitions/*" element={<RouteTransitionsDemo />} />

          {/* Demo: Dynamic breadcrumbs using useLocation and useMatches */}
          <Route path="breadcrumbs/*" element={<BreadcrumbsDemo />} />

          {/* Demo: Multi-step form with route-based navigation */}
          <Route path="multi-step-form/*" element={<MultiStepForm />} />

          {/* Demo: Route error boundaries and custom 404 — errorElement catches loader/action errors */}
          <Route
            path="error-boundary-demo"
            element={<RouteErrorBoundaryDemo />}
            errorElement={<RouterErrorElement />}
          />

          {/* path="*" pega qualquer rota não mapeada (404) — updated to proper 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* se existe background, renderizamos a rota atual por cima */}
        {background && (
          <Routes>
            <Route path="/users/:userId" element={<UserDetails />} />
          </Routes>
        )}
      </RoleAuthProvider>
    </AuthProvider>
  );
}

export default App;
