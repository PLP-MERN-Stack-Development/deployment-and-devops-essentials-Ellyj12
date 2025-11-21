import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import CreateListingButton from "./CreateListingButton";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import UserMenuItem from "./UserMenuItem";



interface CollapsedNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollapsedNavbar = ({ isOpen, onClose }: CollapsedNavbarProps) => {
const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const handleLogout = () => {
    logout();
    onClose(); 
    navigate("/login");
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="bg-white shadow-xl shadow-black right-0 w-1/2 h-screen fixed top-0 p-5 z-200"
        >
          <X className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose} />
          {user ? (
            <div className="flex flex-col gap-6 mt-4">
             <CreateListingButton
              className="w-full bg-green-600 hover:bg-green-700 border-none py-2"
              label="Create Listing"
              to="/create"
              onClick={onClose}
            />

            <div className="flex flex-col gap-3">
                <h1 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Profile</h1>
                <UserMenuItem label="Dashboard" to="/dashboard"/>
                
            </div>
             <div className="flex flex-col gap-3">
                <h1 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Account</h1>
        
                <button 
                  onClick={handleLogout} 
                  className="w-full py-2 rounded-md text-red-600 hover:bg-red-50 border border-red-200 transition-colors font-medium"
                >
                  Logout
                </button>
            </div>
            
            </div>
           
          ) : (
            <>
            Not logged in
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapsedNavbar;
