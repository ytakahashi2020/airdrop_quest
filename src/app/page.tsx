import Link from "next/link";
import styles from './Home.module.css'; // CSS module for styling

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src="/images/title.png" alt="Qdrop Adventures" className={styles.titleImage} />
      </div>
      <Link href="/game">
        <button className={styles.playButton}>PLAY</button>
      </Link>
      <p className={styles.pcOnlyMessage}>💻 This game is only supported on PC.</p>
      <p className={styles.audioWarning}>🔈  Audio will play during the game.</p>

    </div>
  );
};

export default Home;

