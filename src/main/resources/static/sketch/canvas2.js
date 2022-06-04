let sTitle;

var t = function(s) {

  s.setup = function() {
    var sCanvas = s.createCanvas(400, 400);
    sTitle = s.createElement('h3', "Generation 0, Fitness - 0.00%");
    sTitle.parent('bestImg');
    sCanvas.parent('canvas2');
    $('#defaultCanvas1').hide();
  };
};

var myp5 = new p5(t, 'canvas2');
