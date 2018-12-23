import React, {Component} from 'react'
import {actions} from 'mirrorx';
import {Tabs, Loading} from 'tinper-bee';
import Grid from 'components/Grid';
import Header from 'components/Header';
import Button from 'components/Button';
import Alert from 'components/Alert';
import moment from 'moment';
import ButtonRoleGroup from 'components/ButtonRoleGroup';
import AcAttachment from 'ac-attachment';

import SearchArea from '../SearchArea/index';
import Passenger from '../PassengerModal/index';
// import Emergency from '../EmergencyModal/index';
// import Traveling from '../BookModal/index';


import {deepClone, Warning, getPageParam} from "utils";

import 'bee-complex-grid/build/Grid.css';
import 'bee-pagination/build/Pagination.css'
import 'ac-attachment/dist/ac-attachment.css';
import './index.less'

const {TabPane} = Tabs;
const format = "YYYY-MM-DD";

class Many extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, // 添加、编辑、详情 弹框
            flag: -1, //按钮状态
        }
    }

    componentDidMount() {
        // 分页参数
        const param = {pageIndex: 0, pageSize: 5};
        // 调用model.js中的loadList请求grid数据
        actions.many.loadList(param);//table数据
    }

    // 定义主表的column
    passengerColumn = [
        {
            title: "乘客编号",
            dataIndex: "code",
            key: "code",
            // fixed: "left",
            width: 180,
        },
        {
            title: "乘客姓名",
            dataIndex: "name",
            key: "name",
            width: 120,
        },
        {
            title: "乘客性别",
            dataIndex: "sexEnumValue",
            key: "sexEnumValue",
            width: 120,

        },
        {
            title: "所属部门",
            dataIndex: "deptName",
            key: "deptName",
            width: 120,
        },
        {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
            width: 120,
        },
        {
            title: "是否会员",
            dataIndex: "isVip",
            key: "isVip",
            width: 120,
            render(text, record, index) {
                return text ? "是" : "否";
            }

        },
        {
            title: "会员等级",
            dataIndex: "gradeEnumValue",
            key: "gradeEnumValue",
            width: 120,
        },
        {
            title: "会员到期日期",
            dataIndex: "expirationDate",
            key: "expirationDate",
            render: (text, record, index) => {
                return <div>
                    {text ? moment(text).format(format) : ""}
                </div>
            }

        }
    ];

    /**
     *
     * @param {Object} data 组装分页参数
     */
    getBasicPage = (data) => {
        const {pageIndex, total, totalPages} = data;
        return {   // 分页
            activePage: pageIndex,//当前页
            total: total,//总条数
            items: totalPages,
            dataNum: 1, //默认数组第一个值
        };
    }

    /**
     *
     * @param {Number} pageIndex 当前分页值 第几条
     * @param {string} tableObj 分页 table 名称
     */
    freshData = (pageIndex, tableObj) => {
        this.onPageSelect(pageIndex, 0, tableObj);
    }

    /**
     *
     * @param {number} pageIndex 当前分页值 第几条
     * @param {number} value 分页条数
     * @param {string} tableObj 分页table名称
     */
    onDataNumSelect = (pageIndex, value, tableObj) => {
        this.onPageSelect(value, 1, tableObj);
    }

    /**
     *
     *
     * @param {number} value  pageIndex 或者 pageSize值
     * @param {string} type  type为0标识为 pageIndex,为1标识 pageSize,
     * @param {string} tableName 分页table名称
     */
    onPageSelect = (value, type, tableName) => {
        let searchParam = deepClone(this.props.searchParam);
        let modalObj = this.props[tableName];

        let {pageIndex, pageSize} = getPageParam(value, type, modalObj);

        if (tableName === "passengerObj") { //主表分页
            searchParam.pageSize = pageSize;
            searchParam.pageIndex = pageIndex;
            actions.many.loadList(searchParam);
        } 
        actions.many.updateState({searchParam});
    }

    /**
     * @description 打开模态框
     * @param {string} type 当前选中的table选项值为主表或子表
     * @param {number} status 状态 0 添加，1 编辑 2. 详情
     */
    onShowModal = (type, status) => {
        this.setState({
            modalVisible: true,
            flag: status,
            checkTable: type,
        });

    }

    /**
     *
     * 关闭弹框 view update modal
     * @param {Boolean} isSave 判断是否添加或者更新
     * */
    onCloseModal = (isSave = false) => {
        this.setState({modalVisible: false, flag: -1});
        if ((typeof isSave) === 'boolean') {
            this.child.reset();
        }

    }

    // 为自组件定义ref属性,供父组件调用子组件方法
    onRef = (ref) => {
        this.child = ref;
    }


    render() {

        const _this = this;
        // 从model.js中传入的属性passengerObj获取数据
        const { passengerObj, passengerIndex } = this.props;
        const {
            modalVisible, flag, checkTable,
        } = this.state;
        return (
            <div className='master-detail-many' >
               <Header title='B3 一主多子示例'/>
               <SearchArea passengerObj={passengerObj} onRef = {_this.onRef}/>
               <div className='table-header'>
                    <Button iconType="uf-plus" className="ml8"
                        role="add"
                        onClick={() => this.onShowModal('passenger', 0)}
                    >新增</Button>
                    <Button iconType="uf-pencil" className="ml8"
                        role="update"
                        onClick={() => _this.onShowModal("passenger", 1)}
                    >修改</Button>
                    {/* <Button iconType="uf-list-s-o" className="ml8"
                        onClick={() => _this.onShowModal("passenger", 2)}
                    >详情</Button>
                    <Button iconType="uf-del" className="ml8"
                        role="delete"
                        onClick={() => _this.onClickDel("passenger")}
                    >删除</Button>
                    <Button iconType="uf-export" className="ml8"
                            onClick={() => _this.export("passenger")}
                    >导出</Button>
                    <Button iconType="uf-print" className="ml8"
                        onClick={_this.onPrint}
                    >
                        打印
                    </Button> */}
                </div>
               <Grid
                    ref="passenger"
                    data={passengerObj.list}
                    rowKey={(r, i) => i}
                    columns={_this.passengerColumn}
                    showHeaderMenu={true}
                    draggable={true}
                    multiSelect={false}
                    onRowClick={(record, index) => {
                        actions.many.updateState({passengerIndex: index});
                        // 根据tab 页来获取子表数据
                        const {passengerObj, travelingObj, emergencyObj, tabKey, searchParam} = this.props;
                        const {search_contactName} = searchParam;
                        const {list} = passengerObj;
                        const {id: search_passengerId} = list[index];
                        let param = {pageIndex: 0, search_passengerId, search_contactName};
                        /* if (tabKey === "emergency") { // tab为emergency 获取emergency子表数据
                            param.pageSize = emergencyObj.pageSize;
                            actions.many.loadEmergencyList(param)
                        }
                        if (tabKey === "traveling") { // tab为travling 获取travling子表数据
                            param.pageSize = travelingObj.pageSize;
                            actions.many.loadTravelingList(param)
                        } */
                    }}
                    rowClassName={(record, index, indent) => { //判断是否选中当前行
                        return passengerIndex === index ? "selected" : "";
                    }}
                    paginationObj={{
                        ...this.getBasicPage(passengerObj),
                        freshData: (pageSize) => {
                            _this.freshData(pageSize, "passengerObj");
                        },
                        onDataNumSelect: (index, value) => {
                            _this.onDataNumSelect(index, value, "passengerObj");
                        },
                        dataNum: 0,
                    }}
                />

                {/*添加乘客乘客信息modal*/}
                <Passenger
                    passengerObj={passengerObj}
                    // 1.少写变量modalVisible， 2.减少bug 永远只有一个弹框
                    modalVisible={modalVisible && checkTable === "passenger" && flag !== -1}
                    // flag表明打开的页面是新增还是修改页面
                    btnFlag={flag}
                    // 关闭模态框事件
                    onCloseModal={this.onCloseModal}
                    // 当前表格选中行的索引，弹出修改模态框时使用
                    currentIndex={passengerIndex}
                    checkTable={checkTable}
                />
            </div>
        )
    }
}

export default Many;
