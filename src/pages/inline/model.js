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
        }

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
        }

    }
};
