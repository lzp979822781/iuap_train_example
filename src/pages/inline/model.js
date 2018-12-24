import { actions } from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";

import { processData } from 'utils';

export default {
    // 确定 Store 中的数据模型作用域
    name: "inline",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        list: [],//表格数据
        totalPages: 1,//总页数
        total: 0,//总记录数
        queryParam: {//查询体
            pageParams: {
                pageIndex: 0,
                pageSize: 25
            },
            groupParams: [],
            whereParams: []
        },
        cacheData: [],//新增、修改缓存原始数据
        tableData: [],//表格最终处理渲染的数据
        selectData: [],//选中的状态数组
        status: 'view',//表格状态：view=查看、edit=编辑、new=新增、del=删除
        rowEditStatus: true,//操作拖拽列、宽开关
        showLoading: false,//Loading
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
        }
    },
    effects: {
        /**
         * 加载列表数据
         * @param {object} param
         */
        async loadList(param) {
            // 正在加载数据，显示加载 Loading 图标
            actions.inline.updateState({ showLoading: true });
            // 调用 getList 请求数据
            let res = processData(await api.getList(param));
            //关闭加载 Loading 图标
            actions.inline.updateState({ showLoading: false });
            //保存数据并更新
            if (res) {
                const { content: list, number, totalPages, totalElements: total } = res;
                const pageIndex = number + 1;
                actions.inline.updateState({
                    list,
                    pageIndex,
                    totalPages,
                    total,
                    queryParam: param
                });
            }
        },
        /**
         * 批量添加数据
         *
         * @param {Array} [param=[]] 数组对象的数据
         * @returns {bool} 操作是否成功
         */
        async adds(param, getState) {
            actions.inline.updateState({ showLoading: true });
            let { data } = await api.adds(param);
            actions.inline.updateState({ showLoading: false });
            if (data.success == 'success') {
                actions.inline.loadList(getState().inline.queryParam);
                actions.inline.updateState({ status: "view", rowEditStatus: true, selectData: [] });
                return true;
            } else {
                return false;
            }
        },
        /**
         * 批量修改数据
         *
         * @param {Array} [param=[]]
         */
        async updates(param, getState) {
            actions.inline.updateState({ showLoading: true });
            let { data } = await api.updates(param);
            actions.inline.updateState({ showLoading: false, selectData: [] });
            if (data.success == 'success') {
                actions.inline.loadList(getState().inline.queryParam);
                actions.inline.updateState({ status: "view", rowEditStatus: true, selectData: [] });
                return true;
            } else {
                return false;
            }
        },
        /**
         * 批量删除数据
         *
         * @param {Array} [param=[]]
         */
        async removes(param, getState) {
            actions.inline.updateState({ showLoading: true });
            let { data } = await api.removes(param);
            actions.inline.updateState({ showLoading: false, selectData: [] });
            if (data.success == 'success') {
                actions.inline.loadList(getState().inline.queryParam);
                return true;
            } else {
                return false;
            }
        },

    }
};
