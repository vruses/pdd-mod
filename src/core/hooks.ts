/* 页面加载前或加载时需要执行的一些操作 */

// 防止打印操作减慢代码执行
console.table = () => {};
console.clear = () => {};

// IKlv是获取ssr信息的函数
const originalCall = Function.prototype.call;
Function.prototype.call = function (...args) {
	if (this.name === "a4r6") {
		// 拦截打印大数组的函数
		return;
	}
	return originalCall.apply(this, args);
};
export {};
