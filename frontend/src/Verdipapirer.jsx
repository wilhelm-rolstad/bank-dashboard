export default function verdipapirer(){

    const intervalPickerStyle = "border px-2 py-1 rounded-md text-sm cursor-pointer hover:scale-105 hover:bg-gray-100 transition duration-300"

    return(<>
        <section className=" mx-auto w-full h-screen p-2 flex flex-col gap-2">
            <h1>Verdipapirer</h1>
            <section className="flex flex-col gap-2">
                <div className="flex gap 2">
                    <h2>Din beholdning:</h2>
                </div>

                <div className="flex gap-1">
                    <p className={`${intervalPickerStyle}`}>Month</p>
                    <p className={`${intervalPickerStyle}`}>3 Months</p>
                    <p className={`${intervalPickerStyle}`}>Year</p>
                    <p className={`${intervalPickerStyle}`}>All time</p>
                    <p className="ml-auto border px-2 py-1 rounded-md text-sm cursor-pointer hover:scale-105 hover:bg-blue-700 bg-blue-500 transition duration-300 text-white">import csv</p>
                </div>
            </section>

            <section className="border bg-black rounded-xl w-full h-[30vh] text-white p-2">
                <div className="flex gap-2 items-center border border-green-500 w-[20%]">
                    <p>000 000.00</p>
                    <p>eye-icon</p>
                </div>
            </section>

            <section className="w-full flex gap-2 h-[20vh]">
                <div className="border bg-black rounded-xl w-[50%]">   

                </div>
                <div className="border bg-black rounded-xl w-[50%]">

                </div>
            </section>

            <section className="w-full flex flex-col border bg-black rounded-xl h-[16vh] p-2 text-white">
                <p>2026</p>
                <div className="flex flex-wrap content-start gap-1">
                    {Array.from({ length: 365 }, (_, i) => {
                        const r = Math.random() * 3;
                        let cls;
                        if (r >= 1.75) cls = "bg-green-600";
                        else if (r >= 1.2) cls = "bg-green-500";
                        else if (r >= 0.8) cls = "bg-green-400";
                        else if (r >= 0.4) cls = "bg-red-400";
                        else if (r >= 0.2) cls = "bg-red-500";
                        else cls = "bg-red-600";

                        return <div key={i} className={`w-4 h-4 rounded-sm ${cls}`} />;
                        })}
                </div>
            </section>


        </section>
    </>)
}