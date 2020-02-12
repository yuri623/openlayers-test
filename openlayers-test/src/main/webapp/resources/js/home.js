var map, wmsLayer, feature, vectorLayer, pointLayer, point, circle;
var poiLayer, placesLayer, circleLayer;
var drawInt;
var places=[];
var pois=[];
var _searchParams={};
var _code;

jQuery(function(){
	
	var wmsSource = new ol.source.TileWMS({
		url: 'http://192.168.0.222:9098/geoserver/jbt/wms',
		params: {
			VERSION: '1.1.0',
			LAYERS:'jbt:tl_scco_emd',
			STYLES: 'jbt:SCCO_EMD_STYLE'
		},
		serverType: 'geoserver'
	});
	
	wmsLayer = new ol.layer.Tile({
		 source: wmsSource
	});
	
	wmsSource.updateParams({});
	
	map = new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.XYZ({
					url : "http://api.vworld.kr/req/wmts/1.0.0/F0257AC2-A95E-3ADE-B5A2-E2E3DA525392/Base/{z}/{y}/{x}.png"
				})
			}),
	   		wmsLayer
	    ],
	    view: new ol.View({
	      center: ol.proj.transform([127.0016985, 37.5642135], 'EPSG:4326', 'EPSG:900913'),
	      zoom: 9
	    }), 
	    controls: [new ol.control.ScaleLine({
	    	units: 'metric'
	    })],
	    unit: 'm'
	});
	
	map.on('click', function(evt) {
		var flag = true;
		
		map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
			if(feature.get('type') && feature.get('type') != 'CIRCLE'){
				Object.keys(feature.values_).forEach(function(v) {
					jQuery("#"+v).text(feature.get(v));
				})
				
				openPopup2();
				
				flag = false;
			}
		});
		
		if(flag){
			var view = map.getView();
			var viewResolution = view.getResolution();
			
			if(jQuery("#pointBtn").hasClass("selected-btn")){
				var coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
				
				if(point) pointLayer.getSource().removeFeature(point);
				
				point = new ol.Feature(new ol.geom.Point(coord));
				
				point.getGeometry().transform('EPSG:4326', 'EPSG:3857');
	
				if(!pointLayer){
					pointLayer = new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [point]
						})
					})
					
					map.addLayer(pointLayer);
				}
				
				var style = new ol.style.Style({
					image: new ol.style.Icon({
						src: '/resources/images/pin.png',
						offset: [0, 0],
						imgSize: [30, 96]
					}),
					zIndex: 98
				});
				
				pointLayer.setStyle(style);
				
				pointLayer.getSource().addFeature(point);
			}else if(!jQuery("#lineBtn").hasClass("selected-btn")){
				var url = wmsSource.getFeatureInfoUrl(
						evt.coordinate, viewResolution, 'EPSG:3857',
						{'INFO_FORMAT': 'application/json'});
				
				if (url) {
					Common.ajax("/getWMSInfo", "GET", {url: url}, false, function(data){
						var code = data.emd_cd;
	
						if(code != _code){
							var wfsParams = {
									service: "wfs",
									version: "1.1.0",
									typeNames: "jbt:tl_scco_emd",
									featureID: code, 
									request: "GetFeature",
									outputFormat: "application/json"
							};
							
							Common.ajax("/getWFSInfo", "GET", {params: toParamString(wfsParams)}, false, setWfsInfo);
						}
						
					});
				}
			}
		}
	});
	
	jQuery("DIV.close-btn SPAN").click(function() {
		if(jQuery(this).parent().hasClass("emd")){
			jQuery("#popupDiv TABLE TD").empty();
			jQuery("#popupDiv").addClass("noDisplay");
			
			if(feature) {
				vectorLayer.getSource().removeFeature(feature);
				
				feature = null;
			}
			
			_code = "";
		}else{
			jQuery("#popupDiv2 TABLE TD").empty();
			jQuery("#popupDiv2").addClass("noDisplay");
		}
	})
	
	jQuery("#popupDiv").draggable({
		cancel: "#popupDiv .table-div"
	});
	
	jQuery("#popupDiv2").draggable({
		cancel: "#popupDiv2 .table-div"
	});
	
	jQuery("BUTTON.geometry-btn").click(function() {
		if(jQuery(this).hasClass("selected-btn")) {
			jQuery(this).removeClass("selected-btn");
			
			if(jQuery(this).attr("id") == "lineBtn") map.removeInteraction(drawInt);
		}else {
			jQuery("BUTTON.geometry-btn").removeClass("selected-btn");
			jQuery(this).addClass("selected-btn");
			
			if(jQuery(this).attr("id") == "lineBtn"){
				var source = new ol.source.Vector();
				
				if(!pointLayer){
					pointLayer = new ol.layer.Vector({
						source: source
					});
					
					map.addLayer(pointLayer);
				}else {
					source = pointLayer.getSource();
				}
				
				var style = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#63aadc',
						width: 3
					})
				});
				
				pointLayer.setStyle(style);
				
				drawInt = new ol.interaction.Draw({
					source: source,
					type: 'LineString'
				});
				
				map.addInteraction(drawInt);
				
				drawInt.on('drawstart', function(e) {
					var features = pointLayer.getSource().getFeatures();
					
					if(features.length > 0){
						features.forEach(function(v) {
							pointLayer.getSource().removeFeature(v);
						})
					}
				})
				
				drawInt.on('drawend', function(e) {
					point = e.feature;
				})
			}else{
				map.removeInteraction(drawInt);
			}
		}
	})
	
	jQuery("#searchBtn").click(function() {
		_searchParams.bound = jQuery("#bound").val();
		_searchParams.geometry = (new ol.format.WKT()).writeFeature(pointLayer.getSource().getFeatures()[0], {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});

		if(_searchParams.geometry.indexOf("LINESTRING") == -1) _searchParams.side = null;
		else _searchParams.side = jQuery("#side").val();
		
		if(pois && pois.length > 0) {
			pois.forEach(function(v) {
				poiLayer.getSource().removeFeature(v);
			});
			
			pois = [];
		}
		
		if(places && places.length > 0) {
			places.forEach(function(v) {
				placeLayer.getSource().removeFeature(v);
			});
			
			places = [];
		}
		
		if(circle) {
			circleLayer.getSource().removeFeature(circle);
			
			circle = null;
		}
		
		Common.ajax("/getFeaturesByBound", 'POST', _searchParams, false, function(data) {
			
			
			jQuery.each(data.LIST, function(i, v) {
				var wkt = new ol.format.WKT();
				var temp = wkt.readFeatureFromText(v.geom);
				
				temp.getGeometry().transform('EPSG:4326', 'EPSG:3857');
				
				jQuery.each(v, function(i, v) {
					temp.set(i, v);
				})
				
				if(v.type == 'POI') pois.push(temp);
				else if(v.type == 'PLACE') places.push(temp);
				else circle = temp;
			})
			
			circleLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: [circle]
				}),
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
			        	width: 1,
			        	color: [255, 0, 0, 1]
			        }),
			        fill: new ol.style.Fill({
			        	color: [0, 0, 255, 0.2]
			        }),
					zIndex: 90
				}),
				map: map
			})
			
			map.addLayer(circleLayer);
			
			if(places.length > 0){
				placeLayer = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: places
					}),
					style: new ol.style.Style({
						image: new ol.style.Icon({
							src: '/resources/images/point.png'
						}),
						zIndex: 99
					}),
					map: map
				})
				
				map.addLayer(placeLayer);
			}
			
			if(pois.length > 0){
				poiLayer = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: pois
					}),
					style: new ol.style.Style({
						image: new ol.style.Icon({
							src: '/resources/images/poi.png'
						}),
						zIndex: 99
					}),
					map: map
				})
				
				map.addLayer(poiLayer);
			}

		})
	})
});

