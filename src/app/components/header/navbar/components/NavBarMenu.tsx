"use client";

import Image from "next/image";
import { NavItem, SubMenuItem } from "../NavBar";


interface NavBarMenuProps {
  navItems?: NavItem[];
  subMenuItems?: SubMenuItem[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  filteredSubMenu?: SubMenuItem[];
  SubMenuToggle: (id: number) => void;
}

const NavBarMenu: React.FC<NavBarMenuProps> = ({
  navItems = [], // Valeur par défaut pour éviter undefined
  subMenuItems = [],
  isDropdownOpen,
  setIsDropdownOpen,
  activeId,
  setActiveId,
  filteredSubMenu = [],
}) => {
  return (
    <div className="relative">
      <div
        className="flex flex-col w-full hidden md:flex"
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        {/* Menu de navigation */}
        <div className="flex justify-between items-center py-2 relative">
          <div className="flex flex-wrap justify-between w-full">
            {Array.isArray(navItems) && navItems.length > 0 ? (
              navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="flex flex-col items-center text-center text-gray-600 hover:text-green-600 border-b-2 border-transparent hover:border-green-600 transition-colors duration-400"
                  style={{ flex: `1 1 calc(100% / ${navItems.length})`, minWidth: "200px" }}
                  onMouseEnter={() => {
                    setActiveId(item.id.toString());
                    const hasProducts = subMenuItems.some((menuItem) => menuItem.id.startsWith(`${item.id}`));
                    setIsDropdownOpen(hasProducts);
                  }}
                >
                  <Image src={item.img} alt={item.title} className="h-12 w-12 mb-0 rounded-lg" width={20} height={20} />
                  <span className="text-lg whitespace-nowrap">{item.title}</span>
                </a>
              ))
            ) : (
              <p>Chargement du menu...</p>
            )}
          </div>
        </div>
      </div>
      {/* Sous-menu affiché juste en dessous du menu principal */}
      {isDropdownOpen && activeId && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-[90%] bg-white shadow-lg p-6 border rounded-md z-50 mt-0"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <ul className="flex justify-start space-x-8">
            {Array.isArray(filteredSubMenu) && filteredSubMenu.length > 0 ? (
              filteredSubMenu.map((subMenu) => (
                <li key={subMenu.id} className="mb-4 w-full">
                  <a href={subMenu.link} className="text-gray-700 text-2xl hover:underline block mb-2">
                    {subMenu.title}
                  </a>
                  <ul className="grid grid-cols-1 gap-2 mt-4">
                    {subMenuItems.find((productItem) => productItem.id === subMenu.id)?.produits?.map((product) => (
                      <li key={product} className="text-gray-700 text-lg text-left">
                        {product}
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              <p>Aucun sous-menu disponible.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBarMenu;
