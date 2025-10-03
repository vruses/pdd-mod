/**https://mms.pinduoduo.com/home/页面的数据修改
 * 页面数据加载逻辑为首先通过SSR返回携带全量数据的HTML
 * 在路由切换回来之前通过CSR渲染默认HTML模板，再通过XHR进行一次增量更新
 */
import "./composable";

//当路由来回切换时，劫持xhr响应
// 接口分别对应第一行，第二行，第三行的页面数据
// https://mms.pinduoduo.com/fission/functions/mms/main-mall-data
// https://mms.pinduoduo.com/sydney/api/mall/aggregationInfo/mmsModule/query
// https://mms.pinduoduo.com/sydney/api/mallCoreData/homePageOverView
