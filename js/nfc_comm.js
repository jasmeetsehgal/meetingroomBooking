/*global Ndef */
var tagMimeType = "text/AL555RM";

function template(record) {
    var recordType = Ndef.bytesToString(record.type),
    payload;

    if (recordType === "T") {
        var langCodeLength = record.payload[0],
        text = record.payload.slice((1 + langCodeLength), record.payload.length);

        payload = Ndef.bytesToString(text);

    } else if (recordType === "U") {
        var url = Ndef.bytesToString(record.payload);
        payload = "<a href='" + url + "'>" + url + "<\/a>";

    } else {
        payload = Ndef.bytesToString(record.payload);

    }
	//alert(recordType +"--"+ payload);
	MRBS_object.roomListing(payload);
    return ("record type: <b>" + recordType + "<\/b>" +
    "<br/>" + payload
    );
}

function showProperty(parent, name, value) {
    var dt, dd;
    dt = document.createElement("dt");
    dt.innerHTML = name;
    dd = document.createElement("dd");
    dd.innerHTML = value;
    parent.appendChild(dt);
    parent.appendChild(dd);
}




function myNfcListener(nfcEvent) {
   

    var tag = nfcEvent.tag;    
    var records = tag.ndefMessage || [],
    display = document.getElementById("logg");
    //alert("Scanned a NDEF tag with " + records.length + " record" + ((records.length === 1) ? "": "s"));   
   
    showProperty(meta, "Type", tag.type);
    showProperty(meta, "Max Size", tag.maxSize + " bytes");
    showProperty(meta, "Is Writable", tag.isWritable);
    showProperty(meta, "Can Make Read Only", tag.canMakeReadOnly);

    for (var i = 0; i < records.length; i++) {
        var record = records[i],
        p = document.createElement('p');
        p.innerHTML = template(record);
        display.appendChild(p);
    }
    navigator.notification.vibrate(100);
}

var ready = function() {

    function win() {
        console.log("Listening for tags with mime type " + tagMimeType);
    }

    function fail(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }

    navigator.nfc.addMimeTypeListener(tagMimeType, myNfcListener, win, fail);
    
    navigator.nfc.addNdefListener(
        function() {
            alert("This is an NDEF tag but doesn't match the mime type " + tagMimeType + ".");
        },
        myNfcListener,
        function() {
            console.log("Listening for NDEF tags.");
        },
        fail
    );
    
    navigator.nfc.addNdefFormatableListener(
        function() {
            navigator.notification.vibrate(100);
            alert("This tag is can be NDEF formatted.    ");
        },
        function() {
            console.log("Listening for tags that can be NDEF formatted.");
        },
        fail
    );

    
};

//document.addEventListener("menubutton", showInstructions, false);

document.addEventListener('deviceready', ready, false);