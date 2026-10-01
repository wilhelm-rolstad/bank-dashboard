import { CATEGORIES, CATEGORY_LABELS, type Category } from "../constants/categories";

type CategoryDropDownProps = {
    category : string,
    changeCategory : (newCategory:string) => void
}

const CATEGORY_STYLES: Record<Category, string> = {
        dagligvarer: "bg-emerald-100 text-emerald-800 border-emerald-200",
        "snacks og småkjøp": "bg-pink-100 text-pink-800 border-pink-200",
        husleie: "bg-stone-100 text-stone-800 border-stone-200",
        strøm: "bg-yellow-100 text-yellow-800 border-yellow-200",
        takeaway: "bg-orange-100 text-orange-800 border-orange-200",
        transport: "bg-sky-100 text-sky-800 border-sky-200",
        trening: "bg-violet-100 text-violet-800 border-violet-200",
        sosialt: "bg-pink-100 text-pink-800 border-pink-200",
        underholdning: "bg-purple-100 text-purple-800 border-purple-200",
        abonnement: "bg-amber-100 text-amber-800 border-amber-200",
        "studier og pensum": "bg-indigo-100 text-indigo-800 border-indigo-200",
        helse: "bg-red-100 text-red-800 border-red-200",
        "personlig pleie": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
        forsikring: "bg-slate-100 text-slate-800 border-slate-200",
        klær: "bg-rose-100 text-rose-800 border-rose-200",
        elektronikk: "bg-cyan-100 text-cyan-800 border-cyan-200",
        "hjem og interiør": "bg-stone-100 text-stone-800 border-stone-200",
        reise: "bg-teal-100 text-teal-800 border-teal-200",
        "gaver og donasjoner": "bg-rose-100 text-rose-800 border-rose-200",
        lønn: "bg-green-100 text-green-800 border-green-200",
        "studielån og stipend": "bg-emerald-100 text-emerald-800 border-emerald-200",
        "annen inntekt": "bg-green-100 text-green-800 border-green-200",
        "nedbetaling av lån": "bg-orange-100 text-orange-800 border-orange-200",
        "gebyrer og skatt": "bg-zinc-100 text-zinc-800 border-zinc-200",
        sparing: "bg-lime-100 text-lime-800 border-lime-200",
        overføring: "bg-indigo-100 text-indigo-800 border-indigo-200",
        other: "bg-gray-100 text-gray-600 border-gray-200",
    };  

export default function CategoryDropDown({changeCategory, category} : CategoryDropDownProps){
    // Eldre transaksjoner fra backend kan ha denne stavefeilen.
    const selectedCategory = category === "abbonement" ? "abonnement" : category;
    const knownCategory = CATEGORIES.find((item) => item === selectedCategory);

    return(
        <>
            <select aria-label="Kategori" value={selectedCategory} className={`${CATEGORY_STYLES[knownCategory ?? "other"]} border px-3 py-1 rounded-full text-xs`} onChange={(e) => changeCategory(e.target.value)}>
                {!knownCategory && <option value={selectedCategory}>{selectedCategory || "Ukategorisert"}</option>}
                {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="">
                        {CATEGORY_LABELS[category]}
                    </option>
                ))
                }
            </select>
        </>
    )
}
