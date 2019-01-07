import request from "utils/request";
import { deepClone } from 'utils';
//定义接口地址
const URL = {
    // 获取列表url
    "GET_LIST": `${GROBAL_HTTP_CTX}/query_allowances/list`, 
    // 行过滤接口
    "GET_LIST_BY_COL": `${GROBAL_HTTP_CTX}/query_allowances/distinct`,
}

/**
 * 获取列表
 * @param {*} params
 */
export const getList = (param) => {
    // 复制请求参数，
    let newParam = Object.assign({},param),
    pageParams = deepClone(newParam.pageParams);

    delete newParam.pageParams;
    // data中存储的是post请求数据，param存放的是url参数
    return request(URL.GET_LIST, {
        method: "post",
        data : newParam,
        param : pageParams
    });
}

/**
 * 获取行过滤的下拉数据
 *   @param {*} params
 */
export const getListByCol = (param) => {
    return request(URL.GET_LIST_BY_COL, {
        method: "post",
        data : param
    });
}