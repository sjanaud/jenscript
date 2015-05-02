
/**
 * Create views with zoom lens synchronized in 2 views
 * 
 * @param container
 * @param width
 * @param height
 */
function createViewZoomLensSynchronizerMultipleViews(container, width, height) {

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
	
	
	
	var view1 = new JenScript.View({
		name : container+'vview1',
		width : width,
		height : height,
		west : 80,
		south:60
		
	});

	var proj1 = new JenScript.LinearProjection({
		name : "proj1",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view1.registerProjection(proj1);
	
	
	var outline = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj1.registerPlugin(outline);
	
	var legend1 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'View 1 Synch.',
		fontSize : 8,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj1.registerPlugin(legend1);
	
	minor = {
			tickMarkerSize : 2,
			tickMarkerColor : JenScript.RosePalette.AEGEANBLUE,
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
			tickMarkerColor : JenScript.RosePalette.CORALRED,
			tickMarkerStroke : 3,
			tickTextColor : JenScript.RosePalette.CORALRED,
			tickTextFontSize : 12,
			//tickTextOffset : 16
		};
		var southMetrics1 = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisSouth,
			minor:minor,
			median:median,
			major:major
		});
		proj1.registerPlugin(southMetrics1);

		var westMetrics1 = new JenScript.AxisMetricsModeled({
			axis : JenScript.Axis.AxisWest,
			minor:minor,
			median:median,
			major:major
		});
		proj1.registerPlugin(westMetrics1);

	var lens1 = new JenScript.ZoomLensPlugin();
	proj1.registerPlugin(lens1);

	var lx1 = new JenScript.LensX({
		buttonStrokeColor : JenScript.RosePalette.MANDARIN,
		buttonRolloverStrokeColor:JenScript.RosePalette.CORALRED,
	});
	lens1.registerWidget(lx1);

	
	
	var view2 = new JenScript.View({
		name : container+'vview2',
		width : width,
		height : height,
		west : 80,
		south:60
	});

	var proj2 = new JenScript.LinearProjection({
		name : "proj2",
		minX : -1000,
		maxX : 1000,
		minY : -1000,
		maxY : 1000
	});
	view2.registerProjection(proj2);
	
	var legend2 = new JenScript.TitleLegendPlugin({
		layout : 'relative',
		part   : JenScript.ViewPart.Device,
		text   : 'View 2 Synch.',
		fontSize : 8,
		textColor : 'purple',
		xAlign : 'right',
		yAlign : 'top',
	});
	proj2.registerPlugin(legend2);
	
	var outline2 = new JenScript.DeviceOutlinePlugin({color : 'darkslategrey'});
	proj2.registerPlugin(outline2);
	

	var southMetrics2 = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisSouth,
		minor:minor,
		median:median,
		major:major,
	});
	proj2.registerPlugin(southMetrics2);

	var westMetrics2 = new JenScript.AxisMetricsModeled({
		axis : JenScript.Axis.AxisWest,
		minor:minor,
		median:median,
		major:major
	});
	proj2.registerPlugin(westMetrics2);

	var lens2 = new JenScript.ZoomLensPlugin();
	proj2.registerPlugin(lens2);

	var lx2 = new JenScript.LensX({
		buttonStrokeColor : JenScript.RosePalette.MANDARIN,
		buttonRolloverStrokeColor:JenScript.RosePalette.CORALRED,
	});
	lens2.registerWidget(lx2);

	var synchronizer = new JenScript.ZoomLensSynchronizer({
		lenses : [ lens1, lens2 ]
	});
	lens1.select();
}