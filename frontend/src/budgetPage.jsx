import { useState, useEffect} from 'react'

export default function budgetPage(){
    return(
        <>
            <section className="w-full p-2 h-screen flex flex-col gap-2">
                <header>
                    <h1 className="text-xl">Budget</h1>
                </header>
                <div className="w-full rounded-xl h-[35%] overflow-hidden flex gap-2 py-2">
                    <section className="w-[70%] h-full border border-gray-200 shadow-md  rounded-xl">

                    </section>
                    <div className="w-[30%] h-full flex flex-col gap-2">
                        <section className="w-full h-[60%] border border-gray-200 shadow-md rounded-xl flex flex-col gap-1 p-4">
                            <h2>This month:</h2>
                            <div className="flex flex-col gap-0">
                                <h1 className="text-lg"> {"12,360.00"}</h1>
                                <p className="text-sm">of {"16,510.00"} budgeted</p>
                            </div>
                            <div className="relative w-full h-2">
                                <span className="absolute inset-0 z-100 w-[80%] h-2 bg-green-400 rounded-full"></span>
                                <span className="absolute inset-0 w-full h-2 bg-gray-200 rounded-full"></span>
                            </div>
                            
                            <div className="flex items-center">
                                <p className="text-xs text-gray-300">{"percentage"}</p>
                                <p className="text-xs text-gray-300 ml-auto">{"money left"}</p>
                            </div>
                        </section>
                        <section className="w-full h-[40%] border border-gray-200 shadow-md rounded-xl">

                        </section>

                    </div>
                </div>
                <section className="w-full border border-gray-200 shadow-md py-2 rounded-xl h-[65%]">

                </section>
            </section>
        </>
    )
}