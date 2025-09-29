/* https://mms.pinduoduo.com/home/页面下相关的数据 */

/* 实时成交数据，用于展示曲线图表 */
export interface RealTimeTrend {
	statDate: null;
	hr: string;
	curPayOrdrCnt: number;
	// 销售额
	curPayOrdrAmt: number;
	payOrdrUsrCnt: number;
	guvOned: number;
	gpvOned: number;
	promotionSpend: number;
	promotionGoodsCnt: null;
	orderIndex: null;
}
