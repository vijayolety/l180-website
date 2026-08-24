/*
  Minimal static file server for hosting this site on Railway (temporary,
  until the site moves to Hostinger). Serves every file in this directory
  as-is - the site's internal links already use explicit "index.html"
  paths (e.g. "../about/index.html"), so no URL rewriting is needed.
*/
const express = require('express');

const app = express();
app.use(
  express.static(__dirname, {
    extensions: ['html'],
    // This site is redeployed under the same filenames on every change (no
    // cache-busted/hashed asset names), so without this, browsers can keep
    // serving stale JS/CSS from a previous deploy indefinitely.
    setHeaders: (res) => res.set('Cache-Control', 'no-cache'),
  })
);
app.use((req, res) => res.status(404).send('Not found'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Static frontend listening on port ${port}`);
});
