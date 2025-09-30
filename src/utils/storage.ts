class Storage {
	/**
	 * 存储数据到localStorage
	 * @param key 存储键名
	 * @param value 存储值（支持任意可序列化类型）
	 */
	set<T>(key: string, value: T): void {
		try {
			const data = JSON.stringify(value);
			localStorage.setItem(key, data);
		} catch (e) {
			console.error("Storage Set Error:", e);
		}
	}

	/**
	 * 从localStorage获取数据
	 * @param key 存储键名
	 * @param defaultValue 当键不存在时的默认返回值
	 * @returns 解析后的数据或默认值
	 */
	get<T>(key: string, defaultValue: T): T;
	get<T>(key: string, defaultValue?: T): T | undefined;
	get<T>(key: string, defaultValue?: T): T | undefined {
		try {
			const data = localStorage.getItem(key);
			if (data === null) {
				return defaultValue;
			}
			return JSON.parse(data) as T;
		} catch (e) {
			console.error("Storage Get Error:", e);
			return defaultValue;
		}
	}

	/**
	 * 从localStorage删除指定键
	 * @param key 要删除的键名
	 */
	remove(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error("Storage Remove Error:", e);
		}
	}

	/**
	 * 清空localStorage中的所有数据
	 */
	clear(): void {
		try {
			localStorage.clear();
		} catch (e) {
			console.error("Storage Clear Error:", e);
		}
	}

	/**
	 * 检查localStorage中是否存在指定键
	 * @param key 要检查的键名
	 * @returns 是否存在该键
	 */
	has(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}

	/**
	 * 获取所有存储的键名
	 * @returns 键名数组
	 */
	keys(): string[] {
		return Object.keys(localStorage);
	}
}

// 导出单例实例
export default new Storage();
