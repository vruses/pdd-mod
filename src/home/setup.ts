import elementReady from "element-ready";
import { getIndexData } from "@/home/mall.dto";
import type { DataTypeMap, StorageKey } from "@/home/type";
import storage from "@/utils/storage";

/**
 * @description 等待目标容器里的所有子元素加载完成，通过该容器获取所有子元素
 * @param ParentSelector 目标元素父亲元素选择器
 * @param selector 数据列元素选择器
 * @param storageKey 对应数据列的本地存储key
 * @returns
 */
async function dataPanelSetup<K extends StorageKey>(
	ParentSelector: string,
	selector: string,
	storageKey: K,
) {
	const container = await elementReady(ParentSelector, {
		waitForChildren: true,
	});
	const data = storage.get<DataTypeMap[K]>(storageKey);
	const dataCardElement = container?.querySelectorAll(selector);
	const handleIndexData = getIndexData(storageKey);
	if (
		!data ||
		!dataCardElement ||
		!handleIndexData ||
		// TODO:ts识别不到深层的函数类型
		typeof handleIndexData !== "function"
	) {
		return;
	}
	// 按顺序替换子元素文本
	for (const [index, element] of Array.from(dataCardElement).entries()) {
		element.innerHTML = handleIndexData(index, data).toString();
	}
}
export { dataPanelSetup };
