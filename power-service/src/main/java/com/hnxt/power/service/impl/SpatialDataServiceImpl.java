 package com.hnxt.power.service.impl;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.hnxt.basic.core.jdbc.BaseDao;
import com.hnxt.power.service.SpatialDataService;

/** 
 * @ClassName CommonServiceImpl 
 * @Description 通用接口实现
 * @Author ..A..w.. 2262858312@qq.com Or qinfengchun101@Gmail.com    
 * @Date 2017年1月11日 下午3:18:47 
 * @修改历史  
 *     1. [2017年1月11日]创建文件 by ..A..w..
 */
@Service
public class SpatialDataServiceImpl  implements SpatialDataService{
	@Resource(name="${spring.db.type}") 
	private BaseDao baseDao;
 

	@Override
	public List<Map<String, Object>> getSpatialData(String modelName) {
		// TODO Auto-generated method stub  distinct
		return baseDao.executeSQL("SELECT DISTINCT t1.column_name as value ,t2.comments as field FROM all_tab_cols t1 LEFT JOIN all_tab_comments t3 ON t1.table_name=t3.table_name LEFT JOIN all_col_comments t2 ON t1.table_name=t2.table_name AND t1.column_name=t2.column_name WHERE t1.table_name='"+modelName+"'");
	}
	
	
	@Override
	public List<Map<String, Object>> getMultiConditionData(String modelName,Map<String,Object> map) {
		Set<String> keys = map.keySet();
	
		Iterator<String> iterator = keys.iterator( );
		StringBuilder sql = new StringBuilder();
		while(iterator.hasNext()) {
		  String key = (String)iterator.next();
		  Object val = map.get(key);
		  if (val instanceof Integer) {
			    int value = ((Integer) val).intValue();
			    sql.append(" "+key+"="+value);
			   } else if (val instanceof String) {
			    String s = (String) val;
			    sql.append(" "+key+"='"+s+"'");
		   }
		  sql.append(" OR");
		}
        //删除多余的‘OR’
		sql.delete(sql.length()-2, sql.length());
		
		List<Map<String, Object>> list =baseDao.executeSQL("SELECT  * FROM "+modelName+" WHERE "+sql);
		return list;
	}
}
