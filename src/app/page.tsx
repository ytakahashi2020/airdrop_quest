import Link from "next/link";
import styles from './Home.module.css'; // CSS module for styling

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src="/images/title.png" alt="Qdrop Adventures" className={styles.titleImage} />
      </div>
      <Link href="/game">
        <button className={styles.playButton}>Play</button>
      </Link>
    </div>
  );
};

export default Home;
