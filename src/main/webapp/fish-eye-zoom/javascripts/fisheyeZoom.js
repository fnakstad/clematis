// todo
var globalEpisodeContainer;
// todo

	var tbl = document.createElement("table");
	var newTbl=document.createElement("table");

	var tblBody = document.createElement("tbody");
	var tblBody_map = document.createElement("tbody");

	var lineBreak = document.createElement('br');
	

	var episodeContainer = document.createElement("div");
	var episodeContainer2 = document.createElement("div");
	var episodeContents = document.createElement("div");
	var scaledDiv = document.createElement("div");
	scaledDiv.id="scaledDiv";
	$(scaledDiv).addClass('scaledDiv');
	scaledDiv.style.width="auto";
	scaledDiv.style.float="left";
	scaledDiv.style.height="50px";


	//$(episodeContainer).addClass('dock-container');
	episodeContainer.id="makeMeScrollable";
	episodeContainer.style.height="700px";
	//episodeContainer.style.overflow="scroll"

	var episode1Clicked=false;


	var episodes = new Array();
	var divs=new Array();
	var links=new Array();
	var row = document.createElement("tr");
    var cells=new Array();

    var episodes_map = new Array();
	var divs_map=new Array();
	var links_map=new Array();
	var row_map = document.createElement("tr");
    var cells_map=new Array();

    var currentEpisode;
    var temp_data;
    var conn;
    //REST CALL

   
var number_episodes;
	
 var url = 'http://localhost:8080/rest/clematis-api/episodes/';

  $.ajax({
		type: 'GET',
		url: url ,
		dataType: "json",
		async: false,
		success: renderList 
	});
	


function renderList(data) {
	//console.log(data);
	number_episodes=data.length;
	//alert("success");
	//console.log(data);
	
	// todo
	globalEpisodeContainer = data;
	console.log("=======================");
	console.log(globalEpisodeContainer);

	var marchedIDs;	
//	var matchedIDs = searchByDomEventType("click");

	matchedIDs = searchByDomElementKeyword("record");
	
	var key = "Send";
	matchedIDs = searchTraceByKeyword(key.toLowerCase());

	for (var i = 0; i < matchedIDs.length; i ++) {
		console.log(matchedIDs[i], " - ", globalEpisodeContainer[matchedIDs[i]].trace.trace);
	}

	console.log("=======================");
	
	matchedIDs = searchTraceByKeyword("request");

	for (i = 0; i < matchedIDs.length; i ++) {
		console.log(matchedIDs[i], " - ", globalEpisodeContainer[matchedIDs[i]].trace.trace);
	}
	
	console.log("=======================");
	// todo
}


	
	
	//create the list of episodes, ZOOM  level 0
	for (var i=0; i<number_episodes; i++){
		links[i]=document.createElement('a');
		$(links[i]).addClass('dock-item');
		(links[i]).style.top="auto";
		

		links_map[i]=document.createElement('a');
		$(links_map[i]).addClass('dock-item');
		(links_map[i]).style.top="auto";
		
		//episodes[i]=document.createTextNode("Episode #"+i); 
		divs[i]=document.createElement("div");

		episodes_map[i]=document.createTextNode("Episode #"+i); 
		divs_map[i]=document.createElement("div");

		//divs[i].id="div"+i;
		
		

    	 $.ajax({
		type: 'GET',
		url: 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/source' ,
		dataType: "json",
		async: false,
		success: function show1(data) {


		if(data.id==0){
			episodes[i]=document.createTextNode("Episode #"+i+"\n"+"DOM"); 
			$(divs[i]).addClass('cell_dom');
			$(divs_map[i]).addClass('box');

		
		}
		else if(data.id!=0 && data.callbackFunction.length>0){
			episodes[i]=document.createTextNode("Episode #"+i+"\n"+"Timeout"); 
			$(divs[i]).addClass('cell_to');
			$(divs_map[i]).addClass('box');

		}

		else
		{
			episodes[i]=document.createTextNode("Episode #"+i+"\n"+"XHR"); 
			$(divs[i]).addClass('cell_xhr');
			$(divs_map[i]).addClass('box');

		}


		}

		});

    	 divs[i].appendChild(episodes[i]);
		links[i].appendChild(divs[i]);
		
		cells[i]=document.createElement("td");
    	cells[i].appendChild(divs[i]);
    
    	row.appendChild(cells[i]);

    	divs_map[i].appendChild(episodes_map[i]);
		links_map[i].appendChild(divs_map[i]);
		
		cells_map[i]=document.createElement("td");
    	cells_map[i].appendChild(divs_map[i]);
    
    	row_map.appendChild(cells_map[i]);



	
	}
	
	tbl.id="tbl";
	
    tblBody.appendChild(row);
    tbl.appendChild(tblBody);
    //tbl.style.borderSpacing="6px";

   // var newTbl = tbl.cloneNode(true);

    tblBody_map.appendChild(row_map);
    newTbl.appendChild(tblBody_map);
    newTbl.id="newTbl";



	episodeContainer.appendChild(tbl);
	

	(scaledDiv).appendChild(newTbl);

	
//	episodeContainer2.appendChild(episodeContainer);

