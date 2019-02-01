const mysql = require( 'mysql'); 
const pool = mysql.createPool({  
      host : '47.110.151.53',
      user : 'root',
      password : 'Nuscan_dev_123_#',
      database : 'pintuan',
	  connectionLimit:100
})
class dao{
	static toDo(sql,params){
		return new Promise((resolve,reject)=>{
			pool.getConnection((err,connection)=>{
				connection.query(sql,params,(err,res)=>{
					if(res){
						resolve(res);
					}else{
						reject(err)
					}
					
					connection.release();
				})
			})
		})
	}
}
module.exports = dao