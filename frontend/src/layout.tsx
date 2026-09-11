import { NavLink, Outlet } from "react-router-dom";

type LayoutProps = {
  collapsed: boolean;
};

export default function Layout({ collapsed }: LayoutProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl bg-white font-jetbrains font-normal">
      <div className="flex flex-1 min-h-0">
        <div
          className={`shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
            collapsed ? "w-0" : "w-32"
          }`}
          inert={collapsed}
        >
          <nav className="w-32 h-full border-r border-gray-200 p-4 flex flex-col gap-2 text-xs">
            <h3 className="px-3 py-2 bg-green-100 rounded-xl text-lg">
              Stinn.
            </h3>

            <NavLink
              to="/dashbord"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              Dashbord
            </NavLink>

            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              Konto
            </NavLink>

            <NavLink
              to="/verdipapirer"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              Aksjer
            </NavLink>

            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              Budsjett
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md mt-auto ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>

        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}