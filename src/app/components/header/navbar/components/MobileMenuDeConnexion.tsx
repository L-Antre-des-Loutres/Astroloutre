"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface MobileMenuDeConnexionProps {
  isMenuOpen: boolean;
}

const MobileMenuDeConnexion: React.FC<MobileMenuDeConnexionProps> = ({ isMenuOpen }) => {
  const [menuContainer, setMenuContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.getElementById("MobileMenuDeConnexion");
    setMenuContainer(container);
  }, []);

  if (!menuContainer) {
    return null;
  }

  return createPortal(
    isMenuOpen && (
      <div className="fixed left-0 bg-white shadow-lg z-50 lg:hidden h-full w-64 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col w-full p-4">
          <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Se connecter
          </a>
          <a href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            S&apos;inscrire
          </a>
        </div>
      </div>
    ),
    menuContainer
  );
};

export default MobileMenuDeConnexion;
