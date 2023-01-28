#! /usr/bin/env bash


export rlog=/app/logs/route.txt
:> $rlog

function logroute() {
	ip route >> $rlog
	echo '=======================================' >> $rlog
}

logroute

openvpn --daemon --config /app/vpn/default.ovpn
echo "Waiting for openvpn to start..."

while ! ( ip route | grep '^0\.0\.0\.0/1 .*tun'); do
	sleep 1
done

sleep 10

logroute

## Now fix the routing table

# get the vpn gateway ip address and device
read -r vip vdev < <(ip route | awk '/0\.0\.0\.0\/1/ { print $3, $5 }')
# get the default gateway ip address and device
read -r gip gdev < <(ip route | awk '/default/ { print $3, $5 }')

# temporarily delete the vpn routing rule
ip route del 0.0.0.0/1
# add the local routing rules
ip route add 10.3.0.0/16 metric 0 via "$gip" dev "$gdev"
ip route add 192.168.222.0/24 metric 1 via "$gip" dev "$gdev"
# now add the vpn route with a higher cost
ip route add 0.0.0.0/1 metric 9999 via "$vip" dev "$vdev"
# That should do it!

logroute

echo -e "vip = $vip\nvdev = $vdev\ngip = $gip\ngdev = $gdev" >> $rlog

./slskd
