var views = {
		v1  : {name : 'view1' ,desc:'Real Time Curve',  fnName: 'createViewRealTimeLineCurve',  file : 'realtime-line.js', onQuit : function(){console.log('quit real time line');}},
		v2  : {name : 'view2' ,desc:'Real Time Cloud 1',  fnName: 'createViewRealTimeCloud1',  	file : 'realtime-cloud1.js',onQuit : function(){console.log('before ');window.cloudPointSimulator.stop();console.log('after');}},
		//v3  : {name : 'view3' ,desc:'Real Time Cloud 2',  fnName: 'createViewRealTimeCloud2',  	file : 'realtime-cloud2.js',onQuit : function(){console.log('quit real time cloud 2');}},
};

uninstallFeature = function(){
	console.log('uninstall real time feature');
};

var DataLoader = function(proj,bundle,callback){
	
	var recordCounter = 0;
	var dataPaths = [];
	 
	 var monitorPlugin = new JenScript.ProgressPlugin({
			x : 30,
			y : 20,
			width : 200,
			height : 6,
	 });
	 proj.registerPlugin(monitorPlugin);
	 
	 var total = 0;
	 if(bundle === 'data-lines')
		 total = 86;
	 if(bundle === 'data-cloud1')
		 total = 37;
	 if(bundle === 'data-cloud2')
		 total = 93;	
	 
	var m = new JenScript.ProgressMonitor({
			total : total,
			onComplete : function() {
				//console.log('complete callback');
			},
			outlineColor : JenScript.RosePalette.MANDARIN,
			backgroundColor : 'black',
			backgroundOpacity : 0,
			foregroundColor : JenScript.Color.brighten(JenScript.RosePalette.CALYPSOBLUE,50),
			foregroundOpacity : 0.6,
			textColor : JenScript.RosePalette.MANDARIN
	});
	monitorPlugin.addMonitor(m);
	 
	var createRecord = function(record) {
		if (record === undefined)
			return;
		recordCounter++;
		m.setValue(recordCounter, 'Load data record ' + recordCounter);
		return {
			rank : recordCounter,
			record : record,
		};
	};

	var load = function(){
		var dataWorker = new Worker('/catalog/views/realtime/DataWorker.js');
		dataWorker.addEventListener("message", function(event) {
			if (event.data === 'start') {
				dataPaths = [];
			} else if (event.data === 'finish') {
				callback(dataPaths);
			} else {
				var dp = createRecord(event.data);
				if (dp.record.length > 0)
					dataPaths[dataPaths.length] = dp;
			}

		}, false);
		dataWorker.postMessage('start:'+bundle);
	};

	load();

};