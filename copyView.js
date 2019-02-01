const fs = require('fs');
const dao = require('./dao.js')
//1、修改Tables_in_pintuan,pintuan为数据库名，修改dao.js数据库连接配置
//2、使用脚手架搭建好vue及koa项目
//3、在vue项目views文件夹下放置model文件夹，router文件夹下放置model.js,components文件夹下放置model.vue，api文件夹下放置model.js
//4、在koa2项目controller文件夹下放置model文件夹，routes文件夹下放置model.js，routes下的router文件夹放置model.js
class copyView {
	static async copy(){
		let tableName = 'pintuan';
		let allTables = await dao.toDo('show tables');
		let tableArray = await copyView.getTableArray(allTables)
		let params,lists;
		let file = []
		tableArray.map((item,index)=>{
			lists = [];
			params = {};
			params.name = allTables[index].Tables_in_pintuan;
			for(let i=0;i<item.length;i++){
				lists.push({name:item[i].Comment,field:item[i].Field})
			}
			params.lists = lists;
			file.push(params)
		})
		copyView.writeViewNav(file,'D:/vue/model/src/components')
		//copyView.writeRoute(file,'D:/api/store')
		//copyView.writeRouter(file,'D:/api/store')
		//copyView.writeApi(file,'D:/api/store')
		//copyView.writeView(file,'D:/vue/model/src/views')
		//copyView.writeViewRoute(file,'D:/vue/model/src/router')
		//copyView.writeViewApi(file,'D:/vue/model/src/api')
	};
	static async getTableArray(allTables){
		let array = [];
		let surface,result,sql;
		for(let i=0;i<allTables.length;i++){
			surface = allTables[i].Tables_in_pintuan;
			sql = `SHOW FULL COLUMNS FROM ${surface}`;
			result =  await dao.toDo(sql)
			array.push(result)
		}
		return array
	};
	static writeViewNav(FILE,SRC){
		let modelName="";
		let str="";
		FILE.map((item,index)=>{
			modelName = item.name;
			str =str+ `<el-submenu index="${index+1}">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>${modelName}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item index="/admin/${modelName}/list">list</el-menu-item>
								<el-menu-item index="/admin/${modelName}/add">add</el-menu-item>
							</el-menu-item-group>
						</el-submenu>`;
		})
		fs.readFile(SRC+'/model.vue','utf8',(err,files)=>{
			let result = files.replace(/替换这里/g,str);
			fs.writeFile(SRC+'/admin-navs.vue',result,'utf8',function(err,files){
				console.log("writeViewNav")
			})
		})
	};
	static writeViewRoute(FILE,SRC){
		let modelName="";
		let str="";
		let requireStr="";
		FILE.map((item,index)=>{
			modelName = item.name;
			str =str+ `{
					path:'/admin/${modelName}',
					name:'${modelName}',
					component:()=>import('@/views/${modelName}/index'),
					redirect:'/admin/${modelName}/list',
					children:[
						{path:'list',name:'${modelName}List',component:()=> import('@/views/${modelName}/list')},
						{path:'add',name:'${modelName}Add',component:()=> import('@/views/${modelName}/add')},
					]
				},`;
		})
		fs.readFile(SRC+'/model.js','utf8',(err,files)=>{
			let result = files.replace(/这里替换掉/g,str);
			fs.writeFile(SRC+'/index.js',result,'utf8',function(err,files){
				console.log("writeviewRouter")
			})
		})
	};
	static writeViewApi(FILE,SRC){
		let index = 0;
		let copyFile = function(){
			if(index<FILE.length){
				return new Promise((resolve,reject)=>{
					let modelName = FILE[index].name
					fs.readFile(SRC+'/model.js','utf8',(err,files)=>{
						let result = files.replace(/model/g,modelName)
						fs.writeFile(SRC+'/'+modelName+'.js',result,'utf8',function(err,files){
							if(err){
								reject(resolve)
							}else{
								resolve({success:true})
								console.log("writeViewApi")
							}
						})
					})
					
				}).then(res=>{
					index++;
					copyFile()
				})
			}
		}
		copyFile()
	};
	static writeApi(FILE,SRC){
		let index = 0;
		let copyFile = function(){
			if(index<FILE.length){
				return new Promise((resolve,reject)=>{
					let modelName = FILE[index].name
					fs.mkdir(SRC+'/controller/'+modelName,(err)=>{
						fs.readFile(SRC+'/controller/model/model.js','utf8',(err,files)=>{
							let result = files.replace(/model/g,modelName)
							fs.writeFile(SRC+'/controller/'+modelName+'/'+modelName+'.js',result,'utf8',function(err,files){
								if(err){
									reject(resolve)
								}else{
									resolve({success:true})
									console.log("writeApi")
								}
							})
						})
					})
				}).then(res=>{
					index++;
					copyFile()
				})
			}
		}
		copyFile()
	};
	static writeRouter(FILE,SRC){
		let modelName="";
		let str="";
		let requireStr="";
		FILE.map((item,index)=>{
			modelName = item.name;
			str =str+ `app.use(${modelName}.routes()).use(${modelName}.allowedMethods());`;
			requireStr = requireStr+`const ${modelName} = require('./router/${modelName}');`;
		})
		fs.readFile(SRC+'/routes/model.js','utf8',(err,files)=>{
			let result = files.replace(/这里也替换掉/g,str);
			result = result.replace(/这里替换掉/g,requireStr);
			fs.writeFile(SRC+'/routes/index.js',result,'utf8',function(err,files){
				console.log("writeRouter")
			})
		})
	};
	static writeRoute(FILE,SRC){
		let index = 0;
		let copyFile = function(){
			if(index<FILE.length){
				return new Promise((resolve,reject)=>{
					let modelName = FILE[index].name
					fs.readFile(SRC+'/routes/router/model.js','utf8',(err,files)=>{
						let result = files.replace(/model/g,modelName)
						fs.writeFile(SRC+'/routes/router/'+modelName+'.js',result,'utf8',function(err,files){
							if(err){
								reject(resolve)
							}else{
								resolve({success:true})
								console.log("writeRoute")
							}
						})
					})
					
				}).then(res=>{
					index++;
					copyFile()
				})
			}
		}
		copyFile()
	};
	
	
	static writeView(FILE,SRC){
		let index = 0;
		let copyFile = function(){
			if(index<FILE.length){
				
				return new Promise((resolve,reject)=>{
					fs.mkdir(SRC+'/'+FILE[index].name,(err)=>{
						fs.readFile(SRC+'/model/list.vue','utf8',(err,files)=>{
							let lists = FILE[index].lists;
							let titleStr=``;
							let listStr=``;
							let span = parseInt(20/lists.length);
							lists.map((item,index)=>{
								titleStr = titleStr+`<el-col :span="${span}">${item.name}</el-col>`;
								listStr = listStr+`<el-col :span="${span}">{{item.${item.field}}}</el-col>`;
							})
							titleStr = titleStr+`<el-col :span="4">操作</el-col>`
							listStr = listStr+`<el-col :span="4"><el-button type="warning" size="mini" @click="updateItem(item.${lists[0].field})">修改</el-button><el-button type="danger" size="mini" @click="removeItem(item.${lists[0].field})">删除</el-button></el-col>`
							let result = files.replace(/这里替换掉/g,titleStr )
							result = result.replace(/这里也替换掉/g,listStr )
							result = result.replace(/model/g,FILE[index].name )
							fs.writeFile(SRC+'/'+FILE[index].name+'/list.vue',result,'utf8',(err,files)=>{
								if(err){
									reject(resolve)
								}else{
									resolve({success:true})
									console.log("writeViewList")
									
								}
							})
						})
						fs.readFile(SRC+'/model/index.vue','utf8',(err,files)=>{
							fs.writeFile(SRC+'/'+FILE[index].name+'/index.vue',files,'utf8',(err,files)=>{
								console.log("writeViewIndex")
							})
						})
						fs.readFile(SRC+'/model/add.vue','utf8',(err,files)=>{
							let lists = FILE[index].lists;
							let inputStr=``;
							let ruleForm=``;
							let rules=``;
							let loadStr = ``;
							lists.map((item,index)=>{
								inputStr = inputStr+`<el-form-item label="${item.name}" prop="${item.field}">
														<el-input v-model="ruleForm.${item.field}"></el-input>
													  </el-form-item>`;
								ruleForm = ruleForm+`${item.field}: '',`;
								rules = rules+	`${item.field}: [
													{ required: true, message: '请输入 ', trigger: 'blur' }
												  ],`;
								loadStr = loadStr+`this.ruleForm.${item.field} = datas.${item.field};`
							})
							let result = files.replace(/替换input/g,inputStr );
							result = result.replace(/替换ruleForm/g,ruleForm );
							result = result.replace(/替换rules/g,rules );
							result = result.replace(/替换loadGood/g,loadStr );
							result = result.replace(/model唯一/g,FILE[index].name );
							
							fs.writeFile(SRC+'/'+FILE[index].name+'/add.vue',result,'utf8',(err,files)=>{
								console.log("writeViewAdd")
							})
						})
					})
				}).then(res=>{
					index++;
					copyFile()
				})
			}
		}
		copyFile()
	};
	
}
module.exports = copyView;
