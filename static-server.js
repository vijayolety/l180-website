/*
  Minimal static file server for hosting this site on Railway (temporary,
  until the site moves to Hostinger). Serves every file in this directory
  as-is - the site's internal links use clean directory-style paths (e.g.
  "../about/") rather than exposing "index.html", so a request for
  "/about/index.html" itself gets redirected to the clean form. Bare
  directory requests ("/about") already redirect to the trailing-slash
  form ("/about/") via express.static's own default behavior.
*/
const express = require('express');

const app = express();

app.use((req, res, next) => {
  if (req.path.endsWith('/index.html')) {
    const clean = req.path.slice(0, -'index.html'.length) || '/';
    return res.redirect(301, clean + req.url.slice(req.path.length));
  }
  next();
});

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
