import React, {Component} from 'react';
// 第三方框架，主要用作调用数据模型层状态及函数
import {actions} from 'mirrorx';
// 日期处理第三方js
import moment from 'moment';
// grid中引入的组件
import {Tooltip, Dropdown, Menu, Icon} from 'tinper-bee';
import Grid from 'components/Grid';
// 页面head
import Header from 'components/Header';

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

        }
    }

    componentDidMount() {
        actions.query.loadList(this.props.queryParam); // 查询默认条件
    }

    render() {
        const _this = this;
        const {queryObj} = _this.props;
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
                        <Menu>
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

            },
            {
                title: "司龄",
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                width: 130,
                className: 'column-number-right ', // 靠右对齐
            },
            {
                title: "年份",
                dataIndex: "year",
                key: "year",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return <div>{text ? moment(text).format("YYYY") : ""}</div>
                }
            },
            {
                title: "月份",
                dataIndex: "monthEnumValue",
                key: "monthEnumValue",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
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
                render: (text, record, index) => {
                    return <div>{text ? moment(text).format(format) : ""}</div>

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
                    return <div>{text ? moment(text).format(format) : ""}</div>
                }
            },
            {
                title: "备注",
                dataIndex: "remark",
                key: "remark",
                width: 100,
            }
        ];

        return (
            <div className='single-table-query'>
                {/* 页面头部 */}
                <Header title='A1单表查询示例'/>
                {/* 表格区域 */}
                <div className="gird-parent">
                    <Grid
                        ref={(el) => this.grid = el} //存模版
                        columns={column}
                        data={queryObj.list}
                        rowKey={(r, i) => i} //生成行的key
                        // paginationObj={paginationObj} //分页
                        multiSelect={false}  //false 单选，默认多选
                        // showFilterMenu={true} //是否显示行过滤菜单
                        // filterable={filterable}//是否开启过滤数据功能
                        // onFilterChange={_this.onFilterChange}  // 触发过滤输入操作以及下拉条件的回调
                        // onFilterClear={_this.onFilterClear} //清除过滤条件的回调函数，回调参数为清空的字段
                        // afterRowFilter={_this.afterRowFilter} //控制栏位的显示/隐藏
                        // sort={sortObj} //排序属性设置

                        scroll={{y: 400}}
                        sheetHeader={{height: 30, ifshow: false}} //设置excel导出的表头的样式、支持height、ifshow
                    />
                </div>
            </div>
        )
    }
}

export default Query;
