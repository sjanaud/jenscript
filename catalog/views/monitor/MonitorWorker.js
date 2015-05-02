var year;
 
this.onmessage = function(event) {
	console.log('dataworker 2 event : '+event.data);
	
	year = event.data;
	var asset = 'slv-'+event.data+'.csv';

	var oReq = new XMLHttpRequest();
	//oReq.overrideMimeType('text/plain');
	//oReq.addEventListener("progress", updateProgress, false);
	oReq.addEventListener("load", transferComplete, false);
	oReq.addEventListener("error", transferFailed, false);
	oReq.addEventListener("abort", transferCanceled, false);
	oReq.open("get", "/site/module/javascript/catalog/stock/assets/"+asset, true);
	oReq.send();
};




function transferComplete(evt) {
 	 var lines = evt.target.responseText.split('\n');
 	 var post = function(i,line,callback){
 		 setTimeout(function(){
 	 		 if(i > 0 && i < lines.length -1){
 	 			 var stock = loadStock(line);
 	 			 postMessage(stock);
 	 		 }
 	 		 callback(i);
 		 },i*10);
 	 };
 	 for(var i=0;i<lines.length;i++){
 		var line = lines[i];
 		post(i,line,function(rank){if(rank === lines.length-1) postMessage('finish:'+year);});
 	 }
}

function transferFailed(evt) {
	console.log('transfer fail');
}

function transferCanceled(evt) {
	console.log('transfer cancel');
}


function loadStock(dataLine) {
	//console.log('line : '+dataLine);
	var arrayStock = dataLine.split(',');
	var dt = arrayStock[0].replace(/"/g,'');
	var dtArray = dt.split('/');
	var close = arrayStock[1].replace(/"/g,'');
	var volume = arrayStock[2].replace(/"/g,'');
	var open = arrayStock[3].replace(/"/g,'');
	var high = arrayStock[4].replace(/"/g,'');
	var low = arrayStock[5].replace(/"/g,'');
	var fixingDurationMillis = 24 * 60 * 60 * 1000;
	
	//"date","close","volume","open","high","low"
	var stock = {fixing : new Date(dtArray[0],dtArray[1]-1,dtArray[2]),
				close : parseFloat(close),
				volume: parseFloat(volume),
				open  : parseFloat(open),
				high  : parseFloat(high),
				low   : parseFloat(low),
				fixingDurationMillis : fixingDurationMillis
	};
	
	return stock;
}

