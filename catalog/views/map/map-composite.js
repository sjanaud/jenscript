
/**
 * Create view with composite map
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewCompositeMap(container, width, height) {

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


	var tilePlugin = new JenScript.TilePlugin({
		opacity : 0.5
	});
	proj.registerPlugin(tilePlugin);

//geometric transform
//	var zoom = new JenScript.ZoomMapWheelPlugin();
//	proj.registerPlugin(zoom);
//	
//	var translatePlugin = new JenScript.MapTranslatePlugin();
//	proj.registerPlugin(translatePlugin);

	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);
	
	geojsonPlugin.addGeoListener('register', function(event){
		var feature =event.feature;
		
		if(feature.getProperty('sovereignt') === 'France'){
			feature.fillColor   = JenScript.RosePalette.EMERALD;
			feature.fillOpacity = 0.3;
			feature.strokeColor = 'none';
			feature.strokeWidth = 0;
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

	//semantic transform
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin,tilePlugin]
	});
	proj.registerPlugin(transform);
	
	var loader = new MapLoader(['countries.geojson','ne_110m_admin_1_states_provinces_shp_scale_rank.geojson'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});
	

}
