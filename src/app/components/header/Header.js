// components/Header.js

import NavBar from './navbar/NavBar';

export default function HeaderComponent() {

    return (
        <header className="bg-white sticky-header">
            {/* Import de la Navbar */}
            <NavBar />
        </header>
    );
}
