"use client";
/* Component MenuDeConnexion */

import { useState } from 'react';
import MobileMenuDeConnexion from './MobileMenuDeConnexion'; // Import du composant enfant
import Image from 'next/image';

export default function MenuDeConnexion() {
    // Etat pour ouvrir/fermer le menu mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fonction pour basculer l'état du menu
    const toggleMobileMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <div className="relative inline-block text-left group">
            {/* Bouton de connexion */}
            <div className="flex items-center space-x-2 cursor-pointer transition-opacity hover:opacity-75">
                {/* Icône utilisateur */}
                <button onClick={toggleMobileMenu}>
                    <Image src="/icons/user.svg" alt="Utilisateur" className="h-6 w-6 md:h-8 md:w-8" width={20} height={20} />
                </button>

                {/* Texte et chevron */}
                <div className="hidden md:flex flex-col items-start">
                    <div className="flex items-center space-x-2">
                        <div>
                            <p className="text-green-600 text-xl font-bold transition-all duration-400">Identifiez-vous</p>
                            <p className="text-gray-600 transition-all duration-400">Compte et commandes</p>
                        </div>
                        <Image src="/icons/chevron_down.svg" alt="Chevron" className="h-6 w-6 md:h-8 md:w-8" width={20} height={20} />
                    </div>
                </div>
            </div>

            { /* Sous-menu de connexion */}
            <div className="invisible absolute z-500 flex w-full flex-col bg-white px-4 md:group-hover:visible">
                <a href="/connexion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Se connecter</a>
                <a href="/inscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">S&apos;inscrire</a>
            </div>

            {/* Sous-menu de connexion pour mobile */}
            <MobileMenuDeConnexion isMenuOpen={isMenuOpen} />

        </div>
        
    );
}
