import "./App.css";
import { useAuthStore } from "./features/auth/store/authStore";
import Navbar from "./components/layout/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "./components/layout/Navbar/Logo";


export default function App() {
  const user = useAuthStore((s)=>s.user)
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {!isDashboard && (user?(
        <Navbar />
      ):
      <div className="flex justify-center fixed w-full h-1/16 items-center border bg-white z-200">
            <Logo/>
      </div>
      )}
      
      <main className={!isDashboard ? "pt-10" : ""}>
        <Outlet />
      </main>
    </>
  );
}

