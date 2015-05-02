
/**
 * Create view with timing metrics and minute timing models
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewMetricsTimingMinuteModel(container, width, height) {

	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 40,
		west : 60,
		south : 80,
		
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

	var gloss = new JenScript.GlossViewForeground();
	view.addViewForeground(gloss);

	
	//60 minutes range
	var minXDate = new Date(2014,6,12,6,0,0,0);
	var maxXDate = new Date(2014,6,12,6,60,0,0);
	
	
	
	var proj = new JenScript.LinearProjection({
		name : "proj1",
		//new Date(year, month, day, hours, minutes, seconds, milliseconds)
		minX : minXDate.getTime(),
		maxX : maxXDate.getTime(),
		minY : -1200,
		maxY : 1200
	});
	view.registerProjection(proj);
	var outline = new JenScript.DeviceOutlinePlugin({
		color : 'green'
	});
	proj.registerPlugin(outline);

	
	//TIMING
	//this.timingModels[0] = new JenScript.DayModel({});
	//this.timingModels[0] = new JenScript.HourModel({});
	//this.timingModels[1] = new JenScript.Minute1Model({});
	
	
	var southMetrics1 = new JenScript.AxisMetricsTiming({
		axis : JenScript.Axis.AxisSouth,
		models : [new JenScript.Minute1Model({}),
		          new JenScript.Minute10Model({}),
		          new JenScript.HourModel(
		        		  			{
		        	  					format : function(date){
											if(date.getHours() === 8)
												return date.getHours()+'H';
											if(date.getHours() === 12)
												return date.getHours()+'H';
											if(date.getHours() === 18)
												return date.getHours()+'H';
											return date.getHours();
			
		        	  					}
		        		  			}),
		         new JenScript.DayModel({}),
		          
		          ],
		minor : {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
			tickMarkerStroke : 1
		},
		median : {
			tickMarkerSize : 4,
			tickMarkerColor : JenScript.RosePalette.EMERALD,
			tickMarkerStroke : 1.2,
			tickTextColor : JenScript.RosePalette.EMERALD,
			tickTextFontSize : 10
		},
		major : {
			tickMarkerSize : 8,
			tickMarkerColor : JenScript.RosePalette.CORALRED,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.CORALRED,
			tickTextFontSize : 12,
			tickTextOffset : 16
		}
	});
	proj.registerPlugin(southMetrics1);
	
	
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest, gravity :'natural'
	});
	
	
	proj.registerPlugin(westMetrics);
	

	var tx = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx);
	
	var zoomwheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zoomwheel);
	
	tx.select();
	
}
