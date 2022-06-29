import { createServer } from './server';

const PORT = process.env.PORT || 8080;

createServer()
  .then(server => {
    server.listen(PORT, () => {
      console.log(`Github API proxy server listening on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
