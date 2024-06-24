import HackerNewsTop10 from "./HackerNewsTop10";

function App() {
  return (
    <div className="container mx-auto px-2 pt-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">Hacker News</h1>
        <HackerNewsTop10 />
      </div>
    </div>
  );
}

export default App;
