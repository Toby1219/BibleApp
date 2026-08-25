FROM node:22-slim AS builder

WORKDIR /webapp

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginxinc/nginx-unprivileged:1.27-alpine
# tiny nginx image, no node/npm at runtime — CVEs from npm packages never ship

COPY --from=builder /webapp/dist /usr/share/nginx/html

EXPOSE 8080
