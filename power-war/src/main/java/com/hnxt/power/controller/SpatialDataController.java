/**
 * @Author 郑居广   
 * @Date 2016年12月1日 下午4:15:47 
 */
package com.hnxt.power.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hnxt.basic.core.common.entity.page.PageDto;import com.hnxt.power.service.SpatialDataService;

/** 
 * //TODO 角色信息controller
 * @ClassName RoleController 
 * @Description TODO(角色信息页面跳转和数据交互) 
 * @Author 郑居广     
 * @Date 2016年12月1日 下午4:15:47 
 * @修改历史  
 *     1. [2016年12月1日]创建文件 by 郑居广
 */
@Controller
public class SpatialDataController {

	@Resource
	SpatialDataService spatialDataService;
	/**
	 * 
	 * //TODO 根据分组编号查询角色信息
	 * @Title queryRoleListByGroupId 
	 * @Description TODO(根据分组编号查询角色信息) 
	 * @param request
	 * @param model
	 * @return
	 * @Return List<Map<String,Object>>    返回类型 
	 * @Throws 
	 * @Date  2016年12月2日
	 * @修改历史  
	 *     1. [2016年12月2日]创建文件 by 郑居广
	 */
	@ResponseBody
	@RequestMapping(value ="/{modelName}/querySpatialTableField.action")
	public List<Map<String,Object>> queryRoleListByGroupId(@PathVariable String modelName){
		List<Map<String,Object>> result = spatialDataService.getSpatialData(modelName);
		return result;
	}
	
	/**
	 * 
	 * //TODO 多条件查询数据
	 * @Title queryMultiCondition 
	 * @Description TODO(根据分组编号查询角色信息) 
	 * @param request
	 * @param model
	 * @return
	 * @Return List<Map<String,Object>>    返回类型 
	 * @Throws 
	 * @Date  2016年12月2日
	 * @修改历史  
	 *     1. [2016年12月2日]创建文件 by 郑居广
	 */
	@ResponseBody
	@RequestMapping(value ="/{modelName}/queryMultiConditionData.action")
	public List<Map<String,Object>> queryMultiCondition(@PathVariable String modelName,@RequestParam Map<String,Object> map){
		List<Map<String,Object>> result = spatialDataService.getMultiConditionData(modelName, map);
		return result;
	}
	
	
	/**
     * 
     * //TODO 多条件分页查询数据
     * @Title queryPage 
     * @Description TODO(这里用一句话描述这个方法的作用) 
     * @param modelName 表名称
     * @param map 页面数据
     * @return
     * @Return PageDto    返回类型 
     * @Throws 
     * @Date  2017年11月1日
     * @修改历史  
     *     1. [2017年11月1日]创建文件hbx
     */
    @ResponseBody
    @RequestMapping(value="/{modelName}/queryMultiConditionByPage.action")
    public PageDto queryMultiConditionByPage(@PathVariable String modelName,@RequestParam Map<String, Object> map){
        List<Map<String, Object>> result = spatialDataService.getMultiConditionByPage(modelName, map);
        int count = spatialDataService.getMultiConditionCount(modelName, map);
        PageDto pageDto = new PageDto(result, count);
        return pageDto;
    }

	
}
