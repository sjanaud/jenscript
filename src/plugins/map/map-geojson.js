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