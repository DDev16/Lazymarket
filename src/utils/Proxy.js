const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8080;

const server = http.createServer((req, res) => {
  const { hostname, path, protocol } = url.parse(req.url);

  // Create the options object for the target server
  const options = {
    hostname,
    path,
    protocol,
    method: req.method,
    headers: req.headers
  };

  // Choose the appropriate HTTP module based on the protocol
  const proxyRequest = (protocol === 'https:' ? https : http).request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyRequest);
});

server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
