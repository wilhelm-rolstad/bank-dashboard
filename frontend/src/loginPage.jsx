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
            <section className="w-full flex justify-center items-center h-full bg-[url('./assets/login_bg.jpg')] bg-cover bg-center ">
                <div className="border border-gray-300 rounded-lg p-5 flex flex-col gap-2 items-center bg-white/5 shadow-md backdrop-blur-xs text-white">
                    <h1>Welcom back Wilhelm</h1>
                    <p>Please enter your pin</p>
                        <input type="password" className="border rounded" onChange={(e) => handleClick(e.target.value)}></input>
                </div>
            </section>
        </>
    )
}