//Add the menu to the top of the page
// The menu consists of the following"
//1-a home button
//2-a back button
//3-a forward button
//4-a minimap to show the user where they are in a story

	var lineBreak=document.createElement("br");
	var menuContainer=document.createElement("div");
	//menuContainer.style.position="fixed";
	menuContainer.style.left="30%";

	var menuContainerSlide=document.createElement("div");
	menuContainerSlide.id="slide"
	$(menuContainer).addClass('menu');
	var menuList = document.createElement("ul");
	menuList.id="menu";
	var menuElem1 = document.createElement("li");
	var menuElem2 = document.createElement("li");
	var menuElem3 = document.createElement("li");
	var menuElem4 = document.createElement("li");
	var menuElem_map = document.createElement("li");

	var menuAnchor1 = document.createElement("a");
	var menuAnchor2 = document.createElement("a");
	var menuAnchor3 = document.createElement("a");
	var menuAnchor4 = document.createElement("a");

	menuAnchor2.style.width="5px";
	menuAnchor1.href="#anchor1";
	menuAnchor2.href="#anchor2";
	menuAnchor3.href="#anchor3";
	menuAnchor4.href="#anchor4";

	var backButton = document.createElement("input");
    backButton.setAttribute("type", "image");
   	backButton.src="images/arrow_left.gif";
    backButton.setAttribute("value", "Back");
    backButton.setAttribute("name", "Back");
    backButton.setAttribute("title","previous episode");
    backButton.style.height="20px";
    backButton.addEventListener('click', function(){
    	if(currentEpisode==0){
    		currentEpisode=episodes.length;
    	}
    	nextPreviousEpisode(currentEpisode-1);
	});

    var forwardButton = document.createElement("input");
    forwardButton.setAttribute("type", "image");
   	forwardButton.src="images/arrow_right.gif";
    forwardButton.setAttribute("value", "Forward");
    forwardButton.setAttribute("name", "Forward");
    forwardButton.setAttribute("title","next episode");
    forwardButton.style.height="20px";
    forwardButton.addEventListener('click', function(){
    	if(currentEpisode==episodes.length-1){
    		currentEpisode=-1;
    	}
    	nextPreviousEpisode(currentEpisode+1);
	});

    var homeButton = document.createElement("input");
    homeButton.setAttribute("type", "image");
   	homeButton.src="images/Home.png";
    homeButton.setAttribute("value", "Home");
    homeButton.setAttribute("name", "Home");
    homeButton.setAttribute("title","Home");
    homeButton.style.height="20px";
    homeButton.onclick=reloadPage;

    var fullScreen = document.createElement("input");
    fullScreen.setAttribute("type", "image");
   	fullScreen.src="images/fullscreen2.gif";
    fullScreen.setAttribute("value", "fullScreen");
    fullScreen.setAttribute("name", "fullScreen");
    fullScreen.setAttribute("title","expand current episode");
    fullScreen.style.height="20px";
    fullScreen.addEventListener('click', function(){

    	if(zoomLevel1==true){
    		expandCurrentEpisode(currentEpisode);
    	}
    	else
    	{}
	});


    function reloadPage(){
    	window.location.reload();

    }
	
	//menuAnchor1.text = "Item1";
	//menuAnchor2.text = "Item2";
	//menuAnchor3.text = "Item3";

	
	menuAnchor1.appendChild(homeButton);
	//menuAnchor2.appendChild(backButton);
	//menuAnchor3.appendChild(forwardButton);
	//menuAnchor4.appendChild(fullScreen);

	menuElem1.value=1;
	menuElem1.appendChild(menuAnchor1);
	menuElem2.appendChild(menuAnchor2);
	menuElem3.appendChild(menuAnchor3);
	menuElem4.appendChild(menuAnchor4);

	menuList.appendChild(menuElem1);
	menuList.appendChild(menuElem4);
	menuList.appendChild(menuElem2);
	menuList.appendChild(menuElem3);
	
	/***************************************/
	/*** Begin: Search By DOM Event Type ***/
	/***************************************/
	// todo ADD SELECT TAG FOR SEARCHING BY DOM EVENT TYPE
	
	var selectDomEventType = document.createElement('select');
	selectDomEventType.id = "selectDomEventType";
	selectDomEventType.name = "selectDomEventType";

	var domEventOption = document.createElement('option');
	domEventOption.value = "Search by Event";
	domEventOption.textContent = "Search by Event";
	selectDomEventType.appendChild(domEventOption);
	
	domEventOption = document.createElement('option');
	domEventOption.value = "click";
	domEventOption.textContent = "click";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "dblclick";
	domEventOption.textContent = "dblclick";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "mousedown";
	domEventOption.textContent = "mousedown";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "mousemove";
	domEventOption.textContent = "mousemove";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "mouseover";	
	domEventOption.textContent = "mouseover";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "mouseout";	
	domEventOption.textContent = "mouseout";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "mouseup";	
	domEventOption.textContent = "mouseup";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "keydown";	
	domEventOption.textContent = "keydown";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "keypress";	
	domEventOption.textContent = "keypress";
	selectDomEventType.appendChild(domEventOption);

	domEventOption = document.createElement('option');
	domEventOption.value = "keyup";	
	domEventOption.textContent = "keyup";
	selectDomEventType.appendChild(domEventOption);
	
	var menuElem_searchDomEl = document.createElement("li");

	menuElem_searchDomEl.appendChild(selectDomEventType);
	menuList.appendChild(menuElem_searchDomEl);

	
	/*************************************/
	/*** End: Search By DOM Event Type ***/
	/*************************************/
	
	menuContainer.appendChild(menuList);
	menuContainer.appendChild(menuContainerSlide);


	//Add the menu and list of episodes to the page
	//document.body.style.backgroundColor = '#000';
	var code_div=document.createElement('div');
	document.body.appendChild(menuContainer);
	document.body.appendChild(episodeContainer);
	document.body.appendChild(code_div);
	
	/******** Add the listener for search by dom event select tag *******/
	document.getElementById('selectDomEventType').addEventListener('change', searchByDomEventClicked);
	
	function searchByDomEventClicked() {
		var matchingEpisodes = searchByDomEventType(this.options[this.selectedIndex].value);
		console.log("++++\n", matchingEpisodes);
	}
	/*********************************/

