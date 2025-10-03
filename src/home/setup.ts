import elementReady from "element-ready";
import { getDataQueryByKey, getIndexData } from "@/home/mall.dto";
import type { DataTypeMap, StorageKey } from "@/home/type";
import storage from "@/utils/storage";

/**
 * @description 等待目标容器里的所有子元素加载完成，通过该容器获取所有子元素并替换数据文本
 * @param parentSelector 目标元素父亲元素选择器
 * @param selector 数据列元素选择器
 * @param storageKey 对应数据列的本地存储key
 * @param isFetch 是否通过接口请求的数据
 * @returns
 */
async function dataPanelSetup<K extends StorageKey>(
	parentSelector: string,
	selector: string,
	storageKey: K,
	isFetch = false,
) {
	const container = await elementReady(parentSelector, {
		waitForChildren: true,
	});
	const data = storage.get<DataTypeMap[K]>(storageKey);
	const dataCardElement = container?.querySelectorAll(selector);
	// 通过key获取定位函数
	const handleIndexData = getIndexData(storageKey);
	// 通过key获取查询函数
	const queryAndUpdateData = getDataQueryByKey(storageKey);
	if (
		!container ||
		!data ||
		!dataCardElement ||
		!handleIndexData ||
		!queryAndUpdateData ||
		// TODO:ts识别不到深层的函数类型
		typeof handleIndexData !== "function" ||
		typeof queryAndUpdateData !== "function"
	)
		return;
	container.contentEditable = "true";
	container.addEventListener("input", () => {
		// 通过nodeList子元素列表获取textContent数据
		const data = queryAndUpdateData(dataCardElement);
		storage.set(storageKey, data);
	});

	// 通过接口加载数据则不需要修改html
	if (isFetch) return;
	// 按顺序替换子元素文本
	for (const [index, element] of Array.from(dataCardElement).entries()) {
		element.innerHTML = handleIndexData(index, data).toString();
	}
}

export { dataPanelSetup };
