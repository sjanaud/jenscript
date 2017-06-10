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
		
		clear : function(){
			this.data = [];
			this.paths = [];
			this.features = [];
			this.repaintPlugin();
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
			else if(geojson.isFeature()){
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