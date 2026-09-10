import next from "next";
import http from "node:http";

const dev = false;
const app = next({ dev, dir: process.cwd() });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
