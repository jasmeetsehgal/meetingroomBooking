// JavaScript Document
function supportsLocalStorage() {
     try {
         return 'localStorage' in window && window['localStorage'] !== null;
     } 
     catch (e) {
          return false;
      }
    }
var MRBS_object = {
	storage_pref:"RoomBookingSettings_",
	locations:{},
	rooms:{},
	saveSetting:function(name,ext){
		 if (!supportsLocalStorage()) { return false; }
		 if(name == "" && ext =="")
		 {
			 return ({name:localStorage[MRBS_object.storage_pref+"name"],ext:localStorage[MRBS_object.storage_pref+"ext"]});
		 }else{
         localStorage[MRBS_object.storage_pref+"name"] = name;
		 localStorage[MRBS_object.storage_pref+"ext"] = ext;
		 }
	},
	roomListing:function(id){
		MRBS_object.setRoomID(id);
		 $.mobile.changePage( "#viewroombookings", { transition: "slideup"} );
	},
	setLocationID:function(id){
	$('#viewroom ul.rooms-list').jqmData('selectedID',id);
	},
	setRoomID:function(id){
	$('#viewroombookings ul.bookings-list').jqmData('selectedID',id);
	}
	,
	populateLoaction:function(){
		$.mobile.showPageLoadingMsg();
		var template ='<li data-theme="f" class="ui-btn ui-btn-icon-right ui-li ui-btn-up-f"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a onclick="MRBS_object.setLocationID(%%ID%%);" href="#viewroom" class="ui-link-inherit">%%Name%%</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';		
		$.getJSON('http://mrbs.stageweb01.alphasalmonstaging.com/Area/GetAll?rand='+Math.random(), function(data) {
 				var len=data.length;
				var finalhtml="";				
				for(var i =0;i<len;i++){
					var tempD = data[i];
					var tempTemp = template;
					tempTemp = tempTemp.replace("%%ID%%",tempD.ID);
					tempTemp = tempTemp.replace("%%Name%%",(tempD.Name));
					finalhtml += tempTemp;
				}				
				$('#viewlocations ul.locations-list').html(finalhtml);
				$.mobile.hidePageLoadingMsg();
  			});		
		},
		populateRooms:function(id){
			$.mobile.showPageLoadingMsg();
		var template ='<li data-theme="f" class="ui-btn ui-btn-icon-right ui-li ui-btn-up-f"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a onclick="MRBS_object.setRoomID(%%ID%%);" href="#viewroombookings" class="ui-link-inherit"><h3 class="ui-li-heading">%%Name%%</h3><span class="ui-li-count ui-btn-up-c ui-btn-corner-all">%%Capacity%%</span><p class="ui-li-desc">%%Description%%</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';		
		$.getJSON('http://mrbs.stageweb01.alphasalmonstaging.com/Room/GetByAreaID/'+id+'?rand='+Math.random(), function(data) {
 				var len=data.length;
				var finalhtml="";				
				for(var i =0;i<len;i++){
					var tempD = data[i];
					var tempTemp = template;
					tempTemp = tempTemp.replace("%%ID%%",tempD.ID);
					tempTemp = tempTemp.replace("%%Capacity%%",tempD.Capacity);
					tempTemp = tempTemp.replace("%%Description%%",tempD.Description);
					tempTemp = tempTemp.replace("%%Name%%",(tempD.Name));
					finalhtml += tempTemp;	
				}				
				$('#viewroom ul.rooms-list').html(finalhtml);
				
				$.mobile.hidePageLoadingMsg();
  			});		
		},
		populateRoomBookings:function(id,date){
			$.mobile.showPageLoadingMsg();
		var template ='<li data-theme="f" class="ui-btn ui-btn-icon-right ui-li ui-btn-up-f"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a rel="%%ID%%" href="#" class="ui-link-inherit"><h3 class="ui-li-heading">%%Name%%</h3><p class="ui-li-aside ui-li-desc">%%Capacity%%</p><p class="ui-li-desc">%%Description%%</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';		
		$.getJSON('http://mrbs.stageweb01.alphasalmonstaging.com/Entry/GetByRoomIdDayTime/?id='+id+'&date='+date+'&rand='+Math.random(), function(data) {
 				var len=data.length;
				var finalhtml="";				
				for(var i =0;i<len;i++){
					var tempD = data[i];
					var tempTemp = template;
					tempTemp = tempTemp.replace("%%ID%%",tempD.ID);
					tempTemp = tempTemp.replace("%%Capacity%%" , (Date.parse(tempD.StartTime).toString("HH:mm") +" to "+ Date.parse(tempD.EndTime).toString("HH:mm")));
					tempTemp = tempTemp.replace("%%Description%%",tempD.Description);
					tempTemp = tempTemp.replace("%%Name%%",(tempD.Name));
					
					finalhtml += tempTemp;	
				}				
				$('#viewroombookings ul.bookings-list').html(finalhtml);					
				$.mobile.hidePageLoadingMsg();
  			});		
		},
		bookRoom:function(){
			$.mobile.showPageLoadingMsg();
			$.ajax("http://mrbs.stageweb01.alphasalmonstaging.com/Entry/AddEntry", {
				type:"post",
				data:$("form#BookRoomForm").serialize(),
				success: function (data) {
				   alert(data.EntryId+" 00 "+data.IsSuccess);				  
				   $.mobile.changePage( "#home", { transition: "slideup"} );
				   $.mobile.hidePageLoadingMsg();
				  },
				   error:function (xhr, ajaxOptions, thrownError){
					    alert("error :: "+thrownError);	
						$.mobile.hidePageLoadingMsg();
				   }
			});	
		//http://mrbs.stageweb01.alphasalmonstaging.com/Entry/AddEntry	
		}
	};
