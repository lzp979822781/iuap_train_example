/**
 * request服务请求类
 */

//导入网络请求
import request from "utils/request";

//工具引用
import { deepClone } from 'utils';

//定义接口地址
const URL = {
    "GET_LIST": `${GROBAL_HTTP_CTX}/allowances/list`,
    "GET_ADD": `${GROBAL_HTTP_CTX}/allowances/saveMultiple`,
    "GET_UPDATE": `${GROBAL_HTTP_CTX}/allowances/updateMultiple`,
}

/**
 * 获取列表
 * @param {*} params
 */
export const getList = (param) => {
    let newParam = Object.assign({}, param),
        pageParams = deepClone(newParam.pageParams);

    delete newParam.pageParams;

    return request(URL.GET_LIST, {
        method: "post",
        data: newParam,
        param: pageParams
    });
}

/**
* 添加数据
* @param {Array} data 数组对象批量添加
* @returns {Promise}
*/
export const adds = (data) => {
    return request(URL.GET_ADD, {
        method: "post",
        data
    });
}

/**
 * 修改数据
 * @param {Array} data 数组对象批量修改id+ts
 * @returns {Promise}
 */
export const updates = (data) => {
    return request(URL.GET_UPDATE, {
        method: "post",
        data
    });
}
