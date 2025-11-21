import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Home, ChevronLeft, ChevronRight, Settings, LogOut, LayoutDashboard, List, ArrowLeftRight, Plus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300 h-screen shadow-sm z-10",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-20 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-100"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      {/* Logo / Home */}
      <div className="flex items-center justify-center p-4 border-b h-16">
        <Link to="/items" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
          <Home size={24} />
          {!isCollapsed && <span className="font-bold text-xl text-black">EcoSwap</span>}
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-2 p-3 mt-4">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Overview" 
          isCollapsed={isCollapsed} 
          onClick={() => scrollToSection("overview")}
        />
        <NavItem 
          icon={<List size={20} />} 
          label="My Listings" 
          isCollapsed={isCollapsed} 
          onClick={() => scrollToSection("myListings")}
        />
        <NavItem 
          icon={<ArrowLeftRight size={20} />} 
          label="My Requests" 
          isCollapsed={isCollapsed} 
          onClick={() => scrollToSection("myRequests")}
        />

        <div className="mt-4">
          <Button 
            className={cn("w-full bg-green-500 hover:bg-green-600", isCollapsed ? "px-0" : "")} 
            onClick={() => navigate('/create')}
            title="Create Listing"
          >
            {isCollapsed ? <Plus size={20} /> : "Create Listing"}
          </Button>
        </div>
      </div>

      {/* User Profile & Footer */}
      <div className="p-4 border-t flex flex-col gap-4 items-center bg-gray-50">
        {user?.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt="User"
            className={cn(
              "rounded-full object-cover border-2 border-white shadow-sm transition-all",
              isCollapsed ? "size-10" : "size-16"
            )}
          />
        ) : (
           <div className={cn("rounded-full bg-gray-200 flex items-center justify-center", isCollapsed ? "size-10" : "size-16")}>
              <span className="text-gray-500 font-bold text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
           </div>
        )}

        {!isCollapsed && (
          <div className="text-center">
            <p className="font-medium truncate max-w-[180px]">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">@{user?.username}</p>
          </div>
        )}

        <div className={cn("flex gap-2 w-full mt-auto", isCollapsed ? "flex-col" : "flex-row")}>
          <Button 
            variant="outline" 
            size={isCollapsed ? "icon" : "default"} 
            className="flex-1"
            title="Settings"
          >
            <Settings size={18} />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
          <Button 
            variant="destructive" 
            size={isCollapsed ? "icon" : "default"} 
            className="flex-1" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, isCollapsed, onClick }: NavItemProps) => (
  <Button 
    variant="ghost" 
    className={cn(
      "w-full justify-start hover:bg-gray-100", 
      isCollapsed && "justify-center px-2"
    )}
    onClick={onClick}
    title={isCollapsed ? label : undefined}
  >
    {icon}
    {!isCollapsed && <span className="ml-2">{label}</span>}
  </Button>
);

export default SideBar;
