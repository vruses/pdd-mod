import { domMappingConfig, realTimeTrend } from "@/constants";
import { dataPanelSetup } from "@/home/setup";
import type {
	AggregationInfoExtract,
	DataChartExtract,
	MallDataExtract,
	RealTimeTrend,
} from "@/home/type";
import ajaxHooker, { type FetchResponse } from "@/utils/ajaxHooker";
import storage from "@/utils/storage";

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

/* 页面切换时 */

ajaxHooker.hook((request) => {
	// 第一排数据接口
	if (request.url.includes("/fission/functions/mms/main-mall-data")) {
		// 在特定接口获取数据时重新设置数据面板
		for (const config of domMappingConfig) {
			dataPanelSetup(
				config.parentSelector,
				config.dataListSelector,
				config.storageKey,
				true,
			);
		}
		request.response = (res: FetchResponse) => {
			const mainMallData = storage.get<MallDataExtract>("mainMallData");
			if (!mainMallData) return;
			// 修整mainMallData再用可变参数merge
			const { totalWaitHandleCount, expireEarlyWarningCount, ...rest } =
				mainMallData;
			const mergedMallData = {
				...rest,
				aftersalesNew: {
					totalWaitHandleCount,
					expireEarlyWarningCount,
				},
			};
			res.json.result = { ...res.json.result, ...mergedMallData };
		};
	}

	// 第二排数据接口
	if (
		request.url.includes("/sydney/api/mall/aggregationInfo/mmsModule/query")
	) {
		request.response = (res: FetchResponse) => {
			const aggregationInfo =
				storage.get<AggregationInfoExtract>("aggregationInfo");
			if (!aggregationInfo) return;
			res.json.result = {
				...res.json.result,
				...aggregationInfo,
				...{
					// 用于展示体检分，将占位的字段改成true
					isTodayInspected: true,
					// 修改描述:"暂无星级数据"
					mallStarDesc: "请继续保持",
				},
			};
			// 单独修改三分钟人工回复率
			res.json.result.customerAndExpressAggInfo.customerReplyRate3min =
				aggregationInfo.customerReplyRate3min;
		};
	}

	// 第三排数据接口
	if (request.url.includes("/sydney/api/mallCoreData/homePageOverView")) {
		request.response = (res: FetchResponse) => {
			// 实时数据部分的大字
			const manageDataChart = storage.get<DataChartExtract>("manageDataChart");
			// 实时数据部分的小字
			const dataChartSub = storage.get<DataChartExtract>("dataChartSub");
			if (manageDataChart) {
				res.json.result.rtDataOverView = {
					...res.json.result.rtDataOverView,
					...manageDataChart,
				};
			}
			if (dataChartSub) {
				res.json.result.yesterdayDataOverView = {
					...res.json.result.yesterdayDataOverView,
					...dataChartSub,
				};
			}
			// 实时数据右边的图标
			(res.json.result.rtTrend as RealTimeTrend[]).forEach((element, index) => {
				element.curPayOrdrAmt = realTimeTrend[index];
			});
		};
	}
});

// TODO:解决数据显示位数的问题
