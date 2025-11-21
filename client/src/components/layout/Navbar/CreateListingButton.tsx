import { Plus } from "lucide-react";
import { Link } from "react-router-dom";


interface CreateListingButtonProps {
  label: string;
  to: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CreateListingButton = ({ label, to, className, onClick }: CreateListingButtonProps) => {
  return (
    <div 
      className={`relative bg-green-500 text-white items-center hover:bg-green-600 rounded-md overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >

   

   
      <Link
        to={to}
        className="relative z-10 flex items-center gap-2 p-1 w-full justify-center"
      >
        {label}
        <Plus/>
      </Link>
    </div>
  );
};

export default CreateListingButton;
