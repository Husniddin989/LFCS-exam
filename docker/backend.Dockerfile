# LFCS lab backend — Express + ws + dockerode.
# Talks to the host Docker daemon through the mounted socket.
FROM node:22-alpine

WORKDIR /app

# Only the backend's runtime deps — the frontend toolchain is not needed here
RUN npm init -y >/dev/null 2>&1 && npm install --omit=dev \
    express@^5 \
    ws@^8 \
    dockerode@^5 \
    cors@^2

COPY server/ ./server/

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server/index.js"]
