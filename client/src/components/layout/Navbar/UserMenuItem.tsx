import { Link } from "react-router-dom"


interface UserMenuItemProps {
    to: string;
    label: string;
    icon?: React.ReactNode

};

const UserMenuItem = ({to,label,icon}:UserMenuItemProps) => {
  return (
    <div className="block border shadow-sm shadow-gray-500 hover:scale-105 transition-transform  duration-300 rounded-sm ">
        <Link to={to}>
        <div className="flex  justify-center gap-1 items-center">
            {label}
            {icon}
        </div>

        </Link>
    </div>
  )
}

export default UserMenuItem