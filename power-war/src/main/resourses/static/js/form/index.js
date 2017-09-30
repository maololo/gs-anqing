			var modalDialog = Vue.extend({
				template: '#dialog-template',
				data: function() {
					return {
						// 对话框默认是不显示的
						show: false
					}
				},
				/*
				 * mode = 1是新增数据模式，mode = 2是修改数据模式
				 * title表示对话框的标题内容
				 * fields表示对话框要显示的数据字段数组
				 * item是由simple-dialog传下来，用于绑定表单字段的
				 */
				props: ['mode', 'title', 'fields', 'item'],
				methods: {
					close: function() {
						this.show = false
					},
					save: function() {
						if (this.mode === 1) {
							// 使用$dispatch调用simple-grid的create-item事件
							this.$dispatch('create-item')
						} else if (this.mode === 2) {
							// 使用$dispatch调用simple-grid的update-item事件
							this.$dispatch('update-item')
						}
					}
				},
				events: {
					'showDialog': function(show) {
						this.show = show
					}
				}
			})
		
		
			Vue.component('simple-grid', {
				template: '#grid-template',
				props: ['dataList', 'columns', 'searchKey'],
				data: function() {
					return {
						mode: 0,
						title: '',
						keyColumn: '',
						item: {}
					}
				},
				ready: function(){
					for (var i = 0; i < this.columns.length; i++) {
						if (this.columns[i].isKey) {
							this.keyColumn = this.columns[i]['name']
							break;
						}
					}
				},
				methods: {
					openNewItemDialog: function(title) {
						// 对话框的标题
						this.title = title
						// mode = 1表示新建模式
						this.mode = 1
						// 初始化this.item
						this.item = {}
						// 广播事件，showDialog是modal-dialog组件的一个方法，传入参数true表示显示对话框
						this.$broadcast('showDialog', true)
					},
					openEditItemDialog: function(key) {
						// 根据主键查找当前修改的数据
						var currentItem = this.findItemByKey(key)
						// 对话框的标题
						this.title = 'Edit Item - ' + key
						// mode = 2表示修改模式
						this.mode = 2
						// 将选中的数据拷贝到this.item
						this.item = this.initItemForUpdate(currentItem)
						// 广播事件，传入参数true表示显示对话框
						this.$broadcast('showDialog', true)
					},
					// 弹出修改数据的对话框时，使用对象的深拷贝
					initItemForUpdate:	function(p, c) {
						c = c || {};
						for(var i in p) {
							// 属性i是否为p对象的自有属性
							if(p.hasOwnProperty(i)) {
								// 属性i是否为复杂类型
								if(typeof p[i] === 'object') {
									// 如果p[i]是数组，则创建一个新数组
									// 如果p[i]是普通对象，则创建一个新对象
									c[i] = Array.isArray(p[i]) ? [] : {};
									// 递归拷贝复杂类型的属性
									this.initItemForUpdate(p[i], c[i]);
								} else {
									// 属性是基础类型时，直接拷贝
									c[i] = p[i];
								}
							}
						}
						return c;
					},
					findItemByKey: function(key){
						var keyColumn = this.keyColumn
						for(var i = 0; i < this.dataList.length; i++){
							if(this.dataList[i][keyColumn] === key){
								return this.dataList[i]
							}
						}
					},
					itemExists: function() {
						var keyColumn = this.keyColumn
						for (var i = 0; i < this.dataList.length; i++) {
							if (this.item[keyColumn] === this.dataList[i][keyColumn])
								return true;
						}
						return false;
					},
					createItem: function() {
						var keyColumn = this.keyColumn
						if (!this.itemExists()) {
							// 将item追加到dataList
							this.dataList.push(this.item)
							// 广播事件，传入参数false表示隐藏对话框
							this.$broadcast('showDialog', false)
							// 新建完数据后，重置item对象
							this.item = {}
						} else {
							alert(keyColumn + ' "' + this.item[keyColumn] + '" is already exists')
						}

					},
					updateItem: function() {

						// 获取主键列
						var keyColumn = this.keyColumn

						for (var i = 0; i < this.dataList.length; i++) {
							// 根据主键查找要修改的数据，然后将this.item数据更新到this.dataList[i]
							if (this.dataList[i][keyColumn] === this.item[keyColumn]) {
								for (var j in this.item) {
									this.dataList[i][j] = this.item[j]
								}
								break;
							}
						}
						// 广播事件，传入参数false表示隐藏对话框
						this.$broadcast('showDialog', false)
						// 修改完数据后，重置item对象
						this.item = {}
					},
					deleteItem: function(entry) {
						var data = this.dataList
						data.forEach(function(item, i) {
							if(item === entry) {
								data.splice(i, 1)
								return
							}
						})
					}
				},
				components: {
					'modal-dialog': modalDialog
				}
			})

			var demo = new Vue({
				el: '#app',
				data: {
					searchQuery: '',
					columns: [{
						name: 'name',
						isKey: true
					}, {
						name: 'age'
					}, {
						name: 'sex',
						dataSource: ['Male', 'Female']
					}],
					people: [{
						name: 'Jack',
						age: 30,
						sex: 'Male'
					}, {
						name: 'Bill',
						age: 26,
						sex: 'Male'
					}, {
						name: 'Tracy',
						age: 22,
						sex: 'Female'
					}, {
						name: 'Chris',
						age: 36,
						sex: 'Male'
					}]
				}
			})