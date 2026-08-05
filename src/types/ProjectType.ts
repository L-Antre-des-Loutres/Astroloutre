export type ProjectType = {
    id: string;
    collectionId: string;
    name: string;
    repository: string;
    platform: string; // ID (chaîne de caractères) de la relation "platforms" (Single)
    tags: string[]; // Tableau d'IDs des relations "project_tags" (Multiple, Nonempty)
    description: string;
    logo: string; // Nom du fichier image
    is_maintained: boolean;
    wiki_url: string;
    publish_url: string;
    expand?: any;
}