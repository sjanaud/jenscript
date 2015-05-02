
/**
 * Create real time cloud points view
 * 
 * @param container
 * @param width
 * @param height
 *  * @author JenSoft API
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
		minX : -2500,
		maxX : 2500,
		minY : -2500,
		maxY : 2500
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
	
	var zoomwheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zoomwheel);
	
	var legend1 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'Real Time Cloud 1',
		fontSize : 12,
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

						setCloud : function(dataPoints) {
							//console.log('set cloud :'+dataPoints.record);
							this.dataPoints = dataPoints;
							this.repaintPlugin();
						},

						paintPlugin : function(g2d, part) {
							if (part !== JenScript.ViewPart.Device)
								return;

							if (this.dataPoints === undefined)
								return;

							//console.log("paint record with points : "+ this.dataPoints.record.length);
							for (var i = 1; i < this.dataPoints.record.length; i++) {
								var pt = this.dataPoints.record[i];
								var p = this.getProjection().userToPixel(pt);
								var svgRect = new JenScript.SVGRect().origin(p.x-0.5,p.y-0.5).size(1,1).fill(JenScript.RosePalette.LIME);
								g2d.insertSVG(svgRect.toSVG());
							}
						}
					});

	var myDemoPlugin = new DemoPlugin.LineData({});
	proj.registerPlugin(myDemoPlugin);
	

	
function Simulator(name,data) {
		
	this.Id = 'simulator'+JenScript.sequenceId++;
	this.name = name;
	this.running = true;
	var that = this;
	var run = function(i, dp, onFinish) {
		
		if(that.running){
			setTimeout(function() {
				//console.log('run '+i);
				if(!that.running) return;
				myDemoPlugin.setCloud(dp);
				onFinish(i);
			}, i * 300);
		}
		else{
			//console.log('not run '+i);
		}
		
	};

	//console.log('start simulator : '+this.name +'[Id :'+this.Id+']');
	for (var i = 0; i < data.length; i++) {
		var dp = data[i];
		run(i, dp, function onFinish(rank) {
			if (rank === (data.length - 1)) {
				window.cloudPointSimulator = new Simulator(name,data);
			}
		});
	}
	
	this.toString = function(){
		return 'simulator : '+this.name +'[Id :'+this.Id+']';
	};
	
	this.stop= function(){
		//console.log('stop simulator : '+this.name +'[Id :'+this.Id+']');
		this.running = false;
	};
	
	this.isAlive = function(){
		return this.running;
	};
}
	
	window.cloudPointSimulator = undefined;
	
	var loader = new DataLoader(proj,'data-cloud1',function(data){
		if(window.cloudPointSimulator === undefined){
			window.cloudPointSimulator = new Simulator('cloud real time',data);
		}else{
			window.cloudPointSimulator.stop();
			window.cloudPointSimulator = new Simulator('cloud real time',data);
		}
		
	});

}