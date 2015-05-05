var catalogModule = (function(){
	//TODO make catalog module
});


function _getAgent(userAgent) {
	var ua = userAgent.toLowerCase(),
	// jQuery UA regex
	match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
	/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
	/(msie) ([\w.]+)/.exec( ua ) ||
	ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
	[],
	// adding mobile flag as well
	mobile = !!(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)),
	ieMobile = !!(userAgent.match(/IEMobile/i));
		return {
			browser: match[ 1 ] || '',
			version: match[ 2 ] || '0',
			// adding mobile flab
			mobile: mobile,
			ieMobile: ieMobile, // If this is true (i.e., WP8),
			toString : function(){
				return 'browser : '+this.browser+', version : '+this.version+', mobile : '+this.mobile+', ieMobile : '+this.ieMobile;
			}
		};
	};
	

var UA = _getAgent((navigator && navigator.userAgent) || '');

function installJavascript(success){	
	$('#placeHolderPane').load('/catalog/fragments/javascript-template.html',function() {
		if(success !== undefined){
			success();
		}
	});
}

function showJSOverview() {
	console.log("show javascript overview");
	$('#headerJavascriptHolder').load('/catalog/fragments/overview.html',function() {		
	});
}


function showJSGettingStarted() {
	console.log("show javascript getting started");
	$('#headerJavascriptHolder').load('/catalog/fragments/getting-started.html',function() {
		prettyPrint();
	});
}

var jsfeature;
var catalogJSBase;
function showJSFeature(feature) {
	console.log("show javascript feature : "+feature);
		if(jsfeature !== undefined){
			//console.log('should maybe uninstall feature ? : '+jsfeature);
		}
		
		jsfeature = feature;
		var sbase = '/catalog/views/'+feature+'/catalog-'+feature+'.js';
		catalogJSBase = '/catalog/views/'+feature;
		//load catalog
		$.getScript(sbase)
		.done(function( script, textStatus ) {
			//load views from catalog
			loadViews();
			//load feature page
			$('#headerJavascriptHolder').load('/catalog/features/feature-'+feature+'.html',function() {
				prettyPrint();
				$('#jscatalog').load('/catalog/fragments/jscatalog.html',function() {
					var tbody='';
					var count=0;
					for (var property in views) {
						console.log('view : '+views[property].name);
					    if (views.hasOwnProperty(property)) {
					    	var idname = 'c'+count++;
					    	var link ='<span"  id="'+idname+'" rel="popover" data-toggle="popover" data-placement="top" data-trigger="hover">'+views[property].name+'</span>';
					    	if(views[property].dashboard)
					    		tbody = tbody+'<tr onclick="showDashboardSource(\''+views[property].name+'\');return false;"><td width="30%">'+link+'</td><td id="'+idname+'_desc">'+views[property].desc+'</td></tr>';
					    	else
					    		tbody = tbody+'<tr onclick="showViewSource(\''+views[property].name+'\');return false;"><td width="30%">'+link+'</td><td id="'+idname+'_desc">'+views[property].desc+'</td></tr>';
					    	
					    }
					}
					$('#jscatalog-tbody').html(tbody);
				});
			});
			
		})
		.fail(function( jqxhr, settings, exception ) {
			//console.log("fail to load :"+feature);
		});
}




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

window.onerror = function(msg, url, line, col, error) {
	   // Note that col & error are new to the HTML 5 spec and may not be 
	   // supported in every browser.  It worked for me in Chrome.
	   var extra = !col ? '' : '\ncolumn: ' + col;
	   extra += !error ? '' : '\nerror: ' + error;

	   
	   if(url.contains('jenscript/jenscript') && url.endsWith('.js')){
		  console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
		   
		   $('#errorHolder').load('/catalog/fragments/error.html',function() {
				var errorText ='\n'+'//'+ UA.toString()+'\n'+msg;
				errorText = errorText+'\n'+'url : '+url+'\n'+'line : '+line+'\n'+'col : '+col;
				errorText = errorText+'\n'+'msg : '+msg;
				if(error != 'undefined')
					errorText = errorText+'\n'+'stack : '+error.stack;
				
				$('#errorMessage').html(errorText);
				prettyPrint();
			});
	   }
	   

	   var suppressErrorAlert = true;
	   // If you return true, then error alerts (like in older versions of 
	   // Internet Explorer) will be suppressed.
	   return suppressErrorAlert;
	};

var currentView; 
function showViewSource(viewName){
	if(currentView !== undefined){
		//console.log('current view : '+currentView.name);
		if(currentView.onQuit){
			//console.log('onQuit is defined, call it');
			try{
				currentView.onQuit();
			}catch(e){
				console.log('error on quit view '+currentView.name);
			}
			
		}
	}
	
	$("[id*='_desc']").removeAttr('class');
	$(".popover").remove();
	var view = getViewByName(viewName);
	$.get(catalogJSBase+'/'+view.file, function(content) {
		$('#sourceHolder').load('/catalog/fragments/view-source.html',function() {
			$('#viewTitle').html(view.desc);
			try{
				create(viewName,"demoView",600,400);
				currentView = view;
			}
			catch(err){
				$('#errorHolder').load('/catalog/fragments/error.html',function() {
					var errorText ='\n'+'//'+ UA.toString()+'\n'+err.toString();
					errorText = errorText+'\n'+'file : '+err.fileName+'\n'+'line : '+err.lineNumber;
					errorText = errorText+'\n'+'stack : '+err.stack;
					$('#errorMessage').html(errorText);
					prettyPrint();
				});
			}finally{
				$('#viewSource').html(content);
				prettyPrint();
			}
			
		});
		return false;
	});
}

