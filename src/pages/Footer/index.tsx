import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <>
      <footer>
        <div className={styles.footerText}>
          <div className={styles.text}>
            <p>
              <a href="#" className={styles.eventListLink}>
                Журнал событий
              </a>
            </p>
            <p>
              &copy;&nbsp;<b>Optosense</b> 2026
            </p>
            <p>
              <em>v1.0.0</em>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
