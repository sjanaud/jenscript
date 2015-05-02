//var oReq = new XMLHttpRequest();
//
//oReq.overrideMimeType('text/plain');
//oReq.addEventListener("progress", updateProgress, false);
//oReq.addEventListener("load", transferComplete, false);
//oReq.addEventListener("error", transferFailed, false);
//oReq.addEventListener("abort", transferCanceled, false);
//
//oReq.open("get", "assets/slv-2013.csv", true);
//
//console.log("get stock data on server...");
//oReq.send();
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

if (!String.prototype.endsWith) {
	  Object.defineProperty(String.prototype, 'endsWith', {
	    value: function (searchString, position) {
	      var subjectString = this.toString();
	      if (position === undefined || position > subjectString.length) {
	        position = subjectString.length;
	      }
	      position -= searchString.length;
	      var lastIndex = subjectString.indexOf(searchString, position);
	      return lastIndex !== -1 && lastIndex === position;
	    }
	  });
	}
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
 console.log('load data worker');
this.onmessage = function(event) {
    //postMessage("Reply from web worker");
	//alert('la worker'+event.data);
	if(event.data === '2008'){
		console.log("get slv 2008 history");
	}
	if(event.data === 'start'){
		//console.log('stock worker start');
		//postMessage("start");
		
		var oReq = new XMLHttpRequest();

		//oReq.overrideMimeType('text/plain');
		oReq.addEventListener("progress", updateProgress, false);
		oReq.addEventListener("load", transferComplete, false);
		oReq.addEventListener("error", transferFailed, false);
		oReq.addEventListener("abort", transferCanceled, false);

		oReq.open("get", "/site/module/javascript/catalog/stock/assets/slv-2013-old.csv", true);
		//http://www.nasdaq.com/symbol/slv/historical
		//oReq.open("get", "/site/module/javascript/catalog/stock/assets/slv-2006-2015.csv", true);

		//console.log("get data on server...");
		oReq.send();
	}
		
};


function updateProgress (oEvent) {
	console.log('progress');
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    console.log('percent complete : '+percentComplete);
  } else {
  }
}

function transferComplete(evt) {
	//console.log("read raw data ...");
 	 var lines = evt.target.responseText.split('\n');
 	 
 	 var post = function(i,line,callback){
 		 
 		 setTimeout(function(){
 	 		 if(i > 4 && i < lines.length -1){
 	 			 //console.log('post message to page');
 	 			 var stock = loadStock(line);
 	 			 postMessage(stock);
 	 		 }
 	 		 callback(i);
 		 },i*10);
 	 };
 	 for(var i=0;i<lines.length;i++){
 		 //console.log('line '+i+' : '+lines[i]);
 		var line = lines[i];
 		post(i,line,function(rank){if(rank === lines.length-1) postMessage('finish');});
 	 }
 	 
}

function transferFailed(evt) {
}

function transferCanceled(evt) {
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
	
	var stock = {fixing : new Date(dtArray[0],dtArray[1],dtArray[2]),
				close : parseFloat(close),
				volume: parseFloat(volume),
				open  : parseFloat(open),
				high  : parseFloat(high),
				low   : parseFloat(low),
				fixingDurationMillis : fixingDurationMillis
	};
	
	return stock;
}

