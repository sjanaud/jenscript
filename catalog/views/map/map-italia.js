
/**
 * Create France Map
 * @param container
 * @param width
 * @param height
 */
function createViewMapItalia(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 800,
		height : 800,
		holders : 20,
		
	});


	var proj = new JenScript.MapProjection({
		level : 6,
		centerPosition :new JenScript.GeoPosition(42.5,13)
	});
	view.registerProjection(proj);
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.EMERALD;
			feature.fillOpacity = 0.8;
			feature.strokeColor = JenScript.RosePalette.CORALRED;
			feature.strokeWidth = 1;
		//on register you can prepare your feature rendering property
	},'map demo');

	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin]
	});
	proj.registerPlugin(transform);

	
	var loader = new MapLoader(['ITA/country-states.json'],function(geoJSON){
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
		//console.log('enter '+event.feature.Id);
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
		
	},'map demo');
	
	var images = new JenScript.ImagePlugin({});
	images.addImage({x : 650,y: 10, url : '/site/images/flags-iso/shiny/64/IT.png'});
	proj.registerPlugin(images);

}
