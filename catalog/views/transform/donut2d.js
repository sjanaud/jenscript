
/**
 * Create Donut2D and compare Geometric vs Semantic Transform
 * 
 * @param container
 * @param width
 * @param height
 */
function createDonut2D(container, width, height) {

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
	
	createD1((container+'vview1'),width,height);
	createD2((container+'vview2'),width,height);

}

function createD1(container ,width, height){
	console.log('width/height:'+width+','+height);
	//view 1 with geometric transform (Translate or Zoom)
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	//identity proj = linear (-1,1,-1,1);
	var proj = new JenScript.IdentityProjection();
	view.registerProjection(proj);

	var donut2DPlugin = new JenScript.Donut2DPlugin();
	proj.registerPlugin(donut2DPlugin);

	var donut = new JenScript.Donut2D();
	donut2DPlugin.addDonut(donut);

	// no need to set fill, basic fill is already set by default
	donut.setFill(new JenScript.Donut2DDefaultFill());

	// reflection effect
	donut.addEffect(new JenScript.Donut2DLinearEffect());
	donut.addEffect(new JenScript.Donut2DReflectionEffect());

	var s1 = new JenScript.Donut2DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.Donut2DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.Donut2DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.Donut2DSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.Donut2DSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});

	s2.divergence = 20;
	s4.divergence = 20;

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);


	donut2DPlugin.repaintPlugin();
	
	
	//Geometric Translate & Zoom
	var tx1 = new JenScript.TranslatePlugin();
	proj.registerPlugin(tx1);
	tx1.select(); //need the select lock
	
	var zoomwheel = new JenScript.ZoomWheelPlugin();
	proj.registerPlugin(zoomwheel);
}

function createD2(container, width, height){
	console.log('width/height:'+width+','+height);
	//view 1 with geometric transform (Translate or Zoom)
	var view = new JenScript.View({
		name : container,
		width : width,
		height : height,
		holders : 20,
		
	});

	var proj = new JenScript.IdentityProjection();
	view.registerProjection(proj);

	var donut2DPlugin = new JenScript.Donut2DPlugin();
	proj.registerPlugin(donut2DPlugin);

	var donut = new JenScript.Donut2D();
	donut2DPlugin.addDonut(donut);

	donut.setFill(new JenScript.Donut2DDefaultFill());
	donut.addEffect(new JenScript.Donut2DLinearEffect());
	donut.addEffect(new JenScript.Donut2DReflectionEffect());

	var s1 = new JenScript.Donut2DSlice({
		name : "s1",
		value : 45,
		themeColor : 'rgba(240, 240, 240, 0.9)'
	});
	var s2 = new JenScript.Donut2DSlice({
		name : "s2",
		value : 5,
		themeColor : 'rgba(37,38,41,1)'
	});
	var s3 = new JenScript.Donut2DSlice({
		name : "s3",
		value : 30,
		themeColor : 'rgba(78,148,44,1)'
	});
	var s4 = new JenScript.Donut2DSlice({
		name : "s4",
		value : 5,
		themeColor : 'rgba(22,125,218, 1)'
	});
	var s5 = new JenScript.Donut2DSlice({
		name : "s5",
		value : 5,
		themeColor : 'rgba(61,44,105,1)'
	});

	s2.divergence = 20;
	s4.divergence = 20;

	donut.addSlice(s1);
	donut.addSlice(s2);
	donut.addSlice(s3);
	donut.addSlice(s4);
	donut.addSlice(s5);


	donut2DPlugin.repaintPlugin();
	
	
	var transform = new JenScript.AffineTranformPlugin({
		slaves : [donut2DPlugin]
	});
	proj.registerPlugin(transform);
}