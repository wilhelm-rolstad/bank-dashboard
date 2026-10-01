import { useNavigate } from "react-router-dom";
import { useState } from 'react'

export default function loginPage(){
    const navigate = useNavigate();
    const pin = "1218"
    
    function handleClick(answer){
        console.log("happening")
        console.log(answer)
        if(pin === answer){
            navigate("/accounts");
        }
    }

    return(
        <>
            <section className="w-full flex justify-center items-center h-full bg-[url('./assets/login_bg.jpg')] bg-cover bg-center font-jetbrains font-normal">
                <div className="border border-gray-300 rounded-2xl p-5 flex flex-col gap-2 justify-center items-center bg-white text-black w-[40%] h-[30%] min-w-100 min-h-30">
                    <h1 className="text-3xl">Stinn.</h1>
                    <p >Pin-kode</p>
                        <input type="password" className="border rounded w-30" onChange={(e) => handleClick(e.target.value)}></input>
                    <button className="cursor-pointer border px-3 py-1 rounded-lg flex items-center hover:scale-105 transition duration-300">Demo-versjon</button>
                </div>
            </section>
        </>
    )
}