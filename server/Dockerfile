FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY *.js ./

RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/cache \
    && chown -R app:app /app
USER app

ENV PORT=3000
ENV GEOCODE_CACHE_DIR=/app/cache
ENV DATA_CACHE_DIR=/app/cache
ENV FRIENDLY_CACHE_DIR=/app/cache
EXPOSE 3000
VOLUME ["/app/cache"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.js"]
