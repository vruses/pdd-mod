import type { StorageKey } from "@/home/type";

// 实时成交金额数据，写入24组数据对应24小时，100等于1元
export const realTimeTrend = [100, 200, 300, 400];

/**dom和数据映射信息 */
export type domMappingConfig = {
	storageKey: StorageKey;
	parentSelector: string;
	dataListSelector: string;
}[];

export const domMappingConfig: domMappingConfig = [
	{
		storageKey: "mainMallData",
		parentSelector: "div.top-data-panel > *:first-child",
		dataListSelector: "span.top-data-panel__card__value",
	},
	{
		storageKey: "aggregationInfo",
		parentSelector: "div.new-mall-data__service > *:first-child",
		dataListSelector: "div.new-mall-data__service__card__DSR > *:first-child",
	},
	{
		storageKey: "manageDataChart",
		parentSelector: ".manage-data-chart__panel",
		dataListSelector:
			".manage-data-chart__panel__line > .manage-data-chart__panel__card span.manage-data-chart__panel__card__content_val",
	},
	{
		storageKey: "dataChartSub",
		parentSelector: ".manage-data-chart__panel",
		dataListSelector:
			".manage-data-chart__panel > .manage-data-chart__panel__line > .manage-data-chart__panel__card div.manage-data-chart__panel__card__yesterday-value",
	},
];
