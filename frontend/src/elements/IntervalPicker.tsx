type IntervalPickerProps = {
    someFunction : (interval:string) => void
}

export default function IntervalPicker({someFunction}:IntervalPickerProps){
    const style="px-2 py-1 border border-gray-200 rounded bg-gray-100 text-xs cursor-pointer hover:scale-105 transition duration-300"

    return(
        <section className="flex gap-1 ml-auto">
            <button className={style} onClick={(e) => {someFunction(e.currentTarget.value)}}>Måned</button>
            <button className={style} onClick={(e) => {someFunction(e.currentTarget.value)}}>3 Måneder</button>
            <button className={style} onClick={(e) => {someFunction(e.currentTarget.value)}}>År</button>
            <button className={style} onClick={(e) => {someFunction(e.currentTarget.value)}}>Alt</button>
        </section>
    )
}