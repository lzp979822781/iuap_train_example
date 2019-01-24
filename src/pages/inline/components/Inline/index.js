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
import { uuid, deepClone, success, Error, Info, getPageParam, getButtonStatus, getHeight } from "utils";

//Grid组件
import Grid from 'components/Grid';
//布局类组件
import Header from 'components/Header';
//项目级按钮
import Button from 'components/Button';
//项目级提示框
import Alert from 'components/Alert';
//按钮权限组件
import ButtonRoleGroup from 'components/ButtonRoleGroup';

//搜索区组件
import SearchAreaForm from '../SearchArea';
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
            tableHeight: 0,
            showPop: false,
            showPopCancel: false,
        }
    }

    componentWillMount() {
        //计算表格滚动条高度
        this.resetTableHeight(true);
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
        //只要是修改过就启用校验,flag为错误信息数组
        if (this.oldData.length != 0) {
            this.oldData[index][`_${field}Validate`] = (flag == null);
        }

    }

    /**
     * 点击多选框回调函数
     *
     * @param {object} selectData 选择的数据
     * @param {object} record 当前行数据，空为点击全选
     * @param {number} index 当前索引
     */
    getSelectedDataFunc = (selectData, record, index) => {
        let { list } = this.props;
        let _list = deepClone(list);
        //当第一次没有同步数据
        //同步list数据状态
        if (index != undefined) {
            _list[index]['_checked'] = !_list[index]['_checked'];
        } else {//点击了全选
            if (selectData.length > 0) {//全选
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = true
                    }
                });
            } else {//反选
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = false
                    }
                });
            }
        }
        actions.inline.updateState({ selectData, list: _list });
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
    /**
     * 新增行数据
     */
    handlerNew = () => {
        let newData = deepClone(this.props.list);//克隆原始数据
        newData = newData.filter(item => !item._isNew);//去除新增字段
        //这里是新增后的新数据模板，用于默认值
        let tmp = {
            key: uuid(),
            _edit: true,
            _isNew: true,
            _checked: false,
            _disabled: false,
            _flag: false,
            code: '',
            name: '',
            sex: '',
            sexEnumValue: '',
            deptName: '',
            levelName: '',
            serviceYears: 0,
            serviceYearsCompany: 0,
            year: moment().format('YYYY'),
            month: '',
            monthEnumValue: '',
            allowanceType: '',
            allowanceTypeEnumValue: '',
            allowanceStandard: 0,
            allowanceActual: 0,
            exdeeds: '',
            exdeedsEnumValue: '',
            // applyTime: moment(),
            pickType: '',
            pickTypeEnumValue: '',
            // pickTime: moment(),
            remark: ''
        }
        this.oldData.unshift(tmp);//插入到最前
        //禁用其他checked
        for (let i = 0; i < newData.length; i++) {
            newData[i]['_disabled'] = true;
            newData[i]['_checked'] = false;
            newData[i]['_status'] = 'new';
        }

        //重置操作栏位
        this.grid.resetColumns(this.column);
        //同步状态数据
        //保存处理后的数据，并且切换操作态'新增'
        actions.inline.updateState({ list: this.oldData.concat(newData), status: "new", rowEditStatus: false, selectData: [] });
    }

    /**
     * 修改
     */
    onClickUpdate = () => {
        let editData = [...this.props.list];
        //当前行数据设置编辑态
        for (let i = 0; i < editData.length; i++) {
            editData[i]['_edit'] = true;
            editData[i]['_checked'] = false;
            editData[i]['_status'] = 'edit';
        }
        //重置操作栏位
        this.grid.resetColumns(this.column);
        //同步操作数据
        this.oldData = deepClone(editData);
        //保存处理后的数据，并且切换操作态'编辑'
        actions.inline.updateState({ list: editData, status: "edit", rowEditStatus: false });
    }

    /**
     * 删除询问Pop
     *
     */
    onClickDelConfirm = () => {
        let { selectData } = this.props;
        if (selectData.length > 0) {
            this.setState({
                showPop: true
            });
        } else {
            Info('请勾选数据后再删除');
        }
    }
    /**
     * 取消
     */
    onClickPopCancel = () => {
        this.setState({
            showPop: false
        });
    }
    /**
     * 删除
     */
    onClickDel = async () => {
        let { selectData } = this.props;
        let delResult = await actions.inline.removes(selectData);
        if (delResult) {
            success('删除成功');
            this.oldData = [];
        } else {
            Error('删除失败');
        }
        this.setState({
            showPop: false
        });
    }

    /**
     * 根据key关联对应数据后校验
     * @description 将列表中新增选中的数据中_validate字段设为true开启校验，返回添加_validate字段后列表数据
     * @param {array} data 要关联数据、新增数据中选中的数据
     * @param {array} list 被关联数据、列表所有数据
     * @returns
     */
    filterListKey = (data, list) => {
        let _list = list.slice();
        data.forEach((_data, _index) => {
            _list.forEach((item, i) => {
                if (_data['key'] == item['key']) {
                    _list[i]['_validate'] = true;
                }
            });
        });
        return _list;
    }
    /**
     * 根据id关联对应数据后校验
     *
     * @param {array} data 要关联数据
     * @param {array} list 被关联数据
     * @returns {array}
     */
    filterListId = (data, list) => {
        let _list = list.slice();
        data.forEach((_data, _index) => {
            _list.forEach((item, i) => {
                if (_data['id'] == item['id']) {
                    _list[i]['_validate'] = true;
                }
            });
        });
        return _list;
    }
    /**
     * 验证数据否正确
     *
     * @param {array} data 欲验证的数据
     * @returns {bool}
     */
    isVerifyData = (data) => {
        let flag = true;
        let pattern = /Validate\b/;//校验的正则结尾,检查所有已Validate结尾的字段
        data.forEach((item, index) => {
            let keys = Object.keys(item);
            //如果标准为false直接不参与计算说明已经出现了错误
            if (flag) {
                for (let i = 0; i < keys.length; i++) {
                    if (pattern.test(keys[i])) {
                        // 如果带有Validate字段的值为true空，将flag的值置为false证明校验不通过
                        if (data[index][keys[i]]) {
                            flag = true;
                        } else {
                            flag = false;
                            break;
                        }
                    }
                }
            }
        });
        return flag
    }
    /**
     * 过滤左侧新增数据中check选中后的数据
     *
     * @param {array} data 新增数据
     * @param {array} list 列表数据
     * @returns 选中后的数据
     */
    filterChecked = (data, list) => {
        let result = [];
        data.forEach((_data, _index) => {
            list.forEach((item) => {
                if (_data['key'] == item['key'] && item['_checked']) {
                    result.push(_data);
                }
            });
        });
        return result;
    }
    /**
     * 过滤选择的数据根据ID关联
     *
     * @param {array} data 新增数据
     * @param {array} selected 选择后的数据
     * @returns
     */
    filterSelectedById = (data, selected) => {
        let result = [];
        // data为新增的数据、list为所有数据、筛选新增中选中的数据
        data.forEach((_data, _index) => {
            selected.forEach((item) => {
                if (_data['id'] == item['id'] && item['_checked']) {
                    _data['_checked'] = true;
                    result.push(_data);
                }
            });
        });
        return result;
    }
    /**
     * 过滤表格内的数据与左侧check同步数据根据id
     *
     * @param {array} data 数据
     * @param {array} list 来源数据
     * @returns 关联好的数据
     */
    filterSelectedListById = (data, list) => {
        let result = [];
        data.forEach((_data, _index) => {
            list.forEach((item) => {
                if (_data['id'] == item['id'] && item['_checked']) {
                    _data['_checked'] = true;
                    result.push(_data);
                }
            });
        });
        return result;
    }
    /**
     * 保存
     */
    onClickSave = async () => {
        let { status, list, selectData } = this.props;
        let data = deepClone(this.oldData);
        let _list = list.slice();
        switch (status) {
            case 'new':
                //筛选新增的值
                //筛选打过对号的
                data = this.filterChecked(data, this.props.list);
                //检查校验数据合法性
                //查找对应的key关系来开启验证
                _list = this.filterListKey(data, _list);
                //开始校验actions,_list添加了_validate校验标识
                await actions.inline.updateState({ list: _list });
                // 只要检测到list中的数据含有_validate字段并且为true开启检验
                let newData = this.filterChecked(deepClone(this.oldData), this.props.list);
                //检查是否验证通过
                if (this.isVerifyData(newData)) {
                    // 如果检验通过,做如下逻辑处理，检验失败
                    let vals = this.filterChecked(this.oldData, this.props.list);
                    if (vals.length == 0) {
                        Info('请勾选数据后再新增');
                    } else {
                        let newResult = await actions.inline.adds(vals);
                        if (newResult) {
                            this.oldData = [];
                            success('新增成功');
                        } else {
                            Error('新增失败');
                        }
                    }
                }
                break;
            case 'edit':
                /*  
                    筛选打过对号的,此时的this.oldData保存是设置完编辑状态的列表数据，在编辑事件中设置
                    选中状态字段在selectData字段中保存,需要以this.oldData数据为基础，通过selectData中_checked
                    字段后的一份新数据
                */
                data = this.filterSelectedById(data, selectData);
                //如果没有找到继续从左侧找check数据,兼容操作数据而进行勾选的情况
                data = data.length == 0 ? this.filterSelectedListById(this.oldData, _list) : data;
                //检查校验数据合法性
                //查找对应的id关系来开启验证,通过对比data和_list,将data中的勾选的数据状态_checked为true的数据将data中
                // 相同id数据中的_validate置为true
                _list = this.filterListId(data, _list);
                // 此时更新就会校验
                await actions.inline.updateState({ list: _list });
                //检查是否验证通过
                if (this.isVerifyData(data)) {
                    if (data.length == 0) {
                        Info('请勾选数据后再修改');
                    } else {
                        let editResult = await actions.inline.updates(data);
                        if (editResult) {
                            this.oldData = [];
                            success('修改成功');
                        } else {
                            Error('修改失败');
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
    /**
     * 检查是否可选状态
     *
     */
    hasCheck = () => {
        let { selectData, list } = this.props;
        let flag = false;
        selectData.map(item => {
            if (item._checked == true) {
                flag = true;
            }
        });
        list.map(item => {
            if (item._checked == true) {
                flag = true;
            }
        });
        return flag
    }
    /**
     *  新增或修改给出的确定
     *
     */
    onClickPopUnSaveOK = () => {
        //重置store内的数据
        actions.inline.resetData(true);
        //清空选中的数据
        actions.inline.updateState({ selectData: [], rowEditStatus: true });
        this.setState({ showPopCancel: false });
        this.oldData = [];
    }
    /**
     *  新增或修改给出的取消
     *
     */
    onClickPopUnSaveCancel = () => {
        this.setState({ showPopCancel: false });
    }
    /**
     * 表格内的取消
     */
    onClickCancel = () => {
        //检查是否有修改过的选中
        if (this.hasCheck()) {
            this.setState({ showPopCancel: true });
        } else {
            this.oldData = [];//清空上一次结果
            //重置store内的数据
            actions.inline.resetData(true);
            //清空选中的数据
            actions.inline.updateState({ selectData: [], rowEditStatus: true });
        }
    }

    /**
     * 下载模板
     *
     */
    onClickDownloadTemplate = () => {
        window.open(`${GROBAL_HTTP_CTX}/inline_allowances/excelTemplateDownload`);
    }

    /**
     * 导出数据
     *
     */
    onClickExport = () => {
        this.grid.exportExcel();
    }

    /**
     * 重置表格高度计算回调
     *
     * @param {bool} isopen 是否展开
     */
    resetTableHeight = (isopen) => {
        let tableHeight = 0;
        if (isopen) {
            //展开的时候并且适配对应页面数值px
            tableHeight = getHeight() - 420
        } else {
            //收起的时候并且适配对应页面数值px
            tableHeight = getHeight() - 270
        }
        this.setState({ tableHeight });
    }


    render() {
        const _this = this;
        let { showPop, showPopCancel, tableHeight } = _this.state;
        let { list, showLoading, pageIndex, totalPages, total, rowEditStatus, status, queryParam, pageSize } = _this.props;
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
                <SearchAreaForm
                    queryParam={queryParam}//搜索的查询参数
                    status={status}//当前操作态
                    pageSize={pageSize}//总记录数
                    searchOpen={true}//默认展开
                    onCallback={this.resetTableHeight}//折叠、展开后的回调
                />
                <div className='table-header'>
                    <ButtonRoleGroup
                        funcCode="singletable-inlineEdit"
                    >
                        <Button role="add"
                            iconType="uf-plus"
                            disabled={getButtonStatus('add', status)}
                            className="ml8"
                            onClick={this.handlerNew}
                        >
                            新增
                        </Button>
                        <Button
                            role="update"
                            iconType="uf-pencil"
                            disabled={getButtonStatus('edit', status)}
                            className="ml8" onClick={this.onClickUpdate}
                        >
                            修改
                        </Button>
                        <Button
                            role="delete"
                            iconType="uf-del"
                            disabled={getButtonStatus('del', status)}
                            className="ml8"
                            onClick={this.onClickDelConfirm}
                        >
                            删除
                          </Button>
                        <Alert
                            show={showPop}
                            context="是否要删除 ?"
                            confirmFn={this.onClickDel}
                            cancelFn={this.onClickPopCancel}
                        />
                        <Button
                            iconType="uf-table"
                            disabled={getButtonStatus('down', status)}
                            className="ml8"
                            onClick={this.onClickDownloadTemplate}
                        >
                            下载模板
                     </Button>
                        <Button
                            iconType="uf-import"
                            disabled={getButtonStatus('import', status)}
                            className="ml8"
                        >
                            导入
                    </Button>
                        <Button
                            iconType="uf-export"
                            disabled={getButtonStatus('export', status)}
                            className="ml8"
                            onClick={this.onClickExport}
                        >
                            导出
                     </Button>
                        <Button
                            iconType="uf-save"
                            disabled={getButtonStatus('save', status)}
                            className="ml8"
                            onClick={this.onClickSave}
                        >
                            保存
                    </Button>
                        <Button
                            iconType="uf-back"
                            disabled={getButtonStatus('cancel', status)}
                            className="ml8"
                            onClick={this.onClickCancel}
                        >
                            取消
                    </Button>
                        <Alert
                            show={showPopCancel}
                            context="数据未保存，确定离开 ?"
                            confirmFn={this.onClickPopUnSaveOK}
                            cancelFn={this.onClickPopUnSaveCancel}
                        />
                    </ButtonRoleGroup>
                </div>
                <div className='grid-parent'>
                    <Grid
                        ref={(el) => this.grid = el}//ref用于调用内部方法
                        rowKey={r => r.id ? r.id : r.key}//表格内使用的唯一key用于性能优化
                        columns={this.column}//定义列数据
                        paginationObj={paginationObj}//分页数据
                        data={list}//数据
                        columnFilterAble={rowEditStatus}//是否显示右侧隐藏行
                        showHeaderMenu={rowEditStatus}//是否显示菜单
                        dragborder={rowEditStatus}//是否调整列宽
                        draggable={rowEditStatus}//是否拖拽
                        syncHover={rowEditStatus}//是否同步状态
                        getSelectedDataFunc={this.getSelectedDataFunc}//选择数据后的回调
                        scroll={{ y: tableHeight }}//固定表头
                    />
                </div>
                <Loading fullScreen={true} show={showLoading} loadingType="line" />
            </div>
        )
    }
}

export default Inline;
