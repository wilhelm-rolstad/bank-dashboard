import { NavLink, Outlet } from "react-router-dom";
import { useState } from 'react'

export default function Layout() {
  const [hide, setHide] = useState(false)

  return (
    <div className="flex h-screen gap-2">
      <nav className={`${hide ? "w-10" : "w-32"} shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 text-xs`}>
        <button className="border p-2" onClick={() => setHide(!hide)}>{"<"}</button>
        {!hide ? 
        <div className="flex flex-col gap-4 h-full">
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

        <NavLink to="/settings" className={({isActive}) =>
          `px-3 py-2 rounded-md mt-auto ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }>
          Settings
        </NavLink>
        </div> : null
          }
      </nav>

      <main className="flex-1 overflow-auto" >
        <div className="mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}