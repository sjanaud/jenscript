//var catalogJSBase = JenSoft.Context.path+'/module/javascript/catalog/monitor';
var views = {
		v1 :  {name : 'view1' ,desc:'Simple Progress Monitor', fnName: 'createViewMonitor', file : 'monitor-simple.js'},
		v2 :  {name : 'view2' ,desc:'Multiple Progress Monitor', fnName: 'createViewMonitorProgressWorker', file : 'monitor-multiple.js'},
};


var WebLoader = function(proj,args,callback){
	
	 //console.log('new StockLoader');
	 var tasks = [];
	 var data = [];
	 var that = this;
	 
	 
	 var monitorPlugin = new JenScript.ProgressPlugin({
			x : 30,
			y : 20,
			width : 100,
			height : 6,
//			outlineColor : 'black',
//			backgroundColor : 'pink',
//			foregroundColor : 'purple'
	 });
	 proj.registerPlugin(monitorPlugin);
	 
	 
	 this.getTask = function(fullYear){
		 for (var i = 0; i < tasks.length; i++) {
				var t = tasks[i];
				if(fullYear == t.year)
					return t;
		 }
		 return undefined;
	 },
	 
	 this.execTask = function(task){
		 console.log('load task : '+task.year);
		if(task === undefined || task.year === undefined)
			return;
		
		var m = new JenScript.ProgressMonitor({
			total : 250,//approximation of total which is (245/255 stock by year)
			onComplete : function() {
				proj.unregisterPlugin(this);
			},
			outlineColor : JenScript.RosePalette.INDIGO,
			backgroundColor : 'black',
			backgroundOpacity : 0,
			foregroundColor : JenScript.RosePalette.CALYPSOBLUE,
			foregroundOpacity : 0.6,
			textColor : JenScript.RosePalette.EMERALD
		});
		monitorPlugin.addMonitor(m);
		
		//Ref to monitor
		task.monitor = m;
		
		var dataCount = 0;
		var dataWorker = new Worker(JenSoft.Context.path+ '/module/javascript/catalog/monitor/MonitorWorker.js');
		dataWorker.addEventListener("message", function(event) {
			if (event.data.startsWith !== undefined && event.data.startsWith('finish')) {
				var yearFromWorker = event.data.split(':')[1];
				var yo = that.getTask(yearFromWorker);
				yo.state='loaded';
				yo.monitor.complete();
				callback(yo.year,data);
				yo.worker.terminate();
			} else {
				dataCount++;
				var stock = new JenScript.Stock(event.data);
				if (event.data.fixing !== undefined){
					data[data.length] = stock;
					var yo = that.getTask(stock.fixing.getFullYear());
					if(yo.monitor){
						setTimeout(function(){
							yo.monitor.setValue(dataCount, 'Load Data '+yo.year+' item '+ dataCount);
						},20);
					}else{
						console.log("no monitor found");
					}
					
				}
				
			}

		}, false);
		dataWorker.postMessage((task.year+''));
		task.worker=dataWorker;
	};

	proj.addProjectionListener('boundChanged',function(){
		var minYear = proj.getMinDate().getFullYear();
		var maxYear = proj.getMaxDate().getFullYear();
		var foundMinYear = false;
		var foundMaxYear = false;
		for (var i = 0; i < tasks.length; i++) {
			var y = tasks[i].year;
			if(y === minYear){
				foundMinYear = true;
			}
			if(y === maxYear){
				foundMaxYear = true;
			}
		}
		if(!foundMinYear){
			tasks[tasks.length]={year : minYear , state :'request'};
		}
		if(!foundMaxYear && minYear !== maxYear){
			tasks[tasks.length]={year : maxYear , state :'request'};
		}
		for (var i = 0; i < tasks.length; i++) {
			var y = tasks[i];
			if(y.state === 'request'){
				y.state = 'processing';
				setTimeout(that.execTask(y),300);
			}
		}
		
	},'Stock projection listener');
	
	var init = function(i,task){
		console.log(i+','+task.year);
		setTimeout(function(){
			that.execTask(task);
		},i*600);
	};
	
	for (var i = 0; i < args.length; i++) {
		console.log('launch defaut year : '+args[i]);
		tasks[i]={year:args[i],state:'processing'};
		init(i,tasks[i]);
	}
	
};


