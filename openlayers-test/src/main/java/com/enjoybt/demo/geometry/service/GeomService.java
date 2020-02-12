package com.enjoybt.demo.geometry.service;

import java.util.List;
import java.util.Map;

public interface GeomService {

	public List<Map<String, Object>> getPlaceFeaturesByEmd(String code) throws Exception;
	
	public List<Map<String, Object>> getPlaceFeatureByBound(String geom, double bound, String side) throws Exception;
}
