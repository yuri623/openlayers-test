package com.enjoybt.demo.geometry.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.enjoybt.demo.geometry.service.GeomService;

@Controller
public class GeomController {
	
	@Autowired
	private GeomService geomService;

	@RequestMapping(value="/getWMSInfo")
	@ResponseBody
	public Map<String, Object> getWMSInfo(
		@RequestParam(value="url") String url
	){
		Map<String, Object> result = new HashMap<String, Object>();
		
		try {
			
			HttpClient client = HttpClientBuilder.create().build();
			
			HttpGet request = new HttpGet(url);
			
			request.setHeader("Content-type", "application/json; charset=UTF-8");
			
			HttpResponse res = client.execute(request);
			HttpEntity entity = res.getEntity();
			
			String results = EntityUtils.toString(entity);
			
			JSONArray features = new JSONObject(results).getJSONArray("features");
			
			JSONObject obj = features.getJSONObject(0).getJSONObject("properties");
			
			result = obj.toMap();
			
			result.put("RESULT", "SUCCESS");
		}catch(Exception e) {
			e.printStackTrace();
			
			result.put("RESULT", "FAILURE");
		}
		
		return result;
	}
	
	
	@RequestMapping(value="/getWFSInfo")
	@ResponseBody
	public Map<String, Object> getWFSInfo(
		@RequestParam(value="params") String params
	){
		String url = "http://192.168.0.222:9098/geoserver/jbt/wfs";
		Map<String, Object> result = new HashMap<String, Object>();
		
		try {
			
			HttpClient client = HttpClientBuilder.create().build();
			
			HttpGet request = new HttpGet(url+"?"+params);
			
			request.setHeader("Content-type", "application/json; charset=UTF-8");
			
			HttpResponse res = client.execute(request);
			HttpEntity entity = res.getEntity();
			
			String results = EntityUtils.toString(entity);
			
			JSONObject obj = new JSONObject(results).getJSONArray("features").getJSONObject(0);
			
			result = obj.toMap();
			
			result.put("RESULT", "SUCCESS");
		}catch(Exception e) {
			e.printStackTrace();
			
			result.put("RESULT", "FAILURE");
		}
		
		return result;
	}
	
	
	@RequestMapping(value="/getFeaturesByEmd")
	@ResponseBody
	public Map<String, Object> getPlaceFeaturesByEmd(
		@RequestParam(value="code") String code
	){
		Map<String, Object> result = new HashMap<String, Object>();
		
		try {
			result.put("LIST", geomService.getPlaceFeaturesByEmd(code));
			
			result.put("RESULT", "SUCCESS");
		}catch (Exception e) {
			e.printStackTrace();
			
			result.put("RESULT", "FAILURE");
		}
		
		return result;
	}
	
	
	@RequestMapping(value="/getFeaturesByBound")
	@ResponseBody
	public Map<String, Object> getPlaceFeatureByBound(
		@RequestParam(value="geometry") String geom,
		@RequestParam(value="bound") Double bound,
		@RequestParam(value="side", required = false) String side
	){
		Map<String, Object> result = new HashMap<String, Object>();
		
		try {
			result.put("LIST", geomService.getPlaceFeatureByBound(geom, bound, side));
			
			result.put("RESULT", "SUCCESS");
		}catch (Exception e) {
			e.printStackTrace();
			
			result.put("RESULT", "FAILURE");
		}
		
		return result;
	}
	
}
