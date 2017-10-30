/**
 * @Date 2017-10-27 09:24:11
 */
package com.hnxt.power.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.hnxt.basic.core.jdbc.utils.Constant;
import com.hnxt.basic.core.utils.Assert;
import com.hnxt.basic.service.CommunService;

@Controller
public class UploadFileController {
	
	@Resource
	CommunService communService;

	/**
	 * //TODO 保存文件
	 * @Title queryRoleListByGroupId 
	 * @param String 表名称
	 * @param MultipartFile 文件
	 * @param Map<String, Object> 表单数据
	 * @return Map<String, Object>
	 * @Throws 
	 */
	@ResponseBody
	@RequestMapping(value ="/{modelName}/picUploadFile.action")
	public Map<String, Object> saveFile(@PathVariable String modelName,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam Map<String, Object> argsMap) {
		Map<String, Object> result = null;
		Map<String, Object> map = new HashMap<String, Object>();
		if (file != null) {
			argsMap.put("FILENAME", file.getOriginalFilename());
		} else {
			argsMap.remove("file");
		}
		if (Assert.isNotEmpty(argsMap.get(Constant.T_PRIMARY_KEY))) {
			map.put("C_ID", argsMap.get("C_ID"));
			communService.update(modelName, argsMap);
		} else {
			argsMap.remove(Constant.T_PRIMARY_KEY);
			result = communService.insert(modelName, argsMap);
			map.put("C_ID", result.get("C_ID"));
		}
		try {
			if (file != null) {
				String fileName = file.getOriginalFilename();
				map.put("fileName", fileName);
				if (!"".equals(fileName)) {
					communService.updateBlob(String.valueOf(map.get("C_ID").toString()), file.getInputStream(),
							modelName, "PICTURE");
					// 创建文件夹
                    File f = new File("D://upload//");
                    if(!f.exists()){
                        f.mkdir();
                    }
					File newfile = new File("D://upload//" + file.getOriginalFilename());
					file.transferTo(newfile);
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		map.put("msg", "添加成功");
		return map;
	}
	
}
