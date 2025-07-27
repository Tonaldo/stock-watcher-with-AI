import Chart from "chart.js/auto";
import { createResource, onCleanup, onMount, Show } from "solid-js";

export default function StockChart(props: { symbol: string; apiKey: string }) {
    let canvasRef: HTMLCanvasElement;

    const [data] = createResource(async () => {
        const res = await fetch(
            `https://stock-watcher-with-ai-proxy.vercel.app/api/stock?symbol=${props.symbol}`
        );
        const json = await res.json();
        return json.values || [];
    });

    onMount(() => {
        const chart = new Chart(canvasRef, {
            type: "line",
            data: {
                labels: data()?.map((d) => d.datetime).reverse(),
                datasets: [
                    {
                        label: props.symbol,
                        data: data()?.map((d) => parseFloat(d.close)).reverse(),
                        borderColor: "#3b82f6",
                        backgroundColor: "#93c5fd",
                    },
                ],
            },
        });
        onCleanup(() => chart.destroy());
    });

    return (
        <div class="bg-white p-2 rounded shadow">
            <Show when={data()} fallback={<p>Loading {props.symbol}...</p>}>
                <canvas ref={canvasRef} class="w-full h-64" />
            </Show>
        </div>
    );
}
