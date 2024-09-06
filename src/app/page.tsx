import Link from "next/link";

const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>RPGフィールドゲーム</h1>
      <p>フィールドでプレイヤーを動かしてみよう！</p>
      <Link href="/game">
        <button>ゲームを開始</button>
      </Link>
    </div>
  );
};

export default Home;
