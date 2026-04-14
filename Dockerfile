# ─── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Зависимости отдельным слоем — кеш инвалидируется только при смене package.json
COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ─── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Убираем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Статика клиентского приложения
COPY --from=builder /app/dist /usr/share/nginx/html

# Конфиг nginx (reverse proxy + SPA routing + admin)
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/index.html > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
