import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <nav className="w-32 shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 text-xs">
        <NavLink to="/dashbord" className={({isActive}) =>
          `px-3 py-2 rounded-md ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Dashbord
        </NavLink>
        <NavLink to="/accounts" className={({isActive}) =>
          `px-3 py-2 rounded-md ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Oversikt
        </NavLink>
        <NavLink to="/verdipapirer" className={({isActive}) =>
          `px-3 py-2 rounded-md ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Verdipapirer
        </NavLink>

        <NavLink to="/budget" className={({isActive}) =>
          `px-3 py-2 rounded-md ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Budget
        </NavLink>

        <NavLink to="/settings" className={({isActive}) =>
          `px-3 py-2 rounded-md mt-auto ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Settings
        </NavLink>

      </nav>

      <main className="flex-1 overflow-auto" >
        <div className="mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}