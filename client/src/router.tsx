import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "@/features/auth/pages/LoginPage";
import { useAuthStore } from "@/features/auth/store/authStore";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ItemsPage from "./features/items/pages/ItemsPage";
import CreateListingPage from "./features/items/pages/createListingPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ItemDetailsPage from "./features/items/pages/ItemDetailsPage";

// eslint-disable-next-line react-refresh/only-export-components
const Protected = ({ children }: { children: React.ReactElement }) => {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "items", element: <Protected><ItemsPage /></Protected> },
      { path: "items/:id", element: <Protected><ItemDetailsPage /></Protected> },
      {path:"create",element:<Protected><CreateListingPage/></Protected>},
      {path:"dashboard",element:<Protected><DashboardPage/></Protected>}
    ],
  },
]);

export { Protected };
