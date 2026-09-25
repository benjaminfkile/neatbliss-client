import { Link } from "react-router-dom";
import { LogoBadge } from "./LogoBadge";
import { useConfig } from "../config/ConfigProvider";
import styles from "./Footer.module.css";

export function Footer() {
  const { config } = useConfig();
  const { business } = config;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <LogoBadge size={40} showRibbon={false} />
            <span className={styles.brandName}>NeatBliss</span>
          </div>
          <p className={styles.blurb}>
            Family run home cleaning serving {business.serviceArea}. Licensed and
            insured.
          </p>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colHeading}>PAGES</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/#testimonials">Testimonials</Link>
            </li>
            <li>
              <Link to="/quote">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colHeading}>CONTACT</h3>
          <ul>
            <li>{business.phone}</li>
            <li>{business.email}</li>
            <li>
              <a href={business.facebookUrl} target="_blank" rel="noreferrer">
                Facebook page
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; 2026 NeatBliss Cleaning. All rights reserved.</span>
        <span>neatblisscleaning.com</span>
      </div>
    </footer>
  );
}
