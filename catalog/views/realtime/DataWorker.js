if (!String.prototype.startsWith) {
	  Object.defineProperty(String.prototype, 'startsWith', {
	    enumerable: false,
	    configurable: false,
	    writable: false,
	    value: function (searchString, position) {
	      position = position || 0;
	      return this.lastIndexOf(searchString, position) === position;
	    }
	  });
}

this.onmessage = function(event) {
	if(event.data.startsWith('start')){
		var asset = event.data.split(':')[1];
		console.log('get asset : '+asset);
		postMessage("start");
		var oReq = new XMLHttpRequest();
		//oReq.overrideMimeType('text/plain');
		oReq.addEventListener("progress", updateProgress, false);
		oReq.addEventListener("load", transferComplete, false);
		oReq.addEventListener("error", transferFailed, false);
		oReq.addEventListener("abort", transferCanceled, false);
		oReq.open('get', '/site/module/javascript/catalog/realtime/assets/'+asset+'.txt', true);
		oReq.send();
	}
};

function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
  } else {
  }
}

function transferComplete(evt) {
 	 var lines = evt.target.responseText.split('\n');
 	 var totalRecord = lines.length;
 	 
 	 var post = function(i,line,callback){
 		 setTimeout(function(){
 	 		 var c = line.substring(9, line.length - 1);
 	 		 var record = loadEntry(c);
 	 		 if(record !== undefined){
 	 			postMessage(record);	 
 	 		 }else{
 	 			 console.log('problem with line :'+line);
 	 		 }
 	 		 callback(i);
 		 },i*20);
 	 };
 	 for(var i=0;i<lines.length;i++){
 		//console.log('line '+i+' : '+lines[i]);
 		var line = lines[i];
 		post(i,line,function(rank){if(rank === totalRecord-1) postMessage('finish');});
 	 }
 	
 	
}

function transferFailed(evt) {
}

function transferCanceled(evt) {
}


function loadEntry(dataLine) {
	var data = [];
	var empty = false;
	while (!empty) {
		var openCrochet = dataLine.indexOf("[");
		var closeCrochet = dataLine.indexOf("]");
		if (openCrochet == -1) {
			empty = true;
		} else {
			var point = dataLine.substring(openCrochet, closeCrochet + 1);
			var cp = loadXYPoint(point);
			if(cp !== undefined){
				data[data.length] = cp;	
			}
			dataLine = dataLine.substring(closeCrochet + 1);
		}
	}
	return data;
}

function loadXYPoint(spoint) {
	
	try {
		var p = spoint.substring(1, spoint.length - 1);
		var spltPoint = p.split(",");
		return {x:parseFloat(spltPoint[0]),y:parseFloat(spltPoint[1])};
	} catch (e) {
		console.log('error to get data point : '+e);
	}
	
}