$('#viewlocations').live('pagebeforecreate',function(event){	
 
});

$('#viewlocations').live('pagecreate',function(event){
	MRBS_object.populateLoaction();	
	console.log("viewlocations");
});
$('#viewroom').live('pagebeforecreate',function(event){	
 
});

$('#viewroom').live('pageshow',function(event){
	var selectedID =$('#viewroom ul.rooms-list').jqmData('selectedID');
	console.log(" viewroom " + selectedID);
	if(selectedID == "" || selectedID == undefined){
		alert("No Loaction found, Please select Location first");
	}else{
		MRBS_object.populateRooms(selectedID);	
	}
	
});	
$('#bookroom').live('pagebeforecreate',function(event){	
 
});

$('#bookroom').live('pageshow',function(event){
	var selectedID =$('#viewroombookings ul.bookings-list').jqmData('selectedID');	
	console.log(" bookroom " + selectedID);
	if(selectedID == "" || selectedID == undefined){
		alert("No Room ID found, Please select Room first");
	}else{		
		$('#bookroom #roomID').val(selectedID);	
	}
	var settings = MRBS_object.saveSetting("","");
	if(settings != null){
		$('#bookroom #userName').val(settings.name);
	}else{
		alert("No Name set in the settings");
	}
	
	$('#bookroom .btnSubmit').click(function(){
			MRBS_object.bookRoom();		
		});
	
});	
$('#viewroombookings').live('pagebeforecreate',function(event){	
 $('#viewroombookings .date a.prev, #viewroombookings .date a.next').click(function(e){
	 	var selectedID =$('#viewroombookings ul.bookings-list').jqmData('selectedID');
		var dateStrObj =$('#viewroombookings .date .dateStr'); 
		var dateDiff=0;
		if($(this).hasClass('next')){
			 dateDiff = parseInt(dateStrObj.jqmData('dateDiff')) + 1;
		}else{
			 dateDiff = parseInt(dateStrObj.jqmData('dateDiff')) - 1;
		}		
		var date="";
			if(dateDiff < 0){
				date = (getNextDate(0,dateDiff*-1));
			}else if(dateDiff > 0){
				date = (getNextDate(dateDiff,0));
			}else if(dateDiff == 0){
				date = (getNextDate(0,0));	
			}
			dateStrObj.jqmData('dateDiff',dateDiff);
			dateStrObj.html(date.prnt);
			MRBS_object.populateRoomBookings(selectedID,date.param);
		})
});

