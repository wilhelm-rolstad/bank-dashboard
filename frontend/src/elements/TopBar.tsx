import { getCurrentWindow } from "@tauri-apps/api/window";
import {PanelLeftDashed} from 'lucide-react'
import type { Dispatch, SetStateAction } from "react";

type TopBarProps = { 
    setCollapsed : Dispatch<SetStateAction<boolean>>
} 

export default function TopBar ({setCollapsed} : TopBarProps){
    const buttonStyle = "flex items-center justify-center rounded-full  w-3.5 h-3.5 cursor-pointer"
    const win = getCurrentWindow();

    return(
        <>
        <section data-tauri-drag-region className="w-full p-2">
        <div data-tauri-drag-region className="flex w-[30%] gap-2">
            <button className={`${buttonStyle} bg-red-400`} onClick={() => win.close()}/>
            <button className={`${buttonStyle} bg-yellow-400`} onClick={() => win.minimize() }/>
            <button className={`${buttonStyle} bg-green-400`} onClick={() => win.toggleMaximize() }/>
            <button className="cursor-pointer hover:scale-105 transition duration-300" onClick={() => setCollapsed((previous) => !(previous))}> <PanelLeftDashed height="16px"/></button>
        </div>
        </section>
        </>
    )
}