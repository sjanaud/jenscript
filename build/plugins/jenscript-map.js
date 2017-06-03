// JenScript - 1.3.1 2017-06-03
// http://jenscript.io - Copyright 2017 Sébastien Janaud. All Rights reserved

(function(){
	//http://en.wikipedia.org/wiki/GeoJSON
	JenScript.GeoJSON = function(data) {
		this.init(data);
		this.Id = 'GeoJSON'+JenScript.sequenceId++;
		this.geom = ['Point','MultiPoint','LineString','MultiLineString','Polygon','MultiPolygon'];
	};
	JenScript.Model.addMethods(JenScript.GeoJSON,{
			
			init : function(data){
				this.data = data || {};
			},
			
			getId : function(){
				return this.Id;
			},
			
			isFeatureCollection : function(){
				return (this.getType() === 'FeatureCollection');
			},
			
			isFeature : function(){
				return (this.getType() === 'Feature');
			},
			
			isGeometry : function(){
				for (var g = 0; g < this.geom.length; g++) {
					var type = this.geom[g];
					if(this.getType() === type)
						return true;
				}
				return false;
			},
			
			getProperties : function(){
				return this.data.properties;
			},
			
			getProperty : function(property){
				return this.data.properties[property];
			},
			
			getType : function(){
				return this.data.type;
			},
	});
	
	JenScript.MapGeometry = function(data) {
		this._init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapGeometry, JenScript.GeoJSON);
	JenScript.Model.addMethods(JenScript.MapGeometry,{
		_init : function(data){
			JenScript.GeoJSON.call(this, data);
			this.Id = 'mapgeometry'+JenScript.sequenceId++;
			this.coordinates = this.data.coordinates;
		},
		
		toString : function(){
			return 'JenScript.MapGeometry';
		},
		
		getCoordinates : function(){
			return this.coordinates;
		},
		
		isPolygon : function(){
			return (this.getType() === 'Polygon');
		},
		
		isMultiPolygon : function(){
			return (this.getType() === 'MultiPolygon');
		},
		
		isPoint : function(){
			return (this.getType() === 'Point');
		},
		
	});
	
	JenScript.MapPoint = function(data) {
		this.__init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapPoint, JenScript.MapGeometry);
	JenScript.Model.addMethods(JenScript.MapPoint,{
		__init : function(data){
			JenScript.MapGeometry.call(this, data);
			this.Id = 'mappoint'+JenScript.sequenceId++;
		},
		
		toString : function(){
			return 'JenScript.MapPoint';
		},
		
	});
	
	JenScript.MapPolygon = function(data) {
		this.__init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapPolygon, JenScript.MapGeometry);
	JenScript.Model.addMethods(JenScript.MapPolygon,{
		__init : function(data){
			JenScript.MapGeometry.call(this, data);
			this.Id = 'mappolygon'+JenScript.sequenceId++;
		},
		
		toString : function(){
			return 'JenScript.MapPolygon';
		},
		
	});
	
	JenScript.MapMultiPolygon = function(data) {
		this.__init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapMultiPolygon, JenScript.MapGeometry);
	JenScript.Model.addMethods(JenScript.MapMultiPolygon,{
		__init : function(data){
			JenScript.MapGeometry.call(this, data);
			this.Id = 'mapmultipolygon'+JenScript.sequenceId++;
		},
		
		toString : function(){
			return 'JenScript.MapMultiPolygon';
		},
		
	});
	
	JenScript.MapFeature = function(data) {
		this._init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapFeature, JenScript.GeoJSON);
	JenScript.Model.addMethods(JenScript.MapFeature,{
		_init : function(data){
			JenScript.GeoJSON.call(this, data);
			this.Id = 'mapfeature'+JenScript.sequenceId++;
			this.geometry=new JenScript.MapGeometry(this.data.geometry);
			if(this.geometry.isPolygon()){
				this.geometry=new JenScript.MapPolygon(this.data.geometry);
			}
			else if(this.geometry.isMultiPolygon()){
				this.geometry=new JenScript.MapMultiPolygon(this.data.geometry);
			}
			else if(this.geometry.isPoint()){
				this.geometry=new JenScript.MapPoint(this.data.geometry);
			}
			this.fillColor = 'orange';
			this.fillOpacity = 0.2;
			this.strokeColor = 'white';
			this.strokeOpacity = 1;
			this.strokeWidth= 0.5;
		},
		
		getGeometry : function(){
			return this.geometry;
		},
		
	});
	
	JenScript.MapFeatureCollection = function(data) {
		this._init(data);
	};
	JenScript.Model.inheritPrototype(JenScript.MapFeatureCollection, JenScript.GeoJSON);
	JenScript.Model.addMethods(JenScript.MapFeatureCollection,{
		_init : function(data){
			JenScript.GeoJSON.call(this, data);
			this.Id = 'mapfeaturecollection'+JenScript.sequenceId++;
			this.features = [];
			for (var f = 0; f < this.data.features.length; f++) {
				this.features[f] = new JenScript.MapFeature(this.data.features[f]);
			}
		},
		
		size : function(){
			return this.features.length;
		},
		
		getFeature : function(index){
			return this.features[index];
		},
		
		getFeatures : function(){
			return this.features;
		},
		
	});
	
})();
(function(){
	
	JenScript.MapBackgroundPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapBackgroundPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapBackgroundPlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			config.name ='MapBackgroundPlugin';
			JenScript.Plugin.call(this, config);
		},
		
		
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			var w = this.getProjection().getView().getDevice().getWidth();
			var h = this.getProjection().getView().getDevice().getHeight();
			var rect = new JenScript.SVGRect().origin(0,0).size(w,h);
			g2d.insertSVG(rect.strokeNone().fill('#3498db').toSVG());
		}
			
	});
})();
(function(){
	
	JenScript.TilePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.TilePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.TilePlugin,{
		_init : function(config){
			config = config || {};
			this.tileServer = (config.tileServer !== undefined)?config.tileServer : 'https://a.tile.openstreetmap.org';
			this.opacity= (config.opacity !== undefined)?config.opacity : 1;
			config.priority = 1000;
			config.name ='TilePlugin';
			this.tms = (config.tms !== undefined)?config.tms :false;
			JenScript.Plugin.call(this, config);
		},
		
		/**
		 * on projection register, add projection bound listener to repaint this plugin
		 */
		onProjectionRegister : function(){
			var that = this;
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'Tile plugin listener for projection bound changed');
			
			this.addPluginListener('scale', function(){
				//console.log('tile plugin scale changed');
				that.repaintPlugin();
				
			},'Tile plugin listener for scale changed');
			
			this.addPluginListener('translate', function(){
				//console.log('tile plugin translate changed');
				that.repaintPlugin();
			},'Tile plugin listener for translate changed');
		},
		
		createDalle : function(g2d){
			this.destroyGraphics();
			var proj1 = this.getProjection();
			var cp = proj1.getCenterPosition();
			var dalle1 = proj1.getProjection();
			var tileSize = dalle1.getSquareTileSize(); //256
			var dL = 0;
			var factor= 1;
			if(this.sx < 1){
				var flag = true;
				var val = 1;
				var delta = -1;
				while(flag){
					var min = val/2;
					var max = val;
					if(this.sx >= min && this.sx <max){
						//console.log('found generic sx<1 values : '+this.sx +' with min/max'+min+'/'+max+' delta/divisor :'+delta+'/'+min);
						dL = delta;
						factor = min;
						flag = false;
					}
					delta--;
					val = min;
				}
			}else{
				var flag = true;
				var val = 1;
				var delta = 0;
				while(flag){
					var min = val;
					var max = val *2;
					if(this.sx >= min && this.sx <max){
						//console.log('found generic sx>1 values : '+this.sx +' with min/max : '+min+'/'+max+' delta/divisor :'+delta+'/'+min);
						dL = delta;
						factor = min;
						flag = false;
					}
					delta++;
					val = max;
				}
			}
			
			var proj = new JenScript.MapProjection({
				level : (dalle1.getZoom() + dL),
				centerPosition : cp
			});
			
			proj.view = this.getView();
			var dalle = proj.getProjection();
			var width = this.getView().getDevice().getWidth();
			var height = this.getView().getDevice().getHeight();
			
			var longMin = this.p2u({x:0,y:0}).x;
			var longMax = this.p2u({x:width,y:0}).x;
			var latMax = this.p2u({x:0,y:0}).y;
			var latMin = this.p2u({x:0,y:height}).y;
			
//			var minXIndex = dalle.longToXIndex(proj.getMinX());
//			var maxXIndex = dalle.longToXIndex(proj.getMaxX());
//			var minYIndex = dalle.latToYIndex(proj.getMaxY());
//			var maxYIndex = dalle.latToYIndex(proj.getMinY());
			
			var minXIndex = dalle.longToXIndex(longMin);
			var maxXIndex = dalle.longToXIndex(longMax);
			var minYIndex = dalle.latToYIndex(latMax);
			var maxYIndex = dalle.latToYIndex(latMin);

			//shift pixel between 2 projections
			var xx1 = proj1.longToPixel(proj.getMinX());
			var xx2 = proj.longToPixel(proj.getMinX());
			
			var yy1 = proj1.latToPixel(proj.getMinY());
			var yy2 = proj.latToPixel(proj.getMinY());
			
			var dd1 = xx1-xx2;
			var dd2 = yy1 -yy2;
			//console.log('dd1/dd2::'+dd1+','+dd2);
			for (var x = minXIndex  ; x <= maxXIndex ; x++) {
				for (var y = minYIndex ; y <= maxYIndex; y++) {
					
					var long = dalle.tileToLong(x);
					var lat = dalle.tileToLat(y);
					var xpixel = proj.longToPixel(long);
					var ypixel = proj.latToPixel(lat);
					//console.log('x,y pixels tile : '+xpixel+','+ypixel);
					if(dalle.getZoom() >= 0 && x >= 0 && y >=0 && x<= dalle.getMaxTileIndex() && y<= dalle.getMaxTileIndex()){
						var tileURL1;
						if(this.tms){
							tileURL1 = this.tileServer+'/'+dalle.getZoom()+'/'+x+'/'+(dalle.getMaxTileIndex()-y)+'.png';
						}else{
							tileURL1 = this.tileServer+'/'+dalle.getZoom()+'/'+x+'/'+y+'.png';
						}
						var imageTile = new JenScript.SVGImage().attr('transform','translate('+(dd1)+','+(-dd2) +')'+' scale('+1/factor+')').opacity(this.opacity).xlinkHref(tileURL1).origin(xpixel,ypixel).size(tileSize,tileSize);
						g2d.insertSVG(imageTile.toSVG());
						
						//var imageTile = new JenScript.SVGRect().attr('transform','translate('+(dd1)+','+(-dd2) +')'+' scale('+1/factor+')').opacity(this.opacity).origin(xpixel,ypixel).stroke('black').fillNone().size(tileSize,tileSize);
						//g2d.insertSVG(imageTile.toSVG());
					}

				}
			}

		},
		
		
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.createDalle(g2d);
		}
	});
})();
(function(){
	
	JenScript.MapTranslatePlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.MapTranslatePlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.MapTranslatePlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			config.name ='MapTranslatePlugin';
			JenScript.Plugin.call(this, config);
			this.startPoint;
			this.currentPoint;
			this.translate = false;
		},
		
		onPress : function(evt,part,x,y){
			//mozilla, prevent Default to enable dragging correctly
			if(evt.preventDefault){
				evt.preventDefault();
			}
			this.translate = true;
			this.startPoint = new JenScript.Point2D(x,y);
			
		},
		
		onRelease : function(evt,part,x,y){
			this.translate = false;
		},
		
		onMove : function(evt,part,x,y){
			if(!this.translate) return;
			this.currentPoint = new JenScript.Point2D(x,y);
			var dLong =  this.getProjection().pixelToLong(this.startPoint.x)-this.getProjection().pixelToLong(this.currentPoint.x);
			var dLat =   this.getProjection().pixelToLat(this.startPoint.y)-this.getProjection().pixelToLat(this.currentPoint.y);
			var cp = this.getProjection().getCenterPosition();
			this.getProjection().setCenterPosition(new JenScript.GeoPosition(cp.latitude+dLat,cp.longitude+dLong));
			this.startPoint = this.currentPoint;
		},
			
	});
})();
(function(){
	
	
	JenScript.ZoomMapWheelPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.ZoomMapWheelPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.ZoomMapWheelPlugin, {
		_init : function(config){
			config = config || {};
			
			config.name =  "ZoomMapWheelPlugin";
			config.selectable = false;
			config.priority = 1000;
			this.increment = (config.increment !== undefined)?config.increment : 1;
			
			this.wheelListeners = [];
			JenScript.Plugin.call(this,config);
		},
		
		addWheelListener : function(actionEvent,listener,name) {
			var l={action:actionEvent,onEvent:listener,name:name};
			this.wheelListeners[this.wheelListeners.length] = l;
		},
		
		fireWheelEvent : function(action){
			for(var i = 0 ;i<this.wheelListeners.length;i++){
				var l = this.wheelListeners[i];
				if(l.action === action)
					l.onEvent(this);
			}
		},
		
		onPress : function(evt,part,x,y){
			this.stopWheel = true;
		},
		
		onRelease : function(evt,part,x,y){
			this.stopWheel = false;
		},
		
		onMove: function(evt,part,x,y){
			var p = new JenScript.Point2D(x,y);
			this.mp = this.getProjection().pixelToUser(p);
			//console.log('set position mp :'+this.mp);
		},
		
		onWheel : function(evt,part,x,y){
			evt.preventDefault();
			//console.log('zoomWheel onWheel');
			
			var that=this;
			var temporizeIn = function(i){
				setTimeout(function(){
					that.zoomIn();
				},100*i);
			};
			var temporizeOut = function(i){
				setTimeout(function(){
					that.zoomOut();
				},100*i);
			};
			
			var exe = function(rotation){
				if (rotation < 0) {
					var count = -rotation;
					for (var i = 0; i < count; i++) {
						temporizeIn(i);
					}
				} else {
					var count = rotation;
					for (var i = 0; i < count; i++) {
						temporizeOut(i);
					}
				}
			};
			
			if(evt.deltaY){
				exe(evt.deltaY);
			}
		},
	
		/**
		 * bound zoom in
		 */
		zoomIn : function() {
			if(this.stopWheel) return;
			this.getProjection().setLevel(this.getProjection().getLevel()+this.increment);
			if(this.mp !== undefined){
				//this.getProjection().setCenterPosition(this.mp);
			}
			
//			var that = this;
//			var exec = function(i){
//				setTimeout(function(){
//					that.getProjection().setLevel(that.getProjection().getLevel()+1/5);
//					if(that.mp !== undefined){
//						//this.getProjection().setCenterPosition(this.mp);
//					}
//				},i*10);
//			};
//			
//			
//			for (var i = 0; i <5; i++) {
//				exec(i);
//			}
			this.fireWheelEvent('zoomIn');
		},

		/**
		 * bound zoom out
		 */
		 zoomOut : function() {
			if(this.stopWheel) return;
			this.getProjection().setLevel(this.getProjection().getLevel()-this.increment);
			if(this.mp !== undefined){
				//this.getProjection().setCenterPosition(this.mp);
			}
//			var that = this;
//			var exec = function(i){
//				setTimeout(function(){
//					that.getProjection().setLevel(that.getProjection().getLevel()-1/5);
//					if(that.mp !== undefined){
//						//this.getProjection().setCenterPosition(this.mp);
//					}
//				},i*10);
//			};
//			for (var i = 0; i <5; i++) {
//				exec(i);
//			}
			this.fireWheelEvent('zoomOut');
		}
	});	
})();
(function(){
	
	//literal : path :
	//path.element : dom element
	//path.points : pixel polygon points
	//path.feature : feature
	//path.lockEnter :shape flag enter/rollover
	
	
	/**
	 * geo remote, useless, change for a classical dom way
	 */
	JenScript.GeoRemote = function(path) {
		this.path = path;
		
		
		this.fill = function(color){
			this.path.element.setAttribute('fill',color);
			this.path.feature.fillColor = color;
		};
		
		this.fillOpacity = function(opacity){
			this.path.element.setAttribute('fill-opacity',opacity);
			this.path.feature.fillOpacity = opacity;
		};
		
		this.stroke = function(color){
			this.path.element.setAttribute('stroke',color);
			this.path.feature.strokeColor = color;
		};
		
		this.strokeOpacity = function(opacity){
			this.path.element.setAttribute('stroke-opacity',opacity);
			this.path.feature.strokeOpacity = opacity;
		};
		
		this.strokeWidth = function(width){
			this.path.element.setAttribute('stroke-width',width);
			this.path.feature.strokeWidth = width;
		};
	};
	
	
	JenScript.GeoJSONPlugin = function(config) {
		this._init(config);
	};
	JenScript.Model.inheritPrototype(JenScript.GeoJSONPlugin, JenScript.Plugin);
	JenScript.Model.addMethods(JenScript.GeoJSONPlugin,{
		
		_init : function(config){
			config = config || {};
			config.priority = 1000;
			config.name ='GeoJSONPlugin';
			JenScript.Plugin.call(this, config);
			//this.async = (config.async !== undefined)?config.async :  false;
			this.data = [];
			this.paths = [];
			this.features = [];
			this.geoListeners = [];
		},
		

		/**
		 * on projection register
		 */
		onProjectionRegister : function(){
			var that = this;
			
			//strategy : repaint if proj changed
			//can potentially use CPU each time projection change a lot.
			this.getProjection().addProjectionListener('boundChanged', function(){
				that.repaintPlugin();
			},'GeoJSONPlugin plugin listener for projection bound changed');
			
			
			//on scale, set stroke width equivalent to 1
			this.addPluginListener('scale', function(){
				//console.log('geo json plugin scale listener changed');
				for (var i = 0; i < that.paths.length; i++) {
					var path = that.paths[i];
					if(path.revertScale !== undefined && path.revertScale == true){
						path.element.setAttribute('stroke-width',(path.feature.strokeWidth/that.sx));
					}
				}
			},'GeoJSONPlugin plugin listener for scale changed, change stroke according to scale');
		},
		
		/**
	     * add geo listener with given action like feature 'register', feature geometry 'press', 'release' and 'move'
	     * 
	     * @param {String}   geo action event type
	     * @param {Function} listener
	     * @param {String}   listener owner name
	     */
		addGeoListener  : function(actionEvent,listener,name){
			if(name === undefined)
				throw new Error('GeoJSON listener, listener name should be supplied.');
			var l = {action:actionEvent , onEvent : listener,name:name};
			this.geoListeners[this.geoListeners.length] =l;
		},
		
		/**
		 * fire listener when translate is being to start, stop, translate,finish L2R, and B2T
		 */
		fireGeoJSONEvent : function(actionEvent,eventObject){
			for (var i = 0; i < this.geoListeners.length; i++) {
				var l = this.geoListeners[i];
				if(actionEvent === l.action){
					l.onEvent(eventObject);
				}
			}
		},
		
		/**
		 * get features that be registered in this plugin
		 * @returns features 
		 */
		getFeatures : function(){
			return this.features;
		},
		
		/**
		 * add GeoJSON data to this plugin
		 * @param {Object} data GeoJSON object
		 */
		addGeoJSON : function(data){
			this.data[this.data.length] = data;
			var	geojson = new JenScript.GeoJSON(data);
			if(geojson.isFeatureCollection()){
				var featureCollection = new JenScript.MapFeatureCollection(data);
				for (var f = 0; f < featureCollection.size(); f++) {
					var feature = featureCollection.getFeature(f);
					this.features[this.features.length] =  feature;
					this.fireGeoJSONEvent('register',{ type : 'register', target : undefined, feature : feature, remote : undefined});
				}
			}
			else if(geojson.isFeature){
				var feature = new JenScript.MapFeature(data);
				this.features[this.features.length] =  feature;
				this.fireGeoJSONEvent('register',{ type : 'register', target : undefined, feature : feature, remote : undefined});
			}
			this.repaintPlugin();
		},
		
		
		check : function(action,evt,part,x,y){
			for (var i = 0; i < this.paths.length; i++) {
				var polygon = this.paths[i].polygon;
				if(this.isPointInPoly(polygon,new JenScript.Point2D(x,y))){
					if(this.paths[i].lockEnter == false){
						for (var p = 0; p < this.paths.length; p++) {
							
							//this.paths[p].lockEnter = false; 
							//force all false
							if(this.paths[p].lockEnter == true){
								this.paths[p].lockEnter = false;
								this.fireGeoJSONEvent('exit',{type : 'exit' , x:x, y:y, point :new JenScript.Point2D(x,y), target : this.paths[p], feature : this.paths[p].feature , remote : new JenScript.GeoRemote(this.paths[p])});
							}
						}
						this.paths[i].lockEnter = true;
						this.fireGeoJSONEvent('enter',{type : 'enter' , x:x, y:y, point :new JenScript.Point2D(x,y), target : this.paths[i], feature : this.paths[i].feature , remote : new JenScript.GeoRemote(this.paths[i])});
					}
					this.fireGeoJSONEvent(action,{type : action , x:x, y:y, point :new JenScript.Point2D(x,y), target : this.paths[i], feature : this.paths[i].feature , remote : new JenScript.GeoRemote(this.paths[i])});
				}else{
					if(this.paths[i].lockEnter == true){
						this.paths[i].lockEnter = false;
						this.fireGeoJSONEvent('exit',{type : 'exit' , x:x, y:y, point :new JenScript.Point2D(x,y), target : this.paths[i], feature : this.paths[i].feature , remote : new JenScript.GeoRemote(this.paths[i])});
					}
				}
			}
		},
		
		onPress : function(evt,part,x,y){
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.check('press',evt,part,x,y);
		},
		
		isPointInPoly : function(poly, pt){
			//console.log('is in polygon '+pt.x+','+pt.y);
			//var proj = this.getProjection();
			//pt = new JenScript.Point2D(pt.x,pt.y);
			pt = new JenScript.Point2D((pt.x - this.tx)/this.sx,(pt.y-this.ty)/this.sy);
		    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
		        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		        && (c = !c);
		    return c;
		},
		
		isNearLine : function(coordinates,pt){
			var x0 = pt.x;
			var y0 = pt.y;
			for (var i = 0; i < coordinates.length-1; i++) {
				var p1 = coordinates[i];
				var x1 = p1.x;
				var y1 = p1.y;
				var p2 = coordinates[i+1];
				var x2 = p2.x;
				var y2 = p2.y;
				var Dx = x2 - x1;
		        var Dy = y2 - y1;
		        var d = Math.abs(Dy*x0 - Dx*y0 - x1*y2+x2*y1)/Math.sqrt(Math.pow(Dx, 2) + Math.pow(Dy, 2));
		        if(d<4) //4 pixels
		        	return true;
			}
			return false;
		},
		
		onRelease : function(evt,part,x,y){
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.check('release',evt,part,x,y);
		},
		
		onMove : function(evt,part,x,y){
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.check('move',evt,part,x,y);
		},
		
		
		/**
		 * paint feature point
		 */
		paintPoint : function(g2d,feature,geometry){
			var coordinates = geometry.getCoordinates();
			var proj = this.getProjection();
			var long = coordinates[0];
			var lat = coordinates[1];
			var pp = proj.userToPixel({x :long, y :lat});
			
			var svgCircle = new JenScript.SVGCircle().center(pp.x,pp.y).radius(2).attr('transform','scale('+1/this.sx+')');
			svgCircle.fill('black').fillOpacity(0.8);
			
			g2d.insertSVG(svgCircle.toSVG());
		},

		/**
		 * paint feature polygon
		 */
		paintPolygon : function(g2d,feature,geometry){
			var coordinates = geometry.getCoordinates();
			var proj = this.getProjection();
			var svgPath = new JenScript.SVGPath().Id(geometry.Id).attr('fill-rule','evenodd');
			var points = [];
			
			//extract start
			for (var k = 0; k < coordinates.length; k++) {
				var subCoordinates = coordinates[k];
				for (var j = 0; j < subCoordinates.length; j++) {
					var point = subCoordinates[j];
					var pp = proj.userToPixel({x :point[0], y :point[1]});
					points[points.length] = pp;
					if(j == 0){
						svgPath.moveTo(pp.x,pp.y);
					}else{
						svgPath.lineTo(pp.x,pp.y);
					}
				}
				svgPath.close();
				//fill-rule="evenodd"
			}
			
			var pathElement = svgPath.stroke(feature.strokeColor).strokeOpacity(feature.strokeOpacity).strokeWidth(feature.strokeWidth).fill(feature.fillColor).fillOpacity(feature.fillOpacity);
			
			if(feature.texture !== undefined){
				g2d.deleteGraphicsElement(feature.texture.getId());
				g2d.definesTexture(feature.texture);
				//g2d.insertSVG(shape.fillURL(this.texture.Id).opacity(this.opacity).toSVG());
				pathElement.fillURL(feature.texture.getId());
			}
			
			pathElement = pathElement.toSVG();
			
			g2d.deleteGraphicsElement(geometry.Id);
			g2d.insertSVG(pathElement);
			this.paths[this.paths.length]= {element : pathElement, polygon : points, feature : feature , lockEnter : false, revertScale : true};
		},
		
		paintMultiPolygon : function(g2d,feature,geometry){
			var multiPolygon = geometry.getCoordinates();
			for (var m = 0; m < multiPolygon.length; m++) {
				//console.log(" start paint multipolygon "+m+" :"+multiPolygon[m].length);
				var coordinates = multiPolygon[m];
				var proj = this.getProjection();
				var svgPath = new JenScript.SVGPath().Id(geometry.Id+'_'+m).attr('fill-rule','evenodd');
				var points = [];
				
				//extract start
				for (var k = 0; k < coordinates.length; k++) {
					var subCoordinates = coordinates[k];
					//console.log(" multipolygon segment count point : "+subCoordinates.length);
					for (var j = 0; j < subCoordinates.length; j = j + 1) {
						//console.log(" multipolygon segment count point : "+j);
						var point = subCoordinates[j];
						var pp = proj.userToPixel({x :point[0], y :point[1]});
						points[points.length] = pp;
						if(j == 0){
							svgPath.moveTo(pp.x,pp.y);
						}else{
							svgPath.lineTo(pp.x,pp.y);
						}
					}
					svgPath.close();
					//fill-rule="evenodd"
				}
				
				var pathElement = svgPath.stroke(feature.strokeColor).strokeOpacity(feature.strokeOpacity).strokeWidth(feature.strokeWidth).fill(feature.fillColor).fillOpacity(feature.fillOpacity);
				
				if(feature.texture !== undefined){
					g2d.deleteGraphicsElement(feature.texture.getId());
					g2d.definesTexture(feature.texture);
					pathElement.fillURL(feature.texture.getId());
				}
				
				pathElement = pathElement.toSVG();
				g2d.deleteGraphicsElement(geometry.Id+'_'+m);
				g2d.insertSVG(pathElement);
				this.paths[this.paths.length]= {element : pathElement, polygon : points, feature : feature, lockEnter : false, revertScale : true};
				//console.log(" end paint multipolygon "+m+" :"+multiPolygon[m].length);
				
			}
		},
		
		paintFeature : function(g2d, feature){
			if(feature.visible !== undefined && feature.visible === false) return;
			//console.log("paint feature : "+feature.Id);
			var geometry = feature.getGeometry();
			var that= this;
			
			//console.log('geometry :'+geometry);
			if(geometry.isPolygon()){
				this.paintPolygon(g2d,feature,geometry);
				
			}else if(geometry.isMultiPolygon()){
				this.paintMultiPolygon(g2d,feature,geometry);
				
			}else if(geometry.isPoint()){
				this.paintPoint(g2d,feature,geometry);
			}

		},
		
		/**
		 * paint plugin
		 * @params {Object} g2d graphics context
		 * @params {Object} part view part
		 */
		paintPlugin : function(g2d, part) {
			if (part !== JenScript.ViewPart.Device) {
				return;
			}
			this.paths = [];
			for (var f = 0; f < this.features.length; f++) {
				var feature = this.features[f];
				this.paintFeature(g2d,feature);
			}
		}
	});
})();