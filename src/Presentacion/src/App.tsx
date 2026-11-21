import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeftRight, BookOpen, CircleHelp, Coins, Globe2, LayoutDashboard, RefreshCw, Search, ShieldCheck, Signal, X } from 'lucide-react';
import MarketChart from './components/MarketChart';
import { apiGet, compactMoney, formatDate, money, percent } from './services/api';
import type { Analysis, Candle, CryptoAsset, FxRate, Horizon } from './types';

type Page = 'dashboard' | 'crypto' | 'fx' | 'compare' | 'methodology' | 'about';
const navigation: Array<{ id: Page; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'crypto', label: 'Criptomonedas', icon: Coins },
  { id: 'fx', label: 'Divisas FX', icon: Globe2 },
  { id: 'compare', label: 'Comparador', icon: ArrowLeftRight },
  { id: 'methodology', label: 'Metodología', icon: BookOpen },
  { id: 'about', label: 'Proyecto', icon: CircleHelp }
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [fx, setFx] = useState<FxRate[]>([]);
  const [symbol, setSymbol] = useState('BTC');
  const [horizon, setHorizon] = useState<Horizon>('24h');
  const [period, setPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('7d');
  const [history, setHistory] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisError, setAnalysisError] = useState('');
  const [fxPair, setFxPair] = useState('USD/BOB');
  const [fxHistory, setFxHistory] = useState<Candle[]>([]);
  const [fxAnalysis, setFxAnalysis] = useState<Analysis | null>(null);
  const [fxMessage, setFxMessage] = useState('');
  const [compareA, setCompareA] = useState('BTC');
  const [compareB, setCompareB] = useState('ETH');
  const [search, setSearch] = useState('');
  const [stream, setStream] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(new Date().toISOString());
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadMarket = useCallback(async () => {
    try {
      const result = await apiGet<{ data: CryptoAsset[]; updatedAt: string; streamConnected: boolean }>('/api/market/crypto');
      setAssets(result.data); setUpdatedAt(result.updatedAt); setStream(result.streamConnected); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo consultar Binance.'); }
  }, []);
  const loadFx = useCallback(async () => {
    try { const result = await apiGet<{ data: FxRate[] }>('/api/fx/pairs'); setFx(result.data); }
    catch (e) { setFxMessage(e instanceof Error ? e.message : 'No se pudo consultar FX.'); }
  }, []);
  const refreshAll = useCallback(async () => {
    setBusy(true); setRefreshKey((v) => v + 1);
    await Promise.allSettled([loadMarket(), loadFx()]);
    setBusy(false);
  }, [loadMarket, loadFx]);

  useEffect(() => {
    void loadMarket();
    const timer = window.setInterval(() => void loadMarket(), 30_000);
    const events = new EventSource('/api/market/stream');
    events.addEventListener('status', (event) => {
      try { setStream(Boolean((JSON.parse((event as MessageEvent).data) as { connected?: boolean }).connected)); } catch { /* ignore invalid provider status */ }
    });
    events.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as { type?: string; connected?: boolean; data?: CryptoAsset };
        if (message.type === 'ticker' && message.data) {
          setAssets((current) => current.map((asset) => asset.symbol === message.data!.symbol ? { ...asset, ...message.data! } : asset));
          setUpdatedAt(message.data.updatedAt); setStream(true);
        }
        if (message.type === 'status') setStream(Boolean(message.connected));
      } catch { /* ignore malformed stream payload */ }
    };
    events.onerror = () => setStream(false);
    return () => { window.clearInterval(timer); events.close(); };
  }, [loadMarket]);
  useEffect(() => { if (page === 'fx') void loadFx(); }, [page, loadFx]);
  useEffect(() => {
    if (page !== 'crypto' && page !== 'dashboard') return;
    let active = true;
    Promise.all([
      apiGet<{ data: Candle[] }>(`/api/market/crypto/${symbol}/history?period=${period}`),
      apiGet<{ data: Analysis }>(`/api/analytics/${symbol}?horizon=${horizon}`)
    ]).then(([h, a]) => { if (active) { setHistory(h.data); setAnalysis(a.data); setAnalysisError(''); } })
      .catch((e) => { if (active) { setHistory([]); setAnalysis(null); setAnalysisError(e instanceof Error ? e.message : 'Análisis no disponible.'); } });
    return () => { active = false; };
  }, [page, symbol, period, horizon, refreshKey]);
  useEffect(() => {
    if (page !== 'fx') return;
    let active = true;
    const [base, quote] = fxPair.split('/');
    apiGet<{ data: Analysis; history: Candle[] }>(`/api/fx/pair/${base}/${quote}`)
      .then((r) => { if (active) { setFxAnalysis(r.data); setFxHistory(r.history); setFxMessage(''); } })
      .catch((e) => { if (active) { setFxAnalysis(null); setFxHistory([]); setFxMessage(e instanceof Error ? e.message : 'No hay suficientes datos para analizar este par.'); } });
    return () => { active = false; };
  }, [page, fxPair, refreshKey]);

  const selected = assets.find((a) => a.symbol === symbol) ?? assets[0];
  const filtered = useMemo(() => assets.filter((a) => `${a.name} ${a.symbol}`.toLowerCase().includes(search.toLowerCase())), [assets, search]);
  const gainers = assets.filter((a) => a.change24h > 0).length;
  const totalVolume = assets.reduce((sum, a) => sum + a.quoteVolume24h, 0);
  const navigate = (next: Page) => { setPage(next); setMobileOpen(false); setTerminalOpen(false); };
  const toggleMenu = () => {
    if (window.matchMedia('(max-width: 700px)').matches) { setHidden(false); setMobileOpen((v) => !v); }
    else if (hidden) setHidden(false); else setCollapsed((v) => !v);
  };
  const closeMenu = () => {
    setTerminalOpen(false);
    if (window.matchMedia('(max-width: 700px)').matches) setMobileOpen(false); else setHidden(true);
  };

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${hidden ? 'sidebar-hidden' : ''}`}>
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Activity size={20} /></div><div><div className="brand-name">market<span>pulse</span></div><div className="brand-caption">FINANCIAL INTELLIGENCE</div></div><button className="mobile-close icon-button" onClick={closeMenu} aria-label="Cerrar barra lateral"><X size={18}/></button></div>
      <div className="workspace-switcher"><button className={`workspace-pill ${terminalOpen ? 'is-open' : ''}`} onClick={() => setTerminalOpen((v) => !v)} aria-expanded={terminalOpen}><span className="workspace-dot"/><span className="workspace-label">MARKET TERMINAL</span><span>⌄</span></button>
        {terminalOpen && <div className="workspace-menu"><div className="workspace-menu-heading"><strong>Terminal principal</strong><span className={`workspace-live-tag ${stream ? 'online' : ''}`}>{stream ? 'LIVE' : 'REST'}</span></div><div className="workspace-provider"><span className={`status-dot ${stream ? 'online' : ''}`}/><div><strong>Binance Spot</strong><small>{stream ? 'Stream conectado' : 'Datos REST / reconexión'}</small></div></div><div className="workspace-provider"><span className="workspace-dot fx-dot"/><div><strong>Frankfurter FX</strong><small>Tipos de referencia diaria</small></div></div><div className="workspace-menu-label">IR A</div>{navigation.slice(0, 4).map((item) => <button className="workspace-menu-item" key={item.id} onClick={() => navigate(item.id)}>{item.label}</button>)}</div>}
      </div>
      <nav className="side-nav">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)} title={item.label}><Icon size={17}/><span>{item.label}</span>{item.id === 'crypto' && <span className="nav-count">{assets.length || 10}</span>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="terminal-status"><span className={`status-dot ${stream ? 'online' : ''}`}/><div><strong>{stream ? 'Stream conectado' : 'Datos REST'}</strong><small>Binance public market data</small></div><Signal size={15}/></div><div className="sidebar-foot"><span>MARKET PULSE</span><span>v1.0.2</span></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={toggleMenu} aria-label="Alternar navegación"><span>☰</span></button><div className="breadcrumb">Markets <span>/</span> <strong>{navigation.find((n) => n.id === page)?.label}</strong></div></div><div className="topbar-right"><div className="market-clock"><span className={`status-dot ${stream ? 'online' : ''}`}/>{stream ? 'LIVE MARKET DATA' : 'REST FALLBACK'}<span className="clock-divider"/>{new Date(updatedAt).toLocaleTimeString('es-BO')}</div><button className={`icon-button refresh-button ${busy ? 'spinning' : ''}`} onClick={() => void refreshAll()} disabled={busy} aria-label="Actualizar datos"><RefreshCw size={16}/></button><button className="avatar avatar-button" onClick={() => navigate('about')}>MP</button></div></header>
      <div className="page-content">
        {page === 'dashboard' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> MARKET OVERVIEW</div><h1>Market <span>Overview</span></h1><p>Una vista clara del pulso de los mercados digitales.</p></div><div className="heading-actions"><span className="updated-label">Actualizado {formatDate(updatedAt)}</span><button className="button button-outline" onClick={() => void refreshAll()} disabled={busy}><RefreshCw size={15}/> Actualizar</button></div></div>
          <div className="metric-grid"><Metric label="Activos monitoreados" value={String(assets.length || '—')} sub="Criptomonedas Spot"/><Metric label="Activos en positivo" value={assets.length ? `${gainers}/${assets.length}` : '—'} sub="Mercado observado"/><Metric label="Volumen 24h" value={`$${compactMoney(totalVolume)}`} sub="Volumen cotizado en USDT"/><Metric label="Conexión" value={stream ? 'En vivo' : 'REST'} sub="Estado de Binance"/></div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="dashboard-grid"><section className="panel main-chart-panel"><div className="panel-header"><div><div className="panel-kicker">PRICE PERFORMANCE</div><h2>{selected?.name ?? 'Bitcoin'} <span className="symbol-tag">{symbol}/USDT</span></h2></div><div className="chart-controls">{(['1d','7d','30d','90d'] as const).map((p) => <button key={p} className={period === p ? 'period-active' : ''} onClick={() => setPeriod(p)}>{p.toUpperCase()}</button>)}</div></div><div className="chart-price-row"><strong>{selected ? money(selected.price, 'USD', selected.price < 1 ? 5 : 2) : '—'}</strong><span className={selected?.change24h && selected.change24h >= 0 ? 'positive' : 'negative'}>{selected ? percent(selected.change24h) : ''}</span></div><MarketChart data={history} height={285}/><div className="chart-foot">Fuente: Binance Spot · {history.length} observaciones</div></section>
            <section className="panel probability-panel"><div className="panel-header"><div><div className="panel-kicker">STATISTICAL MODEL</div><h2>Market probability</h2></div></div><div className="horizon-switch">{(['1h','24h','7d'] as Horizon[]).map((h) => <button key={h} className={horizon === h ? 'selected' : ''} onClick={() => setHorizon(h)}>{h}</button>)}</div>{analysis ? <><Probability label="Subida" value={analysis.probabilities.up}/><Probability label="Bajada" value={analysis.probabilities.down}/><Probability label="Estabilidad" value={analysis.probabilities.stable}/><div className="model-meta">n = {analysis.sampleSize} observaciones</div></> : <div className="empty-state">{analysisError || 'Calculando estimación...'}</div>}<div className="probability-disclaimer"><ShieldCheck size={14}/> Estimación estadística, no recomendación financiera.</div></section></div>
          <section className="panel assets-panel"><div className="panel-header assets-header"><div><div className="panel-kicker">MARKET WATCHLIST</div><h2>Activos destacados</h2></div><div className="table-actions"><div className="search-box"><Search size={15}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar activo..."/></div><button className="text-action" onClick={() => navigate('crypto')}>Ver mercado</button></div></div><CryptoTable assets={filtered} selected={symbol} onSelect={(s) => { setSymbol(s); navigate('crypto'); }}/></section></>}
        {page === 'crypto' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> DIGITAL ASSETS</div><h1>Crypto <span>Markets</span></h1><p>Precios Spot, comportamiento histórico e inteligencia estadística.</p></div><button className="button button-outline" onClick={() => void refreshAll()}><RefreshCw size={15}/> Actualizar</button></div><section className="panel detail-main"><div className="panel-header"><div><div className="panel-kicker">ASSET DETAIL</div><h2>{selected?.name ?? symbol} ({symbol})</h2></div><strong>{selected ? money(selected.price) : '—'}</strong></div><MarketChart data={history} height={320}/><div className="horizon-switch">{(['1h','24h','7d'] as Horizon[]).map((h) => <button key={h} className={horizon === h ? 'selected' : ''} onClick={() => setHorizon(h)}>{h}</button>)}</div>{analysis ? <div className="detail-insights"><div><span>Subida</span><strong>{(analysis.probabilities.up*100).toFixed(1)}%</strong></div><div><span>Bajada</span><strong>{(analysis.probabilities.down*100).toFixed(1)}%</strong></div><div><span>Estabilidad</span><strong>{(analysis.probabilities.stable*100).toFixed(1)}%</strong></div><div><span>RSI 14</span><strong>{analysis.indicators.rsi14?.toFixed(1) ?? '—'}</strong></div></div> : <p>{analysisError}</p>}<CryptoTable assets={assets} selected={symbol} onSelect={setSymbol}/></section></>}
        {page === 'fx' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> FOREIGN EXCHANGE</div><h1>Currency <span>Markets</span></h1><p>Tipos de cambio de referencia; no son cotizaciones intradía.</p></div><button className="button button-outline" onClick={() => void loadFx()}><RefreshCw size={15}/> Actualizar FX</button></div><section className="panel assets-panel"><div className="panel-header"><h2>Pares de divisas · referencia diaria</h2></div><div className="table-wrap"><table><thead><tr><th>PAR</th><th>TIPO DE CAMBIO</th><th>FECHA</th><th>FUENTE</th></tr></thead><tbody>{fx.map((item) => <tr key={item.pair} className={fxPair === item.pair ? 'row-selected' : ''} onClick={() => setFxPair(item.pair)}><td>{item.pair}</td><td>{item.rate?.toLocaleString('en-US',{maximumFractionDigits:6}) ?? 'No disponible'}</td><td>{item.date ?? '—'}</td><td>{item.source}</td></tr>)}</tbody></table></div></section><div className="fx-detail-grid"><section className="panel"><h2>{fxPair} · histórico diario</h2><MarketChart data={fxHistory} height={260} prefix=""/></section><section className="panel"><h2>Probabilidad a 7 días</h2>{fxAnalysis ? <><Probability label="Apreciación" value={fxAnalysis.probabilities.up}/><Probability label="Depreciación" value={fxAnalysis.probabilities.down}/><Probability label="Estabilidad" value={fxAnalysis.probabilities.stable}/></> : <p>{fxMessage || 'Selecciona un par con cobertura suficiente.'}</p>}</section></div></>}
        {page === 'compare' && <Compare assets={assets} a={compareA} b={compareB} setA={setCompareA} setB={setCompareB}/>}
        {page === 'methodology' && <Methodology/>}
        {page === 'about' && <About/>}
      </div><footer className="main-footer"><span>© 2026 MARKET PULSE</span><span>Datos de terceros · no es asesoramiento financiero</span></footer>
    </main>{mobileOpen && <button className="nav-backdrop" onClick={() => setMobileOpen(false)} aria-label="Cerrar navegación"/>}
  </div>;
}

function Metric({label,value,sub}:{label:string;value:string;sub:string}) { return <div className="metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-sub">{sub}</div></div>; }
function Probability({label,value}:{label:string;value:number}) { return <div className="prob-line"><div className="prob-line-head"><span>{label}</span><strong>{(value*100).toFixed(1)}%</strong></div><div className="prob-track"><div className="bar-green" style={{width:`${value*100}%`}}/></div></div>; }
function CryptoTable({assets,selected,onSelect}:{assets:CryptoAsset[];selected:string;onSelect:(s:string)=>void}) { return <div className="table-wrap"><table><thead><tr><th>ACTIVO</th><th>PRECIO</th><th>CAMBIO 24H</th><th>VOLUMEN USDT</th><th>ESTADO</th></tr></thead><tbody>{assets.map((asset) => <tr key={asset.symbol} className={selected===asset.symbol?'row-selected':''} onClick={() => onSelect(asset.symbol)}><td><strong>{asset.name}</strong> <small>{asset.symbol}</small></td><td>{money(asset.price,'USD',asset.price<1?5:2)}</td><td className={asset.change24h>=0?'positive':'negative'}>{percent(asset.change24h)}</td><td>${compactMoney(asset.quoteVolume24h)}</td><td>{asset.dataStatus==='live'?'LIVE':'REST'}</td></tr>)}</tbody></table></div>; }
function Compare({assets,a,b,setA,setB}:{assets:CryptoAsset[];a:string;b:string;setA:(v:string)=>void;setB:(v:string)=>void}) { const [series,setSeries]=useState<Candle[]>([]); useEffect(()=>{let active=true;Promise.all([apiGet<{data:Candle[]}>(`/api/market/crypto/${a}/history?period=30d`),apiGet<{data:Candle[]}>(`/api/market/crypto/${b}/history?period=30d`)]).then(([x,y])=>{if(active){const right=new Map(y.data.map(v=>[v.time,v.close]));setSeries(x.data.flatMap(v=>right.has(v.time)?[{...v,volume:right.get(v.time)??0}]:[]));}}).catch(()=>setSeries([]));return()=>{active=false;};},[a,b]); return <><div className="page-heading"><div><div className="eyebrow">RELATIVE PERFORMANCE</div><h1>Asset <span>Comparator</span></h1><p>Compara dos activos financieros.</p></div></div><section className="panel compare-panel"><div className="compare-selectors"><label>ACTIVO A<select value={a} onChange={e=>setA(e.target.value)}>{assets.map(v=><option key={v.symbol} value={v.symbol}>{v.symbol}</option>)}</select></label><label>ACTIVO B<select value={b} onChange={e=>setB(e.target.value)}>{assets.map(v=><option key={v.symbol} value={v.symbol}>{v.symbol}</option>)}</select></label></div><MarketChart data={series}/><p className="muted-small">La segunda serie se conserva en el campo volume para permitir una comparación temporal preliminar; para análisis comparativo avanzado, consultar los históricos de cada activo.</p></section></>; }
function Methodology() { return <><div className="page-heading"><div className="eyebrow">MODEL TRANSPARENCY</div><h1>Research <span>Methodology</span></h1></div><div className="method-grid"><section className="panel method-card"><h2>Fuentes y frecuencia</h2><p>Binance Spot para criptomonedas mediante REST y WebSocket. Frankfurter para tipos de referencia diaria, no precios intradía.</p></section><section className="panel method-card"><h2>Variables</h2><p>Rendimientos, volatilidad histórica, SMA, EMA, RSI, MACD y bandas de Bollinger. Los indicadores contextualizan el mercado.</p></section><section className="panel method-card"><h2>Probabilidades</h2><p>Frecuencias empíricas suavizadas: P(clase) = (n_clase + 1) / (n + 3). Las tres clases suman 100% y requieren muestra suficiente.</p></section><section className="panel method-card"><h2>Validación</h2><p>Intervalos de Wilson y backtesting walk-forward con Brier Score, accuracy, precision, recall y matriz de confusión.</p></section></div><div className="panel method-long"><h2>Limitaciones</h2><p>Las probabilidades son estimaciones de frecuencias históricas, no predicciones garantizadas. Las ventanas pueden solaparse, los mercados cambian de régimen y el sistema no incorpora noticias ni costes de transacción. No constituye asesoramiento financiero.</p></div></>; }
function About() { return <><div className="page-heading"><div className="eyebrow">ABOUT THE PLATFORM</div><h1>About <span>Market Pulse</span></h1></div><section className="panel about-hero"><div className="about-mark"><Activity size={35}/></div><div><div className="panel-kicker">REAL-TIME FINANCIAL INTELLIGENCE PLATFORM</div><h2>MARKET PULSE · v1.0.2</h2><p>Plataforma académica de análisis financiero.</p></div></section><section className="panel team-panel"><h2>Autores</h2><div className="team-grid">{['Oliver Zunagua','Camila Andia','Alison Bejarano'].map((name)=> <div className="team-member" key={name}><strong>{name}</strong><small>Autor / Desarrollador</small></div>)}</div></section><section className="panel project-principles"><ShieldCheck size={18}/> Transparencia · rigor estadístico · uso responsable</section></>; }
