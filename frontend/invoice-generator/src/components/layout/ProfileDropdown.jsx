import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    onLogout, 
}) => {

    const navigate = useNavigate();
  return (
    <div className="relative">
        <button
            onClick={onToggle}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
            {avatar ? (
                <img
                    src={avatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                />
            ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                        {companyName ? companyName.charAt(0).toUpperCase() : ""}
                    </span>
                </div>
            )}
            <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{companyName || "Company Name"}</p>
                <p className="text-xs text-gray-500">{email || "Email Address"}</p>
            </div>
            <ChevronDown className="iw-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
                <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700">{companyName || ""}</p>
                    <p className="text-xs text-gray-500">{email || ""}</p>
                </div>
                
                <hr className="border-t border-gray-200 my-1" />

                <a
                    onClick={() => {navigate('/profile'); onToggle();}}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                    View Profile
                </a>

                <hr className="border-t border-gray-200 my-1" />

                <div className="mb-2">
                    <a
                        href="#"
                        onClick={onLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    >
                        Logout
                    </a>
                </div>
            </div>
        )}
    </div>
  )
}

export default ProfileDropdown