
/**
 * Create real time cloud points view
 * 
 * @param container
 * @param width
 * @param height
 * 
 * @author JenSoft API
 */
function createViewRealTimeCloud1(container, width, height) {

	// view
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		west : 80,
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

	var proj = new JenScript.LinearProjection({
		name : "proj1",
		minX : -160,
		maxX : 160,
		minY : -110,
		maxY : 0
	});
	view.registerProjection(proj);
	
	var outline = new JenScript.DeviceOutlinePlugin({color : 'pink'});
	proj.registerPlugin(outline);
	minor = {
		tickMarkerSize : 2,
		tickMarkerColor : JenScript.RosePalette.TURQUOISE,
		tickMarkerStroke : 1
	};
	median = {
		tickMarkerSize : 4,
		tickMarkerColor : JenScript.RosePalette.EMERALD,
		tickMarkerStroke : 1.2,
		tickTextColor : JenScript.RosePalette.EMERALD,
		tickTextFontSize : 10
	};
	major = {
		tickMarkerSize : 8,
		tickMarkerColor : JenScript.RosePalette.TURQUOISE,
		tickMarkerStroke : 3,
		tickTextColor : JenScript.RosePalette.TURQUOISE,
		tickTextFontSize : 12
	};
	var southMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth,
		minor : minor,
		median : median,
		major : major,
	});
	proj.registerPlugin(southMetrics);
	var westMetrics = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor : minor,
		median : median,
		major : major,
	});
	proj.registerPlugin(westMetrics);

	var tx1 = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx1);
	tx1.select();
	
	var legend1 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'Real Time Curve',
		fontSize : 14,
		textColor : JenScript.RosePalette.MANDARIN,
		xAlign : 'right',
		yAlign : 'top',
		yMargin: 5
	});
	proj.registerPlugin(legend1);

	var DemoPlugin = {};

	DemoPlugin.LineData = function(config) {
		this._init(config);
		this.dataPath;
		this.counter = 0;
	};
	JenScript.Model.inheritPrototype(DemoPlugin.LineData, JenScript.Plugin);
	JenScript.Model.addMethods(DemoPlugin.LineData,
					{
						_init : function(config) {
							JenScript.Plugin.call(this, config);
						},

						setDataPath : function(dataPath) {
							this.dataPath = dataPath;
							var dataPoints = dataPath.record;
							var p0Projected = this.getProjection().userToPixel(dataPoints[0]);
							var path = new JenScript.SVGPath();
							path.buildAuto = false;
							path.Id('myDataPath').moveTo(p0Projected.x,	p0Projected.y);
								
							for (var i = 1; i < dataPoints.length; i++) {
								var pProjected = this.getProjection().userToPixel(dataPoints[i]);
								path.lineTo(pProjected.x, pProjected.y);
							}
							path.finalyze();
							var g2d = this.getGraphicsContext('Device');
							var ele = g2d.getGraphicsElement('myDataPath');
							if (ele !== undefined && ele != null) {
								ele.setAttribute('d', path.buildPath());
							} else {
								g2d.insertSVG(path.fillNone().stroke(JenScript.RosePalette.TURQUOISE).strokeWidth(0.8).toSVG());
										
							}
						},

						paintPlugin : function(g2d, part) {
							if (part !== JenScript.ViewPart.Device)
								return;

							if (this.dataPath === undefined)
								return;

							if (this.dataPath.path === undefined) {
								console
										.log("problem with data path : path is undefined, dataPath rank : "
												+ this.dataPath.rank);
								console.log("details record : "
										+ this.dataPath.record);
							}

							// var dataPoints = this.dataPath.record;
							// //console.log("how many points in record?
							// "+this.dataPath.record.length);
							// //if we need create path on the fly
							// var p0Projected =
							// this.getProjection().userToPixel(dataPoints[0]);
							// var path = new JenScript.SVGPath();
							// path.buildAuto = false;
							// path.Id('myDataPath').moveTo(p0Projected.x,p0Projected.y);
							// for (var i = 1; i < dataPoints.length; i++) {
							// var pProjected =
							// this.getProjection().userToPixel(dataPoints[i]);
							// path.lineTo(pProjected.x,pProjected.y);
							// }
							// path.finalyze();
							// var ele = g2d.getGraphicsElement('myDataPath');
							// if(ele !== undefined && ele != null){
							// ele.setAttribute('d',path.buildPath());
							// }else{
							// g2d.insertSVG(path.fillNone().stroke('red').strokeWidth(0.8).toSVG());
							// }
							// //g2d.deleteGraphicsElement('myDataPath');

							// //g2d.insertSVG(this.dataPath.path.fillNone().stroke('red').strokeWidth(0.8).toSVG());
						}
					});

	var myDemoPlugin = new DemoPlugin.LineData({});
	proj.registerPlugin(myDemoPlugin);
	

	function simulateRealTime(dataPaths) {
		
		var run = function(i, dp, onFinish) {
			setTimeout(function() {
				myDemoPlugin.setDataPath(dp);
				onFinish(i);
			}, i * 1000/24);
		};

		for (var i = 0; i < dataPaths.length; i++) {
			var dp = dataPaths[i];
			run(i, dp, function onFinish(rank) {
				if (rank === (dataPaths.length - 1)) {
					simulateRealTime(dataPaths);
				}
			});
		}
	}
	
	
	var loader = new DataLoader(proj,'data-lines',function(data){
		simulateRealTime(data);
	});

}