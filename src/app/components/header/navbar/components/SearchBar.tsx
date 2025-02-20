import Image from 'next/image';

export default function SearchBar() {
    return (
        <div className="hidden md:flex md:flex-grow md:max-w-lg lg:max-w-2xl px-2 order-1">
            {/* Barre de recherche */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Quel produit recherchez-vous ?"
                    className="w-full border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
                <button className="absolute right-2 top-2" aria-label="Rechercher">
                    <Image src="/icons/search.svg" alt="Rechercher" width={20} height={20} className="h-5 w-5 text-green-600" />
                </button>
            </div>
        </div>
    )
}