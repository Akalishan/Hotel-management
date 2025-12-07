import { NavLink } from "react-router-dom";
import { MdDashboard, MdAdd, MdList, MdExplore, MdHome } from "react-icons/md";

export const SideBar = () => {
  const sidebarLinks = [
    { name: "Home", path: "/", icon: MdHome },
    { name: "Dashboard", path: "/owner", icon: MdDashboard },
    { name: "Add Room", path: "/owner/add-room", icon: MdAdd },
    { name: "List Room", path: "/owner/list-room", icon: MdList },
    { name: "Experiences", path: "/owner/adminExperiences", icon: MdExplore },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 transition-colors duration-200 ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600"
                : "hover:bg-gray-100/90 border-white text-gray-700 hover:text-gray-900"
            }`
          }
        >
          <item.icon className="w-6 h-6 min-w-[24px]" />
          <p className="md:block hidden font-medium">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};
