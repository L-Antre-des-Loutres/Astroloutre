import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

export const get: APIRoute = async ({ request }) => {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => {
            const [key, ...v] = c.split('=');
            return [key, decodeURIComponent(v.join('='))];
        })
    );

    const token = cookies.token;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    try {
        const user = jwt.verify(token, import.meta.env.JWT_SECRET) as {
            id: string;
            username: string;
            discriminator: string;
            avatar: string | null;
        };

        // Construire URL avatar Discord
        const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : `/default-avatar.png`; // mettre un avatar par défaut si vide

        return new Response(
            JSON.stringify({
                username: user.username,
                avatarUrl,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch {
        return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 });
    }
};
