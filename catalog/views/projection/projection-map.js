
/**
 * Create map projection with Label plugin
 * @param container
 * @param width
 * @param height
 */
function createMapProjection(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var bg1 = new JenScript.GradientViewBackground();
	view.addViewBackground(bg1);
	var textureBackground = new JenScript.TexturedViewBackground({
		opacity : 0.3,
		texture : JenScript.Texture.getTriangleCarbonFiber(),
		strokeColor : 'cyan',
		strokeWidth : 2,
		cornerRadius : 0
	});
	view.addViewBackground(textureBackground);

	var proj = new JenScript.MapProjection({
		level : 2
	});
	view.registerProjection(proj);
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		var feature = event.feature;
		//if(feature.getProperty('sovereignt') === 'France'){
			feature.fillColor   = JenScript.RosePalette.TURQUOISE;
			feature.fillOpacity = 0.3;
			feature.strokeColor = JenScript.RosePalette.MANDARIN;
			feature.strokeWidth = 0;
		//}
			if(feature.getProperty('sovereignt') === 'France'){
				feature.fillColor   = JenScript.RosePalette.MANDARIN;
				feature.fillOpacity = 0.5;
				feature.strokeColor = JenScript.RosePalette.LIME;
				feature.strokeWidth =0;
			}
		//on register you can prepare your feature rendering property
	},'map demo');

	//semantic transform
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin]
	});
	proj.registerPlugin(transform);
	
	var MapLoader = function(assets,callback){
		 this.loadMap = function(){
			var dataWorker = new Worker('/catalog/views/map/DataWorker.js');
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
	
	var loader = new MapLoader(['countries.geojson'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	

	//label for listener
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	var label = new JenScript.TextLabel({
		fillColor : 'none',
		outlineColor : JenScript.RosePalette.TURQUOISE,
		outlineWidth : 2,
		cornerRadius : 6,
		textColor : JenScript.RosePalette.LIME,
	});
	labelPlugin.addLabel(label);

	var updateText = function(action, point) {
		
		//with semantic transform, ask to a given slave plugin transform user/pixel
		var pu = transform.p2u(geojsonPlugin,point.device);
		
		label.setText(action + ' : P(long:' + pu.x.toFixed(8) + ' , Lat:'+ pu.y.toFixed(8) + ')');
				
		if (point.device.x > view.getDevice().getWidth() - 100) {
			label.setTextAnchor('end');
		} else if (point.device.x < 100) {
			label.setTextAnchor('start');
		} else {
			label.setTextAnchor('middle');
		}
		label.setX(point.device.x);
		label.setY(point.device.y);
		labelPlugin.repaintPlugin();
	};

	var dumpCoordinate = new JenScript.DumpCoordinatePlugin();
	dumpCoordinate.addDumpListener('press', function(point) {
		updateText('press', point);
	});
	dumpCoordinate.addDumpListener('move', function(point) {
		updateText('move', point);
	});
	dumpCoordinate.addDumpListener('release', function(point) {
		updateText('release', point);
	});
	proj.registerPlugin(dumpCoordinate);
}
