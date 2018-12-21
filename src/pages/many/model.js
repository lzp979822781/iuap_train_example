import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";

import {processData, initStateObj, structureObj, Error} from "utils";

export default {
    // 确定 Store 中的数据模型作用域
    name: "many",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        passengerObj: {
            list: [],
            pageIndex: 1,
            pageSize: 5,
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
        }
    },
    effects: {
        /**
         * 加载主列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadList(param, getState) {
            try {
                const resPassenger = processData(await api.getList(param));  // 调用 getList 请求数据
                const {content = []} = resPassenger;
                const passengerObj = structureObj(resPassenger, param);
                actions.many.updateState({passengerObj}); // 更新主表数据
            } catch (error) {
                const { passengerObj} = getState().many;
                actions.many.updateState({   // 如果请求出错,数据初始化
                        passengerObj: initStateObj(passengerObj),
                        passengerRow: {}
                    }
                );
            } finally {
                // 默认选中第一条
                actions.many.updateState({showLoading: false, passengerIndex: 0});
            }
        },
    }
};
