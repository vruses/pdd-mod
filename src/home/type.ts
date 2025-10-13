import type { SetReturnType, Simplify, ValueOf } from "type-fest";
/* https://mms.pinduoduo.com/home/页面下相关的数据 */

/*
 * 实时成交数据，用于展示曲线图表
 */
export interface RealTimeTrend {
	statDate: null;
	hr: string;
	curPayOrdrCnt: number;
	/**
	 * 销售额
	 */
	curPayOrdrAmt: number;
	payOrdrUsrCnt: number;
	guvOned: number;
	gpvOned: number;
	promotionSpend: number;
	promotionGoodsCnt: null;
	orderIndex: null;
}

/**
 * home页面下顶部第一排的数据结构
 */
export interface MainMallData {
	/**
	 * 待付款
	 */
	waitPayNum: number;
	/**
	 * 待打印
	 */
	unPrint: number;
	/**
	 * 待发货
	 */
	waitShipNum: number;
	/**
	 * 待收货
	 */
	waitFinishNum: number;
	/**
	 * 即将逾期发货
	 */
	unShip12H: number;
	/**
	 * 待处理工单
	 */
	pendingOrder: number;
	aftersalesNew: {
		/**
		 退款/售后
		 */
		totalWaitHandleCount: number;
		/**
		 * 售后过期预警
		 */
		expireEarlyWarningCount: number;
	};
	unReturnFds: {
		unReturnFdsOrderCount: number;
		isFactory: boolean;
	};
	inqueryRate: number;
	delay: number;
}

/**home页面下顶部第二排的数据结构 */
export interface AggregationInfo {
	/**综合体验星级：默认为null，需要改为number */
	mallStarTomms: number;
	/**成长层级 */
	level: number;
	/**店铺评分排名，默认为null，需要改为number
	 * 最终显示为rank * 100%
	 */
	avgAntiMallDescRevScr3mRcatePct: number;
	/**今日是否体检，默认为false，需要在替换数据时赋值为true，但本地存储使用number类型 */
	isTodayInspected: number;
	/**商品体检分，默认为null，需要改为number */
	inspectScore: number;
	/**服务体验分，默认为null，需要改为number */
	cstmrServScore: number;
	mallStarDesc: string;
	mallUnfkUndfltRevCnt3m: number;
	descScore: null;
	avgDescRevScrRcatePct3m: null;
	scoreRegionRank: null;
	serveStatus: number;
	canSendRedPacket: boolean;
	remindText: string;
	customerAndExpressAggInfo: {
		/**三分钟人工回复率，默认为null，需要改为number
		 * 最终显示为rate * 100%
		 */
		customerReplyRate3min: number;
		customerReplyRateHoverAlert: boolean;
		customerReplyRate5min: null;
		avgReplyTime: null;
		avgReplyTimeHoverAlert: boolean;
		complaintRate30day: null;
		customerReplyStatus: number;
		expressServiceStatus: number;
		afterSaleStatus: number;
		inPunishByService: unknown[];
		expressUnhealthyShipOrderRatio: number;
	};
	avgServRevScrStplPct3m: number;
	rightsNum: number;
	unfixedProblemTypeCount: null;
	highPriceGoodsNum: {
		isDisplay: boolean;
		displayNum: number;
	};

	qualityExperienceInfo: null;
}

/**home页面下第三排实时数据的数据结构 */
export interface ManageDataChart {
	/**成交订单数 */
	curPayOrdrCnt: number;
	/**成交金额 */
	curPayOrdrAmt: number;
	/**推广花费 */
	promotionSpend: number;
	/**商品访客数 */
	guvOned: number;
	/**商品浏览量 */
	gpvOned: number;
	/**商品评论数 */
	goodsReviewCnt: number;
	payOrdrUsrCnt: number;
	statDate: null;
	hr: null;
	promotionGoodsCnt: number;
	orderIndex: number;
	payOrdrAmtShow: number;
	payOrdrCntShow: number;
	payOrdrUsrCntShow: number;
	guvOnedShow: number;
	gpvOnedShow: number;
	goodsReviewCntShow: number;
	promotionSpendShow: number;
	promotionGoodsCntShow: number;
	orderIndexShow: number;
}

