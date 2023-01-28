IMAGE=slskd-vpn

$(IMAGE): Dockerfile
	docker build -t $(IMAGE) .
