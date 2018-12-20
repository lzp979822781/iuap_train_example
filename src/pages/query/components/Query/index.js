import React, {Component} from 'react';
// 第三方框架，主要用作调用数据模型层状态及函数
import {actions} from 'mirrorx';
// 日期处理第三方js
import moment from 'moment';
// 处理url参数
import queryString from "query-string";
// grid中引入的组件
import {Tooltip, Dropdown, Menu, Icon, Loading} from 'tinper-bee';
import Grid from 'components/Grid';
// 页面head,封装与公共组件中
import Header from 'components/Header';
//导入模态框，模态框组件封装在公共组件下
import PopDialog from 'components/Pop';
// 导入搜索区组件
import SearchArea from '../SearchArea';

// 封装的工具类
import {deepClone, getSortMap} from "utils";

// grid样式
import 'bee-complex-grid/build/Grid.css';
import 'bee-table/build/Table.css';
// 分页样式
import 'bee-pagination/build/Pagination.css'
// 组件样式
import './index.less';

const {Item} = Menu;
const format = "YYYY-MM-DD HH:mm:ss";

class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            record: {}, // 存储关联数据信息
            filterable: false,
        }
    }

    componentDidMount() {
        actions.query.loadList(this.props.queryParam); // 查询默认条件
    }

        /**
     *
     * 关联数据钻取
     * @param {object} record 关联数据行数据
     * @param {string} key menu菜单key值
     */
    onRelevance = (record, key) => {
        const {name} = record;
        if (key === "name") { // 跳转百度
            window.open('https://baike.baidu.com/item/' + name, "_blank");
        }
        if (key === "code") {  // 弹出模态框
            this.setState({record, showModal: true});
        }
        if (key === "year") {  // 跳转新页面
            const {code, name, sexEnumValue, levelName} = record;
            actions.routing.push({
                pathname: '/employee',
                search: queryString.stringify({code, name, sexEnumValue, levelName})
            })
        }
    }

    /**
     * 关闭模态框
     */
    close = () => {
        this.setState({showModal: false});
    }

    /**
     *
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        this.onPageSelect(pageIndex, 0);
    }

    /**
     *
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        this.onPageSelect(value, 1);
    }

    /**
     *
     * @param {Number} value  pageIndex 或者 pageIndex
     * @param {Number} type 为0标识为 pageIndex,为1标识 pageSize
     */
    onPageSelect = (value, type) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        let {pageIndex, pageSize} = queryParam.pageParams;
        if (type === 0) {
            pageIndex = value - 1;
        } else {
            pageSize = value;
            pageIndex = 0;
        }
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        queryParam['pageParams'] = {pageIndex, pageSize};
        actions.query.loadList(queryParam);
    }

    /**
     *
     * @param {Boolean} status 控制栏位的显示/隐藏
     */
    afterRowFilter = (status) => {
        if (!status) { // 清空行过滤数据
            let {queryParam, cacheFilter} = deepClone(this.props);
            queryParam.whereParams = cacheFilter;
            actions.query.updateState({queryParam}); //缓存查询条件
        }
        this.setState({filterable: status});
    }

    /**
     *
     *触发过滤输入操作以及下拉条件的回调
     * @param {string} key 过滤字段名称
     * @param {*} value 过滤字段值
     * @param {string} condition 过滤字段条件
     */
    onFilterChange = (key, value, condition) => {
        let isAdd = true; //是否添加标识
        // 获取查询参数
        let queryParam = deepClone(this.props.queryParam);
        // whereParams为查询条件即过滤条件，pageParams为分页参数
        let {whereParams, pageParams} = queryParam;
        pageParams.pageIndex = 0; // 默认跳转第一页
        // 判断是否查询条件中是否包含过滤字段，有则修改，并且重新加载列表
        for (const [index, element] of whereParams.entries()) {
            if (element.key === key) { // 判断action 中是否有 过滤对象
                whereParams[index] = this.handleFilterData(key, value, condition);
                isAdd = false;
            }
        }
        // 为找到对应的字段,则添加到whereParams数据中,handleFilterData为日期处理函数
        if (isAdd) {
            const filterData = this.handleFilterData(key, value, condition);
            whereParams.push(filterData);
        }
        actions.query.loadList(queryParam);
    }


    /**
     *
     * 拼接过滤条件对象
     * @param {string} key 过滤字段名称
     * @param {*} value 过滤字段值
     * @param {string} condition 过滤字段条件
     */

    handleFilterData = (key, value, condition) => {
        const filterObj = {key, value, condition};
        if (Array.isArray(value)) { // 判断是否日期
            filterObj.value = this.handleDateFormat(value); // moment 格式转换
            filterObj.condition="RANGE";
        }
        return filterObj;
    }


    /**
     * 清除过滤条件的回调函数，回调参数为清空的字段
     * @param {string} key 清除过滤字段
     */
    onFilterClear = (key) => {
        let queryParam = deepClone(this.props.queryParam);
        let {whereParams, pageParams} = queryParam;
        for (const [index, element] of whereParams.entries()) {
            if (element.key === key) {
                whereParams.splice(index, 1);
                pageParams.pageIndex = 0; // 默认跳转第一页
                break;
            }
        }
        actions.query.loadList(queryParam);
    }


    /**
     *
     *行过滤，日期数组拼接
     * @param {Array} value 日期数组
     * @returns
     */
    handleDateFormat = (value) => {
        let dateArray = value.map((item, index) => {
            let str = '';
            if (index === 0) {
                str = item.format(beginFormat);
            } else {
                str = item.format(endFormat);
            }
            return str;
        });
        return dateArray;
    }


    /**
     *
     *排序属性设置，getSortMap为实际排序方法，根据回调sortParam中的orderNum从小到大排序
     * @param {Array} sortParam 排序参数对象数组
     */
    sortFun = (sortParam) => {
        let {queryParam} = this.props;
        queryParam.sortMap = getSortMap(sortParam);
        actions.query.loadList(queryParam);
    }

    render() {
        const _this = this;
        const {queryObj, showLoading, queryParam} = _this.props;
        const {filterable, record} = _this.state;
        const column = [
            {
                title: "数据",
                width: 80,
                dataIndex: "k",
                key: "k",
                fixed: "left",
                className: 'data-cls ',
                exportHidden: true, //是否在导出中隐藏此列
                render: (text, record, index) => {

                    //列注释的右键菜单
                    const menu = (
                        <Menu onClick={e => this.onRelevance(record, e.key)}>
                            <Item key='code'>模态弹出</Item>
                            <Item key='year'>链接跳转</Item>
                            <Item key='name'>打开新页</Item>
                        </Menu>
                    );
                    return (
                        <div>
                            <Dropdown
                                trigger={['click']}
                                overlay={menu}
                                animation="slide-up"
                            >
                                <Icon type="uf-link" style={{"color": "#004898"}}/>
                            </Dropdown>
                        </div>
                    )
                }
            },
            {
                title: "员工编号",
                dataIndex: "code",
                key: "code",
                width: 160,
            },
            {
                title: "员工姓名",
                dataIndex: "name",
                key: "name",
                width: 120,
                filterType: "text",
                filterDropdownType: "string",
                filterDropdown: "show",
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                            <span>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: "员工性别",
                dataIndex: "sex",
                key: "sex",
                exportKey: 'sexEnumValue',
                width: 120,
                filterType: "dropdown",
                // filterDropdown: "true", //条件的下拉是否显示（string，number）
                filterDropdownAuto: "manual", //是否自动和手动设置 filterDropdownData 属性
                filterDropdownData: [{key: "男", value: "1"}, {key: "女", value: "0"}],
                render: (text, record, index) => {
                    return (<span>{record.sexEnumValue}</span>)
                }

            },
            {
                title: "部门",
                dataIndex: "dept",
                key: "dept",
                exportKey: "deptName",
                width: 150,
                filterType: "dropdown",
                filterDropdown: "hide",
                filterDropdownAuto: "manual",
                filterDropdownData: this.props.colFilterSelectdept,
                filterDropdownFocus: () => { //组件焦点的回调函数
                    let param = {
                        distinctParams: ['dept']
                    }
                    actions.query.getListByCol(param); //获取所有部门
                },
                render: (text, record, index) => {
                    return (<span>{record.deptName}</span>)
                }
            },
            {
                title: "职级",
                dataIndex: "levelName",
                key: "levelName",
                width: 120,
            },
            {
                title: "工龄",
                dataIndex: "serviceYears",
                key: "serviceYears",
                width: 180,
                filterType: "number",//输入框类型
                filterDropdownType: "number",//数值类条件
                className: 'column-number-right ', // 靠右对齐
                filterInputNumberOptions: {
                    max: 100,
                    min: 0,
                    step: 1,
                    precision: 0
                },
                sorter: (a, b) => a.serviceYears - b.serviceYears,
            },
            {
                title: "司龄",
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                width: 130,
                className: 'column-number-right ', // 靠右对齐
                sorter: (a, b) => a.serviceYearsCompany - b.serviceYearsCompany
            },
            {
                title: "年份",
                dataIndex: "year",
                key: "year",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return <div>{text ? text : ""}</div>
                }
            },
            {
                title: "月份",
                dataIndex: "monthEnumValue",
                key: "monthEnumValue",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
                sorter: (a, b) => a.month - b.month,
            },
            {
                title: "补贴类别",
                dataIndex: "allowanceTypeEnumValue",
                key: "allowanceTypeEnumValue",
                width: 120,
            },
            {
                title: "补贴标准",
                dataIndex: "allowanceStandard",
                key: "allowanceStandard",
                width: 120,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return (<span>{(typeof text)==='number'? text.toFixed(2):""}</span>)
                }

            },
            {
                title: "实际补贴",
                dataIndex: "allowanceActual",
                key: "allowanceActual",
                width: 120,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return (<span>{(typeof text)==='number'? text.toFixed(2):""}</span>)
                }

            },
            {
                title: "是否超标",
                dataIndex: "exdeedsEnumValue",
                key: "exdeedsEnumValue",
                width: 120,
            },
            {
                title: "申请时间",
                dataIndex: "applyTime",
                key: "applyTime",
                width: 300,
                filterDropdown: "hide", //条件的下拉是否显示
                filterType: "daterange",//输入框类型
                filterDropdownType: "daterange",//数值类条件
                render: (text, record, index) => {
                    return <div>{text}</div>

                }
            },
            {
                title: "领取方式",
                dataIndex: "pickTypeEnumValue",
                key: "pickTypeEnumValue",
                width: 120,
            },
            {
                title: "领取时间",
                dataIndex: "pickTime",
                key: "pickTime",
                width: 150,
                render: (text, record, index) => {
                    return <div>{text}</div>
                }
            },
            {
                title: "备注",
                dataIndex: "remark",
                key: "remark",
                width: 100,
            }
        ];

        // 分页数据获取
        const {pageIndex, total, totalPages} = queryObj;
        const paginationObj = {   // 分页
            activePage: pageIndex,//当前页
            total,//总条数
            items: totalPages,
            freshData: _this.freshData,
            onDataNumSelect: _this.onDataNumSelect,
        }

        //排序属性设置
        const sortObj = {  
            mode: 'multiple',
            backSource: false,
            sortFun: _this.sortFun
        }

        return (
            <div className='single-table-query'>
                {/* 加载进度条 */}
                <Loading showBackDrop={true} loadingType="line" show={showLoading} fullScreen={true}/>
                {/* 页面头部 */}
                <Header title='A1单表查询示例'/>
                <SearchArea
                    queryParam={queryParam}
                    clearRowFilter={this.clearRowFilter}
                    onCallback={this.resetTableHeight}
                />
                {/* 表格区域 */}
                <div className="gird-parent">
                    <Grid
                        ref={(el) => this.grid = el} //存模版
                        columns={column}
                        data={queryObj.list}
                        rowKey={(r, i) => i} //生成行的key
                        paginationObj={paginationObj} //分页
                        multiSelect={false}  //false 单选，默认多选
                        showFilterMenu={true} //是否显示行过滤菜单
                        filterable={filterable}//是否开启过滤数据功能
                        onFilterChange={_this.onFilterChange}  // 触发过滤输入操作以及下拉条件的回调
                        onFilterClear={_this.onFilterClear} //清除过滤条件的回调函数，回调参数为清空的字段
                        afterRowFilter={_this.afterRowFilter} //控制栏位的显示/隐藏
                        sort={sortObj} //排序属性设置

                        // scroll={{y: 400}}
                        sheetHeader={{height: 30, ifshow: false}} //设置excel导出的表头的样式、支持height、ifshow
                    />
                </div>
                <PopDialog
                    // showModal控制模态框的开启关闭
                    show={this.state.showModal}
                    title={"模态弹出"}
                    // 点击关闭按钮触发的事件
                    close={this.close}
                    // 模态框底部是否显示确定、取消按钮
                    btns={[]}
                >
                    <div>
                        <span>员工编号：</span>
                        <span>{record.code}</span>
                    </div>
                    <div>
                        <span>员工姓名：</span>
                        <span>{record.name}</span>
                    </div>
                    <div>
                        <span>员工性别：</span>
                        <span>{record.sexEnumValue}</span>
                    </div>
                    <div>
                        <span>职级：</span>
                        <span>{record.levelName}</span>
                    </div>
                </PopDialog>

            </div>


        )
    }
}

export default Query;
