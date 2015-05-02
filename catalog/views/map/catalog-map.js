//var catalogJSBase = JenSoft.Context.path+'/module/javascript/catalog/map';
var views = {
		v1 :  {name : 'view1' ,desc:'Slippy Map', fnName: 'createViewSlippyMap', file : 'map-slippymap.js'},
		v2 :  {name : 'view2' ,desc:'GeoJSON Map', fnName: 'createViewGeoJSONMap', file : 'map-geojson.js'},
		v3 :  {name : 'view3' ,desc:'Slippy Map + GeoJSON', fnName: 'createViewCompositeMap', file : 'map-composite.js'},
		v4 :  {name : 'view4' ,desc:'Map Label', fnName: 'createViewMapLabel', file : 'map-label.js'},
		v5 :  {name : 'view5' ,desc:'Map France', fnName: 'createViewMapFrance', file : 'map-fr.js'},
		v6 :  {name : 'view6' ,desc:'Map Italia', fnName: 'createViewMapItalia', file : 'map-italia.js'},
		v7 :  {name : 'view7' ,desc:'Map USA & Multiple Projection', fnName: 'createViewMapUSA', file : 'map-usa.js'},
		v8 :  {name : 'view8' ,desc:'Map Australia', fnName: 'createViewMapAUS', file : 'map-aus.js'},
		v9 :  {name : 'view9' ,desc:'Map Germany', fnName: 'createViewMapDEU', file : 'map-germany.js'},
		v10 :  {name : 'view10' ,desc:'Map Oceans Bottom', fnName: 'createViewMapOceans', file : 'map-oceans.js'},
		v11 :  {name : 'view11' ,desc:'Map Natural Earth 2', fnName: 'createViewMapNaturalEarth2', file : 'map-ne2.js'},
		v12 :  {name : 'view12' ,desc:'Europe Map', fnName: 'createViewEuropeMap', file : 'map-eu.js'},
		v13 :  {name : 'view13' ,desc:'Slice Map', fnName: 'createViewSliceMap', file : 'map-slice.js'},
		
		
};


var MapLoader = function(assets,callback){
	
	 
	 this.loadMap = function(){
		var dataWorker = new Worker(JenSoft.Context.path+ '/module/javascript/catalog/map/DataWorker.js');
		dataWorker.addEventListener("message", function(event) {
			
			//console.log('data receive : '+event.data);
			var geoJSON = JSON.parse(event.data);
			if(callback !== undefined)
				callback(geoJSON);
		}, false);
		
		for (var i = 0; i < assets.length; i++) {
			dataWorker.postMessage(assets[i]);
		}
		
	};

	this.loadMap();
};