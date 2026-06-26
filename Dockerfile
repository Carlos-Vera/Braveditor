# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Habilitar pnpm vía corepack
RUN corepack enable

# Copiar archivos de dependencias (.npmrc fija node-linker=hoisted)
COPY package.json pnpm-lock.yaml .npmrc ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de producción
RUN pnpm build

# Stage 2: Serve con Nginx
FROM nginx:stable-alpine

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración nginx optimizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]