$('#viewroombookings').live('pageshow',function(event){
	var selectedID =$('#viewroombookings ul.bookings-list').jqmData('selectedID');
	console.log(" viewroombookings " + selectedID);
	if(selectedID == "" || selectedID == undefined){
		alert("No Room found, Please select Room first");
	}else{
		$('#viewroombookings .date .dateStr').html(getNextDate(0,0).prnt);		
		MRBS_object.populateRoomBookings(selectedID,getNextDate(0,0).param);	
	}
	//default date diff var 
	var dateStrObj =$('#viewroombookings .date .dateStr'); 
	dateStrObj.jqmData('dateDiff',0);
	
	//$('#viewlocations ul.locations-list').jqmData('selectedID',id);
	//MRBS_object.populateLoaction();	
});	


$('#settings').live('pagebeforecreate',function(event){	
 
});

$('#settings').live('pageshow',function(event){
	var settings = MRBS_object.saveSetting("","");
	if(settings != null){
		$('#settings #sname').val(settings.name);
		$('#settings #sext').val(settings.ext);
	}
	$('#settings a.btn_saveSettings').click(function(){
		 MRBS_object.saveSetting($('#settings #sname').val(),$('#settings #sext').val())
		});
});
$('#home').live('pagecreate',function(event){
 // alert('This page was just enhanced by jQuery Mobile!');
	
});
function deviceReadyHandler(){
	$("#selection img").eq(0).show();
		document.ontouchmove = function(e){
		//e.preventDefault();
		};	
	var dragobj= new zxcDragEllipse(document.getElementById('dragThumbObj'),[111,111]);
}


$(document).ready(function(){	
	// document.addEventListener("deviceready", deviceReadyHandler, true);	
	 deviceReadyHandler();
});




function getNextDate(next,prev)
{
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
 var currentDate = new Date();
 var currentMonth = currentDate.getMonth();
 var currentDay = currentDate.getDate();
 var currentYear = currentDate.getFullYear();
 var nextDate= new Date(currentYear, currentMonth, (currentDay +next-prev));
 var nextPrevDateStr = twodigitNumber(nextDate.getDate()) + '/' + twodigitNumber((nextDate.getMonth() + 1))  + '/' + nextDate.getFullYear();
 var prnt =weekday[nextDate.getDay()] +" :: "+ nextPrevDateStr; 
 return ({prnt:prnt,param:nextPrevDateStr});
}

function twodigitNumber(num){
	if(num < 10){
	return ("0"+num);	
	}else{
		return (num);	
	}
}



function displayImg(val)
{
	/*var visi = $("#selection img:visible").next();
	if(visi.length == 0){
		visi =$("#selection img").eq(val);
	}*/
	$("#selection img").hide();
	visi =$("#selection img").eq(val);
	visi.show();
}

function zxcDragEllipse(obj,ellipse){
	this.dobj=obj;
	this.ellipse=ellipse;
	this.df=false;
    
	this.addevt(obj,'mousedown','down');
	
/*this.addevt(document,'mousemove','move');
this.addevt(document,'mouseup','up');*/
 	var xuObj = {xx:228,yy:93};
 	this.circum(xuObj) ;
}

