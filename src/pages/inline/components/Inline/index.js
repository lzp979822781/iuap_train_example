/**
 * 行内编辑示例
 */

//React组件
import React, { Component } from 'react';
//状态管理
import { actions } from 'mirrorx';
//Tinper-bee 组件库
import { Loading, Message } from 'tinper-bee';
//日期处理
import moment from 'moment';

//工具类
import { uuid, deepClone, getPageParam } from "utils";

//Grid组件
import Grid from 'components/Grid';
//布局类组件
import Header from 'components/Header';
//项目级按钮
import Button from 'components/Button';

//行编辑组件工厂
import FactoryComp from './FactoryComp';

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
     * @memberof Inline
     */
    componentDidMount() {
        //生命周期加载数据
        actions.inline.loadList(this.props.queryParam);//初始化Grid数据
    }

    //缓存数据
    oldData = [];

    //定义Grid的Column
    column = [
        {
            title: "员工编号",
            dataIndex: "code",
            key: "code",
            width: 150
        },
        {
            title: "员工姓名",
            dataIndex: "name",
            key: "name",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='name'//姓名业务组件类型
                    value={text}//初始化值
                    field='name'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "员工性别",
            dataIndex: "sexEnumValue",
            key: "sexEnumValue",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='sex'//性别业务组件类型
                    value={record.sex}//初始化值
                    field='sex'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "所属部门",
            dataIndex: "deptName",
            key: "deptName",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='dept'//性别业务组件类型
                    field='dept'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "职级",
            dataIndex: "levelName",
            key: "levelName",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='level'//性别业务组件类型
                    field='postLevel'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "工龄",
            dataIndex: "serviceYears",
            key: "serviceYears",
            width: 130,
            render: (text, record, index) => {
                return <FactoryComp
                    type='serviceYears'//姓名业务组件类型
                    value={text}//初始化值
                    field='serviceYears'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "司龄",
            dataIndex: "serviceYearsCompany",
            key: "serviceYearsCompany",
            width: 130,
            render: (text, record, index) => {
                return <FactoryComp
                    type='serviceYearsCompany'//姓名业务组件类型
                    value={text}//初始化值
                    field='serviceYearsCompany'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "年份",
            dataIndex: "year",
            key: "year",
            width: 100,
            render: (text, record, index) => {
                return <FactoryComp
                    type='year'//姓名业务组件类型
                    value={text}//初始化值
                    field='year'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "月份",
            dataIndex: "monthEnumValue",
            key: "monthEnumValue",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='month'//性别业务组件类型
                    value={record.month}//初始化值
                    field='month'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "补贴类别",
            dataIndex: "allowanceTypeEnumValue",
            key: "allowanceTypeEnumValue",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='allowanceType'//性别业务组件类型
                    value={record.allowanceType}//初始化值
                    field='allowanceType'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "补贴标准",
            dataIndex: "allowanceStandard",
            key: "allowanceStandard",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='allowanceStandard'//姓名业务组件类型
                    value={text}//初始化值
                    field='allowanceStandard'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "实际补贴",
            dataIndex: "allowanceActual",
            key: "allowanceActual",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='allowanceActual'//姓名业务组件类型
                    value={text}//初始化值
                    field='allowanceActual'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "是否超标",
            dataIndex: "exdeedsEnumValue",
            key: "exdeedsEnumValue",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='exdeeds'//姓名业务组件类型
                    value={record.exdeeds}//初始化值
                    field='exdeeds'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "申请时间",
            dataIndex: "applyTime",
            key: "applyTime",
            width: 200,
            render: (text, record, index) => {
                if (text !== "" && (typeof text !== 'undefined')) {
                    return <div>{moment(text).format('YYYY-MM-DD hh:mm:ss')}</div>
                } else {
                    return <div></div>
                }
            }
        },
        {
            title: "领取方式",
            dataIndex: "pickTypeEnumValue",
            key: "pickTypeEnumValue",
            width: 120,
            render: (text, record, index) => {
                return <FactoryComp
                    type='pickType'//姓名业务组件类型
                    value={record.pickType}//初始化值
                    field='pickType'//修改的字段
                    index={index}//字段的行号
                    required={true}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        },
        {
            title: "领取时间",
            dataIndex: "pickTime",
            key: "pickTime",
            width: 200,
            render: (text, record, index) => {
                if (text !== "" && (typeof text !== 'undefined')) {
                    return <div>{moment(text).format('YYYY-MM-DD hh:mm:ss')}</div>
                } else {
                    return <div></div>
                }
            }
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            width: 100,
            render: (text, record, index) => {
                return <FactoryComp
                    type='remark'//姓名业务组件类型
                    value={text}//初始化值
                    field='remark'//修改的字段
                    index={index}//字段的行号
                    required={false}//必输项
                    record={record}//记录集用于多字段处理
                    onChange={this.changeAllData}//回调函数
                    onValidate={this.onValidate}//校验的回调
                />
            }
        }
    ];

    /**
     * 同步修改后的数据不操作State
     *
     * @param {string} field 字段
     * @param {any} value 值
     * @param {number} index 位置
     */
    changeAllData = (field, value, index) => {
        let oldData = this.oldData;
        let _sourseData = deepClone(this.props.list);
        oldData[index][field] = value;
        //有字段修改后去同步左侧对号checkbox
        if (_sourseData[index]['_checked'] != true) {
            _sourseData[index]['_checked'] = true;
            actions.inline.updateState({ list: _sourseData });
        }
        oldData[index]['_checked'] = true;
        this.oldData = oldData;
    }

    /**
     * 处理验证后的状态
     *
     * @param {string} field 校验字段
     * @param {objet} flag 是否有错误
     * @param {number} index 位置
     */
    onValidate = (field, flag, index) => {
        //只要是修改过就启用校验
        if (this.oldData.length != 0) {
            this.oldData[index][`_${field}Validate`] = (flag == null);
        }

    }

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
        let { list, showLoading, pageIndex, totalPages, total } = _this.props;
        //分页条数据
        const paginationObj = {
            activePage: pageIndex,//当前页
            total: total,//总条数
            items: totalPages,
            freshData: _this.freshData,//刷新数据
            onDataNumSelect: _this.onDataNumSelect,//选择记录行
        }

        return (
            <div className='inline'>
                <Header title='单表行内编辑' />
                <div className='table-header'>
                    <Button
                        iconType="uf-plus"
                        className="ml8"
                    >
                        新增
                        </Button>
                    <Button
                        iconType="uf-pencil"
                        className="ml8"
                    >
                        修改
                        </Button>
                    <Button
                        iconType="uf-del"
                        className="ml8"
                    >
                        删除
                          </Button>
                    <Button
                        iconType="uf-table"
                        className="ml8"
                    >
                        下载模板
                     </Button>
                    <Button
                        iconType="uf-import"
                        className="ml8"
                    >
                        导入
                    </Button>
                    <Button
                        iconType="uf-export"
                        className="ml8"
                    >
                        导出
                     </Button>
                    <Button
                        iconType="uf-save"
                        className="ml8"
                        onClick={this.onClickSave}
                    >
                        保存
                    </Button>
                    <Button
                        iconType="uf-back"
                        className="ml8"
                    >
                        取消
                    </Button>

                </div>
                <div className='grid-parent'>
                    <Grid
                        ref={(el) => this.grid = el}//ref用于调用内部方法
                        rowKey={r => r.id ? r.id : r.key}//表格内使用的唯一key用于性能优化
                        columns={this.column}//定义列数据
                        paginationObj={paginationObj}//分页数据
                        data={list}//数据
                    />
                </div>
                <Loading fullScreen={true} show={showLoading} loadingType="line" />
            </div>
        )
    }
}

export default Inline;
