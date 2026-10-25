FROM ghcr.io/lapismd/lapis-ci@sha256:91341a81cc9306eed818c4c433cd29ed11d2ea64c703f32685391befe0eca503
ENV PNPM_HOME=/opt/pnpm PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PATH=/opt/tools:/opt/pnpm:$PATH
RUN test "$(playwright --version)" = 'Version 1.61.1' && playwright install --with-deps chromium
RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates lsof && rm -rf /var/lib/apt/lists/*
RUN corepack prepare pnpm@10.34.5 --activate
COPY install-tools.mjs /opt/install-tools.mjs
RUN node /opt/install-tools.mjs
RUN git config --system user.name 'Agent UI validation' && git config --system user.email 'validation@localhost' && git config --system --add safe.directory '*'
RUN mkdir -p /input /results /work/agent-ui
WORKDIR /work/agent-ui
