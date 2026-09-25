import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogoBadge } from "./LogoBadge";
import styles from "./NavBar.module.css";

interface NavItem {
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Testimonials", to: "/#testimonials" },
  { label: "Contact", to: "/quote" },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} aria-label="NeatBliss home">
          <LogoBadge size={44} showRibbon={false} />
          <span className={styles.wordmark}>
            <span className={styles.brandName}>NeatBliss</span>
            <span className={styles.brandSub}>HOME CLEANING</span>
          </span>
        </NavLink>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink to="/quote" className={`pill pill--green ${styles.cta}`}>
            Get a free quote
          </NavLink>
        </nav>

        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className={menuOpen ? styles.barsOpen : styles.bars}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div id="primary-mobile-menu" className={styles.mobilePanel}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileLink} ${styles.linkActive}`
                      : styles.mobileLink
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/quote" className={`pill pill--green ${styles.mobileCta}`}>
                Get a free quote
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
