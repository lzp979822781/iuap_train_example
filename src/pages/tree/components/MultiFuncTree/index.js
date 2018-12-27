import React, { Component } from 'react';
import { actions } from 'mirrorx';

// 导入组件类
import { FormControl, Tree, Icon, Loading} from 'tinper-bee';
import Header from 'components/Header';
import TreeTable from '../TreeTable';

// 导入样式
import './index.less';

// 定义组件类常量
const TreeNode = Tree.TreeNode;


class MultiFuncTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
			editNode : {
				isHover : "",
				editKey : ""
			}
			
		};
	}

	onExpand = expandedKeys => {
		// expandedKeys为指定展开的节点
		actions.walsinTree.updateState({
			searchRes : {
				expandedKeys,
				autoExpandParent : false
			}
		})

	}

	/**
	 * 
	 * @description 搜索框onChange事件
	 * @param {string} value 搜索框的输入值
	 */
	onChange = value => {

		let _this = this;
		_this.setState({
			searchValue : value
		})

	}

	/**
	 *
	 * @description 树节点回车搜索方法
	 * @param {string} searchValue 搜索框的输入值
	 */
	onSearch = async () => {
		
		let _this = this,
			{searchValue} = _this.state;
		
		await actions.walsinTree.getSearchTree({
			searchValue
		})
	}



	/**
	 *
	 * @description 点击树节点title执行事件,此处直接使用props解构会出错，因此起别名nodeProps
	 * @param {string} value 节点title值
	 * @param {Object} e e为当前选中节点的事件信息
	 */
	onSelect = (value, e ) => {
		
		let  _this = this,
			{selectedNodes : nodeArray} = e,
			search_treeId = value.length ? value[0] :"",
			title = "",
			hierarchy = "";
		// 初次点击树节点nodeArray存在，再次点击数据为空，hierarchy为当前数据层级
		if(nodeArray.length) {
			let	{props : nodeProps, props : {title : {props : {children}}}} = nodeArray[0];
			title = children[2];
			hierarchy = nodeProps['hierarchy'];
		}
		
		let {paginationParam} = _this.props,
			reqParam = {};
		
		reqParam = Object.assign({}, paginationParam.reqParam || {}, {
			search_treeId,
			title,
			hierarchy
		});
		actions.walsinTree.loadTable(reqParam);

	};
	
	componentDidMount() {
		actions.walsinTree.loadTree();
	}

	/**
	 *
	 * @description 异步加载事件,点击图标时触发
	 * @param {*} treeNode 当前点击节点
	 * @returns null
	 */
	onLoadData = (treeNode) => {
		console.log("treeNode",treeNode);
		let id = treeNode.props['eventKey'];
		let _this = this;
		
		return new Promise( (resolve, reject) => {
			if(!_this.idLoaded(id)) {
				actions.walsinTree.loadTree({
					id 
				})
			}
			
			resolve();
		}).then(result => {
			console.log("result",result);
		}).catch(reason => {
			console.log('失败：' + reason);
		})
	}

	/**
	 *
	 * @description isLoaded、checkedLoaded为判断当前节点是否是否加载的方法
	 * @param {string} id 为当前节点的id值,从后台获取得到
	 * @returns {Boolean} true表示已加载、false表示为加载
	 */
	idLoaded = (id) => {
		let _this = this;
		let {content} = _this.props,
			len = content.length;
		if (len > 0) {
			return _this.checkedLoaded(content, id);
		}

		return false;

	}

	checkedLoaded = (array, id) => {
		let len = array.length,
			isChecked = false;
		for (let i = 0; i < len; i++) {
			let item = array[i],
				children = item['children'];
			if (item['id'] == id) {
				if(children && children.length > 0) {
					isChecked = true;
					break;
				}
			} else {
				if(children) {
					isChecked = this.checkedLoaded(children, id);
				}
			}
		}

		return isChecked;
	}
  
	/**
	 * @description getHeight方法为获取树区域所在宽度
	 * @param {Number} clientHeight 视口高度
	 * @param {Number} scrollHeight 包含滚动内容大小的高度
	 * @param {Number} scrollTop 滚动条居上的距离
	 * @param {Number} pageHeadHeight head的高度
	 * @returns {Number} treeHeight  树的高度
	 */
	getHeight = () => {
		let clientHeight = Math.min(window.innerHeight,document.body.clientHeight,document.documentElement.clientHeight),
			scrollHeight = Math.min(window.innerHeight,document.body.scrollHeight,document.documentElement.scrollHeight),
			offsetHeight = document.documentElement.offsetHeight,
			scrollTop = document.documentElement.scrollTop,
			treeHeight = 0,
			pageHeadHeight = 32;

		console.log('clientHeight',clientHeight, 'scrollHeight', scrollHeight, 'offsetHeight',offsetHeight);
		let showHeight = (clientHeight < scrollHeight ) && clientHeight || scrollHeight;
		treeHeight = showHeight - pageHeadHeight - scrollTop;
		
		return treeHeight;
		
	}
	/**
	 *
	 * @description 本方法为获取表格宽度方法
	 * @param {Number} clientWidth 为当前页面的宽度
	 * @param {Number} treeWidth 为左侧树的宽度
	 * @returns {Number} 表格的宽度
	 */
	getTableWidth = () => {
		 
		let clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth),
			treeWidth = 250,
			tableWidth = 1;
		
		tableWidth = clientWidth - treeWidth;
		return tableWidth;
	}

	render() {
		const _this = this;
		let { showLoading, content, searchRes, paginationParam : { reqParam : {search_treeId}}} = _this.props,
			{expandedKeys, autoExpandParent} = searchRes;
		const { searchValue} = _this.state;
		
		let tableWidth = _this.getTableWidth();

		const loop2 = data => data.map( item => {
				// 遍历数据,查找当前节点title是否包含搜索值
				const index = item.name.search(searchValue);
				// 截取搜索到的字符串
				const beforeStr = item.name.substr(0, index);
				const afterStr = item.name.substr(index + searchValue.length);
				const title = index > -1 ? (
					<span>
						{beforeStr}
						{/* 对搜索值字体颜色做处理 */}
						<span style={{ color: '#f50' }}>{searchValue}</span>
						{afterStr}
					</span>
				) : <span>{item.name}</span>;
				// 如果存在子节点则继续遍历,不存在则直接显示
				if (item.children && item.children.length) {
					return <TreeNode className='tree-node' hierarchy={item.parentId} title={title} key={item.id}>{loop2(item.children)}</TreeNode>
				} else {
					return <TreeNode className='tree-node' hierarchy={item.parentId} title={title} key={item.id} isLeaf={typeof item['isSon'] !== 'undefined' ? item.isSon === 1  : true}></TreeNode>
				}
			})
		return (
			<div className="tree-example">
				<Header title="B1左树右表示例" />
				<div className="tree-body">
					<div className = 'tree-wrap'  >
						<div className = 'tree' >
							<div className = 'tree-head'>
								组织机构
							</div>
							<div className = 'tree-search'>
								<FormControl 
									className="search-box" 
									placeholder="Search" 
									onChange={_this.onChange} 
									onSearch = {_this.onSearch}
									value = {searchValue}
									type="search"
									/>
							</div>
							{
								content.length ? (
									<Tree
										// 是否显示连接线
										showLine={true}

										// 设置显示复选框
										// checkable={true}

										// 设置打开节点时的图标
										openIcon={<Icon type="uf-arrow-down" />}

										// 设置关闭节点时的图标
										closeIcon={<Icon type="uf-arrow-right" />}

										// 打开或关闭节点时触发的方法
										onExpand={_this.onExpand}
										expandedKeys={expandedKeys}
										autoExpandParent={autoExpandParent}

										// 默认是否展开所有节点
										defaultExpandAll = {true}

										// 点击节点数据回调函数
										onSelect={_this.onSelect}

										// 点击复选框回调函数
										onCheck={_this.onSelect}

										// 编辑回调函数
										onMouseEnter={_this.onMouseEnter}
										onMouseLeave={_this.onMouseLeave}

										// 拖拽
										draggable = {false}
										onDragEnter = {this.onDragEnter}
										onDrop = {this.onDrop}

										// 异步加载数据
										loadData = {_this.onLoadData}

										selectedKeys = {[search_treeId]}
									>
										{loop2(content)}
									</Tree>
								) : (
									<div className = "no-search-container" >
										<span className="no-search">未查询到相关数据</span>
									</div>
								)
							}
							
						</div>
						<div className = 'table-wrap'>
							<TreeTable tableWidth = {tableWidth}/>
						</div>
					</div>
					<Loading show={showLoading} loadingType="line" fullScreen />
					
				</div>
			</div>
		);
	}
}

export default MultiFuncTree;
