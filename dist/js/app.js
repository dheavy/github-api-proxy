"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const PORT = process.env.PORT || 8080;
(0, server_1.createServer)()
    .then(server => {
    server.listen(PORT, () => {
        console.log(`Github API proxy server listening on http://0.0.0.0:${PORT}`);
    });
})
    .catch(err => {
    console.error(err);
});
