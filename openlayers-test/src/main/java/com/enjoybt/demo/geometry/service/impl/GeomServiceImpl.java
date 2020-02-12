package com.enjoybt.demo.geometry.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enjoybt.demo.geometry.dao.GeomDAO;
import com.enjoybt.demo.geometry.service.GeomService;

@Service
public class GeomServiceImpl implements GeomService {
	
	@Autowired
	private GeomDAO geomDAO;

	@Override
	public List<Map<String, Object>> getPlaceFeaturesByEmd(String code) throws Exception {
		return geomDAO.selectFeaturesByEmd(code);
	}

	@Override
	public List<Map<String, Object>> getPlaceFeatureByBound(String geom, double bound, String side) throws Exception {
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put("geom", geom);
		params.put("buffer", bound);
		params.put("side", side);
		
		return geomDAO.selectFeaturesByBound(params);
	}

}
