/*
  Life180 Labs admin panel - login, dashboard list, add/edit form.
  Talks to /api/admin/* (same origin - session cookie just works).
*/
(function () {
  const LOGIN_API = '/api/admin/login';
  const LOGOUT_API = '/api/admin/logout';
  const ME_API = '/api/admin/me';
  const WORK_API = '/api/admin/work';
  const UPLOAD_PDF_API = '/api/admin/work/upload-pdf';

  async function apiGet(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (res.status === 401) { window.location.href = 'login.html'; return null; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function apiPost(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 401) { window.location.href = 'login.html'; return null; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function upSvg() {
    return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 10l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function downSvg() {
    return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function editSvg() {
    return '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 2.5 13.5 5 5.5 13H3v-2.5L11 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }
  function trashSvg() {
    return '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function initLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const errorEl = document.getElementById('loginError');
      errorEl.hidden = true;

      try {
        const res = await fetch(LOGIN_API, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username.value, password: form.password.value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        window.location.href = 'dashboard.html';
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
      }
    });
  }

  async function initDashboard() {
    const listEl = document.getElementById('list');
    const stateEl = document.getElementById('listState');
    const logoutBtn = document.getElementById('logoutBtn');
    const whoami = document.getElementById('whoami');

    logoutBtn.addEventListener('click', async () => {
      await fetch(LOGOUT_API, { method: 'POST', credentials: 'same-origin' });
      window.location.href = 'login.html';
    });

    apiGet(ME_API).then((data) => {
      if (data) whoami.textContent = 'Signed in as ' + data.username;
    }).catch(() => {});

    async function load() {
      stateEl.hidden = false;
      stateEl.textContent = 'Loading…';
      listEl.hidden = true;

      let data;
      try {
        data = await apiGet(WORK_API);
      } catch (err) {
        stateEl.textContent = 'Could not load: ' + err.message;
        return;
      }
      if (!data) return;

      const items = data.items;
      if (!items.length) {
        stateEl.textContent = 'No work items yet - click "Add new work" to create the first one.';
        return;
      }

      stateEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = '';

      items.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'adm-row' + (item.is_visible ? '' : ' adm-row--hidden');

        const order = document.createElement('div');
        order.className = 'adm-row__order';
        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.setAttribute('aria-label', 'Move up');
        upBtn.innerHTML = upSvg();
        upBtn.disabled = i === 0;
        upBtn.addEventListener('click', () => move(item.id, 'up'));
        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.setAttribute('aria-label', 'Move down');
        downBtn.innerHTML = downSvg();
        downBtn.disabled = i === items.length - 1;
        downBtn.addEventListener('click', () => move(item.id, 'down'));
        order.append(upBtn, downBtn);

        const body = document.createElement('div');
        body.className = 'adm-row__body';
        const title = document.createElement('p');
        title.className = 'adm-row__title';
        title.textContent = item.title;
        if (item.pdf_path) {
          const badge = document.createElement('span');
          badge.className = 'adm-pdf-badge';
          badge.textContent = 'PDF';
          title.appendChild(document.createTextNode(' '));
          title.appendChild(badge);
        }
        const summary = document.createElement('p');
        summary.className = 'adm-row__summary';
        summary.textContent = item.summary || item.description;
        body.append(title, summary);

        const actions = document.createElement('div');
        actions.className = 'adm-row__actions';

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'adm-toggle';
        toggle.setAttribute('aria-pressed', item.is_visible ? 'true' : 'false');
        toggle.setAttribute('aria-label', item.is_visible ? 'Visible - click to hide' : 'Hidden - click to show');
        toggle.addEventListener('click', () => toggleVisible(item.id));

        const editLink = document.createElement('a');
        editLink.className = 'adm-icon-btn';
        editLink.href = 'edit.html?id=' + item.id;
        editLink.setAttribute('aria-label', 'Edit');
        editLink.innerHTML = editSvg();

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'adm-icon-btn adm-icon-btn--danger';
        deleteBtn.setAttribute('aria-label', 'Delete');
        deleteBtn.innerHTML = trashSvg();
        deleteBtn.addEventListener('click', () => removeItem(item.id, item.title));

        actions.append(toggle, editLink, deleteBtn);
        row.append(order, body, actions);
        listEl.appendChild(row);
      });
    }

    async function withCsrf(fn) {
      const data = await apiGet(WORK_API);
      if (!data) return;
      await fn(data.csrf_token);
      load();
    }

    function move(id, direction) {
      withCsrf((csrf_token) => apiPost(WORK_API, { action: 'move', id, direction, csrf_token }));
    }
    function toggleVisible(id) {
      withCsrf((csrf_token) => apiPost(WORK_API, { action: 'toggle', id, csrf_token }));
    }
    function removeItem(id, title) {
      if (!window.confirm('Delete "' + title + '"? This cannot be undone.')) return;
      withCsrf((csrf_token) => apiPost(WORK_API, { action: 'delete', id, csrf_token }));
    }

    load();
  }

  async function initEditForm() {
    const editId = Number(new URLSearchParams(window.location.search).get('id')) || null;
    const form = document.getElementById('workForm');
    const errorEl = document.getElementById('formError');
    const pdfInput = document.getElementById('pdfInput');
    const pdfStatus = document.getElementById('pdfStatus');
    const pdfCurrent = document.getElementById('pdfCurrent');
    const pdfCurrentName = document.getElementById('pdfCurrentName');
    const pdfRemoveBtn = document.getElementById('pdfRemoveBtn');

    if (editId) {
      document.getElementById('pageTitle').textContent = 'Edit work item | Admin | Life180 Labs';
      document.getElementById('formTitle').textContent = 'Edit work item';
    }

    let csrfToken = null;
    // Current PDF state for this item - starts from the loaded item (if
    // editing), updates on upload/remove, and is always sent back on save
    // so an unrelated field edit doesn't accidentally drop the PDF.
    let pdfState = { path: null, name: null };
    // Tracks the in-flight upload (if any) so Save can wait for it instead
    // of submitting with stale pdfState - otherwise clicking Save right
    // after picking a file could save before the upload finishes.
    let pdfUploadPromise = null;
    const saveBtn = form.querySelector('button[type="submit"]');

    function renderPdfState() {
      if (pdfState.path) {
        pdfCurrentName.textContent = pdfState.name || pdfState.path;
        pdfCurrent.hidden = false;
      } else {
        pdfCurrent.hidden = true;
      }
    }

    const data = await apiGet(WORK_API);
    if (!data) return;
    csrfToken = data.csrf_token;

    if (editId) {
      const item = data.items.find((it) => it.id === editId);
      if (!item) {
        errorEl.textContent = 'Item not found.';
        errorEl.hidden = false;
      } else {
        form.id.value = item.id;
        form.title.value = item.title;
        form.eyebrow.value = item.eyebrow;
        form.summary.value = item.summary;
        form.description.value = item.description;
        form.bullets_text.value = item.bullets.join('\n');
        form.metrics_text.value = item.metrics.map((m) => m[0] + ' | ' + m[1]).join('\n');
        form.art_key.value = item.art_key;
        form.link_url.value = item.link_url || '';
        form.is_visible.checked = item.is_visible;
        pdfState = { path: item.pdf_path, name: item.pdf_original_name };
        renderPdfState();
      }
    }

    pdfRemoveBtn.addEventListener('click', () => {
      pdfState = { path: null, name: null };
      pdfInput.value = '';
      pdfStatus.textContent = '';
      renderPdfState();
    });

    pdfInput.addEventListener('change', () => {
      const file = pdfInput.files[0];
      if (!file) return;

      pdfStatus.classList.remove('is-error');
      pdfStatus.textContent = 'Uploading…';
      saveBtn.disabled = true;

      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('csrf_token', csrfToken);

      pdfUploadPromise = fetch(UPLOAD_PDF_API, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      })
        .then(async (res) => {
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Upload failed.');
          pdfState = { path: result.pdf_path, name: result.pdf_original_name };
          pdfStatus.textContent = 'Uploaded.';
          renderPdfState();
        })
        .catch((err) => {
          pdfStatus.classList.add('is-error');
          pdfStatus.textContent = err.message;
        })
        .finally(() => {
          pdfInput.value = '';
          saveBtn.disabled = false;
          pdfUploadPromise = null;
        });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.hidden = true;

      if (pdfUploadPromise) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Waiting for upload…';
        await pdfUploadPromise;
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
      }

      const payload = {
        action: 'save',
        csrf_token: csrfToken,
        id: form.id.value || null,
        title: form.title.value,
        eyebrow: form.eyebrow.value,
        summary: form.summary.value,
        description: form.description.value,
        bullets_text: form.bullets_text.value,
        metrics_text: form.metrics_text.value,
        art_key: form.art_key.value,
        pdf_path: pdfState.path,
        pdf_original_name: pdfState.name,
        link_url: form.link_url.value,
        is_visible: form.is_visible.checked,
      };

      try {
        await apiPost(WORK_API, payload);
        window.location.href = 'dashboard.html';
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
      }
    });
  }

  window.Admin = { initLoginForm, initDashboard, initEditForm };
})();
