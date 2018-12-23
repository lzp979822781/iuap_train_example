import request from "utils/request";

//定义接口地址
const URL = {

    "GET_LIST": `${GROBAL_HTTP_CTX}/passenger/list`, // 获取主表
    "SAVE_PASSENGER": `${GROBAL_HTTP_CTX}/passenger/insertSelective`, // 保存主表
}

/**
 * 获取主列表
 * @param {*} params
 */
export const getList = (param) => {
    return request(URL.GET_LIST, {
        method: "get",
        param
    });
}

/**
 * 保存主表数据
 * @param {*} params
 */
export const savePassenger = (params) => {
    return request(URL.SAVE_PASSENGER, {
        method: "post",
        data: params
    });
}