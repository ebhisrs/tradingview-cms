'use client';

import { useState, useEffect, useCallback } from 'react';
import { sectionTypes } from '../../data/defaultPages';

// ─── STYLES ──────────────────────
const S = {
  body: { background: '#0d1117', color: '#c9d1d9', fontFamily: "'Inter', sans-serif", minHeight: '100vh' },
  login: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0d1117' },
  loginBox: { background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 40, width: 380 },
  loginTitle: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8, textAlign: 'center' },
  loginSub: { fontSize: 13, color: '#8b949e', marginBottom: 28, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 600, color: '#8b949e', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#c9d1d9', fontSize: 14, outline: 'none', marginBottom: 16 },
  btnBlue: { width: '100%', padding: '12px', background: '#2962ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  btnSmall: { padding: '6px 14px', background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '6px 14px', background: '#da3633', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnGreen: { padding: '8px 20px', background: '#238636', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#161b22', borderBottom: '1px solid #30363d' },
  sidebar: { width: 260, background: '#161b22', borderRight: '1px solid #30363d', minHeight: 'calc(100vh - 49px)', padding: '16px 0' },
  main: { flex: 1, padding: 32, overflowY: 'auto', maxHeight: 'calc(100vh - 49px)' },
  card: { background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 20, marginBottom: 16 },
  sectionItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
    cursor: 'pointer', transition: 'all 0.15s',
    background: active ? '#1f2937' : 'transparent',
    borderLeft: active ? '3px solid #2962ff' : '3px solid transparent',
    color: active ? '#fff' : '#8b949e', fontSize: 13, fontWeight: 500,
  }),
  toggle: (on) => ({
    width: 36, height: 20, borderRadius: 10,
    background: on ? '#238636' : '#30363d',
    position: 'relative', cursor: 'pointer', flexShrink: 0, border: 'none',
  }),
  toggleDot: (on) => ({
    width: 16, height: 16, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 2, left: on ? 18 : 2,
    transition: 'left 0.15s',
  }),
  textarea: { width: '100%', padding: '10px 14px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#c9d1d9', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 80 },
  error: { color: '#f85149', fontSize: 12, marginBottom: 12, textAlign: 'center' },
  success: { color: '#3fb950', fontSize: 12, marginBottom: 12, textAlign: 'center' },
  pageItem: (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 20px',
    cursor: 'pointer', background: active ? '#1f2937' : 'transparent',
    borderLeft: active ? '3px solid #2962ff' : '3px solid transparent',
    color: active ? '#fff' : '#c9d1d9', fontSize: 13, fontWeight: 600,
  }),
};

