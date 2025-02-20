"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MenuDeConnexion from "./components/ConnexionMenu";
import NavBarMenu from "./components/NavBarMenu";
import Image from "next/image";

export interface NavItem {
    id: number;
    link: string;
    img: string;
    title: string;
}

export interface SubMenuItem {
    id: string;
    id_item: number;
    link: string;
    title: string;
    produits?: string[];
}


/* Tableau des données du menu de navigation */
const navItems: NavItem[] = [
    { id: 1, title: 'Tous les produits', link: '/tous-les-produits', img: '/icons/tous_les_produits.svg' },
    { id: 2, title: 'Viandes & Charcuterie', link: '/viande-et-charcuterie', img: '/icons/viandes__charcuteries.svg' },
    { id: 3, title: 'Poissons & Fruits de Mer', link: '/poissons-et-fruits-de-mer', img: '/icons/poissons__fruits_de_mer.svg' },
    { id: 4, title: 'Fruits & Légumes', link: '/fruits-et-legumes', img: '/icons/fruits__legumes.svg' },
    { id: 5, title: 'Boissons', link: '/boissons', img: '/icons/boissons__alcools.svg' },
    { id: 6, title: 'Épicerie Salée', link: '/epicerie-salee', img: '/icons/epicerie_salee.svg' },
    { id: 7, title: 'Épicerie Sucrée', link: '/epicerie-sucrée', img: '/icons/epicerie_sucree.svg' },
    { id: 8, title: 'Fromagerie & Produits laitiers', link: '/fromagerie-et-produits-laitiers', img: '/icons/laits__fromages.svg' },
    { id: 9, title: 'Plats traiteur', link: '/plats-traiteur', img: '/icons/plats_traiteur.svg' },
];

/* Tableau des données des sous-menus */
const subMenuTitle: SubMenuItem[] = [
    { id_item: 2, id: '2-1', title: 'Viandes', link: '/viandes' },
    { id_item: 2, id: '2-2', title: 'Charcuterie', link: '/charcuterie' },
    { id_item: 2, id: '2-3', title: 'Patés et Rillettes', link: '/pates-et-rillettes' },
    { id_item: 2, id: '2-4', title: 'Autres', link: '/autres' },
    { id_item: 3, id: '3-1', title: 'Poissons frais', link: '/poissons-frais' },
    { id_item: 3, id: '3-2', title: 'Poissons fumés', link: '/poissons-fumés' },
    { id_item: 3, id: '3-3', title: 'Fruits de Mer', link: '/fruits-de-mer' },
    { id_item: 3, id: '3-4', title: 'Autres', link: '/autres' },
    { id_item: 4, id: '4-1', title: 'Fruits', link: '/fruits' },
    { id_item: 4, id: '4-2', title: 'Légumes', link: '/legumes' },
    { id_item: 4, id: '4-3', title: 'Fruits secs', link: '/fruits-secs' },
    { id_item: 4, id: '4-4', title: 'Autres', link: '/autres' },
    { id_item: 5, id: '5-1', title: 'Boissons', link: '/boissons' },
    { id_item: 5, id: '5-2', title: 'Alcools', link: '/alcools' },
    { id_item: 5, id: '5-3', title: 'Jus de fruits', link: '/jus-de-fruits' },
    { id_item: 5, id: '5-4', title: 'Autres', link: '/autres' },
    { id_item: 6, id: '6-1', title: 'Épicerie Salée', link: '/epicerie-salee' },
    { id_item: 6, id: '6-2', title: 'Condiments', link: '/condiments' },
    { id_item: 6, id: '6-3', title: 'Conserves', link: '/conserves' },
    { id_item: 6, id: '6-4', title: 'Autres', link: '/autres' },
    { id_item: 7, id: '7-1', title: 'Épicerie Sucrée', link: '/epicerie-sucree' },
    { id_item: 7, id: '7-2', title: 'Confiseries', link: '/confiseries' },
    { id_item: 7, id: '7-3', title: 'Chocolats', link: '/chocolats' },
    { id_item: 7, id: '7-4', title: 'Autres', link: '/autres' },
    { id_item: 8, id: '8-1', title: 'Fromagerie', link: '/fromagerie' },
    { id_item: 8, id: '8-2', title: 'Produits laitiers', link: '/produits-laitiers' },
    { id_item: 9, id: '9-1', title: 'Plats', link: '/plats' },
    { id_item: 9, id: '9-2', title: 'Traiteur', link: '/traiteur' }
];