/**
 * 提取第一排属性类型，用于简化本地存储数据结构
 */
export type MallDataExtract = Simplify<
	Pick<
		MainMallData,
		| "waitPayNum"
		| "unPrint"
		| "waitShipNum"
		| "waitFinishNum"
		| "unShip12H"
		| "pendingOrder"
	> &
		MainMallData["aftersalesNew"]
>;

/**
 * 提取第二排属性类型，用于简化本地存储数据结构
 */
export type AggregationInfoExtract = Simplify<
	Pick<
		AggregationInfo,
		| "mallStarTomms"
		| "level"
		| "avgAntiMallDescRevScr3mRcatePct"
		| "inspectScore"
		| "cstmrServScore"
		| "isTodayInspected"
	> & {
		customerReplyRate3min: AggregationInfo["customerAndExpressAggInfo"]["customerReplyRate3min"];
	}
>;

/**
 * 提取第三排属性类型，用于简化本地存储数据结构
 * 下面小字共用一种数据结构（昨日数据）
 */
export type DataChartExtract = Simplify<
	Pick<
		ManageDataChart,
		| "curPayOrdrAmt" // 成交金额
		| "curPayOrdrCnt" // 成交订单数
		| "promotionSpend" // 推广花费
		| "guvOned" // 商品访客数
		| "gpvOned" // 商品浏览量
		| "goodsReviewCnt" // 商品评论数
	>
>;

/**
 * 根据下标提取第一排数据对应属性
 * 因为dom元素有顺序,而本地存储对象无序
 *  */
export type IndexMallData = (
	index: number,
	data: MallDataExtract,
) => ValueOf<MallDataExtract>;

/**
 * 根据下标提取第二排数据对应属性
 * 因为dom元素有顺序,而本地存储对象无序
 *  */
export type IndexAggregationInfo = (
	index: number,
	data: AggregationInfoExtract,
) => ValueOf<AggregationInfoExtract>;

/**
 * 根据下标提取第三排数据对应属性
 * 因为dom元素有顺序,而本地存储对象无序
 *  */
export type IndexDataChart = (
	index: number,
	data: DataChartExtract,
) => ValueOf<DataChartExtract>;

/**
 * 需要拼接为html字符串
 *  */
export type IndexDataChartSub = SetReturnType<IndexDataChart, string>;

export type DataTypeMap = {
	mainMallData: MallDataExtract;
	aggregationInfo: AggregationInfoExtract;
	manageDataChart: DataChartExtract;
	dataChartSub: DataChartExtract;
	[key: string]: unknown;
};

/**根据存储键返回对应的处理函数
 * 将页面中的元素按顺序与对象属性一一对应
 */
export type IndexFunctionMap = {
	mainMallData: IndexMallData;
	aggregationInfo: IndexAggregationInfo;
	manageDataChart: IndexDataChart;
	dataChartSub: IndexDataChartSub;
	[key: string]: unknown;
};

/**根据key返回对应的查询处理函数
 * 根据nodeList获取的textContent返回对象
 */
export type QueryFunctionMap = {
	mainMallData: (nodelist: NodeListOf<Element>) => MallDataExtract;
	aggregationInfo: (nodelist: NodeListOf<Element>) => AggregationInfoExtract;
	manageDataChart: (nodelist: NodeListOf<Element>) => DataChartExtract;
	dataChartSub: (nodelist: NodeListOf<Element>) => DataChartExtract;
	[key: string]: unknown;
};

/**本地存储键 */
export type StorageKey = Exclude<keyof IndexFunctionMap, number>;
