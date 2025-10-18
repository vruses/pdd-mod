//biome-ignore-all lint: this is a migration
//@ts-nocheck
// https://mms.pinduoduo.com/sycm/stores_data页面相关的数据操作
import { mall_logo, monthList, todayRtList } from "@/constants";
import storage from "@/utils/storage";

(() => {
	// 交易信息对应的月份
	let transactionMonth = 0;
	// 每月的交易信息列表
	const transactionInfoList = storage.get("transactionInfoList", {});

	// 更可靠的logo替换方法
	function replaceLogo() {
		// 创建一个观察器来监视DOM变化
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// 检查新增的节点
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Element节点
						// 检查节点本身是否是头像图片
						if (
							node.classList &&
							node.classList.contains("avatar") &&
							node.querySelector("img")
						) {
							node.querySelector("img").src = mall_logo;
						}
						// 检查节点的子元素中是否有头像图片
						const avatarImg =
							node.querySelector && node.querySelector(".avatar img");
						if (avatarImg) {
							avatarImg.src = mall_logo;
						}
					}
				});
			});

			// 也检查现有的头像图片
			const existingAvatars = document.querySelectorAll(".avatar img");
			existingAvatars.forEach((img) => {
				if (img.src !== mall_logo) {
					img.src = mall_logo;
				}
			});
		});

		// 开始观察DOM变化
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// 立即执行一次检查
		const existingAvatars = document.querySelectorAll(".avatar img");
		existingAvatars.forEach((img) => {
			img.src = mall_logo;
		});
	}

	// 页面加载时执行logo替换
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", replaceLogo);
	} else {
		replaceLogo();
	}

	// 定期检查并替换logo，防止React重新渲染后恢复原图
	setInterval(() => {
		const avatarImages = document.querySelectorAll(".avatar img");
		avatarImages.forEach((img) => {
			if (img.src !== mall_logo) {
				img.src = mall_logo;
			}
		});
	}, 1000);

	const originalFetch = window.fetch;
	window.fetch = function (input, init = {}) {
		let url = "";
		// 处理 input 可能是字符串或 Request 对象
		if (typeof input === "string") {
			url = input;
		} else if (input instanceof Request) {
			url = input.url;
		}
		// 调用原始 fetch
		return originalFetch.call(this, input, init).then(async (response) => {
			// 用户信息相关接口
			if (url.includes("/janus/api/auth/login")) {
				const clonedResponse = response.clone();
				const data = await clonedResponse.json();
				const modifiedData = data;

				// 如果有自定义店铺信息，则使用自定义信息
				const shopInfo = storage.get("shopInfo");
				if (shopInfo && modifiedData.result) {
					modifiedData.result.username = shopInfo.username;
					modifiedData.result.nickname = shopInfo.nickname;
					// 如果商城信息也存在，则修改商城名称
					if (modifiedData.result.mall) {
						modifiedData.result.mall.mall_name = shopInfo.mall_name;
						// 同时修改logo URL
						modifiedData.result.mall.logo = mall_logo;
					}
				}

				return new Response(JSON.stringify(modifiedData), {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				});
			}

			// 交易数据信息
			if (url.includes("/sydney/api/mallTrade/getMallTradeInfo")) {
				// 克隆响应流
				const clonedResponse = response.clone();
				// 读取 JSON 数据
				const data = await clonedResponse.json();
				// 修改数据后返回一个新的 Response
				const modifiedData = data;
				// 代表日，昨日，或者周和月
				const queryType = JSON.parse(init.body)?.queryType;
				// 如果没有修改过，将返还原来的月份数据

				// 6代表实时，0代表昨日，4代表月份
				// 如果不是月份信息和实时信息，而是7,30等
				if (queryType !== 0 || queryType !== 4 || queryType !== 6) {
					// 如果信息修改过，则共用0月份数据
					if (transactionInfoList[0]) {
						modifiedData.result = {
							...modifiedData.result,
							...transactionInfoList[0],
						};
					}
				}
				// 如果查看的是实时或者昨日交易量数据
				if (queryType === 6 || queryType === 0) {
					const mergeTransInfo = storage.get("transInfoListRT");
					// 如果有对应月份的编辑信息
					if (mergeTransInfo) {
						modifiedData.result = {
							...modifiedData.result,
							...mergeTransInfo,
						};
					}

					// 每次请求时都需要处理一次
					// 交易数据信息编辑
					handleInfoEdit(
						awaitElementLoad,
						'#mf-mms-sycm-container [class*="card_cardWrapper"] [class*="card_cardItem"]',
						'[class*="card_cardWrapper"]',
						"transInfoListRT",
						queryTransInfoRT,
					);
				}
				// 如果查看的是月交易量数据
				if (queryType === 4) {
					const date = JSON.parse(init.body)?.queryDate;
					const month = new Date(date).getMonth() + 1;
					transactionMonth = month;
					// 如果有对应月份的编辑信息
					if (transactionInfoList[transactionMonth]) {
						modifiedData.result = {
							...modifiedData.result,
							...transactionInfoList[transactionMonth],
						};
					}
					// 每次请求时都需要处理一次
					// 交易数据信息编辑
					handleInfoEdit(
						awaitElementLoad,
						'#mf-mms-sycm-container [class*="card_cardWrapper"] [class*="card_cardItem"]',
						'[class*="card_cardWrapper"]',
						"transactionInfoList",
						queryTransInfo,
					);
				}
				// 返回未读的响应体
				return new Response(JSON.stringify(modifiedData), {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				});
			}
			// 交易曲线数据
			if (url.includes("/sydney/api/mallTrade/queryMallTradeList")) {
				// 如果查看的是月交易量数据
				if (JSON.parse(init.body)?.queryType === 4) {
					const date = JSON.parse(init.body)?.queryDate;
					const month = new Date(date).getMonth() + 1;
					const dayList = monthList[month];
					// 克隆响应流
					const clonedResponse = response.clone();
					// 读取 JSON 数据
					const data = await clonedResponse.json();
					// 修改数据后返回一个新的 Response
					const modifiedData = data;
					// dayList
					dayList.forEach((value, index) => {
						try {
							if (index >= modifiedData.result.dayList.length) return;
							modifiedData.result.dayList[index].payOrdrAmt = value;
						} catch (error) {
							console.log(error);
						}
					});
					// 返回未读的响应体
					return new Response(JSON.stringify(modifiedData), {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
					});
				} else if (JSON.parse(init.body)?.queryType === 6) {
					// 克隆响应流
					const clonedResponse = response.clone();
					// 读取 JSON 数据
					const data = await clonedResponse.json();
					// 修改数据后返回一个新的 Response
					const modifiedData = data;
					todayRtList.forEach((value, index) => {
						try {
							if (index >= modifiedData.result.todayRtList.length) return;
							modifiedData.result.todayRtList[index].payOrdrAmt = value;
						} catch (error) {
							console.log(error);
						}
					});
					// 返回未读的响应体
					return new Response(JSON.stringify(modifiedData), {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
					});
				}
			}
			return response;
		});
	};

	// IKlv是获取ssr信息的函数
	const originalCall = Function.prototype.call;
	Function.prototype.call = function (...args) {
		if (this.name === "IKlv") {
			let funcStr = this.toString();
			funcStr.indexOf("__NEXT_DATA__");
			const shopInfo = storage.get("shopInfo");
			// 替换用户名，昵称，店铺名
			if (shopInfo) {
				const mall_name = shopInfo.mall_name;
				const username = shopInfo.username;
				const nickname = shopInfo.nickname;
				funcStr = funcStr.replace(
					`JSON.parse(document.getElementById("__NEXT_DATA__").textContent);`,
					(res) =>
						res +
						`k.props.headerProps.serverData.userInfo.username="${username}";
          k.props.headerProps.serverData.userInfo.nickname="${nickname}";
          k.props.headerProps.serverData.userInfo.mall.mall_name="${mall_name}";
          k.props.headerProps.serverData.userInfo.mall.logo="${mall_logo}";
          `,
				);
			}
			funcStr = eval("(" + funcStr + ")");
			return originalCall.apply(funcStr, args);
		}
		return originalCall.apply(this, args);
	};

	// 等待元素加载
	async function awaitElementLoad(selector, timeout = 5000, interval = 100) {
		return new Promise((resolve, reject) => {
			const start = Date.now();
			const check = () => {
				try {
					const element = document.querySelector(selector);
					if (element !== undefined && element !== null) {
						clearInterval(timer);
						resolve(element);
					} else if (Date.now() - start >= timeout) {
						clearInterval(timer);
						reject(new Error(`元素 "${selector}" 加载超时 (${timeout}ms)`));
					}
				} catch (err) {
					// 如果报错也继续轮询，直到超时
					if (Date.now() - start >= timeout) {
						clearInterval(timer);
						reject(
							new Error(
								`元素 "${selector}" 加载出错并超时 (${timeout}ms): ${err.message}`,
							),
						);
					}
				}
			};

			const timer = setInterval(check, interval);
		});
	}

	// 查询交易信息
	function queryTransInfo(target) {
		// 展示数据的文字被用某种字体加密的
		// 找到spider_font类就好了
		const textList = target.querySelectorAll("span.__spider_font");
		// 需要控制month,防止乱改信息
		transactionInfoList[transactionMonth] = {
			// 成交金额
			payOrdrAmt: textList[0]?.textContent || "占位符",
			// 成交金额百分比
			payOrdrAmtPct: textList[1]?.textContent || "占位符",
			//成交订单数
			payOrdrCnt: textList[2]?.textContent || "占位符",
			// 成交订单数百分比
			payOrdrCntPct: textList[3]?.textContent || "占位符",
			// 成交买家数
			payOrdrUsrCnt: textList[4]?.textContent || "占位符",
			// 成交买家数百分比
			payOrdrUsrCntPct: textList[5]?.textContent || "占位符",
			// 成交转换率
			payUvRto: textList[6]?.textContent
				? textList[6]?.textContent + "%"
				: "占位符%",
			// 成交转化率百分比
			payUvRtoPct: textList[7]?.textContent || "占位符",
			// 客单价
			payOrdrAup: textList[8]?.textContent || "占位符",
			// 客单价百分比
			payOrdrAupPct: textList[9]?.textContent || "占位符",
			// 成交老买家占比
			rpayUsrRtoDth: textList[10]?.textContent
				? textList[10]?.textContent + "%"
				: "占位符%",
			// 成交老买家占比百分比
			rpayUsrRtoDthPct: textList[11]?.textContent || "占位符",
			// 店铺关注数
			mallFavCnt: textList[12]?.textContent || "占位符",
			// 店铺关注数百分比
			mallFavCntPct: textList[13]?.textContent || "占位符",
			// 退款金额
			sucRfOrdrAmt1d: textList[14]?.textContent || "占位符",
			// 退款金额百分比
			sucRfOrdrAmt1dPct: textList[15]?.textContent || "占位符",
			// 退款单数
			sucRfOrdrCnt1d: textList[16]?.textContent || "占位符",
			// 退款单数百分比
			sucRfOrdrCnt1dPct: textList[17]?.textContent || "占位符",
			// 平均访客价值
			uvCfmVal: textList[18]?.textContent || "占位符",
			// 平均访客价值百分比
			uvCfmValPct: textList[19]?.textContent || "占位符",
		};
		return transactionInfoList;
	}

	// 每日的交易数据
	function queryTransInfoRT(target) {
		// 展示数据的文字被用某种字体加密的
		// 找到spider_font类就好了
		const textList = target.querySelectorAll("span.__spider_font");
		return {
			// 成交金额
			payOrdrAmt: textList[0]?.textContent || "占位符",
			// 成交金额百分比
			payOrdrAmtPct: textList[1]?.textContent || "占位符",
			//成交订单数
			payOrdrCnt: textList[2]?.textContent || "占位符",
			// 成交订单数百分比
			payOrdrCntPct: textList[3]?.textContent || "占位符",
			// 成交买家数
			payOrdrUsrCnt: textList[4]?.textContent || "占位符",
			// 成交买家数百分比
			payOrdrUsrCntPct: textList[5]?.textContent || "占位符",
			// 成交转换率
			payUvRto: textList[6]?.textContent
				? textList[6]?.textContent + "%"
				: "占位符%",
			// 成交转化率百分比
			payUvRtoPct: textList[7]?.textContent || "占位符",
			// 客单价
			payOrdrAup: textList[8]?.textContent || "占位符",
			// 客单价百分比
			payOrdrAupPct: textList[9]?.textContent || "占位符",
			// 成交老买家占比
			rpayUsrRtoDth: textList[10]?.textContent
				? textList[10]?.textContent + "%"
				: "占位符%",
			// 成交老买家占比百分比
			rpayUsrRtoDthPct: textList[11]?.textContent || "占位符",
			// 店铺关注数
			mallFavCnt: textList[12]?.textContent || "占位符",
			// 店铺关注数百分比
			mallFavCntPct: textList[13]?.textContent || "占位符",
			// 退款金额
			sucRfOrdrAmt1d: textList[14]?.textContent || "占位符",
			// 退款金额百分比
			sucRfOrdrAmt1dPct: textList[15]?.textContent || "占位符",
			// 退款单数
			sucRfOrdrCnt1d: textList[16]?.textContent || "占位符",
			// 退款单数百分比
			sucRfOrdrCnt1dPct: textList[17]?.textContent || "占位符",
			// 平均访客价值
			uvCfmVal: textList[18]?.textContent || "占位符",
			// 平均访客价值百分比
			uvCfmValPct: textList[19]?.textContent || "占位符",
		};
	}

	// 查询店铺信息
	function queryShopInfo(target) {
		const ele = target.querySelectorAll("span");
		let mall_name = "";
		let inside = "";
		let before = "";
		let userStr = "";
		try {
			mall_name = ele[0].textContent;
			userStr = ele[1].textContent;

			// 检查是否包含括号
			if (userStr.includes("(") && userStr.includes(")")) {
				// 提取括号里的内容
				inside = userStr.substring(
					userStr.indexOf("(") + 1,
					userStr.indexOf(")"),
				);
				// 提取括号前面的内容
				before = userStr.substring(0, userStr.indexOf("("));
			} else {
				// 如果没有括号，将整个字符串作为用户名，昵称设为空或默认值
				before = userStr;
				inside = userStr; // 或者设置为默认值，如 "默认昵称"
			}
		} catch (error) {
			mall_name = "占位符";
			before = "请按照";
			inside = "格式";
		}
		return {
			mall_name,
			nickname: inside,
			username: before,
		};
	}

	// 处理信息编辑
	async function handleInfoEdit(
		waitFunc,
		waitSelector,
		selector,
		storageKey,
		queryFunc,
	) {
		// 等待前置元素加载
		await waitFunc(waitSelector, 10e5, 1000);
		// 获取元素信息
		const ele = document.querySelector(selector);
		ele.contentEditable = "true";
		// 切换时更新input事件
		ele.oninput = function () {
			// 获取数据
			const data = queryFunc(this);
			// 本地存储数据
			storage.set(storageKey, data);
		};
	}

	// 处理账号类型显示（去除括号前的内容）
	function handleAccountTypeDisplay() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// 查找包含账号类型的元素
				const accountTypeElements = document.querySelectorAll(
					".user-name-id .user-name-text",
				);
				accountTypeElements.forEach((element) => {
					const text = element.textContent;
					// 如果包含括号，提取括号中的内容
					if (text.includes("(") && text.includes(")")) {
						const inside = text.substring(
							text.indexOf("(") + 1,
							text.indexOf(")"),
						);
						element.textContent = inside;
					}
					// 如果包含自定义内容，则显示自定义内容
					else {
						// 检查是否有本地存储的自定义账号类型
						const customAccountType = storage.get("customAccountType");
						if (customAccountType) {
							element.textContent = customAccountType;
						}
					}
				});
			});
		});

		// 开始观察
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// 同时监听输入事件来保存自定义内容
		awaitElementLoad(".user-name-id .user-name-text", 10e5, 100).then(
			(element) => {
				element.contentEditable = "true";
				element.addEventListener("input", function () {
					// 保存自定义的账号类型
					storage.set("customAccountType", this.textContent);
				});
			},
		);
	}

	function main() {
		// 店铺信息编辑
		handleInfoEdit(
			awaitElementLoad,
			".user-name",
			".user-name",
			"shopInfo",
			queryShopInfo,
		);
		// 处理账号类型显示
		handleAccountTypeDisplay();
	}

	main();
})();
