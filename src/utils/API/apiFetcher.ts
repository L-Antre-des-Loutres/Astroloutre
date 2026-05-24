import PocketBase from 'pocketbase';
import { PB_URL } from "../constantes.ts";

export class ApiFetcher {
    private static instance: PocketBase;

    /**
     * Récupère l'instance PocketBase (Singleton)
     */
    static get pb(): PocketBase {
        if (!this.instance) {
            if (!PB_URL) {
                console.error("ApiFetcher: PocketBase URL (PB_URL) missing in constantes.ts.");
            }
            this.instance = new PocketBase(PB_URL);
        }
        return this.instance;
    }

    /**
     * Authentification automatique via les variables d'environnement (Server-side)
     * Utilise la collection '_superusers' pour PocketBase v0.23+
     */
    private static async authenticate() {
        if (this.pb.authStore.isValid && this.pb.authStore.isAdmin) return;

        const email = import.meta.env.PB_EMAIL;
        const password = import.meta.env.PB_PASSWORD;

        if (email && password) {
            try {
                // Authentification exclusive via la collection '_superusers' (PocketBase v0.23+)
                await this.pb.collection('_superusers').authWithPassword(email, password);
                // console.debug("ApiFetcher: Authentification réussie via _superusers !");
            } catch (error) {
                console.error(`ApiFetcher: Échec de l'authentification (_superusers): ${error}`);
            }
        } else {
            // console.debug("ApiFetcher: Initialisé en mode invité.");
        }
    }

    /**
     * Récupère tous les enregistrements d'une collection PocketBase.
     * @param collectionName Nom de la collection
     * @returns Un tableau contenant tous les enregistrements
     */
    static async getAllRecords<T>(collectionName: string): Promise<T[]> {
        try {
            // On s'assure d'être authentifié pour les appels serveur
            await this.authenticate();

            return await this.pb.collection(collectionName).getFullList<T>({
                requestKey: null,
            });
        } catch (error) {
            console.error(`Erreur lors de la récupération de la collection ${collectionName}:`, error);
            return [];
        }
    }

    /**
     * Authentification manuelle avec email/username et mot de passe (Client-side)
     */
    static async login(identity: string, password: string) {
        try {
            return await this.pb.collection('users').authWithPassword(identity, password);
        } catch (error) {
            console.error("Erreur de connexion:", error);
            throw error;
        }
    }

    /**
     * Déconnexion
     */
    static logout() {
        this.pb.authStore.clear();
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    static isAuthenticated(): boolean {
        return this.pb.authStore.isValid;
    }

    /**
     * Récupère l'utilisateur actuel
     */
    static getCurrentUser() {
        return this.pb.authStore.record;
    }
}
