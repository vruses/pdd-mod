import { realTimeTrend } from "@/constants";
import type { RealTimeTrend } from "@/types/home";

document.addEventListener("readystatechange", () => {
	// 在DOM结构加载完成，script未执行之前修改实时数据
	if (document.readyState === "interactive") {
		const data = JSON.parse(window.__NEXT_DATA__.innerHTML);
		(
			data.props.pageProps.coreData.data.realTimeManagementData
				.rtTrend as RealTimeTrend[]
		).forEach((element, index) => {
			element.curPayOrdrAmt = realTimeTrend[index];
		});
		window.__NEXT_DATA__.innerHTML = JSON.stringify(data);
	}
});