//Create the tabbed view that will be used for zoom level2
var tabs_div=document.createElement("div");
tabs_div.id="tabs_div";
tabs_div.style.top="50px";
//tabs_div.style.position="absolute";



var list = document.createElement("ul");
var elem1 = document.createElement("li");
var elem2 = document.createElement("li");
var elem3 = document.createElement("li");
var elem4 = document.createElement("li");

var anchor1 = document.createElement("a");
var anchor2 = document.createElement("a");
var anchor3 = document.createElement("a");
var anchor4 = document.createElement("a");

anchor1.href="#tabs1";
anchor2.href="#tabs2";
anchor3.href="#tabs3";
anchor4.href="#tabs4";

anchor1.text = "Event Type";
anchor2.text = "DOM mutations";
anchor3.text = "Trace";
anchor4.text = "Episode";


elem1.appendChild(anchor1);
elem2.appendChild(anchor2);
elem3.appendChild(anchor3);
elem4.appendChild(anchor4);

list.appendChild(elem4);
list.appendChild(elem1);
list.appendChild(elem2);
list.appendChild(elem3);



var tabs1=document.createElement("div");
var tabs2=document.createElement("div");
var tabs3=document.createElement("div");
var tabs4=document.createElement("div");

tabs1.id="tabs1";
tabs2.id="tabs2";
tabs3.id="tabs3";
tabs4.id="tabs4";



tabs_div.appendChild(list);
tabs_div.appendChild(tabs1);
tabs_div.appendChild(tabs2);
tabs_div.appendChild(tabs3);
tabs_div.appendChild(tabs4);

$(tabs_div).tabs();

var zoomLevel1=false;




////////////////////////////////////////////////////////////////////ZOOM LEVEL 1 /////////////////

	//var episodeContents = document.createElement("div"); // MOVED UP
	episodeContents.id=("episode-Contents");

	
	episodeContents.style.border = " solid black";
	episodeContents.style.display="table";
	
	//episodeContents.style.left="390px";
	//episodeContents.style.top="120px";
	episodeContents.style.width="120px";

	var tblLevel1 = document.createElement("table");
	var tblBodyLevel1 = document.createElement("tbody");
	
	var rowLevel1 = document.createElement("tr");
	var row2Level1 = document.createElement("tr");
    var cellLevel1= document.createElement("td");
    cellLevel1.id="CELL1";
    
    var cell2Level1= document.createElement("td");
    cell2Level1.id="CELL2";

    
    rowLevel1.appendChild(cellLevel1);
    row2Level1.appendChild(cell2Level1);
    
    tblBodyLevel1.appendChild(rowLevel1);
    tblBodyLevel1.appendChild(row2Level1);
    
    var row3Level1 = document.createElement("tr");
    var cell3Level1= document.createElement("td");
    cell3Level1.id="CELL3";

    row3Level1.appendChild(cell3Level1);
    tblBodyLevel1.appendChild(row3Level1); 
    tblLevel1.appendChild(tblBodyLevel1);
    tblLevel1.setAttribute("border","0");
    //tblLevel1.style.border = " solid black";

    episodeContents.appendChild(tblLevel1);

   // episodeContents.style.overflow="auto";


var zoomLevel1Container_DOM=document.createElement("div");
var zoomLevel1Container_source=document.createElement("div");
var zoomLevel1Container_trace=document.createElement("div");

var cell1SZ=cellLevel1;	
var cell2SZ=cell2Level1;		
var cell3SZ=cell3Level1		

