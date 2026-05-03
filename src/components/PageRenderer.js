'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { translations } from '../data/translations';
import { TICKERS, INDICES, CRYPTOS, FOREX, FUTURES_DATA, BONDS_DATA, IDEAS, BROKERS_LIST } from '../data/marketData';

function generatePrice(len, base, vol, drift) {
  const p = [base];
  for (let i = 1; i < len; i++) p.push(p[i-1] + (Math.random()-0.5)*vol + drift);
  return p;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── NAV ─────────────────────
function Nav({ t, lang, onLangToggle }) {
  return (
    <nav className="site-nav">
      <a className="nav-logo" href="#">
        <svg width="32" height="22" viewBox="0 0 32 22" fill="none"><rect x="0" y="0" width="5" height="22" rx="1.5" fill="white"/><rect x="9" y="4" width="2" height="14" rx="1" fill="white" opacity="0.5"/><rect x="14" y="0" width="18" height="5" rx="1.5" fill="white"/><path d="M26 5 L18 22" stroke="white" strokeWidth="5" strokeLinecap="round"/></svg>
        <span className="nav-logo-text">TradingView</span>
      </a>
      <div className="nav-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{color:'rgba(255,255,255,0.5)',flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder={t.nav.search} />
      </div>
      <ul className="nav-links">
        <li><a href="#">{t.nav.products} <span className="chevron">▾</span></a></li>
        <li><a href="#">{t.nav.community}</a></li>
        <li><a href="#">{t.nav.markets}</a></li>
        <li><a href="#">{t.nav.brokers}</a></li>
        <li><a href="#">{t.nav.more}</a></li>
      </ul>
      <div className="nav-right">
        <button className="nav-lang" onClick={onLangToggle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          {t.nav.lang}
        </button>
        <button className="nav-user">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <a href="#" className="btn btn-primary">{t.nav.getStarted}</a>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────
function HeroSection({ t, data }) {
  const bgImage = data?.backgroundImage || '/space-desktop.webp';
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="hero-content">
        <h1>
          {data?.title1 || t.hero.title1}
          <span className="slash">{t.hero.slash}</span><br/>
          {data?.title2 || t.hero.title2}
        </h1>
        <p className="hero-subtitle">
          <mark>{data?.subtitle || t.hero.subtitle}</mark>
        </p>
        <div className="hero-cta-wrap">
          <a href="#" className="hero-cta">{data?.cta || t.hero.cta}</a>
          <div className="hero-cta-sub">{data?.ctaSub || t.hero.ctaSub}</div>
        </div>
      </div>
      {data?.showSupport !== false && (
        <div className="hero-support">
          <a href="#" className="support-card">
            <div className="support-avatar">💬</div>
            <div className="support-info">
              <div className="support-name" style={{display:'flex',alignItems:'center'}}>
                <span className="support-pulse" />
                {t.support.name}
              </div>
              <div className="support-role">{t.support.role}</div>
            </div>
          </a>
          <a href="#" className="contact-btn">
            <span>{t.support.missionIcon}</span>
            <span className="contact-btn-text">{t.support.missionText}</span>
          </a>
        </div>
      )}
      <div className="hero-chevron">⌄</div>
    </section>
  );
}

// ─── TICKER ─────────────────────
function TickerSection() {
  const items = [...TICKERS, ...TICKERS];
  return (
    <div className="ticker-bar">
      <div className="ticker-scroll">
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-name">{t.ticker}</span>
            <span className="ticker-price">{t.price}</span>
            <span className={`ticker-chg ${t.up?'up':'dn'}`}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHART CANVAS ─────────────────
function ChartCanvas({ id, up, height = 120 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width = c.offsetWidth;
    const h = c.height = height;
    const prices = generatePrice(80, 100, 2, up ? 0.2 : -0.2);
    const min = Math.min(...prices), max = Math.max(...prices), range = max-min||1;
    const color = up ? '#26a69a' : '#ef5350';
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    prices.forEach((p,i) => {
      const x = (i/(prices.length-1))*w;
      const y = h - ((p-min)/range)*(h-20) - 10;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    const lastY = h - ((prices[prices.length-1]-min)/range)*(h-20) - 10;
    ctx.lineTo(w,lastY); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, hexToRgba(color, 0.25));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    prices.forEach((p,i) => {
      const x = (i/(prices.length-1))*w;
      const y = h - ((p-min)/range)*(h-20) - 10;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  }, [up, height]);
  return <canvas ref={ref} style={{width:'100%',height}} />;
}

// ─── WHERE THE WORLD ─────────────
function WhereWorldSection({ t }) {
  const [price, setPrice] = useState(211.45);
  const mainRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setPrice(p => p + (Math.random()-0.5)*0.8), 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const c = mainRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width = c.offsetWidth;
    const h = c.height = 400;
    const prices = generatePrice(120, 180, 3, 0.3);
    const min = Math.min(...prices), max = Math.max(...prices), range = max-min||1;
    ctx.clearRect(0,0,w,h);
    // candles
    const cw = w/prices.length;
    prices.forEach((p,i) => {
      const open = i>0?prices[i-1]:p;
      const close = p;
      const high = Math.max(open,close)+(Math.random()*2);
      const low = Math.min(open,close)-(Math.random()*2);
      const up = close >= open;
      const color = up ? '#26a69a' : '#ef5350';
      const x = i*cw + cw*0.2;
      const bw = cw*0.6;
      const oY = h - ((open-min)/range)*(h-40)-20;
      const cY = h - ((close-min)/range)*(h-40)-20;
      const hY = h - ((high-min)/range)*(h-40)-20;
      const lY = h - ((low-min)/range)*(h-40)-20;
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x+bw/2,hY); ctx.lineTo(x+bw/2,lY); ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillRect(x, Math.min(oY,cY), bw, Math.max(Math.abs(cY-oY),1));
    });
  }, []);

  const change = price - 208.24;
  const pct = (change / 208.24 * 100).toFixed(2);
  const up = change >= 0;

  return (
    <section style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'80px 0',textAlign:'center'}}>
      <div className="container">
        <h2 style={{fontSize:36,fontWeight:800,color:'#fff',letterSpacing:-1,marginBottom:12}}>{t.whereWorld.title}</h2>
        <p style={{fontSize:15,color:'var(--text2)',marginBottom:40}}>{t.whereWorld.subtitle}</p>
        <div className="chart-wrapper">
          <div className="chart-toolbar">
            {['1D','5D','1M','3M','6M','YTD','1Y','5Y','All'].map((tf,i) => (
              <button key={tf} className={`chart-tf${i===0?' active':''}`}>{tf}</button>
            ))}
            <div className="chart-sep" />
            <button className="chart-tool">📊 Candles</button>
            <button className="chart-tool">📈 Indicators</button>
            <div style={{flex:1}} />
            <button className="chart-tool" style={{color:'var(--blue)'}}>↗ Full screen</button>
          </div>
          <div className="chart-area">
            <canvas ref={mainRef} className="chart-canvas" />
            <div className="chart-info">
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:2}}>NASDAQ:AAPL · 1D</div>
              <div className="big">${price.toFixed(2)}</div>
              <div style={{fontSize:13}}>
                <span className={up?'up':'dn'}>{up?'+':''}{change.toFixed(2)} ({up?'+':''}{pct}%)</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop:24}}>
          <a href="#" className="btn btn-outline" style={{height:42,fontSize:14}}>{t.whereWorld.explore}</a>
        </div>
      </div>
    </section>
  );
}

