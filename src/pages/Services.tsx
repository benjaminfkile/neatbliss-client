import { Link } from "react-router-dom";
import { useConfig } from "../config/ConfigProvider";
import {
  BoxIcon,
  CalendarIcon,
  CheckIcon,
  SparkleIcon,
} from "../components/icons";
import styles from "./Services.module.css";

const SERVICE_ICONS = [CalendarIcon, SparkleIcon, BoxIcon];
const SERVICE_ICON_CLASSES = [
  `${styles.icon} ${styles.iconSky}`,
  `${styles.icon} ${styles.iconGreen}`,
  `${styles.icon} ${styles.iconNavy}`,
];

export function ServicesPage() {
  const { config } = useConfig();
  const { services } = config;

  return (
    <main className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.sub}>
            Every clean comes with our full attention. Here is what each
            service covers, and we are happy to adjust for your home.
          </p>
        </header>

        <div className={styles.grid}>
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            const iconClass =
              SERVICE_ICON_CLASSES[i % SERVICE_ICON_CLASSES.length];
            return (
              <article
                key={`${service.title}-${i}`}
                className={`card ${styles.card}`}
              >
                <span className={iconClass} aria-hidden="true">
                  <Icon />
                </span>
                <h2 className={styles.serviceTitle}>{service.title}</h2>
                <p className={styles.serviceDesc}>{service.description}</p>
                <hr className={styles.divider} />
                <div className={styles.includedLabel}>INCLUDED</div>
                <ul className={styles.includedList}>
                  {service.included.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className={styles.includedItem}
                    >
                      <span
                        className={styles.includedIcon}
                        aria-hidden="true"
                      >
                        <CheckIcon size={14} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className={styles.note}>
          <h2 className={styles.noteTitle}>Every home is different.</h2>
          <p className={styles.noteBody}>
            Pricing depends on size, condition, and how often we come. Reach
            out for a free quote and we will figure it out together.
          </p>
          <Link to="/quote" className="pill pill--green">
            Get a free quote
          </Link>
        </aside>
      </div>
    </main>
  );
}
