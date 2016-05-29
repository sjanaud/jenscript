
 
this.onmessage = function(event) {
	console.log(' data worker load map : '+event.data);
	
	var asset = event.data;

	var oReq = new XMLHttpRequest();
	//oReq.overrideMimeType('text/plain');
	oReq.addEventListener("progress", updateProgress, false);
	oReq.addEventListener("load", transferComplete, false);
	oReq.addEventListener("error", transferFailed, false);
	oReq.addEventListener("abort", transferCanceled, false);
	oReq.open("get", "/catalog/views/map/assets/"+asset, true);
	oReq.send();
};


function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    console.log('percent : '+percentComplete);
  } else {
  }
}

function transferComplete(evt) {
	
	console.log('map transfer complete'); 
 	var data = evt.target.responseText;
 	//console.log("transfer map complete : "+data);
 	postMessage(data);
 	
 	 
}

function transferFailed(evt) {
	console.log('transfer fail');
}

function transferCanceled(evt) {
	console.log('transfer cancel');
}




