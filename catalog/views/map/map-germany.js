
/**
 * Create Germany Map
 * @param container
 * @param width
 * @param height
 */
function createViewMapDEU(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 700,
		height : 700,
		holders : 20,
		
	});

	var proj = new JenScript.MapProjection({
		level : 6,
		centerPosition :new JenScript.GeoPosition(51,10.42)
	});
	view.registerProjection(proj);
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		//on register you can prepare your feature rendering property
		var feature = event.feature;
		feature.fillColor   = JenScript.RosePalette.HENNA;
		feature.fillOpacity = 0.6;
		feature.strokeColor = JenScript.RosePalette.LEMONPEEL;
		feature.strokeWidth = 1;
	},'map demo');

	var loader = new MapLoader(['DEU/country-states.json' ],function(geoJSON){
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
	images.addImage({x : 550,y: 10, url : '/site/images/flags-iso/shiny/64/DE.png'});
	proj.registerPlugin(images);

}