// ─── LOGIN ──────────────────────
function LoginForm({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('admin_token', data.token);
      onLogin(data.token);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={S.login}>
      <form onSubmit={submit} style={S.loginBox}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <svg width="40" height="28" viewBox="0 0 32 22" fill="none"><rect x="0" y="0" width="5" height="22" rx="1.5" fill="white"/><rect x="9" y="4" width="2" height="14" rx="1" fill="white" opacity="0.5"/><rect x="14" y="0" width="18" height="5" rx="1.5" fill="white"/><path d="M26 5 L18 22" stroke="white" strokeWidth="5" strokeLinecap="round"/></svg>
        </div>
        <div style={S.loginTitle}>Admin Panel</div>
        <div style={S.loginSub}>Sign in to manage your pages</div>
        {err && <div style={S.error}>{err}</div>}
        <label style={S.label}>Username</label>
        <input style={S.input} value={user} onChange={e => setUser(e.target.value)} placeholder="admin" autoFocus />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
        <button type="submit" style={{ ...S.btnBlue, opacity: loading ? 0.6 : 1 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p style={{ fontSize: 11, color: '#484f58', textAlign: 'center', marginTop: 16 }}>
          Default: admin / admin123
        </p>
      </form>
    </div>
  );
}

// ─── SECTION EDITOR ──────────────
function SectionEditor({ section, onChange }) {
  const update = (key, val) => {
    onChange({ ...section, data: { ...section.data, [key]: val } });
  };

  if (section.type === 'hero') {
    return (
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Hero Section</h3>
        <label style={S.label}>Background Image URL</label>
        <input style={S.input} value={section.data?.backgroundImage || ''} onChange={e => update('backgroundImage', e.target.value)} placeholder="/space-desktop.webp" />
        <label style={S.label}>Title Line 1 (leave blank for translation default)</label>
        <input style={S.input} value={section.data?.title1 || ''} onChange={e => update('title1', e.target.value)} placeholder="Look first" />
        <label style={S.label}>Title Line 2</label>
        <input style={S.input} value={section.data?.title2 || ''} onChange={e => update('title2', e.target.value)} placeholder="Then leap." />
        <label style={S.label}>Subtitle</label>
        <input style={S.input} value={section.data?.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
        <label style={S.label}>CTA Button Text</label>
        <input style={S.input} value={section.data?.cta || ''} onChange={e => update('cta', e.target.value)} />
        <label style={S.label}>CTA Sub Text</label>
        <input style={S.input} value={section.data?.ctaSub || ''} onChange={e => update('ctaSub', e.target.value)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <button style={S.toggle(section.data?.showSupport !== false)} onClick={() => update('showSupport', !(section.data?.showSupport !== false))}>
            <div style={S.toggleDot(section.data?.showSupport !== false)} />
          </button>
          <span style={{ fontSize: 13, color: '#8b949e' }}>Show Online Support Widget</span>
        </div>
      </div>
    );
  }

  if (section.type === 'whereWorld') {
    return (
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Where the World Section</h3>
        <label style={S.label}>Title Override</label>
        <input style={S.input} value={section.data?.title || ''} onChange={e => update('title', e.target.value)} />
        <label style={S.label}>Subtitle Override</label>
        <input style={S.input} value={section.data?.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
        <p style={{ fontSize: 12, color: '#484f58' }}>Leave blank to use default translation.</p>
      </div>
    );
  }

  // Generic editor for other sections
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
        {sectionTypes.find(st => st.type === section.type)?.label || section.type}
      </h3>
      <p style={{ fontSize: 13, color: '#8b949e' }}>
        This section uses default content from translations. Toggle it on/off or reorder using the sidebar.
      </p>
    </div>
  );
}

// ─── NEW PAGE MODAL ──────────────
function NewPageModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [lang, setLang] = useState('en');

  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ ...S.loginBox, width: 420 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Create New Page</h3>
        <label style={S.label}>Page Title</label>
        <input style={S.input} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="About Us" autoFocus />
        <label style={S.label}>URL Slug</label>
        <input style={S.input} value={slug} onChange={e => setSlug(e.target.value)} placeholder="about-us" />
        <label style={S.label}>Default Language</label>
        <select style={{ ...S.input, cursor: 'pointer' }} value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English (LTR)</option>
          <option value="ar">العربية (RTL)</option>
        </select>
        <label style={S.label}>Sections to Include</label>
        <p style={{ fontSize: 12, color: '#484f58', marginBottom: 16 }}>All sections will be added. You can enable/disable them after creation.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGreen} onClick={() => {
            if (!title || !slug) return;
            onSubmit({ title, slug, lang, sections: sectionTypes.map((st, i) => ({ id: `${st.type}-${Date.now()}`, type: st.type, enabled: true, order: i, data: st.type === 'hero' ? { backgroundImage: '/space-desktop.webp', showSupport: true } : {} })) });
          }}>Create Page</button>
          <button style={S.btnSmall} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGE UPLOADER ──────────────
function ImageUploader({ token, currentImage, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data.url) onUpload(data.url);
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {currentImage && (
          <div style={{ width: 120, height: 68, borderRadius: 6, overflow: 'hidden', border: '1px solid #30363d', flexShrink: 0 }}>
            <img src={currentImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
        )}
        <div>
          <label style={{ ...S.btnSmall, display: 'inline-block', position: 'relative', overflow: 'hidden' }}>
            {uploading ? 'Uploading...' : '📁 Upload Image'}
            <input type="file" accept="image/*" onChange={handle} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────
function AdminDashboard({ token }) {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showNewPage, setShowNewPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadPages = useCallback(async () => {
    const res = await fetch('/api/pages');
    const data = await res.json();
    setPages(data);
    if (data.length > 0 && !activePage) {
      setActivePage(data[0]);
      if (data[0].sections?.length) setActiveSection(data[0].sections[0]);
    }
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  const saveCurrent = async () => {
    if (!activePage) return;
    setSaving(true); setMsg('');
    try {
      await fetch('/api/pages', { method: 'POST', headers, body: JSON.stringify(activePage) });
      setMsg('Saved successfully!');
      loadPages();
    } catch (e) { setMsg('Error saving'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const deleteCurrent = async () => {
    if (!activePage || !confirm(`Delete "${activePage.title}"?`)) return;
    await fetch(`/api/pages?slug=${activePage.slug}`, { method: 'DELETE', headers });
    setActivePage(null); setActiveSection(null);
    loadPages();
  };

  const createPage = async (pageData) => {
    await fetch('/api/pages', { method: 'POST', headers, body: JSON.stringify(pageData) });
    setShowNewPage(false);
    loadPages();
  };

  const updateSection = (updated) => {
    const newSections = activePage.sections.map(s => s.id === updated.id ? updated : s);
    const newPage = { ...activePage, sections: newSections };
    setActivePage(newPage);
    setActiveSection(updated);
  };

  const toggleSection = (sectionId) => {
    const newSections = activePage.sections.map(s => s.id === sectionId ? { ...s, enabled: !s.enabled } : s);
    setActivePage({ ...activePage, sections: newSections });
    if (activeSection?.id === sectionId) setActiveSection(newSections.find(s => s.id === sectionId));
  };

  const moveSection = (sectionId, dir) => {
    const secs = [...activePage.sections].sort((a,b) => a.order - b.order);
    const idx = secs.findIndex(s => s.id === sectionId);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= secs.length) return;
    [secs[idx], secs[newIdx]] = [secs[newIdx], secs[idx]];
    const reordered = secs.map((s, i) => ({ ...s, order: i }));
    setActivePage({ ...activePage, sections: reordered });
  };

  const selectPage = (page) => {
    setActivePage(page);
    setActiveSection(page.sections?.[0] || null);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    window.location.reload();
  };

  const sortedSections = activePage?.sections ? [...activePage.sections].sort((a,b) => a.order - b.order) : [];

  return (
    <div style={S.body}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="28" height="19" viewBox="0 0 32 22" fill="none"><rect x="0" y="0" width="5" height="22" rx="1.5" fill="white"/><rect x="9" y="4" width="2" height="14" rx="1" fill="white" opacity="0.5"/><rect x="14" y="0" width="18" height="5" rx="1.5" fill="white"/><path d="M26 5 L18 22" stroke="white" strokeWidth="5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>CMS Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {msg && <span style={msg.includes('Error') ? S.error : S.success}>{msg}</span>}
          {activePage && (
            <a href={activePage.slug === 'home' ? '/' : `/${activePage.slug}`} target="_blank" style={{ ...S.btnSmall, textDecoration: 'none' }}>
              👁 Preview
            </a>
          )}
          <button style={S.btnGreen} onClick={saveCurrent} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save'}
          </button>
          <button style={S.btnSmall} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          {/* Pages list */}
          <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pages</span>
            <button style={{ ...S.btnSmall, padding: '3px 10px', fontSize: 11 }} onClick={() => setShowNewPage(true)}>+ New</button>
          </div>
          {pages.map(p => (
            <div key={p.slug} style={S.pageItem(activePage?.slug === p.slug)} onClick={() => selectPage(p)}>
              <span>{p.title}</span>
              <span style={{ fontSize: 10, color: '#484f58' }}>/{p.slug === 'home' ? '' : p.slug}</span>
            </div>
          ))}
          {pages.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#484f58', fontSize: 12 }}>
              No pages yet. Create one!
            </div>
          )}

          {/* Sections list */}
          {activePage && (
            <>
              <div style={{ borderTop: '1px solid #30363d', margin: '16px 0' }} />
              <div style={{ padding: '0 20px 12px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Sections</span>
              </div>
              {sortedSections.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4px', gap: 0 }}>
                    <button onClick={() => moveSection(s.id, -1)} style={{ background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', fontSize: 9, lineHeight: 1, padding: 0 }}>▲</button>
                    <button onClick={() => moveSection(s.id, 1)} style={{ background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', fontSize: 9, lineHeight: 1, padding: 0 }}>▼</button>
                  </div>
                  <div style={{ ...S.sectionItem(activeSection?.id === s.id), flex: 1, opacity: s.enabled ? 1 : 0.4, paddingLeft: 6 }} onClick={() => setActiveSection(s)}>
                    <span style={{ fontSize: 12 }}>{sectionTypes.find(st => st.type === s.type)?.label || s.type}</span>
                  </div>
                  <button style={{ ...S.toggle(s.enabled), marginRight: 12 }} onClick={() => toggleSection(s.id)}>
                    <div style={S.toggleDot(s.enabled)} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main content */}
        <div style={S.main}>
          {!activePage ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: '#484f58' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <p style={{ fontSize: 16 }}>Select a page or create a new one</p>
            </div>
          ) : (
            <>
              {/* Page settings */}
              <div style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Page: {activePage.title}</h2>
                  <button style={S.btnDanger} onClick={deleteCurrent}>Delete Page</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={S.label}>Title</label>
                    <input style={S.input} value={activePage.title} onChange={e => setActivePage({ ...activePage, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={S.label}>Slug (URL)</label>
                    <input style={S.input} value={activePage.slug} readOnly />
                  </div>
                  <div>
                    <label style={S.label}>Default Language</label>
                    <select style={{ ...S.input, cursor: 'pointer' }} value={activePage.lang || 'en'} onChange={e => setActivePage({ ...activePage, lang: e.target.value })}>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section editor */}
              {activeSection && (
                <div style={S.card}>
                  {activeSection.type === 'hero' && activeSection.data && (
                    <ImageUploader
                      token={token}
                      currentImage={activeSection.data.backgroundImage}
                      onUpload={(url) => updateSection({ ...activeSection, data: { ...activeSection.data, backgroundImage: url } })}
                    />
                  )}
                  <SectionEditor section={activeSection} onChange={updateSection} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showNewPage && <NewPageModal onClose={() => setShowNewPage(false)} onSubmit={createPage} />}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (t) setToken(t);
    setReady(true);
  }, []);

  if (!ready) return <div style={{ background: '#0d1117', minHeight: '100vh' }} />;
  if (!token) return <LoginForm onLogin={setToken} />;
  return <AdminDashboard token={token} />;
}