export default function NavMenu() {
    /* Déclaration des états */
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeSubMenuId, setActiveSubMenuId] = useState<string | number | null>(null);

    /* Fonctions */
    const SubMenuToggle = (id: string | number) => {
        setActiveSubMenuId(activeSubMenuId === id ? null : id);
    };

    const toggleMobileMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    // Filtrer les sous-menus en fonction de l'ID actif
    const filteredSubMenu = Array.isArray(subMenuTitle)
        ? subMenuTitle.filter(item => item.id_item === Number(activeId))
        : [];

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 bg-white sticky top-0 z-50">
                <div className="flex items-center justify-between w-full mb-4 md:mb-0">
                    <div className="flex justify-center items-center mr-4 md:flex-shrink-0 transition-opacity hover:opacity-75">
                        <Image src="/logo.svg" alt="Kouer" className="h-8 md:h-12" width={20} height={20} />
                    </div>
                    {/* Formulaire de recherche */}
                    <SearchBar />

                    {/* Connexion, Favoris, Panier */}
                    <div className="flex items-center space-x-2 ml-4 order-3">
                        <div id='MenuDeConnexion'>
                            <MenuDeConnexion />
                        </div>
                    </div>
                </div>

                {/* Menu mobile */}
                <div className="md:hidden w-full max-w-xs mt-4 order-4 flex items-center">
                    <button className="mr-2" onClick={toggleMobileMenu}>
                        <Image src="/icons/menuIcon.svg" alt="Menu" className="h-5 w-5 text-green-600" width={20} height={20} />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Quel produit recherchez-vous ?"
                            className="w-full border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        />
                        <button className="absolute right-2 top-2" aria-label="Rechercher">
                            <Image src="/icons/search.svg" alt="Rechercher" className="h-5 w-5 text-green-600" width={20} height={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navbar-Menu */}
            <NavBarMenu
                navItems={navItems}
                subMenuItems={subMenuTitle}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                activeId={activeId}
                setActiveId={setActiveId}
                SubMenuToggle={SubMenuToggle}
                filteredSubMenu={filteredSubMenu}
            />

            {/* Sous-Menu mobile */}
            {isMenuOpen && (
                <div className="fixed left-0 bg-white shadow-lg z-50 lg:hidden h-full transform transition-transform duration-300 ease-in-out translate-x-0">
                    <div className="flex flex-col w-64 p-4">
                        {navItems.map(item => (
                            <div key={item.id}>
                                <button
                                    onClick={() => {
                                        SubMenuToggle(item.id);
                                        setActiveId(item.id.toString());
                                    }}
                                    className="flex items-center text-gray-600 hover:text-green-600 transition-all duration-400 py-2 w-full text-left"
                                >
                                    <Image src={item.img} alt={item.title} className="h-6 w-6 mr-2" width={20} height={20} />
                                    <span>{item.title}</span>
                                </button>
                                {activeSubMenuId === item.id && (
                                    <ul className="pl-4">
                                        {filteredSubMenu.map(subCategory => (
                                            <li key={subCategory.id} className="py-1">
                                                <a href={subCategory.link} className="text-gray-600 hover:text-green-600 transition-all duration-400">
                                                    {subCategory.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div id="MobileMenuDeConnexion">
                {/* Menu mobile mis ici grâce à un portail React */}
            </div>
        </div>
    );
}
