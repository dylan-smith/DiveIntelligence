FROM mcr.microsoft.com/devcontainers/typescript-node:18-bullseye

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends chromium
ENV CHROME_BIN=/usr/bin/chromium