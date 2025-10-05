import {
	aggregationInfoProps,
	dataChartProps,
	mallDataProps,
} from "@/constants";
import type {
	AggregationInfoExtract,
	DataChartExtract,
	IndexAggregationInfo,
	IndexDataChart,
	IndexDataChartSub,
	IndexFunctionMap,
	IndexMallData,
	MallDataExtract,
	QueryFunctionMap,
	StorageKey,
} from "@/home/type";

/* 根据元素顺序获取对应数据条目 */
export const indexMallData: IndexMallData = (index, data) => {
	if (index < 0 || index >= mallDataProps.length) {
		return 0;
	}
	return data[mallDataProps[index]];
};

export const indexAggregationInfo: IndexAggregationInfo = (index, data) => {
	if (index < 0 || index >= aggregationInfoProps.length) {
		return 0;
	}
	// 保持dom结构，div:[span,span]
	const key = aggregationInfoProps[index];
	if (
		// 体检分、服务体验分、回复率
		key === "avgAntiMallDescRevScr3mRcatePct" ||
		key === "isTodayInspected" ||
		key === "customerReplyRate3min"
	) {
		return `<span class="new-mall-data__service__card_num">${data[key]}.00</span>
		<span class="manage-data-chart__panel__card__percenage">%</span>` as unknown as number;
	}
	return `<span class="new-mall-data__service__card_num">${data[key]}</span>
		<span class="new-mall-data__service__card_char">${key === "mallStarTomms" ? "星" : key === "level" ? "级" : "分"}</span>` as unknown as number;
};

export const indexDataChart: IndexDataChart = (index, data) => {
	if (index < 0 || index >= dataChartProps.length) {
		return 0;
	}
	return data[dataChartProps[index]];
};

// 数据表看板下方小字与上方的数据结构一样，但是dom内元素需要额外处理
export const indexChartSub: IndexDataChartSub = (index, data) => {
	if (index < 0 || index >= dataChartProps.length) {
		return "0";
	}
	// 拼接符合dom格式的文本
	return `昨日&nbsp;${data[dataChartProps[index]]}&nbsp;`;
};
// 根据存储键返回对应的处理函数
function isKeys(key: unknown): key is StorageKey {
	return (
		key === "mainMallData" ||
		key === "aggregationInfo" ||
		key === "manageDataChart" ||
		key === "dataChartSub"
	);
}

export function getIndexData<K extends StorageKey>(key: K): IndexFunctionMap[K];
export function getIndexData(key: string) {
	const map: IndexFunctionMap = {
		mainMallData: indexMallData,
		aggregationInfo: indexAggregationInfo,
		manageDataChart: indexDataChart,
		dataChartSub: indexChartSub,
	};
	if (isKeys(key)) {
		return map[key];
	}

	return undefined;
}

/* 根据元素顺序生成对应的完整对象 */
export const queryAndUpateMallData: QueryFunctionMap["mainMallData"] = (
	nodeList,
) => {
	const data = Array.from(nodeList).map((value, index) => {
		return [mallDataProps[index], Number(value.textContent) || 0]; //可能非数字
	});
	return Object.fromEntries(data) as MallDataExtract;
};

export const queryAndUpateAggregationInfo: QueryFunctionMap["aggregationInfo"] =
	(nodeList) => {
		const data = Array.from(nodeList).map((value, index) => {
			return [aggregationInfoProps[index], Number(value.textContent) || 0];
		});
		return Object.fromEntries(data) as AggregationInfoExtract;
	};

export const queryAndUpateDataChart: QueryFunctionMap["manageDataChart"] = (
	nodeList,
) => {
	const data = Array.from(nodeList).map((value, index) => {
		return [dataChartProps[index], Number(value.textContent) || 0];
	});
	return Object.fromEntries(data) as DataChartExtract;
};

export const queryAndUpateChartSub: QueryFunctionMap["dataChartSub"] = (
	nodeList,
) => {
	const data = Array.from(nodeList).map((value, index) => {
		// e.g. 提取'昨日&nbsp;545&nbsp;'里的数字
		const match = value.textContent.match(/\d+/);
		return [dataChartProps[index], match ? Number(match[0]) : 0];
	});
	return Object.fromEntries(data) as DataChartExtract;
};

/**
 * 根据key获取对应的textContent查询函数
 */
export function getDataQueryByKey<K extends StorageKey>(
	key: K,
): QueryFunctionMap[K];
export function getDataQueryByKey(key: string) {
	const map: QueryFunctionMap = {
		mainMallData: queryAndUpateMallData,
		aggregationInfo: queryAndUpateAggregationInfo,
		manageDataChart: queryAndUpateDataChart,
		dataChartSub: queryAndUpateChartSub,
	};
	if (isKeys(key)) {
		return map[key];
	}
	return undefined;
}
