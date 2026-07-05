# LFCS lab environment — one container per user terminal session.
# Build: npm run lab:build   (docker build -f docker/lab.Dockerfile -t lfcs-lab .)
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash-completion \
    cron \
    curl \
    e2fsprogs \
    file \
    findutils \
    grep \
    iproute2 \
    iptables \
    iputils-ping \
    less \
    logrotate \
    man-db \
    nano \
    net-tools \
    passwd \
    procps \
    rsync \
    rsyslog \
    sudo \
    tar \
    tree \
    util-linux \
    vim \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Friendlier shell prompt for students
RUN echo 'export PS1="\\[\\e[1;32m\\]\\u@lfcs-lab\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ "' >> /root/.bashrc

WORKDIR /root
CMD ["sleep", "infinity"]
