#!/usr/bin/env bash

health=2

if timeout 1 telnet it-the-drote.tk 5222 | grep -oqi connected; then
    health='0'
fi

cat << EOF > /tmp/jsonstats/01-xmpp.json
{
    "name": "XMPP server",
    "health": $health
}
EOF
