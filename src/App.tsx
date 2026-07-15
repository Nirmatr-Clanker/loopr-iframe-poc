import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  ChevronRight,
  ExternalLink,
  Home,
  LayoutDashboard,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react'
import './App.css'

const LOOPR_URL = 'https://dev1.k8.loopr.ai'

type NavKey = 'overview' | 'activity' | 'insights' | 'loopr' | 'settings'

type NavItem = {
  key: NavKey
  label: string
  icon: typeof Home
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'insights', label: 'Insights', icon: BarChart3 },
  { key: 'loopr', label: 'Loopr', icon: MessageSquare },
  { key: 'settings', label: 'Settings', icon: Settings },
]

function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('loopr')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  const activeLabel = useMemo(
    () => navItems.find((item) => item.key === activeNav)?.label ?? 'Loopr',
    [activeNav],
  )

  useEffect(() => {
    if (activeNav !== 'loopr') return

    setIframeStatus('loading')
    const timer = window.setTimeout(() => {
      setIframeStatus((status) => (status === 'loading' ? 'unavailable' : status))
    }, 18000)

    return () => window.clearTimeout(timer)
  }, [activeNav, iframeKey])

  const retryIframe = () => {
    setIframeStatus('loading')
    setIframeKey((key) => key + 1)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">LC</div>
          <div>
            <p className="brand-name">Loopr Console</p>
            <p className="brand-subtitle">Workspace</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = activeNav === item.key
            return (
              <button
                key={item.key}
                className={`nav-item ${selected ? 'selected' : ''}`}
                type="button"
                aria-current={selected ? 'page' : undefined}
                onClick={() => setActiveNav(item.key)}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-card">
          <Sparkles size={17} />
          <div>
            <strong>POC environment</strong>
            <span>Embedded dev Loopr instance</span>
          </div>
        </div>

        <div className="profile-footer">
          <div className="avatar"><UserRound size={18} /></div>
          <div className="profile-copy">
            <strong>Alex Morgan</strong>
            <span>Product Operations</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span>Console</span>
              <ChevronRight size={15} />
              <strong>{activeLabel}</strong>
            </div>
            <h1>{activeLabel}</h1>
          </div>

          <div className="topbar-actions">
            <span className="status-badge"><span /> Dev instance online</span>
            <button className="icon-button" type="button" aria-label="Search"><Search size={18} /></button>
            <button className="icon-button" type="button" aria-label="Notifications"><Bell size={18} /></button>
            {activeNav === 'loopr' && (
              <a className="primary-action" href={LOOPR_URL} target="_blank" rel="noreferrer">
                Open external <ExternalLink size={16} />
              </a>
            )}
          </div>
        </header>

        <section className="content-area">
          {activeNav === 'loopr' ? (
            <div className="iframe-card" aria-busy={iframeStatus === 'loading'}>
              {iframeStatus === 'loading' && (
                <div className="iframe-overlay">
                  <Loader2 className="spin" size={28} />
                  <strong>Loading Loopr</strong>
                  <span>Preparing the embedded console…</span>
                </div>
              )}

              {iframeStatus === 'unavailable' && (
                <div className="iframe-overlay unavailable">
                  <div className="unavailable-icon"><Lock size={24} /></div>
                  <strong>Loopr is taking longer than expected</strong>
                  <span>
                    The embedded app may be unavailable, blocked by browser policy, or waiting on the network.
                  </span>
                  <div className="overlay-actions">
                    <button className="secondary-action" type="button" onClick={retryIframe}>
                      <RefreshCw size={16} /> Retry
                    </button>
                    <a className="secondary-action" href={LOOPR_URL} target="_blank" rel="noreferrer">
                      <ExternalLink size={16} /> Open externally
                    </a>
                  </div>
                </div>
              )}

              <iframe
                key={iframeKey}
                className="loopr-frame"
                src={LOOPR_URL}
                title="Loopr embedded console"
                allow="camera; microphone; autoplay; fullscreen; display-capture"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="eager"
                onLoad={() => setIframeStatus('ready')}
              />
            </div>
          ) : (
            <PlaceholderPage label={activeLabel} />
          )}
        </section>
      </main>
    </div>
  )
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="placeholder">
      <div className="placeholder-header">
        <div>
          <p className="eyebrow">Coming soon</p>
          <h2>{label} workspace</h2>
          <p>Polished shell placeholder for navigation outside the embedded Loopr experience.</p>
        </div>
        <button className="secondary-action" type="button">Configure</button>
      </div>
      <div className="placeholder-grid">
        <div className="metric-card"><span>Active sessions</span><strong>128</strong></div>
        <div className="metric-card"><span>Tasks queued</span><strong>34</strong></div>
        <div className="metric-card"><span>Health score</span><strong>98%</strong></div>
      </div>
      <div className="empty-panel">
        <Sparkles size={28} />
        <strong>{label} content will live here</strong>
        <span>Select Loopr from the side navigation to view the embedded console.</span>
      </div>
    </div>
  )
}

export default App
