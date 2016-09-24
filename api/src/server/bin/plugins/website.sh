#!/usr/bin/env bash

health=2

if [[ `curl -sI it-the-drote.tk | head -n 1 | cut -f 2 -d ' '` == '200' ]]; then
    health='0'
fi

cat << EOF > /tmp/jsonstats/00-website.json
{
    "name": "Main website",
    "health": $health
}
EOF
