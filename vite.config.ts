import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import packageJSON from "./package.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	plugins: [
		monkey({
			entry: "src/main.ts",
			userscript: {
				name: "pdd-mod",
				version: JSON.stringify(packageJSON.version),
				description: "拼多多交易数据与首页数据修改",
				grant: "none",
				namespace: "vruses",
				match: ["*://*.pinduoduo.com/*"],
				"run-at": "document-start",
			},
			server: { open: false },
		}),
	],
});
