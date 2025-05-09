# syntax=docker/dockerfile:1
FROM node:20-alpine3.20 AS devrunner
RUN apk add --no-cache libc6-compat git \
    jq bash zip mc expect curl python3 openssl

WORKDIR /app


# Install pnpm first
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g tsx
RUN git config --global --add safe.directory /app

RUN touch /root/.bashrc \
    && echo 'PS1="aka-app \w # "' \
    >> /root/.bashrc

VOLUME /app
VOLUME /app/.next
VOLUME /app/.pnpm-store

ENV NODE_ENV=development
ENV PORT=3000

# Expose port
EXPOSE 3000

CMD ["pnpm", "dev"]
