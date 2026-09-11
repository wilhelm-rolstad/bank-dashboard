import { getCurrentWindow } from "@tauri-apps/api/window";

export default function TopBar (){
    const buttonStyle = "flex items-center justify-center rounded-full  w-3.5 h-3.5 cursor-pointer"
    const win = getCurrentWindow();

    return(
        <>
        <section data-tauri-drag-region className="w-full p-2">
        <div data-tauri-drag-region className="flex w-[30%] gap-2">
            <button className={`${buttonStyle} bg-red-400`} onClick={() => win.close()}/>
            <button className={`${buttonStyle} bg-yellow-400`} onClick={() => win.minimize() }/>
            <button className={`${buttonStyle} bg-green-400`} onClick={() => win.toggleMaximize() }/>
        </div>
        </section>
        </>
    )
}