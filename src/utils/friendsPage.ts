import {slugify} from "../formater/JoueurFormater.ts";
import {clearOapiSessionCache, getOapiLoginUrl, getOapiSession} from "./API/oapiAuth.ts";
import {acceptFriend, friendsRetryAt, getFriends, OapiFriendsError, removeFriend, requestFriendByTag} from "./API/oapiFriends.ts";
import type {FriendList, FriendProfile, Friendship} from "./API/oapiFriends.ts";

type ListKind = keyof FriendList;

/**
 * Page /amis : liste d'amis, demandes reçues et envoyées de l'utilisateur connecté (logique reprise de l'ADL ROM Patcher).
 * @param root élément racine de la page, contenant les blocs data-*
 */
export function initFriendsPage(root: HTMLElement) {
    const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
    const guest = get('[data-guest]');
    const workspace = get('[data-workspace]');
    const errorBox = get('[data-error]');
    const feedback = get('[data-feedback]');
    const loading = get('[data-session-loading]');
    const listLoading = get('[data-list-loading]');
    const lists = get('[data-lists]');
    const form = get<HTMLFormElement>('[data-add-form]');
    const tagInput = get<HTMLInputElement>('#friend-tag');
    const search = get<HTMLInputElement>('[data-search]');
    const template = get<HTMLTemplateElement>('[data-friend-template]');
    const dialog = get<HTMLDialogElement>('[data-confirm-dialog]');
    let connected = false;
    let data: FriendList | null = null;
    let busy = false;
    let cooldownTimer: ReturnType<typeof setInterval> | undefined;

    const login = get<HTMLAnchorElement>('[data-login]');
    login.href = getOapiLoginUrl("/amis");
    login.addEventListener('click', clearOapiSessionCache);

    function syncControls() {
        const waiting = Date.now() < friendsRetryAt();
        root.querySelectorAll<HTMLButtonElement | HTMLInputElement>('[data-api-control]').forEach((control) => {
            // Le bouton "Réessayer" (hors espace connecté) doit rester utilisable pour se reconnecter
            control.disabled = busy || waiting || (workspace.contains(control) && !connected);
        });
        workspace.setAttribute('aria-busy', String(busy));
    }

    function showCooldown() {
        if (cooldownTimer) clearInterval(cooldownTimer);
        const label = get('[data-cooldown]');
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((friendsRetryAt() - Date.now()) / 1000));
            label.hidden = remaining === 0;
            label.textContent = remaining ? `Nouvel essai possible dans ${remaining} s.` : '';
            syncControls();
            if (!remaining && cooldownTimer) clearInterval(cooldownTimer);
        };
        tick();
        if (Date.now() < friendsRetryAt()) cooldownTimer = setInterval(tick, 1000);
    }

    function signedOut() {
        connected = false;
        data = null;
        workspace.hidden = true;
        lists.hidden = true;
        guest.hidden = false;
        root.querySelectorAll('[data-list]').forEach((list) => list.replaceChildren());
    }

    function reportError(error: unknown, prefix = '') {
        if (error instanceof OapiFriendsError && error.status === 401) signedOut();
        errorBox.hidden = false;
        get('[data-error-message]').textContent = prefix + (error instanceof Error ? error.message : "Une erreur est survenue. Réessaie plus tard.");
        if (error instanceof OapiFriendsError && error.status === 429) showCooldown();
    }

    async function perform(work: () => Promise<void>) {
        if (busy || Date.now() < friendsRetryAt()) return;
        busy = true;
        errorBox.hidden = true;
        feedback.textContent = '';
        syncControls();
        try {
            await work();
        } catch (error) {
            reportError(error);
        } finally {
            busy = false;
            loading.hidden = true;
            syncControls();
        }
    }

    function dateLabel(since: string, kind: ListKind) {
        // PocketBase sépare la date et l'heure par un espace au lieu du T de l'ISO
        const date = new Date(since.replace(' ', 'T'));
        if (Number.isNaN(date.getTime())) return '';
        const formatted = new Intl.DateTimeFormat('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'}).format(date);
        return `${kind === 'friends' ? 'Amis depuis le' : kind === 'incoming' ? 'Reçue le' : 'Envoyée le'} ${formatted}`;
    }

    function displayName(profile: FriendProfile) {
        return profile.username || profile.discord_tag || 'Compte indisponible';
    }

    function setAvatar(container: HTMLElement, profile: FriendProfile) {
        const initial = container.querySelector<HTMLElement>('[data-initial]')!;
        const image = container.querySelector<HTMLImageElement>('img')!;
        initial.textContent = profile.username?.trim().charAt(0).toLocaleUpperCase('fr') || '?';
        if (typeof profile.avatar_url !== 'string') return;
        try {
            const url = new URL(profile.avatar_url);
            if (url.protocol !== 'https:') return;
            image.onload = () => { image.hidden = false; };
            image.onerror = () => { image.hidden = true; };
            image.src = url.href;
        } catch {
            // URL d'avatar invalide : on garde l'initiale
        }
    }

    function renderList(kind: ListKind) {
        if (!data) return;
        const list = get<HTMLUListElement>(`[data-list="${kind}"]`);
        const query = search.value.trim().toLocaleLowerCase('fr');
        const entries = data[kind].filter(({user}) => kind !== 'friends' ||
            `${user.username ?? ''} ${user.discord_tag ?? ''}`.toLocaleLowerCase('fr').includes(query));
        const fragment = document.createDocumentFragment();

        for (const entry of entries) {
            const row = template.content.cloneNode(true) as DocumentFragment;
            const name = displayName(entry.user);
            const nameLink = row.querySelector<HTMLAnchorElement>('[data-name]')!;
            nameLink.textContent = name;
            // Les pages profil sont indexées par discord_tag
            if (entry.user.discord_tag) nameLink.href = `/profil/${slugify(entry.user.discord_tag)}/`;
            else nameLink.removeAttribute('href');
            row.querySelector('[data-tag]')!.textContent = entry.user.discord_tag ? `@${entry.user.discord_tag}` : '';
            row.querySelector('[data-since]')!.textContent = dateLabel(entry.since, kind);
            setAvatar(row.querySelector<HTMLElement>('.friend-avatar')!, entry.user);

            const actions = row.querySelector<HTMLElement>('[data-actions]')!;
            const addAction = (label: string, style: string, onClick: () => void) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `friend-button ${style}`;
                button.textContent = label;
                button.setAttribute('aria-label', `${label} : ${name}`);
                button.dataset.apiControl = '';
                button.addEventListener('click', onClick);
                actions.append(button);
            };
            if (kind === 'incoming') addAction('Accepter', 'primary', () => void mutate(entry, 'accept', kind));
            if (kind === 'friends') addAction('Retirer', 'danger', () => confirmRemoval(entry));
            else addAction(kind === 'incoming' ? 'Refuser' : 'Annuler', 'secondary', () => void mutate(entry, 'remove', kind));
            fragment.append(row);
        }

        list.replaceChildren(fragment);
        const empty = get(`[data-empty="${kind}"]`);
        empty.hidden = entries.length > 0;
        if (kind === 'friends') empty.textContent = data.friends.length && query
            ? "Aucun ami ne correspond à ta recherche."
            : "Ta bande de loutres commence ici. Envoie ta première demande !";
        get(`[data-count="${kind}"]`).textContent = String(data[kind].length);
        syncControls();
    }

    async function refreshFriends() {
        listLoading.hidden = false;
        try {
            data = await getFriends();
            for (const kind of ['friends', 'incoming', 'outgoing'] as const) renderList(kind);
            lists.hidden = false;
        } finally {
            listLoading.hidden = true;
        }
    }

    async function connect() {
        loading.hidden = false;
        const session = await getOapiSession();
        if (!session?.authenticated) {
            signedOut();
            return;
        }
        connected = true;
        guest.hidden = true;
        workspace.hidden = false;
        loading.hidden = true;
        await refreshFriends();
    }

    async function afterAction(message: string) {
        feedback.textContent = message;
        // Une action réussie ne doit pas être confondue avec l'échec de l'actualisation qui suit
        try {
            await refreshFriends();
        } catch (error) {
            lists.hidden = true;
            reportError(error, "L'action a réussi, mais la liste n'a pas pu être actualisée. ");
        }
    }

    function mutate(entry: Friendship, action: 'accept' | 'remove', kind: ListKind) {
        return perform(async () => {
            if (action === 'accept') await acceptFriend(entry.user.id);
            else await removeFriend(entry.user.id);
            await afterAction(action === 'accept' ? "Demande acceptée : ta bande s'agrandit !"
                : kind === 'incoming' ? "La demande a été refusée."
                : kind === 'outgoing' ? "Ta demande a été annulée." : "Cet ami a été retiré de ta liste.");
        });
    }

    function confirmRemoval(entry: Friendship) {
        get('#remove-description').textContent = `Veux-tu retirer ${displayName(entry.user)} de tes amis ? Tu pourras lui renvoyer une demande plus tard.`;
        dialog.returnValue = 'cancel';
        dialog.addEventListener('close', () => {
            if (dialog.returnValue === 'confirm') void mutate(entry, 'remove', 'friends');
        }, {once: true});
        dialog.showModal();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        tagInput.value = tagInput.value.trim();
        if (!form.reportValidity()) return;
        void perform(async () => {
            const result = await requestFriendByTag(tagInput.value);
            tagInput.value = '';
            await afterAction(result.status === 'accepted'
                ? "Ce membre t'avait déjà envoyé une demande : vous êtes maintenant amis !"
                : "Ta demande d'ami a été envoyée.");
        });
    });
    search.addEventListener('input', () => renderList('friends'));
    get('[data-refresh]').addEventListener('click', () => void perform(refreshFriends));
    get('[data-retry]').addEventListener('click', () => void perform(connected ? refreshFriends : connect));
    void perform(connect);
}
