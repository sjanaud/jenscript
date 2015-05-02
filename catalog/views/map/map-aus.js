
/**
 * Create Australia Map
 * @param container
 * @param width
 * @param height
 */
function createViewMapAUS(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 800,
		height : 800,
		holders : 20,
		
	});


	var proj = new JenScript.MapProjection({
		level : 4,
		centerPosition :new JenScript.GeoPosition(-27,135)
	});
	view.registerProjection(proj);
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.CHOCOLATE;
			feature.fillOpacity = 0.9;
			feature.strokeColor = JenScript.RosePalette.CHOCOLATE;
			feature.strokeWidth = 1;
		//on register you can prepare your feature rendering property
	},'map demo');

	

	var loader = new MapLoader(['AUS/country-states.json' ],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin]
	});
	proj.registerPlugin(transform);
	
	
	var images = new JenScript.ImagePlugin({});
	images.addImage({x : 650,y: 10, url : '/site/images/flags-iso/shiny/64/AU.png'});
	proj.registerPlugin(images);

}
