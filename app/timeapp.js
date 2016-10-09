(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.renderTimeLoop();
};
App.fn = App.prototype;

App.fn.renderTimeLoop = function(){
  this.interval = setInterval(this.renderTime.bind(this), 80);
};

App.fn.renderTime = function(){
    var today = new Date();
	var hours = (24-today.getHours()).toString();
	if(hours.length<2)
		hours="0"+hours;
	var minutes=(60-today.getMinutes()).toString();
	if(minutes.length<2)
		minutes="0"+minutes;
	var seconds=(60-today.getSeconds()).toString();
	if(seconds.length<2)
		seconds="0"+seconds;
	var milli=(1000-today.getMilliseconds()).toString();
	if(milli.length==1)
		milli="00"+milli;
	else if(milli.length==2)
		milli="0"+milli;
	
  requestAnimationFrame(function(){
    this.html(this.view('time')({
      hour:         hours,
	  minute:	minutes,
	  second:	seconds,
	  milliseconds: milli
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('timeapp'))

})();
