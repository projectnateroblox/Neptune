import { NavLink } from "react-router-dom";
import { Home, Cloud, User, Settings } from "lucide-react";

const Sidebar = () => {
  const iconClass = "w-5 h-5";
  const linkClass =
    "w-full h-10 flex items-center justify-center text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 transition-all duration-200 ease-in-out relative group";
  const activeLinkClass =
    "text-ocean-300 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-ocean-300 before:transition-all before:duration-200";

  return (
    <nav className="w-12 bg-deep-800 flex flex-col items-center py-1 border-r border-deep-600">
      <div className="flex-1 w-full flex flex-col items-center gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
          title="Home"
        >
          <Home className={iconClass} />
        </NavLink>
        <NavLink
          to="/clouds"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
          title="Cloud Storage"
        >
          <Cloud className={iconClass} />
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
          title="Account"
        >
          <User className={iconClass} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
          title="Settings"
        >
          <Settings className={iconClass} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
