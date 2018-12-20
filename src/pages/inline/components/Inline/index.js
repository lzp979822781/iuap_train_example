/**
 * 行内编辑示例
 */

//React组件
import React, { Component } from 'react';
//状态管理
import { actions } from 'mirrorx';

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

    componentDidMount() {

    }
    //定义Grid的Column
    column = [
        {
            title: "员工编号",
            dataIndex: "code",
            key: "code",
            width: 150,
            render: (text, record, index) => {
                return <div>自定义数据列 {index}</div>
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
        }
    ];

    render() {

        return (
            <div>
                标准节点
            </div>
        )
    }
}

export default Inline;
