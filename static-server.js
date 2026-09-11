/*
  Minimal static file server for hosting this site on Railway (temporary,
  until the site moves to Hostinger). Serves every file in this directory
  as-is - the site's internal links use clean directory-style paths (e.g.
  "../about/") rather than exposing "index.html", so a request for
  "/about/index.html" itself gets redirected to the clean form. Bare
  directory requests ("/about") already redirect to the trailing-slash
  form ("/about/") via express.static's own default behavior.

  life180labs.com (not www) is the canonical host - www.life180labs.com
  redirects there. Both are mapped to this service in Railway's custom
  domains, so the split has to happen here rather than in DNS.
*/
const express = require('express');
const helmet = require('helmet');

const CANONICAL_HOST = 'life180labs.com';

const app = express();

// Baseline security headers (HSTS, X-Content-Type-Options, X-Frame-Options,
// Referrer-Policy, etc.). CSP is left off: pages here rely on inline GTM/
// dataLayer <script> blocks and JSON-LD, which a default CSP would block -
// enabling it needs a nonce/hash pass over every page first.
app.use(helmet({ contentSecurityPolicy: false }));

app.use((req, res, next) => {
  const hostNeedsFix = req.hostname === `www.${CANONICAL_HOST}`;
  const pathNeedsFix = req.path.endsWith('/index.html');
  if (!hostNeedsFix && !pathNeedsFix) return next();

  const path = pathNeedsFix ? req.path.slice(0, -'index.html'.length) || '/' : req.path;
  const query = req.url.slice(req.path.length);
  const host = hostNeedsFix ? CANONICAL_HOST : req.hostname;
  res.redirect(301, `https://${host}${path}${query}`);
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
