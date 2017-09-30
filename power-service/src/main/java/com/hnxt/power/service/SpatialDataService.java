package com.hnxt.power.service;

import java.util.List;
import java.util.Map;


/** 
 * @ClassName CommonService  
 * @Description 通用接口
 * @Author ..A..w.. 2262858312@qq.com Or qinfengchun101@Gmail.com    
 * @Date 2017年1月11日 下午3:17:29 
 * @修改历史  
 *     1. [2017年1月11日]创建文件 by ..A..w..
 */
public interface SpatialDataService {

     /**
     * @Title getModelInfo 获取空间数据字段集合
     * @Description  通过空间数据表名称获取数据字段集合
     * @param modelName 空间数据表名称
     * @Return L	ist<Map<String, Object>   集合 
     * @Throws 
     * @Date  2017年9月29日
     * @修改历史  
     *     1. [2017年9月29日]创建文件 hbx
     */
   public  List<Map<String, Object>> getSpatialData(String modelName);

}
