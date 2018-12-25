import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";

import {processData, initStateObj, structureObj, Error} from "utils";

export default {
    // 确定 Store 中的数据模型作用域
    name: "many",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        tabKey: "emergency", // table 页切换
        passengerIndex: 0, // 默认选中第一行
        searchParam: {},
        showLoading : false, // 主表页面加载动画是否展示
        showEmergencyLoading: false,
        showTravelingLoading: false,
        passengerObj: {
            list: [],
            pageIndex: 1,
            pageSize: 5,
            totalPages: 1,
            total: 0,
        },
        emergencyObj: {
            list: [],
            pageIndex: 1,
            pageSize: 10,
            totalPages: 1,
            total: 0,
        },
        travelingObj: {
            list: [],
            pageIndex: 1,
            pageSize: 10,
            totalPages: 1,
            total: 0,
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

                // 更新子表
                const tabKey = getState().many.tabKey;
                if (content.length > 0 && tabKey !== "uploadFill") { // 获取子表数据
                    const {pageSize} = getState().many[tabKey + "Obj"];
                    const {id: search_passengerId} = content[0];
                    let paramObj = {pageSize, pageIndex: 0, search_passengerId};
                    if (tabKey === "emergency") { // tab 页为emergency
                        // 带上子表信息
                        const {search_contactName} = getState().many.searchParam;
                        paramObj.search_contactName = search_contactName;
                        actions.many.loadEmergencyList(paramObj)
                    }
                    if (tabKey === "traveling") { // tab travling
                        actions.many.loadTravelingList(paramObj)
                    }
                }
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
         * 获取emergency 列表
         * @param param
         * @param getState
         * @returns {Promise<void>}
         */
        async loadEmergencyList(param, getState) {
            actions.many.updateState({showEmergencyLoading: true});
            try {
                const res = processData(await api.getEmergency(param)); // 请求获取emergency数据
                const emergencyObj = structureObj(res, param);
                actions.many.updateState({emergencyObj});
            } catch (error) {
                const {emergencyObj} = getState().many;
                actions.many.updateState({   // 如果请求出错,数据初始化
                    emergencyObj: initStateObj(emergencyObj),
                });
            } finally {
                actions.many.updateState({showEmergencyLoading: false});
            }
        },

        /**
         * 获取 Traveling 列表
         * @param param
         * @param getState
         * @returns {Promise<void>}
         */

        async loadTravelingList(param, getState) {
            actions.many.updateState({showTravelingLoading: true});
            try {
                const res = processData(await api.getTraveling(param)); // 请求获取Traveling数据
                const travelingObj = structureObj(res,param);

                actions.many.updateState({travelingObj});
            } catch (error) {
                const {travelingObj} = getState().many;
                actions.many.updateState({travelingObj: initStateObj(travelingObj)}); // 如果请求出错,数据初始化
            } finally {
                actions.many.updateState({showTravelingLoading: false});
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

        /**
         * 删除主表数据
         * @param {*} param
         * @param {*} getState
         */
        async delPassenger(param, getState) {
            const {id} = param;
            // 删除数据应该为一个数组
            processData(await api.delPassenger([{id}]), '删除成功');
            // 获取表pageSize;
            const {passengerObj} = getState().many;
            const {pageSize} = passengerObj;
            const initPage = {pageIndex: 0, pageSize};
            actions.many.loadList(initPage);
        },

        /**
         *
         *
         * @param {*} param
         * @returns
         */
        async printDocument(param) {
            // 查询是否配置打印模板
            let res = processData(await api.queryPrintTemplateAllocate(param.queryParams), '');
            if (!res || !res.res_code) {
                return false;
            }
            await api.printDocument({
                tenantId: 'tenant',
                printcode: res['res_code'],
                serverUrl: `${GROBAL_HTTP_CTX}/passenger/dataForPrint`,
                params: encodeURIComponent(JSON.stringify(param.printParams)),
                sendType: 'post'
            })
        },

        /**
         * getSelect：保存子表数据
         * @param {*} param
         * @param {*} getState
         */
        async saveTraveling(param, getState) {
            actions.many.updateState({showLoading: true});
            try {
                const {btnFlag}=param;
                let res=null;
                delete param.btnFlag; //删除标识字段
                if(btnFlag===0){ // 添加数据
                    res = processData(await api.saveTraveling(param), '保存成功');
                }
                if(btnFlag===1){ // 修改数据
                    res = processData(await api.updateTraveling(param), '修改成功');
                }
                if (res) {
                    // 获取主表的id;
                    const {passengerIndex, passengerObj} = getState().many;
                    const {list} = passengerObj;
                    const {id: search_passengerId} = list[passengerIndex];
                    const {pageSize} = getState().many.travelingObj;
                    const param = {pageIndex: 0, pageSize, search_passengerId}; // 获取Traveling表信息
                    actions.many.loadTravelingList(param);
                }
            } catch (error) {
                console.log(error);
            } finally {
                actions.many.updateState({showLoading: false});
            }
        },
        /**
         * getSelect：保存子表数据 紧急联系人
         * @param {*} param
         * @param {*} getState
         */
        async saveEmergency(param, getState) {
            actions.many.updateState({showLoading: true});
            try {
                const {btnFlag}=param;
                let res=null;
                delete param.btnFlag; //删除标识字段
                if(btnFlag===0){ // 添加数据
                    res = processData(await api.saveEmergency(param), '保存成功');
                }
                if(btnFlag===1){ // 修改数据
                    res = processData(await api.updateEmergency(param), '修改成功');
                }
                if (res) {
                    // 获取主表的id;
                    const {passengerIndex, passengerObj, emergencyObj} = getState().many;
                    const {list} = passengerObj;
                    const {id: search_passengerId} = list[passengerIndex];

                    const {pageSize} = emergencyObj;
                    // 带上子表信息
                    const {search_contactName} = getState().many.searchParam;
                    const param = {pageIndex: 0, pageSize, search_passengerId,search_contactName}; // 获取Emergency表信息
                    actions.many.loadEmergencyList(param);
                }
            } catch (error) {
                console.log(error);
            } finally {
                actions.many.updateState({showLoading: false});
            }
        },

        /**
         * 删除子表 Emergency 数据
         * @param {*} param
         * @param {*} getState
         */
        async delEmergency(param, getState) {
            const {id, passengerId: search_passengerId} = param;
            processData(await api.delEmergency([{id}]), '删除成功');
            // 获取表pageSize;
            const {emergencyObj} = getState().many;
            const {pageSize} = emergencyObj;
            const initPage = {pageIndex: 0, pageSize, search_passengerId};
            actions.many.loadEmergencyList(initPage);
        },


        /**
         * 删除子表 Traveling 数据
         * @param {*} param
         * @param {*} getState
         */
        async delTraveling(param, getState) {
            const {id, passengerId: search_passengerId} = param;
            processData(await api.delTraveling([{id}]), '删除成功');
            // 获取表pageSize;
            const {travelingObj} = getState().many;
            const {pageSize} = travelingObj;
            const initPage = {pageIndex: 0, pageSize, search_passengerId};
            actions.many.loadTravelingList(initPage);
        },
    }
};
