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
            <section className="w-full flex justify-center items-center h-screen">
                <div className="border rounded-lg p-5 flex flex-col gap-2 items-center">
                    <h1>Welcom back Wilhelm</h1>
                    <p>Please enter your pin</p>
                        <input type="password" className="border rounded" onChange={(e) => handleClick(e.target.value)}></input>
                </div>
            </section>
        </>
    )
}