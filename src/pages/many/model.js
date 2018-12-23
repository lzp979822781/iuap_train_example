import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";

import {processData, initStateObj, structureObj, Error} from "utils";

export default {
    // 确定 Store 中的数据模型作用域
    name: "many",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        passengerIndex: 0, // 默认选中第一行
        searchParam: {},
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
                // 请求后台数据
                const resPassenger = processData(await api.getList(param));  // 调用 getList 请求数据
                // 拼接参数passengerObj
                const {content = []} = resPassenger;
                const passengerObj = structureObj(resPassenger, param);
                // 更新参数
                actions.many.updateState({passengerObj}); // 更新主表数据
            } catch (error) {
                const { passengerObj} = getState().many;
                actions.many.updateState({   // 如果请求出错,数据初始化
                        passengerObj: initStateObj(passengerObj),
                        passengerRow: {}
                    }
                );
            } finally {
                // 默认选中第一条,不管请求成功或失败,取消进度条
                actions.many.updateState({showLoading: false, passengerIndex: 0});
            }
        },

        /**
         * getSelect：保存主表数据
         * @param {*} param
         * @param {*} getState
         */

        async savePassenger(param, getState) {
            try {
                const {btnFlag}=param;
                let res=null;
                delete param.btnFlag; //删除标识字段
                if(btnFlag===0){ // 添加数据
                    res = processData(await api.savePassenger(param), '添加成功');
                }
                if(btnFlag===1){ // 修改数据
                    res = processData(await api.updatePassenger(param), '修改成功');
                }

                if (res) { // 如果不判断是会报错，param参数有错
                    const {pageSize} = getState().many.passengerObj;
                    // 带上子表信息
                    const {search_contactName} = getState().many.searchParam;
                    const param = {pageIndex: 0, pageSize,search_contactName}; // 获取主表信息
                    actions.many.loadList(param);
                }
            } catch (error) {
                console.log(error);
            } finally {
                actions.many.updateState({showLoading: false});
            }
        },

    }
};