for (var i = 0, n = cells.length; i<n; i++) {
  var el = cells[i];

  
  el.addEventListener('click', (function(i, el) { 
    return function() {
    	//jsPlumb.detachEveryConnection();

    	menuAnchor4.appendChild(fullScreen);
    	if(zoomLevel1==false){
			zoomLevel1=true;
			currentEpisode=i;

	//Get the source for  zoom level 1, specifically we want to get the eventType and eventHandler from the the source
	var url = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/source';
    var tempDiv_source=document.createElement("div");
   	var tbl_source = document.createElement("table");
	var tblBody_source = document.createElement("tbody");
	var rows_source=new Array;
	var cells_source=new Array;
	rows_source[0] = document.createElement("tr");
	rows_source[1] = document.createElement("tr");
	rows_source[2]=document.createElement("tr");

	 cells_source[0]=document.createElement("td");
	 cells_source[1]=document.createElement("td");
	 cells_source[2]=document.createElement("td");
	 cells_source[3]=document.createElement("td");
	 cells_source[4]=document.createElement("td");


	 //cells_source[0].style.display="block";
	 cells_source[0].style.fontSize="20px";
	 cells_source[1].style.fontSize="15px";
	 cells_source[2].style.fontSize="15px";
	 cells_source[0].style.color="black";
	 cells_source[1].style.color="black";
	 cells_source[2].style.color="black";

	  cells_source[0].style.fontFamily="TAHOMA";
	  cells_source[1].style.fontFamily="TAHOMA";
	  cells_source[2].style.fontFamily="TAHOMA";

	 cells_source[0].colSpan=2;

	 cells_source[0].appendChild(document.createTextNode("Source"));

	 
	 rows_source[0].appendChild(cells_source[0]);
	 

	 
	 
	
  	$.ajax({
		type: 'GET',
		url: url ,
		dataType: "json",
		async: false,
		success: function show1(data) {

		

	 	//if id != 0 then its an XHR or Timeout event
		if(data.id==0){
			cells_source[1].appendChild(document.createTextNode("eventType"));
	 		cells_source[2].appendChild(document.createTextNode("targetElement id"));
			cells_source[3].appendChild(document.createTextNode(JSON.stringify(data.eventType)));
			cells_source[3].setAttribute('class','cell_source');
			cells_source[4].appendChild(document.createTextNode(JSON.stringify(data.targetElement.id)));
			$(episodeContents).addClass('cell_dom').removeClass('cell_to' ,'cell_xhr');

		
		}
		else if(data.id!=0 && (data.timeoutId==0 || data.timeoutId!=0)){

			cells_source[1].appendChild(document.createTextNode("eventType"));
	 		cells_source[2].appendChild(document.createTextNode("targetElement"));
			cells_source[3].appendChild(document.createTextNode("TO:"+JSON.stringify(data.id)));
			cells_source[3].setAttribute('class','cell_source');
			cells_source[4].appendChild(document.createTextNode(JSON.stringify(data.id)));
			$(episodeContents).addClass('cell_to').removeClass('cell_xhr', 'cell_dom');
		}

		else{

			cells_source[1].appendChild(document.createTextNode("eventType"));
	 		cells_source[2].appendChild(document.createTextNode("targetElement"));
			cells_source[3].appendChild(document.createTextNode("XHR:"+JSON.stringify(data.id)));
			cells_source[3].setAttribute('class','cell_source');
			cells_source[4].appendChild(document.createTextNode(JSON.stringify(data.id)));
			$(episodeContents).addClass('cell_xhr').removeClass('cell_to', 'cell_dom');


		}
		

		rows_source[1].appendChild(cells_source[1]);
		rows_source[1].appendChild(cells_source[2]);
		rows_source[2].appendChild(cells_source[3]);
		//rows_source[2].appendChild(cells_source[4]);

		tblBody_source.appendChild(rows_source[0]);
	 	//tblBody_source.appendChild(rows_source[1]);
		tblBody_source.appendChild(rows_source[2]);


	}

		});

  	tbl_source.setAttribute("border","0");
  	tbl_source.appendChild(tblBody_source);
  	tempDiv_source.appendChild(tbl_source);
	cell1SZ.appendChild(tempDiv_source);



//Get the Dom for  zoom level 1
	 var url2 = 'http://localhost:8080/rest/clematis-api/episodes/'+i;
	 var dom;
	$.ajax({
		type: 'GET',
		url: url2 ,
		dataType: "json",
		async: false,
		success: function renderList3(data) {

		console.log(data);
		dom=document.createTextNode("Result");
	}
		});
		cell3SZ.style.fontSize="20px";

	 cell3SZ.style.color="black";

	 
	 cell3SZ.style.fontFamily="TAHOMA";
  		cell3SZ.appendChild(dom);



  	//Get the trace for  zoom level 1, specifically we want to get the trace and lineNo and targetfunction and scopeName from the the trace.	
  	 var url3 = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/trace';
	 var trace=new Array;
	 var tempDiv=document.createElement("div");
	 var myBr = document.createElement('br');
	 var tbl = document.createElement("table");
	 var tblBody = document.createElement("tbody");
	 var rows=new Array;
	 rows[0] = document.createElement("tr");
	 rows[1] = document.createElement("tr");
	 var cells=new Array;

	 cells[0]=document.createElement("td");
	 cells[1]=document.createElement("td");
	 cells[2]=document.createElement("td");
	 cells[3]=document.createElement("td");
	 
	 cells[0].style.fontSize="20px";
	 cells[1].style.fontSize="15px";
	 cells[2].style.fontSize="15px";
	 cells[3].style.fontSize="15px";

	 cells[0].style.color="black";
	 cells[1].style.color="black";
	 cells[2].style.color="black";
	 cells[3].style.color="black";
	 
	 cells[0].style.fontFamily="TAHOMA";
	 cells[1].style.fontFamily="TAHOMA";
	 cells[2].style.fontFamily="TAHOMA";
	 cells[3].style.fontFamily="TAHOMA";

	 cells[0].colSpan=3;
	 cells[0].appendChild(document.createTextNode("Trace"));
	 cells[1].appendChild(document.createTextNode("lineNo"));
	 cells[2].appendChild(document.createTextNode("targetFunction"));
	 cells[3].appendChild(document.createTextNode("scopeName"));

	 rows[0].appendChild(cells[0]);
	 rows[1].appendChild(cells[1]);
	 rows[1].appendChild(cells[2]);
	 rows[1].appendChild(cells[3]);
	 tblBody.appendChild(rows[0]);
	 //tblBody.appendChild(rows[1]);

	$.ajax({
		type: 'GET',
		url: url3 ,
		dataType: "json",
		async: false,
		success: function renderList4(data) {
	
	
			/*
			for(var i=1;i<data.trace.length;i++){
				rows[i+2]=document.createElement("tr");

				cells[i+4]=document.createElement("td");
				cells[i+5]=document.createElement("td");
				cells[i+6]=document.createElement("td");


				cells[i+4].appendChild(document.createTextNode(JSON.stringify(data.trace[i].lineNo)));
				cells[i+5].appendChild(document.createTextNode(JSON.stringify(data.trace[i].targetFunction)));
				cells[i+6].appendChild(document.createTextNode(JSON.stringify(data.trace[i].scopeName)));

				rows[i+2].appendChild(cells[i+4]);
				rows[i+2].appendChild(cells[i+5]);
				rows[i+2].appendChild(cells[i+6]);
				tblBody.appendChild(rows[i+2]);
				//tempDiv.appendChild(trace[i]);
			}

			*/
			var counter=0;
			var num_rows=1;
			rows[num_rows+2]=document.createElement("tr");
			for(var i=1;i<data.trace.length;i++){

				if(counter==3){
					counter=0;
					num_rows++;
					rows[num_rows+2]=document.createElement("tr");

				}
				counter++;

				cells[i+3]=document.createElement("td");


				var eventHandler= new String(JSON.stringify(data.trace[i].eventHandler));
				if(data.trace[i].id==0 && eventHandler=="\"anonymous\""){
					cells[i+3].appendChild(document.createTextNode("Anonymous"));
					cells[i+3].setAttribute("title","Anonymous");
					$(cells[i+3]).tipsy({gravity:'nw'});
				}
				else if(data.trace[i].id !=0 && (data.trace[i].xhrId>=0)){
					cells[i+3].appendChild(document.createTextNode("XHR id:"+JSON.stringify(data.trace[i].xhrId)));
					cells[i+3].setAttribute("title","XHR Event");
					$(cells[i+3]).tipsy({gravity:'nw'});
				}
				else if(data.trace[i].id !=0 && (data.trace[i].timeoutId>=0)){
					cells[i+3].appendChild(document.createTextNode("TimeOut id:"+JSON.stringify(data.trace[i].timeoutId)));
					cells[i+3].setAttribute("title","Timeout Event");
					$(cells[i+3]).tipsy({gravity:'nw'});
				}
				else{
					cells[i+3].appendChild(document.createTextNode(JSON.stringify(data.trace[i].targetFunction)));
					cells[i+3].setAttribute("title","DOM Event");
					$(cells[i+3]).tipsy({gravity:'nw'});
				}

				cells[i+3].setAttribute('class','cell_source');


				rows[num_rows+2].appendChild(cells[i+3]);
				tblBody.appendChild(rows[num_rows+2]);
			}
			//tbl.setAttribute("border","3");
			tbl.appendChild(tblBody);
			tempDiv.appendChild(tbl);
	}
		});

  	

		cell2SZ.appendChild(tempDiv);
		jsPlumb.detachEveryConnection();
		$(divs[i]).replaceWith(episodeContents);
		//$(divs[i]).replaceWith(episodeTable[i]);
		//tabs3.appendChild(episodeTable[i]);
		
	
	
			
		}
		
		
		else{
			zoomLevel1=false;

			$(episodeContents).replaceWith(divs[i]);
			cell1SZ.removeChild(cell1SZ.lastChild);
			cell2SZ.removeChild(cell2SZ.lastChild);
			cell3SZ.removeChild(cell3SZ.lastChild);
			//redrawLinks(temp_data);
			renderListLinks(temp_data);
			//jsPlumb.repaintEverything();
			
		}

    }
  })(i, el), false);
}


