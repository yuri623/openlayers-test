<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<script src="/resources/js/lib/jquery-3.4.1.js"></script>
<script src="/resources/js/lib/ol.js"></script>
<script src="/resources/js/lib/jquery-ui.min.js"></script>
<link rel="stylesheet" href="/resources/css/lib/ol.css">
<style type="text/css">
	html, body{width: calc(100% - 8px); height: calc(100% - 8px);}
	.noDisplay{display: none;}
	.popup-window{width: 354px; height: auto; background: #3d3d3d; color: #fff; position: absolute; text-align: center; font-size: 14px; border: 1px solid #000;}
	.close-btn{cursor: move;}
	.close-btn span{cursor: pointer;}
	TABLE {width: calc(100% - 10px); margin: 5px;}
	.selected-btn{background: rgba(117, 166, 228, 0.8);}
</style>
</head>
<body>
    <div id="map" class="map" style="height: 100%; width: 100%;"></div>
    <div style="width: 200px; height:100px; position: absolute; top: 20px; right: 20px;">
    	<button id="pointBtn" class="geometry-btn">포인트 선택</button>&nbsp;<button id="lineBtn" class="geometry-btn">라인 선택</button><br/>
    	<label for="bound">º 반경(m)</label>
    	<select id="side">
    		<option value="">All</option>
    		<option value="left">Left</option>
    		<option value="right">Right</option>
    	</select>
    	<input id="bound" maxlength="4">
    	<button id="searchBtn">검색</button>
    </div>
    <div id="popupDiv" class="popup-window noDisplay">
    	<div class="close-btn emd" style="width: 100%; height: 20px; border-bottom: 1px solid #3d3d3d;">    	
    		<span style="float: right;">X </span>
    	</div>
    	<div class="table-div">
	    	<table>
	    		<colgroup>
	    			<col width="23%">
	    			<col width="25%">
	    			<col width="26%">
	    			<col width="26%">
	    		</colgroup>
	    		<tr>
	    			<th>시군구 코드</th>
	    			<th>읍면동 코드</th>
	    			<th>읍면동(한글)</th>
	    			<th>읍면동(영문)</th>
	    		</tr>
	    		<tr>
	    			<td id="sig_cd"></td>
	    			<td id="emd_cd"></td>
	    			<td id="emd_kor_nm"></td>
	    			<td id="emd_eng_nm"></td>
	    		</tr>
	    	</table>    
    	</div>
    </div>
    
    <div id="popupDiv2" class="popup-window noDisplay">
    	<div class="close-btn osm" style="width: 100%; height: 20px; border-bottom: 1px solid #3d3d3d;">    	
    		<span style="float: right;">X </span>
    	</div>
    	<div class="table-div">
	    	<table>
	    		<colgroup>
	    			<col width="23%">
	    			<col width="25%">
	    			<col width="26%">
	    			<col width="26%">
	    		</colgroup>
	    		<tr>
	    			<th>OSM ID</th>
	    			<th>CODE</th>
	    			<th>유형</th>
	    			<th>이름</th>
	    		</tr>
	    		<tr>
	    			<td id="osm_id"></td>
	    			<td id="code"></td>
	    			<td id="fclass"></td>
	    			<td id="name"></td>
	    		</tr>
	    	</table>    
    	</div>
    </div>
</body>
<script src="/resources/js/common.js"></script>
<script src="/resources/js/home.js"></script>
<script type="text/javascript">
	var _contextPath = "";
</script>
</html>