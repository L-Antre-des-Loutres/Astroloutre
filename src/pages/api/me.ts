// src/pages/api/me.ts
import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";

export const GET: APIRoute = async ({ request }) => {
    const cookie = request.headers.get("cookie");
    const jwtCookie = cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

    if (!jwtCookie) {
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const user = jwt.verify(jwtCookie, import.meta.env.JWT_SECRET!);
        return new Response(JSON.stringify({ authenticated: true, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }
};
