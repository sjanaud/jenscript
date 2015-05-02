//var catalogJSBase = JenSoft.Context.path+'/module/javascript/catalog/transform';
var views = {
		v1 :  {name : 'view1'  ,desc:'Donut2D Semantic Transform vs Geometric Transform', fnName: 'createDonut2D', file : 'donut2d.js', dashboard:true},
		v2 :  {name : 'view2'  ,desc:'Map Semantic Transform vs Geometric Transform', fnName: 'createMap', file : 'map.js', dashboard:true},
		v3 :  {name : 'view3'  ,desc:'Stock Semantic Transform vs Geometric Transform', fnName: 'createStock', file : 'stock.js', dashboard:true},
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


