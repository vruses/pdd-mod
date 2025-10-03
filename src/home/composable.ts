import { domMappingConfig, realTimeTrend } from "@/constants";
import { dataPanelSetup } from "@/home/setup";
import type { RealTimeTrend } from "@/home/type";

/* home页面首次加载时立即执行一次 */
// SSR渲染数据首次劫持(chart数据部分)
document.addEventListener("readystatechange", () => {
	// 在DOM结构加载完成，script未执行之前修改实时数据
	if (document.readyState === "interactive") {
		try {
			const data = JSON.parse(window.__NEXT_DATA__.innerHTML);
			(
				data.props.pageProps.coreData.data.realTimeManagementData
					.rtTrend as RealTimeTrend[]
			).forEach((element, index) => {
				element.curPayOrdrAmt = realTimeTrend[index];
			});
			window.__NEXT_DATA__.innerHTML = JSON.stringify(data);
		} catch {
			console.log("图表数据修改时间过短，请关闭控制台尝试刷新");
		}
	}
});

document.addEventListener("readystatechange", () => {
	// 在script执行之后，初始化dom数据
	if (document.readyState === "complete") {
		for (const config of domMappingConfig) {
			dataPanelSetup(
				config.parentSelector,
				config.dataListSelector,
				config.storageKey,
			);
		}
	}
});
