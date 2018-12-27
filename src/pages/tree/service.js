import request from "utils/request";
//定义接口地址
const URL = {
    // 查询树数据，不带treeNode id
    "GET_TREE_DATA" : `${GROBAL_HTTP_CTX}/tree_demo/getSonNodes`,
    // 搜索功能接口
    "TREE_SEARCH" : `${GROBAL_HTTP_CTX}/tree_demo/dataSearchNodes`,
    
    // 获取表格数据
    "GET_TABLE_DATA" : `${GROBAL_HTTP_CTX}/table_demo/list`,
    // 表格新增保存表格接口
    "ADD_TABLE_DATA" : `${GROBAL_HTTP_CTX}/table_demo/insertSelective`,
    // 表格编辑保存接口
    "EDIT_SAVE_DATA" : `${GROBAL_HTTP_CTX}/table_demo/updateSelective`,
    // 表格删除接口
    "DEL_TABLE_DATA" : `${GROBAL_HTTP_CTX}/table_demo/deleteBatch`

}



/**
 * 获取树数据
 * @param {*} params
 */
export const getTreeData = (param) => {
    console.log("param",param);
    return request(URL.GET_TREE_DATA, {
        method: "get",
        param
    });
}

/** 
 * 获取表格数据
 */

export const getTableData = (param) => {
    return request(URL.GET_TABLE_DATA, {
        method: "get",
        param
    });
}

// 拖拽节点
export const dragNode = (param) => {
    console.log("param",param);
    return request(URL.DRAG_NODE, {
        method: "post",
        data : param
    });
}

// 列表添加数据
export const addTableData = (param) => {
    return request(URL.ADD_TABLE_DATA, {
        method: "post",
        data : param
    });
}

// 编辑保存事件
export const addEditData = (param) => {
    return request(URL.EDIT_SAVE_DATA, {
        method: "post",
        data : param
    });
}

// 删除数据
export const delTableData = (param) => {
    return request(URL.DEL_TABLE_DATA, {
        method: "post",
        data : param
    });
}

/**
 *
 *
 * @param {*} params
 * @returns {Array} 返回查询结果
 */
export const getSearchTree = (param) => {
    return request(URL.TREE_SEARCH, {
        method: "get",
        param
    });
}
