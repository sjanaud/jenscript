
/**
 * Create Map and compare Geometric vs Semantic Transform
 * @param container
 * @param width
 * @param height
 */
function createMap(container, width, height) {
	
	
	//create 2 containers
	var rootContainer = document.getElementById(container);
	while (rootContainer.firstChild) {
		rootContainer.removeChild(rootContainer.firstChild);
	}
	
	var nodeView1 = document.createElement("div");
	nodeView1.setAttribute('id',container+'vview1');
	nodeView1.setAttribute('style','float : left; padding-right : 5px;');
	var nodeView2 = document.createElement("div");
	nodeView2.setAttribute('id',container+'vview2');
	nodeView2.setAttribute('style','float : left;');
	
	
	rootContainer.appendChild(nodeView1);
	rootContainer.appendChild(nodeView2);
	
	//geometric transform, projection changed and objects are repainted
	//very slow with big feature (two much projections)
	createM1((container+'vview1'),width,height);
	
	//semantic transform, projection does not changed, only plugins are tranformed
	//fast
	createM2((container+'vview2'),width,height);

}

function createM1(container ,width, height){
	var view = new JenScript.View({
		name : container,
		width : 400,
		height : 300,
		holders : 10,
		
	});

	var proj = new JenScript.MapProjection({
		level : 5,
		centerPosition :new JenScript.GeoPosition(46.5,2.4)
	});
	view.registerProjection(proj);
	
	
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

	
	var loader = new MapLoader(['FRA/country-states.json','FRA/country-places.json'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	


	//with geometric Translate and zoom, projection is changed, all points and object are re - solved  in 
	//new bounds
	var translate  =new  JenScript.MapTranslatePlugin({}); //adapted map classic translate
	proj.registerPlugin(translate);
	
	var zoom  = new JenScript.ZoomMapWheelPlugin({}); //adapted map classic zoom wheel
	proj.registerPlugin(zoom);
	
}

function createM2(container ,width, height){
	var view = new JenScript.View({
		name : container,
		width : 400,
		height : 300,
		holders : 10,
		
	});

	var proj = new JenScript.MapProjection({
		level : 5,
		centerPosition :new JenScript.GeoPosition(46.5,2.4)
	});
	view.registerProjection(proj);
	
	
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

	

	
	var loader = new MapLoader(['FRA/country-states.json','FRA/country-places.json'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	

	//projection is not changed, it still the same (bound not changed). Only transform translate and scale of plugin root svg
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin],
	});
	proj.registerPlugin(transform);
}
