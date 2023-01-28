#! /usr/bin/env bash

if [ "$( docker container inspect -f '{{.State.Running}}' slskd 2> /dev/null )" == "true" ]; then
	if [ "x$1" == "xreset" ]; then
		echo "[!] slskd is already running. Killing it now..."
		docker container stop slskd
	else
		echo "[!] slskd is already running"
		docker container ls
		exit 1
	fi
fi

pushd ~/src/slskd
make
popd

T="-d"
[ -n "$DCMD" ] && T="-it"
echo "== DCMD = $DCMD"
echo "== T = $T"

docker run --rm "$T" \
  -p 0.0.0.0:5000:5000 \
  -p 0.0.0.0:5001:5001 \
  -p 0.0.0.0:50000:50000 \
  --device /dev/net/tun \
  --cap-add=NET_ADMIN \
  --cap-add=MKNOD \
  --cap-add=NET_BROADCAST \
  --sysctl net.ipv6.conf.all.disable_ipv6=0 \
  -v /miles/soul:/app \
  -v /miles/based/Music:/app/data/music:ro \
  -v /miles/based/Comics:/app/data/comics:ro \
  -v /miles/OpenAudible/books:/app/data/audiobooks:ro \
  -v /miles/Library:/app/data/ebooks:ro \
  --name slskd \
  slskd-vpn:latest $DCMD
#slskd/slskd:latest

