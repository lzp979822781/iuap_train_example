import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 公共工具类,在src/utils/下
import {processData, structureObj, initStateObj} from "utils";

export default {
    // 确定 Store 中的数据模型作用域
    name: "query",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        showLoading: false,
        // 缓存行过滤条件
        cacheFilter: [],
        queryParam: {
            pageParams: {
                pageIndex: 0,
                pageSize: 25,
            },
            sortMap: [],
            whereParams: [],
        },
        queryObj: {
            list: [],
            pageIndex: 0,
            pageSize: 25,
            totalPages: 1,
            total: 0,
        },
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) { //更新state
            return {
                ...state,
                ...data
            };
        },
    },
    effects: {
        /**
         * 加载列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadList(param = {}, getState) {

            // 是否显示加载进度条,为true则显示,为false则不显示
            actions.query.updateState({showLoading: true});   // 正在加载数据，显示加载 Loading 图标
            try {
                // api.getList服务层定义的请求方法,processData用于处理请求获取的数据
                const res = processData(await api.getList(param));  // 调用 getList 请求数据
                const {pageParams} = param;
                // structureObj对返回的数据进行拼装，返回的是queryObj的数据
                const queryObj = structureObj(res, pageParams);
                actions.query.updateState({queryObj, queryParam: param}); // 更新数据和查询条件

            } catch (error) {
                // 如果请求出错,数据初始化
                const {queryObj} = getState().query;
                actions.query.updateState({queryObj: initStateObj(queryObj)});
            } finally {
                actions.query.updateState({showLoading: false});
            }

        },

        /**
         * 获取行过滤的下拉数据
         * @param {*} param
         */
        async getListByCol(param, getState) {
            const res = await api.getListByCol(param);
            // 解构返回的数据
            const {data: {detailMsg: {data: content}}} = res;
            // 缓存查询字段参数
            const {distinctParams} = param,
                column = distinctParams[0];
            // 拼接下拉框的值 返回一个数组
            const selectValList = content.map((item) => {
                const {deptName, dept} = item;
                // 每一个下拉项包含key、value字段，
                return {key: deptName, value: dept};
            });
            actions.query.updateState({['colFilterSelect' + column]: selectValList});
        },
    }
};