function getType(data,i){
	if(data.trace[i].id==0 && data.trace[i].targetfunction.length>0){
		return 1;
	}
	else if(data.trace[i].id !=0 && (data.trace[i].xhrId==0  ||data.trace[i].xhrId!=0)){
		return 2;
	}
	else if(data.trace[i].id !=0 && (data.trace[i].timeoutId==0  ||data.trace[i].timeoutId!=0)){
		return 3;
	}
	else{
		return 4;
	}

}
//Function to zoom into the current episode(ZOOM level 2)
function expandCurrentEpisode(i){

	menuAnchor2.appendChild(backButton);
	menuAnchor3.appendChild(forwardButton);

	anchor4.text="Episode  "+i;
	var url = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/source';
    var eventType;
   

  	$.ajax({
		type: 'GET',
		url: url ,
		dataType: "json",
		async: false,
		success: renderList2
		});

  	function renderList2(data) {

		console.log(data.eventType);
		eventType=document.createTextNode(data.eventType);
	}

		var temp_event=first_column;//document.getElementById('first_column');
		tabs1.appendChild(temp_event);
//get the DOM of a speceifc episode
 	var url2 = 'http://localhost:8080/rest/clematis-api/episodes/'+i;
	 var dom;
	$.ajax({
		type: 'GET',
		url: url2 ,
		dataType: "json",
		async: false,
		success: renderList3
		});

  	function renderList3(data) {
		console.log(data);
		dom=document.createTextNode(JSON.stringify(data.dom));
	}
		tabs2.appendChild(dom);

//get the trace of a specefic episode
	var url3 = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/trace';
	 var trace=new Array;
	 var tempDiv=document.createElement("div");
	 var myBr = document.createElement('br');
	$.ajax({
		type: 'GET',
		url: url3 ,
		dataType: "json",
		async: false,
		success: function renderList4(data) {
				
			
			for(var i=0;i<data.trace.length;i++){
				trace[i]=document.createTextNode(JSON.stringify(data.trace)+"\n");
				tempDiv.appendChild(trace[i]);
			}

	
	}
		});

		//tabs3.appendChild(trace[0]);
		//var cells=document.getElementById('storyTable');
		//console.log(cells);
		//tabs3.appendChild(document.getElementById('episodeTable_'+i));
		var table_sequence=document.createElement('table');
		var row_sequence=document.createElement('tr');
		var cell1_sequence=document.createElement('td');
		var cell2_code=document.createElement('td');

		row_sequence.appendChild(cell1_sequence);
		row_sequence.appendChild(cell2_code);
		table_sequence.appendChild(row_sequence);
		cell1_sequence.appendChild(episodeTable[i]);

		 var div_code=second_column;//document.getElementById('second_column');
		cell2_code.appendChild(div_code);
		//code_div.appendChild(second_column);
		tabs3.appendChild(table_sequence);
    	$(episodeContainer).replaceWith(tabs_div);

}


