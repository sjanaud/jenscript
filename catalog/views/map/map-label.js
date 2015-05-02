
/**
 * Create map projection with Label plugin
 * @param container
 * @param width
 * @param height
 */
function createViewMapLabel(container, width, height) {
	
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
	
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin]
	});
	proj.registerPlugin(transform);

	geojsonPlugin.addGeoListener('register', function(event){
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.TURQUOISE;
			feature.fillOpacity = 0.3;
			feature.strokeColor = JenScript.RosePalette.MANDARIN;
			feature.strokeWidth = 0;
		//on register you can prepare your feature rendering property
	},'map demo');

	
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
		fillColor : JenScript.RosePalette.TURQUOISE,
		fillOpacity : 0.6,
		outlineColor : 'none',
		outlineWidth : 0,
		cornerRadius : 6,
		fontSize : 12,
		textColor : 'white',
	});
	labelPlugin.addLabel(label);

	var updateText = function(text, x,y) {
		label.setText(text);
		x = x+10;
		y = y-20;
		if (x > view.getDevice().getWidth() - 100) {
			label.setTextAnchor('end');
		} else if (x < 100) {
			label.setTextAnchor('start');
		} else {
			label.setTextAnchor('middle');
		}
		label.setX(x);
		label.setY(y);
		labelPlugin.repaintPlugin();
	};
	
	
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
		//console.log('enter '+event.feature.Id);
		var remote = event.remote;
		remote.fill('orange');
		remote.fillOpacity(0.4);
		remote.stroke('white');
		remote.strokeWidth(0.5);
	},'map demo');
	
	geojsonPlugin.addGeoListener('exit', function(event){
		//console.log('exit '+event.feature.Id);
		label.setText(undefined);
		labelPlugin.repaintPlugin();
		
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
		updateText(country,event.x,event.y);
	},'map demo');

}
