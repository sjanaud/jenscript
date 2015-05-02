
/**
 * Create France Map
 * @param container
 * @param width
 * @param height
 */
function createViewMapFrance(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 900,
		height : 900,
		holders : 10,
		
	});

	var proj = new JenScript.MapProjection({
		level : 5,
		centerPosition :new JenScript.GeoPosition(46.5,2.4)
	});
	view.registerProjection(proj);
	
	//default osm 
	var tilePlugin = new JenScript.TilePlugin({
		opacity : 0.5
	});
	proj.registerPlugin(tilePlugin);
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.TURQUOISE;
			feature.fillOpacity = 0.3;
			feature.strokeColor = JenScript.RosePalette.MANDARIN;
			feature.strokeWidth = 0;
		//on register you can prepare your feature rendering property
	},'map demo');

	

	
	var loader = new MapLoader([/*'FRA/country-FRA.json' ,*/'FRA/country-state-FRA.json','FRA/country-places-FRA.json'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	

	geojsonPlugin.addGeoListener('press', function(event){
		console.log('press '+event.type);
		//on event you can remote your feature
		var remote = event.remote;
		remote.fill('purple');
		remote.fillOpacity(0.4);
		remote.stroke('white');
		
	},'map demo');
	
	geojsonPlugin.addGeoListener('release', function(event){
		//console.log('release '+event.feature.Id);
	},'map demo');
	
	geojsonPlugin.addGeoListener('enter', function(event){
		console.log('enter '+event.feature.Id);
		var remote = event.remote;
		remote.fill('orange');
		remote.fillOpacity(0.4);
		remote.stroke('white');
		remote.strokeWidth(0.5);
	},'map demo');
	
	geojsonPlugin.addGeoListener('exit', function(event){
		//console.log('exit '+event.feature.Id);

		
//		var feature = event.feature;
//		feature.fillColor   = JenScript.RosePalette.TURQUOISE;
//		feature.fillOpacity = 0.3;
//		feature.strokeColor = JenScript.RosePalette.MANDARIN;
//		feature.strokeWidth = 0;
//		geojsonPlugin.repaintPlugin();
		
		//or remote
		var remote = event.remote;
		remote.fill(JenScript.RosePalette.TURQUOISE);
		remote.fillOpacity(0.3);
		remote.stroke('none');
		remote.strokeWidth(0);
		
	},'map demo');

	geojsonPlugin.addGeoListener('move', function(event){
		var feature = event.feature;
		var country = feature.getProperty('sovereignt');
	},'map demo');
	
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin,tilePlugin],
	});
	proj.registerPlugin(transform);
	
	
	
	//label for listener
	var labelPlugin = new JenScript.TextLabelPlugin();
	proj.registerPlugin(labelPlugin);
	
	var label = new JenScript.TextLabel({
		fillColor : 'none',
		outlineColor : JenScript.RosePalette.TURQUOISE,
		outlineWidth : 2,
		cornerRadius : 6,
		textColor : JenScript.RosePalette.COALBLACK,
	});
	labelPlugin.addLabel(label);

	var updateText = function(action, point) {
		
		
		//proj tx & ty come from semantic translate which is special behavior of map projection
		var geo = proj.pixelToUser(new JenScript.Point2D((point.device.x-geojsonPlugin.tx)/geojsonPlugin.sx,(point.device.y-geojsonPlugin.ty)/geojsonPlugin.sy));
		
		label.setText(action + ' : P(long:' + geo.x + ' , Lat:'+geo.y);
				
		if (point.device.x > view.getDevice().getWidth() - 100) {
			label.setTextAnchor('end');
		} else if (point.device.x < 100) {
			label.setTextAnchor('start');
		} else {
			label.setTextAnchor('middle');
		}
		label.setX(point.device.x);
		label.setY(point.device.y-15);
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
