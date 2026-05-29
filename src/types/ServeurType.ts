export type ServeurType = {
[x: string]: any;
    collectionId?: string;
    id: string;
    name: string;
    platform: string;
    version: string;
    modpack: string;
    modpack_url: string;
    world_name: string;
    embed_color: string;
    is_enabled: boolean;
    is_global: boolean;
    image: string;
    description: string;
    container: string;
    type: string;
    expand?: {
        platform?: {
            name: string;
        }
    }
}

export type ServeurScreenType = {
    nom: string;
    auteur_pseudo: string;
    path: string;
}