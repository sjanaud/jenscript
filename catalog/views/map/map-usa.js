
/**
 * Create France Map
 * @param container
 * @param width
 * @param height
 */
function createViewMapUSA(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 800,
		height : 600,
		holders : 20,
		
	});

	//proj1
	var proj1 = new JenScript.MapProjection({
		level : 4,
		paintMode : 'ALWAYS',
		centerPosition : new JenScript.GeoPosition(36,-96)
	});
	view.registerProjection(proj1);
	
	var geojsonPlugin1 = new JenScript.GeoJSONPlugin({});
	proj1.registerPlugin(geojsonPlugin1);

	geojsonPlugin1.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.CHOCOLATE;
			feature.fillOpacity = 0.5;
			feature.strokeColor = 'white';
			feature.strokeWidth = 0.5;
		//on register you can prepare your feature rendering property
	},'map demo');

	
	var loader1 = new MapLoader(['country-state-110m-usa.json'],function(geoJSON){
		geojsonPlugin1.addGeoJSON(geoJSON);
	});
	
	var proj2 = new JenScript.MapProjection({
		level : 3,
		paintMode : 'ALWAYS',
		centerPosition : new JenScript.GeoPosition(75,-110)
	});
	view.registerProjection(proj2);
	
	var geojsonPlugin2 = new JenScript.GeoJSONPlugin({});
	proj2.registerPlugin(geojsonPlugin2);

	geojsonPlugin2.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.COBALT;
			feature.fillOpacity = 0.5;
			feature.strokeColor = 'white';
			feature.strokeWidth = 0.5;
		//on register you can prepare your feature rendering property
	},'map demo');
	
	var loader2 = new MapLoader(['country-state-110m-usa-alaska.json'],function(geoJSON){
		geojsonPlugin2.addGeoJSON(geoJSON);
	});
	
	
	//proj3
	var proj3 = new JenScript.MapProjection({
		level : 6,
		paintMode : 'ALWAYS',
		centerPosition : new JenScript.GeoPosition(24.5,-161)
	});
	view.registerProjection(proj3);
	
	var geojsonPlugin3 = new JenScript.GeoJSONPlugin({});
	proj3.registerPlugin(geojsonPlugin3);

	geojsonPlugin3.addGeoListener('register', function(event){
		console.log('register feature');
		var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.CORALRED;
			feature.fillOpacity = 0.5;
			feature.strokeColor = 'white';
			feature.strokeWidth = 0.5;
		//on register you can prepare your feature rendering property
	},'map demo');
	
	var loader3 = new MapLoader(['country-state-110m-usa-hawaii.json'],function(geoJSON){
		geojsonPlugin3.addGeoJSON(geoJSON);
	});
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin1,geojsonPlugin2,geojsonPlugin3],
	});
	proj3.registerPlugin(transform);

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj1.registerPlugin(outline);
	

	
	
	var images = new JenScript.ImagePlugin({});
	images.addImage({x : 650,y: 10, url : '/site/images/flags-iso/shiny/64/US.png'});
	proj1.registerPlugin(images);

}
