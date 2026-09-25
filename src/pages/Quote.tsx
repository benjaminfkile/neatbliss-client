import { useConfig } from "../config/ConfigProvider";
import {
  ChatIcon,
  CheckIcon,
  FacebookIcon,
  MailIcon,
  PhoneIcon,
} from "../components/icons";
import { smsHref, telHref } from "../lib/phone";
import styles from "./Quote.module.css";

const SPEED_ITEMS = [
  "What city you are in",
  "Beds and baths",
  "How often you want us",
  "Pets or anything special",
];

export function QuotePage() {
  const { config } = useConfig();
  const { business } = config;

  return (
    <main className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>Get a free quote</h1>
          <p className={styles.sub}>
            No forms to fill out. Reach a real person however is easiest for
            you, and we will get right back to you.
          </p>
        </header>

        <div className={styles.grid}>
          <a
            href={telHref(business.phone)}
            className={styles.bigCard}
            aria-label={`Call us at ${business.phone}`}
          >
            <span
              className={`${styles.circle} ${styles.circleGreen}`}
              aria-hidden="true"
            >
              <PhoneIcon size={30} />
            </span>
            <div className={styles.cardLabel}>Call us</div>
            <div className={styles.cardValue}>{business.phone}</div>
            <div className={styles.cardHint}>Tap to call on your phone</div>
          </a>

          <a
            href={smsHref(business.textNumber)}
            className={styles.bigCard}
            aria-label={`Text us at ${business.textNumber}`}
          >
            <span
              className={`${styles.circle} ${styles.circleSky}`}
              aria-hidden="true"
            >
              <ChatIcon size={30} />
            </span>
            <div className={styles.cardLabel}>Text us</div>
            <div className={styles.cardValue}>{business.textNumber}</div>
            <div className={styles.cardHint}>
              Texts usually get the fastest reply
            </div>
          </a>

          <a
            href={business.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bigCard}
            aria-label="Message us on Facebook, opens in a new tab"
          >
            <span
              className={`${styles.circle} ${styles.circleNavy}`}
              aria-hidden="true"
            >
              <FacebookIcon size={30} />
            </span>
            <div className={styles.cardLabel}>Message us on Facebook</div>
            <div className={styles.cardHint}>Opens our Facebook page</div>
          </a>
        </div>

        <div className={styles.emailCard}>
          <span className={styles.emailIcon} aria-hidden="true">
            <MailIcon />
          </span>
          <div className={styles.emailBody}>
            <div className={styles.emailLabel}>Prefer email?</div>
            <a
              href={`mailto:${business.email}`}
              className={styles.emailLink}
            >
              {business.email}
            </a>
          </div>
        </div>

        <aside className={styles.speedCard}>
          <div className={styles.speedTitle}>
            To speed up your quote, tell us:
          </div>
          <ul className={styles.speedList}>
            {SPEED_ITEMS.map((item) => (
              <li key={item} className={styles.speedItem}>
                <span className={styles.speedIcon} aria-hidden="true">
                  <CheckIcon size={14} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
