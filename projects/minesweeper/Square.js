function Square(){
  this.x = 0;
  this.y = 0;
  this.count = 0;
  this.flagged = 0;
  this.code = "";
  this.discovered = 0;
  this.locked = 0;
}

function Square(xPoint, yPoint){
  this.x = xPoint;
  this.y = yPoint;
  this.count = 0;
  this.flagged = 0;
  this.code = "";
  this.discovered = 0;
  this.locked = 0;
}