function showDashboardSource(viewName){
	$("[id*='_desc']").removeAttr('class');
	$(".popover").remove();
	var view = getViewByName(viewName);

	$.get(catalogJSBase+'/'+view.file, function(content) {
		$('#sourceHolder').load('/catalog/fragments/jsview-source.html',function() {
			$('#viewTitle').html(view.desc);
			try{
				create(viewName,"demoView",400,300);
			}
			catch(err){
				$('#errorHolder').load('/catalog/fragments/error.html',function() {
					var errorText ='\n'+'//'+ UA.toString()+'\n'+err.toString();
					errorText = errorText+'\n'+'file : '+err.fileName+'\n'+'line : '+err.lineNumber;
					errorText = errorText+'\n'+'stack : '+err.stack;
					$('#errorMessage').html(errorText);
					prettyPrint();
				});
			}finally{
				$('#viewSource').html(content);
				prettyPrint();
			}
			
		});
		return false;
	});
	
}

function loadViewFile(viewName){
	var view = getViewByName(viewName);
	if(view !== undefined){
		$.getScript(catalogJSBase+'/'+view.file)
    	.done(function( script, textStatus ) {
    		console.log("success load "+viewName+" with file resource : "+view.file);
    	})
    	.fail(function( jqxhr, settings, exception ) {
    		console.log('failed load  '+viewName+' with error '+exception);
    	});
	}else{
		console.log('no view found for name  '+viewName);
	}
};


function getViewByName(viewName){
	for (var property in views) {
	    if (views.hasOwnProperty(property)) {
	        //console.log("property : "+views[property].name);
	        if(views[property].name === viewName){
	        	return views[property];
	        }
	    }
	}
	return undefined;
};

function loadViews(){
	for (var property in views) {
	    if (views.hasOwnProperty(property)) {
	        console.log("load view  : "+views[property].name);
	        loadViewFile(views[property].name);
	    }
	}
};


function create(viewName, container, width, height){
	var view = getViewByName(viewName);
	if(view === undefined){
		console.log("Error call function with name :"+viewName+" of feature :"+jsfeature);
	}
	if(!window[view.fnName]){
		console.log("Error call function with name :"+viewName+" of feature :"+jsfeature +" with function name : "+view.fnName);
	}
	//window["My"]["Namespace"]["functionName"](arguments);
	window[view.fnName](container, width, height);
};



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


var StockLoader = function(proj,args,callback){
	 //console.log('new StockLoader');
	 var years = [];
	 var stocks = [];
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
	 
	 
	 this.getY = function(fullYear){
		 for (var i = 0; i < years.length; i++) {
				var y = years[i];
				if(fullYear == y.year)
					return y;
		 }
		 return undefined;
	 },
	 
	 this.loadYear = function(year){
		//console.log('load year : '+year.year);
		if(year === undefined || year.year === undefined)
			return;
		
		var m = new JenScript.ProgressMonitor({
			//x : 30,
			//y : 20,
			//width : 100,
			//height : 6,
			total : 250,//approximation of total which is (245/255 stock by year)
			onComplete : function() {
				proj.unregisterPlugin(this);
			},
			outlineColor : 'black',
			backgroundColor : 'white',
			foregroundColor : 'purple'
		});
		monitorPlugin.addMonitor(m);
		
		//Ref to monitor
		year.monitor = m;
		
		var stockCount = 0;
		var dataWorker = new Worker('/catalog/views/stock/StockWorker.js');
		dataWorker.addEventListener("message", function(event) {
			if (event.data.startsWith !== undefined && event.data.startsWith('finish')) {
				var yearFromWorker = event.data.split(':')[1];
				var yo = that.getY(yearFromWorker);
				yo.state='loaded';
				yo.monitor.complete();
				callback(yo.year,stocks);
				yo.worker.terminate();
			} else {
				stockCount++;
				var stock = new JenScript.Stock(event.data);
				if (event.data.fixing !== undefined){
					stocks[stocks.length] = stock;
					var yo = that.getY(stock.fixing.getFullYear());
					if(yo.monitor){
						setTimeout(function(){
							yo.monitor.setValue(stockCount, 'Load SLV '+yo.year+' stock '+ stockCount);
						},20);
					}else{
						//console.log("no monitor found");
					}
					
				}
				
			}

		}, false);
		dataWorker.postMessage((year.year+''));
		year.worker=dataWorker;
	};

	proj.addProjectionListener('boundChanged',function(){
		var minYear = proj.getMinDate().getFullYear();
		var maxYear = proj.getMaxDate().getFullYear();
		var foundMinYear = false;
		var foundMaxYear = false;
		for (var i = 0; i < years.length; i++) {
			var y = years[i].year;
			if(y === minYear){
				foundMinYear = true;
			}
			if(y === maxYear){
				foundMaxYear = true;
			}
		}
		if(!foundMinYear){
			years[years.length]={year : minYear , state :'request'};
		}
		if(!foundMaxYear && minYear !== maxYear){
			years[years.length]={year : maxYear , state :'request'};
		}
		for (var i = 0; i < years.length; i++) {
			var y = years[i];
			if(y.state === 'request'){
				y.state = 'processing';
				setTimeout(that.loadYear(y),300);
			}
		}
		
	},'Stock projection listener');
	
	var init = function(i,y){
		console.log(i+','+y.year);
		setTimeout(function(){
			that.loadYear(y);
		},i*600);
	};
	
	for (var i = 0; i < args.length; i++) {
		//console.log('launch defaut year : '+args[i]);
		years[i]={year:args[i],state:'processing'};
		init(i,years[i]);
	}
	
};

