
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import UserMenuItem from "./UserMenuItem";
import CreateListingButton from "./CreateListingButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CircleUserRound} from 'lucide-react';



const UserMenu = () => {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

 
  const handleClick = (e: React.MouseEvent) => {
  
    e.stopPropagation();
    setOpen((prev) => !prev);
  };
  const logout = useAuthStore((s)=>s.logout)
   const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login')
  };
 
  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [open]);
 

  return (
    <nav className=" px-5 gap-1 hidden sm:flex ">
    
    <div className="relative ">
      {user?.profilePhoto ? (
        <img
          src={user.profilePhoto}
          alt="User"
          className="size-9 rounded-full object-cover cursor-pointer border border-gray-200"
          onClick={handleClick}
        />
      ) : (
        <CircleUserRound
          className={`size-9 cursor-pointer ${user ? "text-green-500" : "text-red-500"}`}
          onClick={handleClick}
        />
      )}

      {open && (
        <div
          ref={menuRef}
          className="absolute mt-2  flex gap-2 flex-col shadow-lg shadow-gray-500 rounded-md border w-40 p-3 bg-white z-80"
          onClick={(e) => e.stopPropagation()} 
        >
          {user ? (
            <>
            <UserMenuItem to='/dashboard' label="Dashboard"/>
            <Button className="bg-red-500 " onClick={handleLogout}>Logout </Button>
            
            
             
            </>
          ) : (
            <>
            <UserMenuItem to="/login" label="Login" />
            <UserMenuItem to="/register" label="Register" />
            </>
            
        
          )}
        </div>
      )}
    </div>
    <CreateListingButton label="Create listing " to="create"  />
    </nav>
  );
};

export default UserMenu;
