import React, {Component} from 'react'
import {actions} from 'mirrorx';
import Grid from 'components/Grid';
import Header from 'components/Header';
import moment from 'moment';

import 'bee-complex-grid/build/Grid.css';
import 'bee-pagination/build/Pagination.css'
import 'ac-attachment/dist/ac-attachment.css';
import './index.less'

const format = "YYYY-MM-DD";

class Many extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const param = {pageIndex: 0, pageSize: 5};
        actions.many.loadList(param);//table数据
    }

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


    render() {

        const _this = this;
        const { passengerObj } = this.props;
        
        return (
            <div className='master-detail-many' >
               <Header title='B3 一主多子示例'/>
               <Grid
                    ref="passenger"
                    data={passengerObj.list}
                    rowKey={(r, i) => i}
                    columns={_this.passengerColumn}

                    getSelectedDataFunc={this.getSelectedDataFunc}
                    showHeaderMenu={true}
                    draggable={true}
                    multiSelect={false}
                    /* onRowClick={(record, index) => {
                        actions.masterDetailMany.updateState({passengerIndex: index});
                        // 根据tab 页来获取子表数据
                        const {passengerObj, travelingObj, emergencyObj, tabKey, searchParam} = this.props;
                        const {search_contactName} = searchParam;
                        const {list} = passengerObj;
                        const {id: search_passengerId} = list[index];
                        let param = {pageIndex: 0, search_passengerId, search_contactName};
                        if (tabKey === "emergency") { // tab为emergency 获取emergency子表数据
                            param.pageSize = emergencyObj.pageSize;
                            actions.masterDetailMany.loadEmergencyList(param)
                        }
                        if (tabKey === "traveling") { // tab为travling 获取travling子表数据
                            param.pageSize = travelingObj.pageSize;
                            actions.masterDetailMany.loadTravelingList(param)
                        }
                    }} */
                    /* rowClassName={(record, index, indent) => { //判断是否选中当前行
                        return passengerIndex === index ? "selected" : "";
                    }} */
                    
                />
            </div>
        )
    }
}

export default Many;
