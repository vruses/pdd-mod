import type {
	AggregationInfoExtract,
	DataChartExtract,
	IndexAggregationInfo,
	IndexDataChart,
	IndexDataChartSub,
	IndexFunctionMap,
	IndexMallData,
	MallDataExtract,
	StorageKey,
} from "@/home/type";

export const indexMallData: IndexMallData = (index, data) => {
	// 定义属性顺序映射表（与索引一一对应）
	const properties: Array<keyof MallDataExtract> = [
		"waitPayNum",
		"unPrint",
		"waitShipNum",
		"waitFinishNum",
		"unShip12H",
		"pendingOrder",
		"totalWaitHandleCount",
		"expireEarlyWarningCount",
	];
	if (index < 0 || index >= properties.length) {
		return 0;
	}
	return data[properties[index]];
};

export const indexAggregationInfo: IndexAggregationInfo = (index, data) => {
	// 定义属性顺序映射表（与索引一一对应）
	const properties: Array<keyof AggregationInfoExtract> = [
		"mallStarTomms",
		"level",
		"avgAntiMallDescRevScr3mRcatePct",
		"inspectScore",
		"cstmrServScore",
		// 质量体验排名没有数据，用于index占位
		"isTodayInspected",
		"customerReplyRate3min",
	];
	if (index < 0 || index >= properties.length) {
		return 0;
	}
	return data[properties[index]];
};

export const indexDataChart: IndexDataChart = (index, data) => {
	// 定义属性顺序映射表（与索引一一对应）
	const properties: Array<keyof DataChartExtract> = [
		"curPayOrdrCnt", // 成交订单数
		"curPayOrdrAmt", // 成交金额
		"promotionSpend", // 推广花费
		"guvOned", // 商品访客数
		"gpvOned", // 商品浏览量
		"goodsReviewCnt", // 商品评论数
	];
	if (index < 0 || index >= properties.length) {
		return 0;
	}
	return data[properties[index]];
};

// 数据表看板下方小字与上方的数据结构一样，但是dom内元素需要额外处理
export const indexChartSub: IndexDataChartSub = (index, data) => {
	// 定义属性顺序映射表（与索引一一对应）
	const properties: Array<keyof DataChartExtract> = [
		"curPayOrdrCnt", // 成交订单数
		"curPayOrdrAmt", // 成交金额
		"promotionSpend", // 推广花费
		"guvOned", // 商品访客数
		"gpvOned", // 商品浏览量
		"goodsReviewCnt", // 商品评论数
	];
	if (index < 0 || index >= properties.length) {
		return "0";
	}
	// 拼接符合dom格式的文本
	return `昨日&nbsp;${data[properties[index]]}&nbsp;`;
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
