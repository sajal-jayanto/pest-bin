# ---------- 1. deps ----------
FROM denoland/deno:2.5.3 AS deps
WORKDIR /app
ENV DENO_DIR=/deno-dir
COPY deno.json deno.lock ./
RUN deno install --frozen

# ---------- 2. build ----------
FROM denoland/deno:2.5.3 AS build
WORKDIR /app
ENV DENO_DIR=/deno-dir
COPY --from=deps /deno-dir /deno-dir
COPY deno.json deno.lock ./
COPY . .
RUN deno check src/server.ts
RUN deno compile \
  --cached-only \
  --allow-net \
  --allow-env \
  --allow-read \
  --allow-sys \
  --output /app/server \
  src/server.ts

# ---------- 3. runtime ----------
FROM gcr.io/distroless/cc-debian12:nonroot
WORKDIR /app
COPY --from=build /app/server /app/server
ENV PORT=3000
EXPOSE 3000
USER nonroot
ENTRYPOINT ["/app/server"]