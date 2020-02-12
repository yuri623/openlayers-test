package com.enjoybt.demo.geometry.dao;

import java.util.List;
import java.util.Map;

public interface GeomDAO {

	public List<Map<String, Object>> selectFeaturesByEmd(String code);
	
	public List<Map<String, Object>> selectFeaturesByBound(Map<String, Object> params);
}
