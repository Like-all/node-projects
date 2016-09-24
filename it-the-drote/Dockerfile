FROM mhart/alpine-node:base-6.4.0

COPY src/it-the-drote /opt/it-the-drote
COPY src/it-the-drote/public /static
COPY misc/expose-webstatic /bin/expose-webstatic
RUN chmod 755 /bin/expose-webstatic
CMD node /opt/it-the-drote/app.js