// function to navigate to the next or previous episode in zoom level 2
function nextPreviousEpisode(i){
	console.log(divs_map.length);
	for (var j = 0; j < divs_map.length; j++) {
		 divs_map[j].setAttribute('class','box');
	};
	

	divs_map[i].setAttribute('class','box2');
	currentEpisode=i;
	tabs1.innerHTML = '';
	tabs2.innerHTML = '';
	tabs3.innerHTML = '';

	anchor4.text="Episode  "+i;
	var url = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/source';
    var eventType;
   

  	$.ajax({
		type: 'GET',
		url: url ,
		dataType: "json",
		async: false,
		success: renderList2
		});

  	function renderList2(data) {

		console.log(data.eventType);
		eventType=document.createTextNode(data.eventType);
	}
		//tabs1.appendChild(eventType);
		tabs1.appendChild(first_column);
//get the DOM of a speceifc episode
 	var url2 = 'http://localhost:8080/rest/clematis-api/episodes/'+i;
	 var dom;
	$.ajax({
		type: 'GET',
		url: url2 ,
		dataType: "json",
		async: false,
		success: renderList3
		});

  	function renderList3(data) {
		console.log(data);
		dom=document.createTextNode(JSON.stringify(data.dom));
	}
		tabs2.appendChild(dom);

//get the trace of a specefic episode
	var url3 = 'http://localhost:8080/rest/clematis-api/episodes/'+i+'/trace';
	 var trace=new Array;
	 var tempDiv=document.createElement("div");
	 var myBr = document.createElement('br');
	$.ajax({
		type: 'GET',
		url: url3 ,
		dataType: "json",
		async: false,
		success: function renderList4(data) {
				
			
			for(var i=0;i<data.trace.length;i++){
				trace[i]=document.createTextNode(JSON.stringify(data.trace)+"\n");
				tempDiv.appendChild(trace[i]);
			}

	
	}
		});

		var table_sequence=document.createElement('table');
		var row_sequence=document.createElement('tr');
		var cell1_sequence=document.createElement('td');
		var cell2_code=document.createElement('td');

		row_sequence.appendChild(cell1_sequence);
		row_sequence.appendChild(cell2_code);
		table_sequence.appendChild(row_sequence);
		cell1_sequence.appendChild(episodeTable[i]);

		 var div_code=second_column;//document.getElementById('second_column');
		cell2_code.appendChild(div_code);
		tabs3.appendChild(table_sequence);
		//tabs3.appendChild(trace[0]);
		//tabs3.appendChild(episodeTable[i]);


}

