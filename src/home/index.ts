/**https://mms.pinduoduo.com/home/页面的数据修改
 * 页面数据加载逻辑为首先通过SSR返回携带全量数据的HTML
 * 在路由切换回来之前通过CSR渲染默认HTML模板，再通过XHR进行一次增量更新
 */
import "@/core/hooks";
import "./composable";

// 首次
// 本地存储get数据
// 通过html替换子元素数据
// 监听元素输入：查询对应子元素
// 本地存储set数据

// 路由切换
// 本地存储get数据
// 通过接口替换子元素数据
// 监听元素输入：查询对应子元素
// 本地存储set数据

//当路由来回切换时，劫持xhr响应
// 接口分别对应第一行，第二行，第三行的页面数据
// https://mms.pinduoduo.com/fission/functions/mms/main-mall-data
// https://mms.pinduoduo.com/sydney/api/mall/aggregationInfo/mmsModule/query
// https://mms.pinduoduo.com/sydney/api/mallCoreData/homePageOverView
//0立即执行一次
// 0=>null=>default=>0
// 处理信息编辑
