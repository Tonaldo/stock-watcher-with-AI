// vite.config.ts
import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
export default {
    plugins: [solid({ adapter: vercel() })],
};