function renderListLinks(data) {

		temp_data=data;
		for (var i = 0; i < data.length; i++) {
			//links[i]=jsPlumb.addEndpoint(cells[data[i].source]);
			//links[i+1]=jsPlumb.addEndpoint(cells[data[i].target]);
			//jsPlumb.connect({ source:links[i], target:links[i+1],endpoint:["rectangle"],connector:["Bezier", { curviness:30 }] });
			var color_link=get_random_color();
			jsPlumb.connect({
                source: (cells[data[i].target]), //flipped these so arrows point in right direction
                target: (cells[data[i].source]),
                connector: ["Bezier",{ curviness:30 }],
                cssClass: "c1",
                endpoint: "Blank",
                endpointClass: "c1Endpoint",
                paintStyle: {
                    lineWidth: 1,
                    strokeStyle: color_link,
                    outlineWidth: 1,
                    outlineColor: "#666"
                },
                endpointStyle: {
                    fillStyle: "#a7b04b"
                },
            overlays:[ 
               ["Arrow", {location:.955, width:15, length:10}], 
   
           ]
                
            });
		};

	}
function redrawLinks(data) {

		//temp_data=data;
		//alert("REDRAW");
		for (var i = 0; i < data.length; i++) {
			console.log("redrawring");
			console.log(data[i].source);
			console.log(data[i].target);
			//links[i]=jsPlumb.addEndpoint(cells[data[i].source]);
			//links[i+1]=jsPlumb.addEndpoint(cells[data[i].target]);
			//jsPlumb.connect({ source:links[i], target:links[i+1],endpoint:["rectangle"],connector:["Bezier", { curviness:30 }] });
			jsPlumb.connect({
                source: (cells[data[i].source]),
                target: (cells[data[i].target]),
                connector: ["Bezier",{ curviness:30 }],
                cssClass: "c1",
                endpoint: "Blank",
                endpointClass: "c1Endpoint",
                paintStyle: {
                    lineWidth: 6,
                    strokeStyle: "#a7b04b",
                    outlineWidth: 1,
                    outlineColor: "#666"
                },
                endpointStyle: {
                    fillStyle: "#a7b04b"
                },
                
            });
		};

	}

//create the scrollable effect for a series of episodes

$("#makeMeScrollable").smoothDivScroll({
			mousewheelScrolling: "allDirections",
			manualContinuousScrolling: true,
			autoScrollingMode: "onStart"
});
	

//variables to retrieve the tables that contain the episodes, these will be used to create the overview bar that is displayed in the menu.	
var tableNew;
var cellsNew;
var table2;
var cells2;


function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

jsPlumb.bind("ready", function() {

	var url = 'http://localhost:8080/rest/clematis-api/story/causalLinks';
	var links=new Array;

 	 $.ajax({
		type: 'GET',
		url: url ,
		dataType: "json",
		async: false,
		success: renderListLinks 
	});
	
	function renderListLinks(data) {

		temp_data=data;
		for (var i = 0; i < data.length; i++) {
			//links[i]=jsPlumb.addEndpoint(cells[data[i].source]);
			//links[i+1]=jsPlumb.addEndpoint(cells[data[i].target]);
			//jsPlumb.connect({ source:links[i], target:links[i+1],endpoint:["rectangle"],connector:["Bezier", { curviness:30 }] });
			var color_link=get_random_color();
			jsPlumb.connect({
                source: (divs[data[i].target]), //flipped these so arrows point in right direction
                target: (divs[data[i].source]),
                connector: ["Bezier",{ curviness:30 }],
                cssClass: "c1",
                endpoint: "Blank",
                endpointClass: "c1Endpoint",
                paintStyle: {
                    lineWidth: 1,
                    strokeStyle: color_link,
                    outlineWidth: 1,
                    outlineColor: "#666"
                },
                endpointStyle: {
                    fillStyle: "#a7b04b"
                },
            overlays:[ 
               ["Arrow", {location:.955, width:15, length:10}], 
   
           ]
                
            });
		};

	}

     });

$(document).ready(function(){

	menuContainer.appendChild(scaledDiv);
/*	menuElem_map.appendChild(scaledDiv);
	menuList.appendChild(menuElem_map);
*/

	menuSlider.init('menu','slide');
   	
});

//Create the overview bar on top of the series of episodes
//shade the current episode you are on.
//window.onload=function() {
	
   // tableNew = document.getElementById('newTbl');
   // cellsNew = tableNew.getElementsByTagName('div');


    table2 = document.getElementById('tbl');
    cells2 = table2.getElementsByTagName('div');


for (var i = 0, n = cells2.length; i<n; i++) {
  var el = cells2[i];
  el.addEventListener('mouseover', (function(i, el) { 
    return function() {
      divs_map[i].setAttribute('class','box2');
      //cellsNew[i+1].setAttribute('class','box2');
      //cellsNew[i-1].setAttribute('class','box2');
    }
  })(i, el), false);
}

for (var i = 0, n = cells2.length; i<n; i++) {
  var el = cells2[i];
  el.addEventListener('mouseout', (function(i, el) { 
    return function() {
      divs_map[i].setAttribute('class','box');
      //cellsNew[i+1].setAttribute('class','box');
      //cellsNew[i-1].setAttribute('class','box');
    }
  })(i, el), false);
}



//};	


	
///////////////////////////////////////
// Search on DOM event and its content