function changeWmsSource(source, code){
	wmsLayer.getSource().updateParams({ENV: "code:"+code});
}


function toParamString(obj){
	var str = '';
	
	jQuery.each(obj, function(i, v){
		str += i+"="+v+"&";
	})
	
	return str.substring(0, str.length-1);
}


function setWfsInfo(data){
	if(feature) {
		vectorLayer.getSource().removeFeature(feature);
		
		feature = null;
	}
	
	jQuery("#popupDiv TABLE TD").empty();
	
	var properties = data.properties
	
	var keys = Object.keys(properties);
	
	keys.forEach(function(v){
		jQuery("#"+v).text(properties[v]);
		});
	
	feature = new ol.Feature({
		name: 'f1',
		geometry: new ol.geom.Polygon(data.geometry.coordinates[0])
	});
	
	feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
	
	vectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [feature]
	    }),
	    style: new ol.style.Style({
	        stroke: new ol.style.Stroke({
	        	width: 3,
	        	color: [255, 0, 0, 1]
	        })
	    }),
	    map: map
	})

	map.addLayer(vectorLayer);
	
	addOSMLayer(properties.emd_cd);
	
	openPopup();
}


function addOSMLayer(code) {
	if(pois && pois.length > 0) {
		pois.forEach(function(v) {
			poiLayer.getSource().removeFeature(v);
		});
		
		pois = [];
	}
	
	if(places && places.length > 0) {
		places.forEach(function(v) {
			placeLayer.getSource().removeFeature(v);
		});
		
		places = [];
	}
	
	Common.ajax("/getFeaturesByEmd", "GET", {code: code}, false, function(data) {
		var list = data.LIST;
		
		list.forEach(function(v, i) {
			var wkt = new ol.format.WKT();
			var osm = wkt.readFeatureFromText(v.geom);
			
			osm.getGeometry().transform('EPSG:4326', 'EPSG:3857');
			
			jQuery.each(v, function(i, v) {
				if(i != 'geom')	osm.set(i, v);
			})
			
			osm.on('click', function(evt) {
				console.log(evt);
			});
			
			if(v.type == 'POI') pois.push(osm);
			else places.push(osm);
		})
		
		if(places.length > 0){
			placeLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: places
				}),
				style: new ol.style.Style({
					image: new ol.style.Icon({
						src: '/resources/images/point.png'
					}),
					zIndex: 999
				}),
				map: map
			});
			
			
			map.addLayer(placeLayer);
		}
		
		if(pois.length > 0){
			poiLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: pois
				}),
				style: new ol.style.Style({
					image: new ol.style.Icon({
						src: '/resources/images/poi.png'
					}),
					zIndex: 999
				}),
				map: map
			});
			
			map.addLayer(poiLayer);
		}
		
	})
}


function addOSMLayer_WMS(code) {
	var osmParams = {
		VERSION: '1.1.0',
		LAYERS: 'jbt:gis_osm_pois_free_1',
		SRS: 'EPSG:4326',
		CQL_FILTER: "INTERSECTS(geom, querySingle('jbt:tl_scco_emd','geom','emd_cd="+code+"'))"
	}
	
	if(!osmLayer) {
		var osmSource = new ol.source.TileWMS({
			url: 'http://192.168.0.222:9098/geoserver/jbt/wms',
			params: osmParams,
			serverType: 'geoserver'
		});
		
		osmLayer = new ol.layer.Tile({
			source: osmSource
		})
		
		map.addLayer(osmLayer);
	}else{
		osmLayer.getSource().updateParams(osmParams);
	}
}


function openPopup() {
	jQuery("#popupDiv").css("top", "100px");
	jQuery("#popupDiv").css("left", "100px");
	
	jQuery("#popupDiv").removeClass("noDisplay");
}

function openPopup2() {
	jQuery("#popupDiv2").css("top", "100px");
	jQuery("#popupDiv2").css("right", "100px");
	jQuery("#popupDiv2").css("left", "unset");
	
	jQuery("#popupDiv2").removeClass("noDisplay");
}
