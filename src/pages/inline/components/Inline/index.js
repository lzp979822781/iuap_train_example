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



    render() {

        return (
            <div>
                行内编辑节点
            </div>
        )
    }
}

export default Inline;
