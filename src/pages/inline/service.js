/**
 * request服务请求类
 */

//导入网络请求
import request from "utils/request";

//工具引用
import { deepClone } from 'utils';

//定义接口地址
const URL = {
    "GET_LIST": `${GROBAL_HTTP_CTX}/allowances/list`
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
