import React, {Component} from 'react'
// 调用mirror框架
import {actions} from "mirrorx";
// Col、Row为栅格布局组件、FormControl为输入框组件、Label为标签组件
import {Col, Row, FormControl, Label} from "tinper-bee";
// Form表单容器组件
import Form from 'bee-form';
// 下拉框组件
import Select from 'bee-select';
// 日期组件
import DatePicker from "tinper-bee/lib/Datepicker";
// 数字选择组件
import InputNumber from 'bee-input-number';
// 参照组件
import {RefIuapDept} from 'components/RefViews';
// 导入封装的SearchPanel组件、下拉月份
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';
// deepClone为深度克隆方法、delListObj
import {deepClone, delListObj} from "utils";
import zhCN from "rc-calendar/lib/locale/zh_CN";

import 'bee-datepicker/build/DatePicker.css';
import 'ref-tree/dist/index.css';
import './index.less'

const {FormItem} = Form;
const {Option} = Select;
const format = "YYYY";
const {YearPicker} = DatePicker;


class SearchAreaForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error, values) => {
        // 年份特殊处理
        if (values.year) {
            values.year = values.year.format('YYYY');
        }
        // 参照特殊处理部门参照返回的数据为"{"refname":"煙台華新冷精生產二//科（江陰合金）","refpk":"c8348fc0-d4e1-4954-acff-ebcd894b3ff1"}"
        // 后台存的值为以','分隔的refpk组成的字符串
        const {dept} = values;
        if (dept) {
            const {refpk} = JSON.parse(dept);
            values.dept = refpk;
        }

        let queryParam = deepClone(this.props.queryParam);
        let {pageParams} = queryParam;
        pageParams.pageIndex = 0;
        /* 
         *   getSearchPanel方法删除空的搜索条件，并对特殊字段的查询条件进行了处理
         *   精确查询condition为EQ,大于等于查询为GTEQ
         */
        const arrayNew = this.getSearchPanel(values); //对搜索条件拼接

        queryParam.whereParams=arrayNew;
        // 将当前查询条件缓存到model.js中的cacheFilter字段中备用
        actions.query.updateState({cacheFilter: arrayNew});  //缓存查询条件
        actions.query.loadList(queryParam);
        //点击搜索面板的时候，关闭过滤条件
        this.props.clearRowFilter()

    }


    /**
     * 重置 如果无法清空，请手动清空
     */
    reset = () => {
        this.props.form.validateFields((err, values) => {
            let queryParam = deepClone(this.props.queryParam);
            let {whereParams} = queryParam;

            const arrayNew = [];
            for (const field in values) {
                arrayNew.push({key: field});
            }
            // 删除model.js中queryParam.whereParams中的搜索面板的字段
            queryParam.whereParams = delListObj(whereParams, arrayNew, "key"); //合并对象
            // 删除完成后进行更新查询条件
            actions.query.updateState({queryParam});  //清空查询条件
        });
    }


    /**
     * @description 对员工编码、月份进行精确查询、司龄为大于等于查询
     *              查询条件结构为{key:组件对应字段, value:组件对应的值, condition:查询条件}
     * @param values search 表单值
     * @returns {Array}
     */

    getSearchPanel = (values) => {
        const list = [];
        for (let key in values) {
            //排除空值并兼容值为数字并且值为0的情况
            if (values[key] || ((typeof values[key]) === "number")) {
                let condition = "LIKE";
                // 这里通过根据项目自己优化
                const equalArray = ["code", "month"]; // 当前字段查询条件为等于
                const greaterThanArray = ["serviceYearsCompany"]; //  当前字段查询条件为大于等于
                if (equalArray.includes(key)) { // 查询条件为 等于
                    condition = "EQ";
                }
                if (greaterThanArray.includes(key)) { // 查询条件为 大于等于
                    condition = "GTEQ";
                }
                list.push({key, value: values[key], condition}); //前后端约定
            }
        }
        return list;

    }


    render() {
        const _this = this;
        const {form,onCallback} = _this.props;
        const {getFieldProps} = form;
        return (
            <SearchPanel
                form={form}
                reset={this.reset}
                onCallback={onCallback}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>员工编号</Label>
                            <FormControl placeholder='精确查询' {...getFieldProps('code', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>员工姓名</Label>
                            <FormControl placeholder='模糊查询' {...getFieldProps('name', {initialValue: ''})}/>
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>部门</Label>
                            <RefIuapDept {...getFieldProps('dept', {initialValue: ''})}/>
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>司龄≥</Label>
                            <InputNumber min={0} iconStyle="one"
                                         {...getFieldProps('serviceYearsCompany', {
                                             initialValue: "",
                                         })}
                            />
                        </FormItem>
                    </Col>


                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>年份</Label>
                            <YearPicker
                                {...getFieldProps('year', {initialValue: ''})}
                                format={format}
                                locale={zhCN}
                                placeholder="选择年"
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>月份</Label>
                            <SelectMonth {...getFieldProps('month', {initialValue: ''})} />
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>是否超标</Label>
                            <Select {...getFieldProps('exdeeds', {initialValue: ''})}>
                                <Option value="">请选择</Option>
                                <Option value="0">未超标</Option>
                                <Option value="1">超标</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(SearchAreaForm)
