
/**
 * Create France Map
 * @param container
 * @param width
 * @param height
 */
function createViewSliceMap(container, width, height) {
	
	var view = new JenScript.View({
		name : container,
		width : 900,
		height : 900,
		holders : 10,
		
	});

	var proj = new JenScript.MapProjection({
		level : 4,
		centerPosition :new JenScript.GeoPosition(49,10)
	});
	view.registerProjection(proj);
	
	
	var geojsonPlugin = new JenScript.GeoJSONPlugin({});
	proj.registerPlugin(geojsonPlugin);

	geojsonPlugin.addGeoListener('register', function(event){
		console.log('register feature');
			var feature = event.feature;
			feature.fillColor   = JenScript.RosePalette.COALBLACK;
			feature.fillOpacity = 1;
			feature.strokeColor = JenScript.RosePalette.COALBLACK;
			feature.strokeWidth = 0.5;
			feature.visible = false;

			var prepareFeature = function(f,country,flag,rotate){
				if(f.getProperty('sovereignt') === country){
					f.visible = true;
//					var pattern  = new JenScript.SVGPattern();
//					var image = new JenScript.SVGImage().opacity(1).xlinkHref('/site/images/flags-iso/flat/64/'+flag+'.png').origin(-1,-4).size(16,16);
//					pattern.origin(1,4).size(14,8).attr('patternTransform','rotate('+rotate+')').child(image.toSVG());
//					f.texture = new JenScript.Texture(pattern);
				}
			};
			
			prepareFeature(feature,'France','FR',45);
			prepareFeature(feature,'Italy','IT',-27);
			prepareFeature(feature,'Spain','ES',18);
			prepareFeature(feature,'Portugal','PT',-5);
			prepareFeature(feature,'Germany','DE',-5);
			prepareFeature(feature,'Sweden','SE',-5);
			prepareFeature(feature,'Belgium','BE',-5);
			prepareFeature(feature,'Austria','AT',-5);
			prepareFeature(feature,'Switzerland','CH',-5);
			prepareFeature(feature,'United Kingdom','GB',-5);
			prepareFeature(feature,'Denmark','DK',-5);
			
			prepareFeature(feature,'Croatia','HR',-5);
			
			prepareFeature(feature,'Bosnia and Herzegovina','BA',-5);
			prepareFeature(feature,'Montenegro','ME',-5);
			prepareFeature(feature,'Greece','GR',-5);
			prepareFeature(feature,'Albania','AL',-5);
			prepareFeature(feature,'Bulgaria','BG',-5);
			
			prepareFeature(feature,'Republic of Serbia','RS',-5);
			prepareFeature(feature,'Macedonia','MK',-5);
			prepareFeature(feature,'Kosovo','XK',-5);
			
			prepareFeature(feature,'Ireland','IR',-5);
			prepareFeature(feature,'Netherlands','NL',-5);
			prepareFeature(feature,'Luxembourg','XK',-5);
			prepareFeature(feature,'Hungary','HU',-5);
			
			prepareFeature(feature,'Poland','PL',-5);
			prepareFeature(feature,'Czech Republic','CZ',-5);
			prepareFeature(feature,'Norway','NO',-5);
			
			prepareFeature(feature,'Finland','FI',-5);
			prepareFeature(feature,'Belarus','BY',-5);
			prepareFeature(feature,'Estonia','EE',-5);
			prepareFeature(feature,'Latvia','LV',-5);
			prepareFeature(feature,'Lithuania','LT',-5);
			
			prepareFeature(feature,'Romania','RO',-5);
			prepareFeature(feature,'Andorra','AD',-5);
			prepareFeature(feature,'Slovakia','SK',-5);
			prepareFeature(feature,'Slovenia','SI',-5);
			
			prepareFeature(feature,'Moldova','MD',-5);
			prepareFeature(feature,'Ukraine','UA',-5);



		//on register you can prepare your feature rendering property
	},'map demo');

	

	
	var loader = new MapLoader(['50m/world.json'],function(geoJSON){
		geojsonPlugin.addGeoJSON(geoJSON);
	});

	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'black'
	});
	proj.registerPlugin(outline);
	

	
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [geojsonPlugin],
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
