import { readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";

const listenHost = process.env.HTTPS_PROXY_HOST || "127.0.0.1";
const listenPort = Number(process.env.HTTPS_PROXY_PORT || 8443);
const target = new URL(process.env.HTTPS_PROXY_TARGET || "http://127.0.0.1:8000");
const keyPath = process.env.HTTPS_PROXY_KEY;
const certPath = process.env.HTTPS_PROXY_CERT;
const failureQueryParam = process.env.HTTPS_PROXY_FAILURE_QUERY_PARAM?.trim() || "";

if (!keyPath || !certPath) {
  throw new Error("HTTPS_PROXY_KEY and HTTPS_PROXY_CERT are required.");
}

if (target.protocol !== "http:") {
  throw new Error("The loopback proxy target must use plain HTTP.");
}

const shouldForceNetworkFailure = (requestUrl = "/") => {
  if (!failureQueryParam) return false;
  const parsed = new URL(requestUrl, `https://${listenHost}:${listenPort}`);
  return parsed.searchParams.has(failureQueryParam);
};

const server = https.createServer(
  {
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
  },
  (request, response) => {
    if (shouldForceNetworkFailure(request.url)) {
      console.log(`Forced loopback network failure for ${request.url}`);
      request.socket.destroy();
      return;
    }

    const headers = {
      ...request.headers,
      host: target.host,
      "x-forwarded-host": request.headers.host || `${listenHost}:${listenPort}`,
      "x-forwarded-proto": "https",
    };

    const upstream = http.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port,
        method: request.method,
        path: request.url,
        headers,
      },
      (upstreamResponse) => {
        response.writeHead(
          upstreamResponse.statusCode || 502,
          upstreamResponse.statusMessage,
          upstreamResponse.headers,
        );
        upstreamResponse.pipe(response);
      },
    );

    upstream.on("error", (error) => {
      console.error(`HTTPS loopback proxy upstream error: ${error.message}`);
      if (!response.headersSent) {
        response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
      }
      response.end("Bad gateway");
    });

    request.on("aborted", () => upstream.destroy());
    request.pipe(upstream);
  },
);

server.on("clientError", (error, socket) => {
  console.error(`HTTPS loopback proxy client error: ${error.message}`);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(listenPort, listenHost, () => {
  console.log(
    `HTTPS loopback proxy listening on https://${listenHost}:${listenPort} -> ${target.origin}`,
  );
});
