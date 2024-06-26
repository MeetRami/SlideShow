// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto(direction = true) {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string

	if(direction){
		mCurrentIndex++;
		if(mCurrentIndex === mImages.length){
			mCurrentIndex = 0;
		}
	}else{
		mCurrentIndex--;
		if(mCurrentIndex === -1){
			mCurrentIndex = mImages.length - 1;
		}
	}
	

	$('.photoHolder img').attr('src', mImages[mCurrentIndex].img);
	
	$('p.location').text(
	'Location: ' + mImages[mCurrentIndex].location    );
	$('p.description').text(
	'Description: ' + mImages[mCurrentIndex].description );
	$('p.date').text(
	'Date: ' + mImages[mCurrentIndex].date            );

	console.log('swap photo');
	console.log(mCurrentIndex);
}



// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
 	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

	$('.moreIndicator').click(function(){
		$(this).toggleClass('rot90');
		$('.details').eq(0).slideToggle('slow');
	});

	$('#nextPhoto').click(function(){
		swapPhoto();
	});

	$('#prevPhoto').click(function(){
		swapPhoto(false);
	});
	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function getJSONFile(){	
	var query = window.location.search.substring(1);
	var passed = query.split("&");
	for (var i=0;i<passed.length;i++) {
			var pair = passed[i].split("=");
			if(pair[0] == 'json'){return pair[1];}
	}
	return(false);
}

function GalleryImage(loc, des, dat, src) {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	//2. description of photo
	//3. the date when the photo was taken
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)

	this.location    = loc;
	this.description = des;
	this.date        = dat;
	this.img         = src;
}

mRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        mJson = JSON.parse(this.responseText);
        mJson.images.forEach(function(element) {
			mImages.push(new GalleryImage(
							element.imgLocation,
							element.description,
							element.date,
							element.imgPath));
		}, this);

		initShow();
    }
};

function initShow(){
	$('.photoHolder img').attr('src', mImages[mCurrentIndex].img);
	$('p.location').text(
		'Location: ' + mImages[mCurrentIndex].location
		);
	$('p.description').text(
	'Description: ' + mImages[mCurrentIndex].description
	);
	$('p.date').text(
	'Date: ' + mImages[mCurrentIndex].date
	);
}

var jsonFile = getJSONFile();

if(jsonFile != false){
	mUrl = jsonFile;
}

mRequest.open('GET', mUrl);
mRequest.send();
