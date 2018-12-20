/**
 * 行内编辑示例
 */

//React组件
import React, { Component } from 'react';
//状态管理
import { actions } from 'mirrorx';
//Tinper-bee 组件库
import { Loading, Message } from 'tinper-bee';

//工具类
import { deepClone, getPageParam } from "utils";

//Grid组件
import Grid from 'components/Grid';
//布局类组件
import Header from 'components/Header';

//组件样式引用
import 'bee-complex-grid/build/Grid.css';
import 'bee-table/build/Table.css';
import 'bee-pagination/build/Pagination.css';
import './index.less';

class Inline extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    /**
     * 渲染后执行的函数
     *
     * @memberof InlineEdit
     */
    componentDidMount() {
        //生命周期加载数据
        actions.inline.loadList(this.props.queryParam);//初始化Grid数据
    }

    //定义Grid的Column
    column = [
        {
            title: "员工编号",//列标题
            dataIndex: "code",//显示记录字段
            key: "code",//唯一值字段一般和dataIndex相同
            width: 150,//列的宽度
            render: (text, record, index) => {//自定义列内的数据
                return <div>自定义编码 {index}</div>
            }
        },
        {
            title: "员工姓名",
            dataIndex: "name",
            key: "name",
            width: 120
        },
        {
            title: "员工性别",
            dataIndex: "sexEnumValue",
            key: "sexEnumValue",
            width: 120
        },
        {
            title: "所属部门",
            dataIndex: "deptName",
            key: "deptName",
            width: 120
        },
        {
            title: "职级",
            dataIndex: "levelName",
            key: "levelName",
            width: 120
        },
        {
            title: "工龄",
            dataIndex: "serviceYears",
            key: "serviceYears",
            width: 130
        },
        {
            title: "司龄",
            dataIndex: "serviceYearsCompany",
            key: "serviceYearsCompany",
            width: 130
        },
        {
            title: "年份",
            dataIndex: "year",
            key: "year",
            width: 100
        },
        {
            title: "月份",
            dataIndex: "monthEnumValue",
            key: "monthEnumValue",
            width: 120
        },
        {
            title: "补贴类别",
            dataIndex: "allowanceTypeEnumValue",
            key: "allowanceTypeEnumValue",
            width: 120
        },
        {
            title: "补贴标准",
            dataIndex: "allowanceStandard",
            key: "allowanceStandard",
            width: 120
        },
        {
            title: "实际补贴",
            dataIndex: "allowanceActual",
            key: "allowanceActual",
            width: 120
        },
        {
            title: "是否超标",
            dataIndex: "exdeedsEnumValue",
            key: "exdeedsEnumValue",
            width: 120
        },
        {
            title: "申请时间",
            dataIndex: "applyTime",
            key: "applyTime",
            width: 200
        },
        {
            title: "领取方式",
            dataIndex: "pickTypeEnumValue",
            key: "pickTypeEnumValue",
            width: 120
        },
        {
            title: "领取时间",
            dataIndex: "pickTime",
            key: "pickTime",
            width: 200
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            width: 100
        }
    ];

    /**
     * 跳转指定页码
     *
     * @param {*} pageIndex
     */
    freshData = (pageIndex) => {
        this.onPageSelect(pageIndex, 0);
    }

    /**
     * 分页  跳转指定页数和设置一页数据条数
     *
     * @param {*} index
     * @param {*} value
     */
    onDataNumSelect = (index, value) => {
        this.onPageSelect(value, 1);
    }

    /**
     * type为0标识为pageIndex,为1标识pageSize
     *
     * @param {*} value
     * @param {*} type
     */
    onPageSelect = (value, type) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从action里
        const { pageIndex, pageSize } = getPageParam(value, type, queryParam.pageParams);
        queryParam['pageParams'] = { pageIndex, pageSize };
        actions.inline.updateState(queryParam); // 更新action queryParam
        actions.inline.loadList(queryParam);
    }

    render() {
        const _this = this;
        let { list, showLoading, pageIndex, pageSize, totalPages, total, status, rowEditStatus, queryParam } = _this.props;
        //分页条数据
        const paginationObj = {
            activePage: pageIndex,//当前页
            total: total,//总条数
            items: totalPages,
            freshData: _this.freshData,//刷新数据
            onDataNumSelect: _this.onDataNumSelect,//选择记录行
            disabled: status !== "view"//分页条禁用状态
        }
        return (
            <div className='inline'>
                <Header title='单表行内编辑' />
                <div className='grid-parent'>
                    <Grid
                        ref={(el) => this.grid = el}//ref用于调用内部方法
                        data={list}//数据
                        rowKey={r => r.id ? r.id : r.key}
                        columns={this.column}//定义列数据
                        paginationObj={paginationObj}//分页数据
                    />
                </div>
                <Loading fullScreen={true} show={showLoading} loadingType="line" />
            </div>
        )
    }
}

export default Inline;
