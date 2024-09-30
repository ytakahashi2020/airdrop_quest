import Link from "next/link";

const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Qdrop Adventures</h1>
      <Link href="/game">
        <button>Play</button>
      </Link>
    </div>
  );
};

export default Home;