// ─── MARKET SUMMARY ──────────────
function MarketSummarySection({ t }) {
  const [activeTab, setActiveTab] = useState('sp500');
  const tabs = [
    { id:'sp500', label:'S&P 500', color:'#2962ff', icon:'📊', name:'S&P 500', ticker:'SPX', exchange:'SP:SPX · Index', price:'5,611.85', change:'+72.34 (+1.30%)', up:true, list: INDICES },
    { id:'crypto', label:'Crypto', color:'#f7931a', icon:'₿', name:'Bitcoin', ticker:'BTCUSD', exchange:'BITSTAMP:BTCUSD · Crypto', price:'96,432.10', change:'+1,234.50 (+1.30%)', up:true, list: CRYPTOS },
    { id:'forex', label:'Forex', color:'#26a69a', icon:'💱', name:'EUR/USD', ticker:'EURUSD', exchange:'FX:EURUSD · Forex', price:'1.0823', change:'-0.0021 (-0.19%)', up:false, list: FOREX },
    { id:'futures', label:'Futures', color:'#ef5350', icon:'🛢', name:'Crude Oil', ticker:'CL1!', exchange:'NYMEX:CL1! · Futures', price:'78.42', change:'-0.87 (-1.10%)', up:false, list: FUTURES_DATA },
    { id:'bonds', label:'Bonds', color:'#9c27b0', icon:'📋', name:'US 10Y Yield', ticker:'US10Y', exchange:'TVC:US10Y · Bonds', price:'4.285%', change:'+0.032 (+0.75%)', up:true, list: BONDS_DATA },
  ];
  const active = tabs.find(tb => tb.id === activeTab);

  return (
    <section style={{background:'var(--bg)'}}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.marketSummary.title}</h2>
          <a href="#" className="section-link">{t.marketSummary.seeAll}</a>
        </div>
        <div className="market-tabs">
          <div className="tab-header">
            {tabs.map(tb => (
              <button key={tb.id} className={`tab-btn${activeTab===tb.id?' active':''}`} onClick={() => setActiveTab(tb.id)}>
                <div className="dot" style={{background:tb.color}} /> {tb.label}
              </button>
            ))}
          </div>
          {active && (
            <div className="market-grid">
              <div className="market-main">
                <div className="mkt-symbol-header">
                  <div className="mkt-icon">{active.icon}</div>
                  <div>
                    <div className="mkt-name">{active.name} <span style={{fontSize:12,color:'var(--text2)',fontWeight:400}}>{active.ticker}</span></div>
                    <div className="mkt-ticker">{active.exchange}</div>
                  </div>
                </div>
                <div className="mkt-price">{active.price}</div>
                <div className={`mkt-change ${active.up?'up':'dn'}`}>{active.change}</div>
                <ChartCanvas up={active.up} />
              </div>
              <div className="market-sidebar">
                <ul className="mkt-sub-list">
                  {active.list.map((d, i) => (
                    <li key={i} className="mkt-sub-item">
                      <div className="mkt-sub-icon">{d.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div className="mkt-sub-name">{d.name}</div>
                        <div className="mkt-sub-ticker">{d.ticker}</div>
                      </div>
                      <div className="mkt-sub-right">
                        <div className="mkt-sub-price">{d.price}</div>
                        <div className={`mkt-sub-chg ${d.up?'up':'dn'}`}>{d.chg}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── COMMUNITY IDEAS ──────────────
function CommunityIdeasSection({ t }) {
  return (
    <section>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.communityIdeas.title}</h2>
          <a href="#" className="section-link">{t.communityIdeas.seeAll}</a>
        </div>
        <div className="ideas-tabs">
          <button className="idea-tab active">{t.communityIdeas.editorsPicks}</button>
          <button className="idea-tab">{t.communityIdeas.popular}</button>
          <button className="idea-tab">{t.communityIdeas.following}</button>
        </div>
        <div className="ideas-grid">
          {IDEAS.map((idea, i) => (
            <div key={i} className="idea-card">
              <div className="idea-thumb">
                <ChartCanvas up={idea.direction==='Long'} height={140} />
                <div className="idea-direction" style={{background:idea.bg,color:idea.color}}>{idea.direction}</div>
              </div>
              <div className="idea-title">{idea.title}</div>
              <div className="idea-meta">
                <div className="idea-avatar">{idea.author[0]}</div>
                <span className="idea-author">{idea.author}</span>
                <span style={{flex:1}} />
                <span style={{fontSize:11,color:'var(--text2)'}}>{idea.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ──────────────
function FeaturesSection({ t }) {
  return (
    <section className="features-section">
      <div className="container">
        <div style={{textAlign:'center',marginBottom:0}}>
          <h2 style={{fontSize:34,fontWeight:800,color:'#fff',letterSpacing:-1,marginBottom:12}}>{t.features.title}</h2>
          <p style={{color:'var(--text2)',fontSize:15}}>{t.features.subtitle}</p>
        </div>
      </div>
      <div style={{marginTop:48,borderTop:'1px solid var(--border)'}}>
        <div className="features-grid">
          {t.features.items.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ──────────────
function StatsSection({ t }) {
  return (
    <section className="stats-section">
      <div className="container">
        <h2 style={{fontSize:34,fontWeight:800,color:'#fff',letterSpacing:-1}}>{t.stats.title}</h2>
        <div className="stats-grid">
          {t.stats.items.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PLANS ──────────────
function PlansSection({ t }) {
  return (
    <section style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
      <div className="container">
        <div style={{textAlign:'center',marginBottom:0}}>
          <h2 style={{fontSize:34,fontWeight:800,color:'#fff',letterSpacing:-1,marginBottom:12}}>{t.plans.title}</h2>
          <p style={{color:'var(--text2)'}}>{t.plans.subtitle}</p>
        </div>
        <div className="plans-grid">
          {t.plans.items.map((plan, i) => (
            <div key={i} className={`plan-card${plan.featured?' featured':''}`}>
              {plan.featured && <div className="plan-badge">{t.plans.mostPopular}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price} <span>{plan.period}</span></div>
              <div className="plan-desc">{plan.desc}</div>
              <a href="#" className={`plan-cta ${plan.featured?'plan-cta-blue':'plan-cta-outline'}`}>
                {i===0 ? t.plans.getStarted : t.plans.startTrial}
              </a>
              <ul className="plan-features" style={{marginTop:20}}>
                {plan.features.map((f,j) => <li key={j}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BROKERS ──────────────
function BrokersSection({ t }) {
  return (
    <section>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.brokersSection.title}</h2>
          <a href="#" className="section-link">{t.brokersSection.seeAll}</a>
        </div>
        <div className="brokers-grid">
          {BROKERS_LIST.map((b, i) => (
            <div key={i} className="broker-card">
              <div className="broker-logo" style={{background:`${b.color}22`,color:b.color,fontSize:9,fontWeight:800,textAlign:'center',padding:4}}>
                {b.name.split(' ').map(w=>w[0]).join('')}
              </div>
              <div className="broker-name">{b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APP ──────────────
function AppSection({ t }) {
  return (
    <section className="app-section">
      <div className="container">
        <div className="app-inner">
          <div>
            <h2 className="app-title">{t.app.title}</h2>
            <p className="app-desc">{t.app.desc}</p>
            <div className="app-btns">
              <a href="#" className="app-btn">
                <div className="app-btn-icon">🍎</div>
                <div><div className="app-btn-sub">{t.app.appStoreSub}</div><div className="app-btn-name">{t.app.appStore}</div></div>
              </a>
              <a href="#" className="app-btn">
                <div className="app-btn-icon">▶</div>
                <div><div className="app-btn-sub">{t.app.googlePlaySub}</div><div className="app-btn-name">{t.app.googlePlay}</div></div>
              </a>
            </div>
          </div>
          <div style={{textAlign:'center'}}>
            <div className="app-mockup">
              <div className="app-mockup-bar">
                <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>BTCUSD</span>
                <span className="up" style={{fontSize:12}}>$96,432 ▲</span>
              </div>
              <div style={{padding:16}}>
                <ChartCanvas up={true} height={320} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────
function FooterSection({ t }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none"><rect width="24" height="24" rx="4" fill="#2962FF"/><path d="M4 17L8 12L12 14.5L16 8L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="footer-logo-text">TradingView</span>
            </div>
            <p className="footer-tagline">{t.footer.tagline}</p>
            <div className="footer-socials">
              {['𝕏','in','f','▶','📷'].map((s,i) => <button key={i} className="social-btn">{s}</button>)}
            </div>
          </div>
          {[
            { title: t.footer.products, links: ['Chart','Stock Screener','Market Data','Economic Calendar','Pine Script'] },
            { title: t.footer.community, links: ['Ideas','Scripts','Streams',"Editors' Picks",'Traders of the Week'] },
            { title: t.footer.company, links: ['About','Blog','Careers','Media Kit','Advertise'] },
            { title: t.footer.supportCol, links: ['Help Center','Feature Request','Contact Us','System Status'] },
          ].map((col,i) => (
            <div key={i}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">
                {col.links.map((l,j) => <li key={j}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">{t.footer.copyright}</div>
          <div className="footer-legal">
            <a href="#">{t.footer.privacy}</a>
            <a href="#">{t.footer.terms}</a>
            <a href="#">{t.footer.cookies}</a>
            <a href="#">{t.footer.accessibility}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── SECTION MAP ──────────────
const SECTION_MAP = {
  hero: HeroSection,
  ticker: TickerSection,
  whereWorld: WhereWorldSection,
  marketSummary: MarketSummarySection,
  communityIdeas: CommunityIdeasSection,
  features: FeaturesSection,
  stats: StatsSection,
  plans: PlansSection,
  brokers: BrokersSection,
  app: AppSection,
  footer: FooterSection,
};

// ─── PAGE RENDERER ──────────────
export default function PageRenderer({ pageData }) {
  const [lang, setLang] = useState(pageData?.lang || 'en');
  const t = translations[lang] || translations.en;

  const toggleLang = useCallback(() => {
    setLang(l => l === 'en' ? 'ar' : 'en');
  }, []);

  // scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const sections = (pageData?.sections || [])
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div dir={t.dir}>
      <Nav t={t} lang={lang} onLangToggle={toggleLang} />
      <div style={{ marginTop: 'var(--nav-h)' }}>
        {sections.map(section => {
          const Component = SECTION_MAP[section.type];
          if (!Component) return null;
          if (section.type === 'hero') return <Component key={section.id} t={t} data={section.data} />;
          if (section.type === 'ticker') return <Component key={section.id} />;
          return <Component key={section.id} t={t} data={section.data} />;
        })}
      </div>
    </div>
  );
}
