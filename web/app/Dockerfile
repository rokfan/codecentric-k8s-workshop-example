FROM node:11.9.0-alpine AS build
ENV NOBODY_HOME=/app
USER root
    RUN apk add --no-cache ca-certificates shadow
    RUN mkdir -p "${NOBODY_HOME}"
    RUN chown nobody "${NOBODY_HOME}"
    RUN usermod nobody -d "${NOBODY_HOME}"
USER nobody
WORKDIR ${NOBODY_HOME}
COPY --chown=nobody:nobody package.json package-lock.json ./
RUN npm install
COPY --chown=nobody:nobody app.js .
COPY --chown=nobody:nobody bin bin
COPY --chown=nobody:nobody public public
COPY --chown=nobody:nobody routes routes
COPY --chown=nobody:nobody views views
RUN chmod +x ./bin/www

FROM build
ENV PORT=3000
ENV REDIS_SERVER_URL=redis://redis:6379
ENTRYPOINT [ "node", "bin/www" ]