function searchByDomEventType(eventType) {
	var matchedEpisodeIDs = [];
	
	for (var i = 0; i < globalEpisodeContainer.length; i ++) {
		if (globalEpisodeContainer[i].source.eventType != null) {
			if (globalEpisodeContainer[i].source.eventType == eventType) {
//				console.log("found");
				matchedEpisodeIDs.push(i);
			}
		}
	}

	return matchedEpisodeIDs;
}

function searchByDomElementKeyword(key) {
	var matchedEpisodeIDs = [];
	
	for (var i = 0; i < globalEpisodeContainer.length; i ++) {
		var eventType = globalEpisodeContainer[i].source.eventType;
		var eventHandler = globalEpisodeContainer[i].source.eventHandler;
		var targetElementAttributes = globalEpisodeContainer[i].source.targetElementAttributes;
		if (eventType != null && eventType.toLowerCase().indexOf(key) != -1) {
			console.log("eventType: ", eventType);
			matchedEpisodeIDs.push(i);
		}
		else if (eventHandler != null && eventHandler.toLowerCase().indexOf(key) != -1) {
			console.log("eventHandler: ", eventHandler);
			matchedEpisodeIDs.push(i);
		}
		else if (targetElementAttributes != null && targetElementAttributes.toLowerCase().indexOf(key) != -1) {
			console.log("targetElementAttributes: ", targetElementAttributes);
			matchedEpisodeIDs.push(i);
		}
	}

	return matchedEpisodeIDs;	
}

// search on all important text values in SOURCE
function searchSourceByKeyword(key) {
	var matchedEpisodeIDs = [];
/*	
	for (var i = 0; i < globalEpisodeContainer.length; i ++) {
		if (type == dom) {
			searchByDomElementKeyword(key);
		}
		else if (type == timeoutcallback) {
			var callbackFunction = globalEpisodeContainer[i].source.callbackFunction; // todo
		}
		else if (type == xhrcallback) {
			var callbackFunction = globalEpisodeContainer[i].source.callbackFunction; // todo
			var response = globalEpisodeContainer[i].source.response; // todo
		}
	}
*/

	for (var i = 0; i < globalEpisodeContainer.length; i ++) {
		var source = globalEpisodeContainer[i].source;
		if (source.eventType != null && source.eventType.toLowerCase().indexOf(key) != -1) {
			console.log("eventType: ", eventType);
			matchedEpisodeIDs.push(i);
		}
		else if (source.eventHandler != null && source.eventHandler.toLowerCase().indexOf(key) != -1) {
			console.log("eventHandler: ", eventHandler);
			matchedEpisodeIDs.push(i);
		}
		else if (source.targetElementAttributes != null && source.targetElementAttributes.toLowerCase().indexOf(key) != -1) {
			console.log("targetElementAttributes: ", targetElementAttributes);
			matchedEpisodeIDs.push(i);
		}
		else if (source.callbackFunction != null && source.callbackFunction.toLowerCase().indexOf(key) != -1) {
			matchedEpisodeIDs.push(i);
		}
		else if (source.response != null && source.response.toLowerCase().indexOf(key) != -1) {
			matchedEpisodeIDs.push(i);
		}
	}

	return matchedEpisodeIDs;	
}

function searchTraceByKeyword(key) {
	var matchedEpisodeIDs = [];
/*
	if (type = functionEnter or functionCall or functionExit or functionReturn) {
		var targetFunction
	}
	else if (type == timeoutSet) {
	}
	else if (type == timeoutCallback) {
	}
	else if (type == xhrOpen) {
	}
	else if (type == xhrSend) {
	}
	else if (type == xhrResponse) {
	}
*/	
	// OR JUST CHECK (FOR ALL FIELS) IF THE FIELD WAS NOT EMPTY OR NULL SEARCH IT

	for (var i = 0; i < globalEpisodeContainer.length; i ++) {
		var trace = globalEpisodeContainer[i].trace.trace;
		for (var j = 0; j < trace.length; j ++) {
			if (trace[j].targetFunction != null && trace[j].targetFunction.toLowerCase().indexOf(key) != -1) { // function stuff
				console.log("found targetFunction ", trace[j].targetFunction);
				matchedEpisodeIDs.push(i);
			}
			else if (trace[j].callbackFunction != null && trace[j].callbackFunction.toLowerCase().indexOf(key) != -1) { // to callback and xhr response
				console.log("found callbackFunction ", trace[j].callbackFunction);
				matchedEpisodeIDs.push(i);
			}
			else if (trace[j].methodType != null && trace[j].methodType.toLowerCase().indexOf(key) != -1) { // xhr open
				console.log("found methodType ", trace[j].methodType);
				matchedEpisodeIDs.push(i);
			}
			else if (trace[j].url != null && trace[j].url.toLowerCase().indexOf(key) != -1) { // xhr open
				console.log("found url ", trace[j].url);
				matchedEpisodeIDs.push(i);
			}
			else if (trace[j].message != null && trace[j].message.toLowerCase().indexOf(key) != -1) { // xhr send
				console.log("found message ", trace[j].message);
				matchedEpisodeIDs.push(i);
			}
			else if (trace[j].response != null && trace[j].response.toLowerCase().indexOf(key) != -1) { // xhr response
				console.log("found response ", trace[j].response);
				matchedEpisodeIDs.push(i);
			}
		}
	}

	return matchedEpisodeIDs;
}