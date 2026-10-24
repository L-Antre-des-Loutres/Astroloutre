# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────
#  Étape 1 : génération du site statique Astro
# ──────────────────────────────────────────────
# Astro 7 demande Node >= 22.23.4 (voir "engines" dans package.json)
FROM node:24-alpine AS builder
WORKDIR /app

# Dépendances d'abord, pour garder ce cache tant que package*.json ne change pas.
# Les devDependencies sont nécessaires au build : pas de --omit=dev
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Le build interroge PocketBase et OAPI : le .env (PB_EMAIL, PB_PASSWORD, OAPI_SERVICE_API_KEY...)
# est monté comme secret le temps du build, il ne finit dans aucune couche de l'image
RUN --mount=type=secret,id=env,target=/app/.env,required=true \
    npm run build

# ──────────────────────────────────────────────
#  Étape 2 : service des fichiers par Nginx
# ──────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
