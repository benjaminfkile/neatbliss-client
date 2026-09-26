import { Link } from "react-router-dom";
import { useConfig } from "../config/ConfigProvider";
import { LogoBadge } from "../components/LogoBadge";
import {
  BoxIcon,
  CalendarIcon,
  HeartIcon,
  MapPinIcon,
  SparkleIcon,
  StarIcon,
} from "../components/icons";
import { serviceAreaCity } from "../lib/serviceArea";
import { smsHref, telHref } from "../lib/phone";
import styles from "./Home.module.css";

const SERVICE_ICONS = [CalendarIcon, SparkleIcon, BoxIcon];
const SERVICE_ICON_TINTS = [
  styles.serviceIcon,
  `${styles.serviceIcon} ${styles.serviceIconGreen}`,
  `${styles.serviceIcon} ${styles.serviceIconNavy}`,
];

export function HomePage() {
  const { config } = useConfig();
  const { business, services, testimonials } = config;
  const city = serviceAreaCity(business.serviceArea);

  return (
    <main>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="eyebrow">
              RESIDENTIAL CLEANING IN {city.toUpperCase()}
            </span>
            <h1 className={styles.heroTitle}>{business.tagline}</h1>
            <p className={styles.heroLead}>
              NeatBliss is a family run home cleaning service. Recurring
              cleans, deep cleans, and move in or move out cleans, all done
              with care by people who treat your home like their own.
            </p>
            <div className={styles.heroActions}>
              <Link to="/quote" className="pill pill--green">
                Get a free quote
              </Link>
              <a
                href={telHref(business.phone)}
                className="pill pill--navy-outline"
              >
                Call {business.phone}
              </a>
            </div>
          </div>
          <div className={styles.heroBadge}>
            <LogoBadge size={280} />
          </div>
        </div>
      </section>

      <section className="container">
        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <span
              className={`${styles.trustIcon} ${styles.trustIconGreen}`}
              aria-hidden="true"
            >
              <HeartIcon />
            </span>
            <div>
              <div className={styles.trustLabel}>Family owned</div>
              <div className={styles.trustSub}>
                Run by people who care about your home
              </div>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span
              className={`${styles.trustIcon} ${styles.trustIconSky}`}
              aria-hidden="true"
            >
              <SparkleIcon />
            </span>
            <div>
              <div className={styles.trustLabel}>One year in business</div>
              <div className={styles.trustSub}>And just getting started</div>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span
              className={`${styles.trustIcon} ${styles.trustIconGreen}`}
              aria-hidden="true"
            >
              <MapPinIcon />
            </span>
            <div>
              <div className={styles.trustLabel}>
                Serving {business.serviceArea}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="eyebrow">SERVICES</span>
            <h2 className={styles.sectionTitle}>What we can do for you</h2>
          </div>
          <div className={styles.grid3}>
            {services.map((service, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              const iconClass =
                SERVICE_ICON_TINTS[i % SERVICE_ICON_TINTS.length];
              return (
                <article
                  key={`${service.title}-${i}`}
                  className={`card ${styles.serviceCard}`}
                >
                  <span className={iconClass} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  <Link to="/services" className={styles.serviceLink}>
                    See what is included
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="eyebrow">TESTIMONIALS</span>
            <h2 className={styles.sectionTitle}>What clients say</h2>
            <p className={styles.sectionSub}>Real reviews from real homes.</p>
          </div>
          <div className={styles.grid3}>
            {testimonials.map((t, i) => (
              <article
                key={`${t.name}-${i}`}
                className={`card ${styles.testimonialCard}`}
              >
                <span
                  className={styles.stars}
                  aria-label="Five out of five stars"
                >
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </span>
                <p className={styles.quote}>{t.quote}</p>
                <div className={styles.author}>{t.name}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready for a cleaner home?</h2>
          <p className={styles.ctaSub}>
            Reach out and tell us about your place. Quotes are always free,
            and you will always talk to a real person.
          </p>
          <div className={styles.ctaActions}>
            <a href={telHref(business.phone)} className="pill pill--green">
              Call {business.phone}
            </a>
            <a
              href={smsHref(business.textNumber)}
              className={`pill ${styles.ctaOutline}`}
            >
              Text {business.textNumber}
            </a>
            <a
              href={business.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`pill ${styles.ctaOutline}`}
            >
              Message us on Facebook
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