zxcDragEllipse.prototype={

 down:function(ev){
  if (!this.drag){
   document.onselectstart=function(event){ window.event.returnValue=false; };
   this.lastX=ev.clientX;
   this.lastY=ev.clientY;
   this.dobj.style.zIndex=zxcLTZ(this.dobj,'z-Index')+10+'';
   this.pos=[zxcLTZ(this.dobj,'left'),zxcLTZ(this.dobj,'top')];
   this.drag=true;
  }
  if (ev.target) ev.preventDefault();
  return false;
 },

 move:function(ev){
	
  if (this.drag){
   var mx=ev.clientX,my=ev.clientY,x=this.pos[0]+(mx-this.lastX),y=this.pos[1]+(my-this.lastY);
   this.pos=[x,y];
   this.lastX=mx;
   this.lastY=my;
   this.circum();
  }
  if (ev.target) ev.preventDefault();
  return false;
 },

 circum:function(ev){
 //console.log("Mouse move " + this.drag);
 // var srtx=this.ellipse[0],srty=this.ellipse[1],x=this.pos[0],y=this.pos[1];
	if(ev != undefined){
		var srtx=this.ellipse[0],srty=this.ellipse[1],x=ev.xx,y=ev.yy;
	}else{
		var srtx=this.ellipse[0],srty=this.ellipse[1],x=this.pos[0],y=this.pos[1];
		//console.log('x:'+x);
	}
  // var srtx=this.ellipse[0],srty=this.ellipse[1],x=527,y=310;
  var w=Math.abs(Math.abs(x)-Math.abs(srtx)),h=Math.abs(Math.abs(y)-Math.abs(srty)),hyp=Math.sqrt(w*w+h*h);
  var deg=1,seg=(x>=srtx&&y>=srty)?1:(x<=srtx&&y<=srty)?2:(x<=srtx&&y>=srty)?3:4,rad=Math.PI/180;

  if (seg==1||seg==2){
   deg=Math.acos((w*w+hyp*hyp-h*h)/(2*w*hyp))*180/Math.PI;
   deg+=seg==1?0:180;
  }
  else if (seg==3||seg==4){
   deg=Math.acos((h*h+hyp*hyp-w*w)/(2*h*hyp))*180/Math.PI;
   deg+=(seg==3)?90:270;
  }
 // $("#logg").html(seg +":::" + deg+":::" + Math.floor(deg/60));
    
  x=Math.floor(srtx*Math.cos(deg*rad)+srtx);
  y=Math.floor(srty*Math.sin(deg*rad)+srty);
  if (isFinite(x)&&isFinite(y)){
   this.dobj.style.left=x-zxcLTZ(this.dobj,'width')/2+'px';
   this.dobj.style.top=y-zxcLTZ(this.dobj,'height')/2+'px';
 	// this.dobj.style.webkitTransform ="rotate(60deg)";
  //this.dobj.setAttribute('-webkit-transform', 'rotate('+deg+'deg)');
  }
  displayImg( Math.floor(deg/60));
 },

 up:function(ev){
 // console.log("Mouse up " + this.drag);
  if (this.drag){	 
   this.drag=false;
   this.dobj.style.zIndex=zxcLTZ(this.dobj,'z-Index')-10+'';
   document.onselectstart=null;
  
  }else{
	
  }
 },

 addevt:function(o,t,f){
  var oop=this;
   $('#home #tst').live('vmousedown',function(event){ 
  		// console.log(oop.down(event))
		 oop.down(event);
		 return false;
		});
		$("#home .circal_wrapper").live('vmousemove',function(event){
		  oop.move(event);
		  //console.log(event)
		  return false;
		});
		$('#home .circal_wrapper,#home ').live('vmouseup',function(event){
		  oop.up(event);
		  //console.log(event)
		  return false;
		});
		/*$("#home .circal_wrapper").live('tap',function(event){		  
		   var xuObj = {xx:event.clientX,yy:event.clientY};
		   console.log(xuObj);
		  // $("#logg").html("xx::"+event.layerX+"::"+"yy::"+event.layerY+"<br>"+"xx::"+event.clientX+"::"+"yy::"+event.clientY);
		   //console.log("Mouse tap " + this.drag);
		   if (this.drag == undefined){
			  	oop.circum(xuObj) ;		 
		   }		   
		   return false;
		});*/
return;
  if (o.addEventListener) o.addEventListener(t,function(e){ return oop[f](e);}, false);
  else if (o.attachEvent) o.attachEvent('on'+t,function(e){ return oop[f](e); });
 
 }

}

function zxcLTZ(obj,p){
 if (obj.currentStyle) return parseInt(obj.currentStyle[p.replace(/-/g,'')],10);
 return parseInt(document.defaultView.getComputedStyle(obj,null).getPropertyValue(p.toLowerCase()),10);
}


