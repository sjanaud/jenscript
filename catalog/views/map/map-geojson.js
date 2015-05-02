
/**
 * Create view with GeoJSON map
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewGeoJSONMap(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : 900,
		height : 600,
		holders : 10,
	});


	var proj = new JenScript.MapProjection({
		level : 2
	});
	view.registerProjection(proj);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);




	//var bg = new JenScript.MapBackgroundPlugin();

	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);
	
	geojsonPlugin.addGeoListener('register', function(event){
		var feature =event.feature;
		
		//for us states
		console.log('register feature'+feature.Id+" with code : "+feature.getProperty('adm1_code'));
		
		//for country
		console.log('register feature'+feature.Id+" with code : "+feature.getProperty('sovereignt'));
		if(feature.getProperty('sovereignt') === 'France'){
			feature.fillColor   = JenScript.RosePalette.TURQUOISE;
			feature.fillOpacity = 0.3;
			feature.strokeColor = JenScript.RosePalette.MANDARIN;
			feature.strokeWidth = 2;
		}
		
		//on register you can prepare your feature rendering property
	},'map demo');
	
	geojsonPlugin.addGeoListener('press', function(event){
		console.log('press '+event.type);
		
		//on event you can remote your feature
		var remote = event.remote;
		remote.fill('purple');
		remote.fillOpacity(0.4);
		remote.stroke('white');
		
	},'map demo');
	
	geojsonPlugin.addGeoListener('release', function(event){
		console.log('release '+event.type);
	},'map demo');

	geojsonPlugin.addGeoListener('move', function(event){
		//console.log('move '+event.type);
	},'map demo');

	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin]
	});
	proj.registerPlugin(transform);
	
	var loader = new MapLoader(['countries.geojson'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});
	

}
