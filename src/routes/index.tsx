import { createSignal, createResource, Show, For } from "solid-js";
import { Title } from "@solidjs/meta";
import { useLocalStorage } from "../utils/localStorage";
import StockChart from "../components/StockChart";


export default function Home() {
  const [query, setQuery] = createSignal("");
  const [selectedStocks, setSelectedStocks] = useLocalStorage<string[]>("watchedStocks", []);

  const [searchResults] = createResource(query, async (q) => {
    if (!q) return [];
    const res = await fetch(`https://stock-watcher-with-ai-proxy.vercel.app/api/stock?symbol=${q}`);
    const data = await res.json();
    return data.data || [];
  });

  const addStock = (symbol: string) => {
    if (!selectedStocks().includes(symbol)) {
      setSelectedStocks([...selectedStocks(), symbol]);
    }
  };

  return (
    <main class="p-4 max-w-4xl mx-auto">
      <Title>Stock Watcher</Title>
      <h1 class="text-3xl font-bold mb-4">📈 Stock Watcher</h1>

      <input
        class="border p-2 w-full rounded mb-2"
        placeholder="Search stock (e.g., Tesla, AAPL)"
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />

      <Show when={searchResults()}>
        <ul class="border rounded p-2 mb-4 bg-white shadow">
          <For each={searchResults()}>{(result) => (
            <li class="cursor-pointer hover:bg-gray-100 p-1" onClick={() => addStock(result.symbol)}>
              {result.instrument_name} ({result.symbol})
            </li>
          )}</For>
        </ul>
      </Show>

      <h2 class="text-xl font-semibold mb-2">📋 Watched Stocks</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <For each={selectedStocks()}>{(symbol) => (
          <StockChart symbol={symbol} apiKey={API_KEY} />
        )}</For>
      </div>
    </main>
  );
}
