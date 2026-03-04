'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme, useCartStore, resolveMenuUrl, getStorePermalink } from '@zevcommerce/storefront-api';
import { useRouter, useParams } from 'next/navigation';

// ─── Colours ────────────────────────────────────────────────────────────────
const DARK_BG   = '#0D0C0B';
const GOLD      = '#C9A96E';
const CREAM     = '#C4BDB4';
const HEADING   = '#EDE8E0';
const BORDER    = '#252320';

// ─── Nav Dropdown ────────────────────────────────────────────────────────────
function NavDropdown({ item, domain }: { item: any; domain: string }) {
  const itemUrl = resolveMenuUrl(item, domain);

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={itemUrl}
        className="luxe-nav-link relative text-[11px] uppercase tracking-[0.18em] whitespace-nowrap py-1 transition-colors"
        style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
      >
        {item.title}
        {/* Underline grow animation via pseudo-element substitute */}
        <span
          className="luxe-nav-underline absolute bottom-0 left-0 h-px w-0 transition-all duration-300"
          style={{ backgroundColor: GOLD }}
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <div className="relative group/menu">
      <button
        className="luxe-nav-link flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] whitespace-nowrap py-5 transition-colors"
        style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
      >
        {item.title}
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200 group-hover/menu:rotate-180"
          style={{ color: GOLD }}
        />
      </button>

      {/* Dropdown panel */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 translate-y-1 invisible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:visible transition-all duration-200 z-[100]">
        <div
          className="py-3 min-w-[200px]"
          style={{
            backgroundColor: DARK_BG,
            border: `1px solid ${BORDER}`,
            borderTop: `1px solid ${GOLD}`,
          }}
        >
          {item.children.map((child: any) => (
            <Link
              key={child.id}
              href={resolveMenuUrl(child, domain)}
              className="block px-6 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-colors"
              style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Header({ settings }: { settings: any }) {
  const { storeConfig, menus } = useTheme();
  const { openCart, items } = useCartStore();
  const router = useRouter();
  const params = useParams();

  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const {
    layout      = 'standard',
    sticky      = true,
    showSearch  = true,
    logoHeight  = 40,
    menuHandle,
  } = settings;

  const logoSrc  = storeConfig?.storeLogo;
  const storeName = storeConfig?.name || 'Store';

  // Menu resolution
  const availableMenus = Object.values(menus || {});
  const defaultMenu    = availableMenus.find((m: any) => m.isDefault);
  const activeMenu     = (menuHandle && menus?.[menuHandle]) || defaultMenu || availableMenus[0];
  const menuItems      = (activeMenu as any)?.items || [];

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen,     setIsSearchOpen]     = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [suggestions,      setSuggestions]      = useState<any[]>([]);
  const [showSuggestions,  setShowSuggestions]  = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when drawers are open
  useEffect(() => {
    document.body.style.overflow = (isMobileMenuOpen || isSearchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // ESC closes overlays
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setSuggestions([]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search suggestions (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const { getProducts } = await import('@zevcommerce/storefront-api');
          const { data } = await getProducts(domain, 1, 5, searchQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, domain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchQuery.trim()) return;
    router.push(getStorePermalink(domain, `/search?q=${encodeURIComponent(searchQuery)}`));
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isCentered = layout === 'centered';

  // ─── Shared icon buttons ───────────────────────────────────────────────────
  const SearchBtn = ({ hidden }: { hidden?: boolean }) =>
    showSearch ? (
      <button
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open search"
        className="p-1.5 transition-colors"
        style={{ color: CREAM, opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto' }}
        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
        onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
      >
        <Search className="h-[18px] w-[18px]" />
      </button>
    ) : null;

  const CartBtn = () => (
    <button
      onClick={openCart}
      aria-label="Open cart"
      className="relative p-1.5 transition-colors"
      style={{ color: CREAM }}
      onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
      onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
    >
      <ShoppingBag className="h-[18px] w-[18px]" />
      {cartCount > 0 && (
        <span
          className="absolute -top-0.5 -right-1 text-[9px] min-w-[16px] h-[16px] flex items-center justify-center px-1 font-semibold"
          style={{
            backgroundColor: GOLD,
            color: DARK_BG,
            borderRadius: 0,
            fontFamily: 'var(--font-body)',
          }}
        >
          {cartCount}
        </span>
      )}
    </button>
  );

  const HamburgerBtn = () => (
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      aria-label="Open menu"
      className="md:hidden p-1.5 transition-colors"
      style={{ color: CREAM }}
      onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
      onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
    >
      <Menu className="h-[18px] w-[18px]" />
    </button>
  );

  // ─── Logo ──────────────────────────────────────────────────────────────────
  const Logo = () => (
    <Link href={getStorePermalink(domain, '/')} className="block flex-shrink-0">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={storeName}
          style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
        />
      ) : (
        <span
          className="tracking-[0.06em] leading-none"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `${Math.round(logoHeight * 0.7)}px`,
            color: HEADING,
          }}
        >
          {storeName}
        </span>
      )}
    </Link>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inline styles for nav link hover (can't do pseudo-elements in Tailwind easily) */}
      <style>{`
        .luxe-nav-link:hover { color: ${GOLD} !important; }
        .luxe-nav-link:hover .luxe-nav-underline { width: 100% !important; }
      `}</style>

      <header
        style={{
          backgroundColor: DARK_BG,
          borderBottom: `1px solid ${GOLD}`,
          position: sticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 50,
          width: '100%',
        }}
      >
        <div className="container mx-auto px-5 sm:px-8">
          {isCentered ? (
            /* ── Centered layout: nav-left | LOGO | nav-right + icons ── */
            <div className="flex items-center justify-between h-[64px] md:h-[76px]">
              {/* Left: hamburger + search (mobile) + left nav half (desktop) */}
              <div className="flex items-center gap-4 flex-1">
                <HamburgerBtn />
                <SearchBtn hidden={isSearchOpen} />
                <nav className="hidden md:flex items-center gap-8">
                  {menuItems
                    .slice(0, Math.ceil(menuItems.length / 2))
                    .map((item: any) => (
                      <NavDropdown key={item.id} item={item} domain={domain} />
                    ))}
                </nav>
              </div>

              {/* Center: logo */}
              <div className="flex items-center justify-center px-4">
                <Logo />
              </div>

              {/* Right: right nav half + cart */}
              <div className="flex items-center justify-end gap-4 flex-1">
                <nav className="hidden md:flex items-center gap-8">
                  {menuItems
                    .slice(Math.ceil(menuItems.length / 2))
                    .map((item: any) => (
                      <NavDropdown key={item.id} item={item} domain={domain} />
                    ))}
                </nav>
                <CartBtn />
              </div>
            </div>
          ) : (
            /* ── Standard layout: LOGO + nav-left | icons-right ── */
            <div className="flex items-center justify-between h-[64px] md:h-[76px]">
              <div className="flex items-center gap-10">
                <Logo />
                <nav className="hidden md:flex items-center gap-8">
                  {menuItems.map((item: any) => (
                    <NavDropdown key={item.id} item={item} domain={domain} />
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <HamburgerBtn />
                <SearchBtn hidden={isSearchOpen} />
                <CartBtn />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Search Overlay ──────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[300] flex flex-col transition-all duration-300 ${
          isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(13,12,11,0.97)' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) { setIsSearchOpen(false); setSuggestions([]); }
        }}
      >
        {/* Close */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => { setIsSearchOpen(false); setSuggestions([]); setSearchQuery(''); }}
            className="p-2 transition-colors"
            style={{ color: CREAM }}
            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search form */}
        <div className="flex items-start justify-center px-6 pt-8">
          <div className="w-full max-w-2xl relative">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <Search
                className="absolute left-0 h-5 w-5 pointer-events-none"
                style={{ color: GOLD }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the collection…"
                className="w-full pl-9 pr-12 py-3 text-xl outline-none bg-transparent"
                style={{
                  color: HEADING,
                  borderBottom: `1px solid ${GOLD}`,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.04em',
                  caretColor: GOLD,
                }}
              />
            </form>

            {/* Search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-50"
                style={{ backgroundColor: DARK_BG, border: `1px solid ${BORDER}`, borderTop: `1px solid ${GOLD}` }}
              >
                <p
                  className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: GOLD, fontFamily: 'var(--font-body)' }}
                >
                  Products
                </p>
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={getStorePermalink(domain, `/products/${product.slug}`)}
                    onClick={() => { setIsSearchOpen(false); setSuggestions([]); setSearchQuery(''); }}
                    className="flex items-center gap-4 px-5 py-3 transition-colors"
                    style={{ borderTop: `1px solid ${BORDER}` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#161513')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      className="h-11 w-11 flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: '#161513' }}
                    >
                      {product.media?.[0]?.url ? (
                        <img
                          src={product.media[0].url}
                          alt={product.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ShoppingBag className="h-5 w-5 m-auto mt-3" style={{ color: CREAM }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm line-clamp-1"
                        style={{ color: HEADING, fontFamily: 'var(--font-heading)' }}
                      >
                        {product.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
                      >
                        ₦{parseFloat(product.variants?.[0]?.price || '0').toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition-colors"
                  style={{
                    color: GOLD,
                    fontFamily: 'var(--font-body)',
                    borderTop: `1px solid ${BORDER}`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#161513')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  View all results for &ldquo;{searchQuery}&rdquo;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ───────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(13,12,11,0.7)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] flex flex-col animate-in slide-in-from-left duration-300"
            style={{ backgroundColor: DARK_BG, borderRight: `1px solid ${BORDER}` }}
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${BORDER}` }}
            >
              <Link
                href={getStorePermalink(domain, '/')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={storeName}
                    style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                  />
                ) : (
                  <span
                    className="text-lg tracking-[0.06em]"
                    style={{ fontFamily: 'var(--font-heading)', color: HEADING }}
                  >
                    {storeName}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-1.5 transition-colors"
                style={{ color: CREAM }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {menuItems.map((item: any) => (
                <div key={item.id}>
                  <Link
                    href={resolveMenuUrl(item, domain)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-sm uppercase tracking-[0.15em] transition-colors"
                    style={{
                      color: CREAM,
                      borderBottom: `1px solid ${BORDER}`,
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
                  >
                    {item.title}
                  </Link>
                  {/* Mobile children */}
                  {item.children?.length > 0 && (
                    <div className="pl-4 space-y-0">
                      {item.children.map((child: any) => (
                        <Link
                          key={child.id}
                          href={resolveMenuUrl(child, domain)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 text-xs uppercase tracking-[0.15em] transition-colors"
                          style={{
                            color: '#8A8279',
                            borderBottom: `1px solid ${BORDER}`,
                            fontFamily: 'var(--font-body)',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                          onMouseLeave={e => (e.currentTarget.style.color = '#8A8279')}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom actions */}
            <div
              className="flex items-center gap-4 px-6 py-5"
              style={{ borderTop: `1px solid ${BORDER}` }}
            >
              {showSearch && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors"
                  style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              )}
              <button
                onClick={() => { setIsMobileMenuOpen(false); openCart(); }}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors"
                style={{ color: CREAM, fontFamily: 'var(--font-body)' }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = CREAM)}
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
                {cartCount > 0 && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 font-semibold"
                    style={{ backgroundColor: GOLD, color: DARK_BG, borderRadius: 0 }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Schema ───────────────────────────────────────────────────────────────────
export const schema = {
  type: 'header',
  name: 'Header',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'standard', label: 'Standard (Logo Left)' },
        { value: 'centered', label: 'Centered (Logo Center)' },
      ],
      default: 'standard',
    },
    { type: 'checkbox', id: 'sticky',     label: 'Sticky Header',  default: true },
    { type: 'checkbox', id: 'showSearch', label: 'Show Search',    default: true },
    {
      type: 'range',
      id: 'logoHeight',
      label: 'Logo Height (px)',
      min: 20,
      max: 80,
      step: 5,
      default: 40,
    },
    { type: 'link_list', id: 'menuHandle', label: 'Main Menu', default: 'main-menu' },
  ],
};
