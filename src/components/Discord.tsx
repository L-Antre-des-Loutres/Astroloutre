// src/components/User.tsx
import { useEffect, useState } from "react";

export default function DiscordConnexion() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch("https://otterlyapi.antredesloutres.fr/api/auth/discord/me", { credentials: "include" })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data?.authenticated) setUser(data.user);
            });
    }, []);

    if (!user) {
        return (
            <a href="https://otterlyapi.antredesloutres.fr/api/auth/discord/login">
                <button>Connexion avec Discord</button>
            </a>
        );
    }

    return (
        <div>
            <p>Bienvenue {user.username}#{user.discriminator} 👋</p>
            <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                width="64"
                alt="Avatar Discord"
            />
        </div>
    );
}
