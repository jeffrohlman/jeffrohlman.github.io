var sSize;
var gSize;
var header;
var init;
var numBombs;
var rx;
var ry;
var grid = [];
var flagI;
var bombI;
var timerStart;
var timerEnd;
var gameComplete;

function preload(){
  flagI = loadImage("minesweeper/flag.png");
  bombI = loadImage("minesweeper/bomb.png");
}

function setup() {
  //Variables
  sSize = 20;
  gSize = 9;
  header = 60;
  numBombs = 10;
  init = 0;
  rx = 0;
  ry = 0;
  gameComplete = false;
  timerStart = millis();
  timerEnd = 0;
  for (var i = 0; i < gSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gSize; j++) {
      grid[i][j] = new Square(i * sSize, j * sSize);
    }
  }
  
  
  createCanvas(gSize * sSize + 1, header + gSize * sSize + 1);
  background(0);
  for(i = 0; i < gSize; i++){
    for(j = 0; j < gSize; j++){
      fill(0);
      rect(sSize * i, header + sSize * j, sSize, sSize);
    }
  }
  rect(0, 0, gSize * sSize, header);
}

function draw() {
  //if(mouseX >= 0 && mouseX <= gSize * sSize && mouseY >= 0 && mouseY <= gSize * sSize)
    cursor(HAND);
  //else
    //cursor(ARROW);
  for(var i = 0; i < gSize; i++){
      for(var j = 0; j < gSize; j++){
        if(grid[i][j].discovered === 1){
          if(grid[i][j].count != -1){
            if(grid[i][j].locked === 1)
              fill(208);
            else
              fill(188)
            rect(grid[i][j].x, header + grid[i][j].y, sSize, sSize);
            if(grid[i][j].count === 1) fill(40, 100, 255);
            else if(grid[i][j].count === 2) fill(0, 170, 50);
            else if(grid[i][j].count === 3) fill(255, 0, 0);
            else if(grid[i][j].count === 4) fill(0, 0, 140);
            else if(grid[i][j].count === 5) fill(135, 0, 60);
            else if(grid[i][j].count === 6) fill(0, 180, 240);
            else if(grid[i][j].count === 7) fill(140, 0, 190);
            else if(grid[i][j].count === 8) fill(255, 200, 50);
            else fill(0);
            textAlign(CENTER, CENTER);
            textSize(floor(sSize - (sSize * 0.10)));
            text(grid[i][j].code, grid[i][j].x, header + grid[i][j].y, sSize, sSize);
          }
          else
            image(bombI, grid[i][j].x + 1, header + grid[i][j].y + 1, sSize-1, sSize-1);
        }
        else{
          fill(168);
          rect(grid[i][j].x, header + grid[i][j].y, sSize, sSize);
          if(grid[i][j].flagged === 1){
            image(flagI, grid[i][j].x + 1, header + grid[i][j].y + 1, sSize-1, sSize-1);
          }
        }
      }
  }
  fill(150);
  rect(0, 0, gSize * sSize, header);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(25);
  text(bombsLeft(), 10, 7, 50, 25);
  if(gameComplete)
    text(floor((timerEnd - timerStart)/1000), gSize * sSize - 60, 7, 50, 25);
  else
    text(floor((millis() - timerStart)/1000), gSize * sSize - 60, 7, 50, 25);
}

function mousePressed(){
  if(mouseX >= 0 && mouseX <= gSize * sSize && mouseY >= header && mouseY <= header + gSize * sSize){
    var xStart = floor(mouseX/sSize);
    var yStart = floor((mouseY - header) /sSize);
    if(mouseButton == LEFT){
      if(init === 0){
        initBombs(xStart, yStart);
        initGrid();
        grid[xStart][yStart].discovered = 1;
        clearEmpty(xStart, yStart);
        init++;
      }
      else if(grid[xStart][yStart].discovered === 1)
        clearNumber(xStart, yStart);
      else if(grid[xStart][yStart].flagged === 1);
      else{
        grid[xStart][yStart].discovered = 1;
        endgame(xStart, yStart);
        if(grid[xStart][yStart].count === 0)
          clearEmpty(xStart, yStart);
      }
    }
    
    else if(mouseButton == RIGHT){
      if(grid[xStart][yStart].flagged === 1  && grid[xStart][yStart].locked === 0)
        grid[xStart][yStart].flagged = 0;
      else
        grid[xStart][yStart].flagged = 1;
    }
    
    checkWin();
  }
}

function initBombs(x, y){
  for(var i = 0; i < numBombs; i++){
    rx = floor(random(gSize));
    ry = floor(random(gSize));
    if((abs(rx-x) <= 1 && abs(ry - y) <= 1) || grid[rx][ry].count < 0)
      i--;
    else{
      grid[rx][ry].count = -1;
      grid[rx][ry].code = "B";
    }
  }
}

function initGrid(){
  for(var i = 0; i < gSize; i++){
    for(var j = 0; j < gSize; j++){
      if(grid[i][j].count >= 0){
        grid[i][j].count = 0;
        if(i > 0 && grid[i - 1][j].count < 0)
          grid[i][j].count++;
        if(i < gSize - 1 && grid[i + 1][j].count < 0)
          grid[i][j].count++;
        if(j > 0 && grid[i][j - 1].count < 0)
          grid[i][j].count++;
        if(j < gSize - 1 && grid[i][j + 1].count < 0)
          grid[i][j].count++;
        if(i > 0 && j > 0 && grid[i - 1][j - 1].count < 0)
          grid[i][j].count++;
        if(i > 0 && j < gSize - 1 && grid[i - 1][j + 1].count < 0)
          grid[i][j].count++;
        if(i < gSize - 1 && j > 0 && grid[i + 1][j - 1].count < 0)
          grid[i][j].count++;
        if(i < gSize - 1 && j < gSize - 1 && grid[i + 1][j + 1].count < 0)
          grid[i][j].count++;
        if(grid[i][j].count === 1)
          grid[i][j].code = "1";
        if(grid[i][j].count === 2)
          grid[i][j].code = "2";
        if(grid[i][j].count === 3)
          grid[i][j].code = "3";
        if(grid[i][j].count === 4)
          grid[i][j].code = "4";
        if(grid[i][j].count === 5)
          grid[i][j].code = "5";
        if(grid[i][j].count === 6)
          grid[i][j].code = "6";
        if(grid[i][j].count === 7)
          grid[i][j].code = "7";
        if(grid[i][j].count === 8)
          grid[i][j].code = "8";
      }
    }
  }
}

function clearNumber(x, y){
  var surCount = 0;
  if(x > 0 && grid[x - 1][y].flagged === 1)
      surCount++;
  if(x < gSize - 1 && grid[x + 1][y].flagged === 1)
      surCount++;
  if(y > 0 && grid[x][y - 1].flagged === 1)
      surCount++;
  if(y < gSize - 1 && grid[x][y + 1].flagged === 1)
      surCount++;
  if(x > 0 && y > 0 && grid[x - 1][y - 1].flagged === 1)
      surCount++;
  if(x > 0 && y < gSize - 1 && grid[x - 1][y + 1].flagged === 1)
      surCount++;
  if(x < gSize - 1 && y > 0 && grid[x + 1][y - 1].flagged === 1)
      surCount++;
  if(x < gSize - 1 && y < gSize - 1 && grid[x + 1][y + 1].flagged === 1)
      surCount++;
  
  if(surCount === grid[x][y].count){
    if(x > 0 && grid[x - 1][y].flagged === 0){
      grid[x - 1][y].discovered = 1;
      endgame(x - 1, y);
      if(grid[x - 1][y].count === 0)
        clearEmpty(x - 1, y);
    }
    if(x < gSize - 1 && grid[x + 1][y].flagged === 0){
        grid[x + 1][y].discovered = 1;
        endgame(x + 1, y);
        if(grid[x + 1][y].count === 0)
          clearEmpty(x + 1, y);
    }
    if(y > 0 && grid[x][y - 1].flagged === 0){
        grid[x][y - 1].discovered = 1;
        endgame(x, y - 1);
        if(grid[x][y - 1].count === 0)
          clearEmpty(x, y - 1);
    }
    if(y < gSize - 1 && grid[x][y + 1].flagged === 0){
        grid[x][y + 1].discovered = 1;
        endgame(x, y + 1);
        if(grid[x][y + 1].count === 0)
          clearEmpty(x, y + 1);
    }
    if(x > 0 && y > 0 && grid[x - 1][y - 1].flagged === 0){
        grid[x - 1][y - 1].discovered = 1;
        endgame(x - 1, y - 1);
        if(grid[x - 1][y - 1].count === 0)
          clearEmpty(x - 1, y - 1);
    }
    if(x > 0 && y < gSize - 1 && grid[x - 1][y + 1].flagged === 0){
        grid[x - 1][y + 1].discovered = 1;
        endgame(x - 1, y + 1);
        if(grid[x - 1][y + 1].count === 0)
          clearEmpty(x - 1, y + 1);
    }
    if(x < gSize - 1 && y > 0 && grid[x + 1][y - 1].flagged === 0){
        grid[x + 1][y - 1].discovered = 1;
        endgame(x + 1, y - 1);
        if(grid[x + 1][y - 1].count === 0)
          clearEmpty(x + 1, y - 1);
    }
    if(x < gSize - 1 && y < gSize - 1 && grid[x + 1][y + 1].flagged === 0){
        grid[x + 1][y + 1].discovered = 1;
        endgame(x + 1, y + 1);
        if(grid[x + 1][y + 1].count === 0)
          clearEmpty(x + 1, y + 1);
    }
  }
    
}

function clearEmpty(x, y){
  if(x > 0 && grid[x - 1][y].discovered === 0){
      grid[x - 1][y].discovered = 1;
      if(grid[x - 1][y].count === 0)
        clearEmpty(x - 1, y);
  }
  if(x < gSize - 1 && grid[x + 1][y].discovered === 0){
      grid[x + 1][y].discovered = 1;
      if(grid[x + 1][y].count === 0)
        clearEmpty(x + 1, y);
  }
  if(y > 0 && grid[x][y - 1].discovered === 0){
      grid[x][y - 1].discovered = 1;
      if(grid[x][y - 1].count === 0)
        clearEmpty(x, y - 1);
  }
  if(y < gSize - 1 && grid[x][y + 1].discovered === 0){
      grid[x][y + 1].discovered = 1;
      if(grid[x][y + 1].count === 0)
        clearEmpty(x, y + 1);
  }
  if(x > 0 && y > 0 && grid[x - 1][y - 1].discovered === 0){
      grid[x - 1][y - 1].discovered = 1;
      if(grid[x - 1][y - 1].count === 0)
        clearEmpty(x - 1, y - 1);
  }
  if(x > 0 && y < gSize - 1 && grid[x - 1][y + 1].discovered === 0){
      grid[x - 1][y + 1].discovered = 1;
      if(grid[x - 1][y + 1].count === 0)
        clearEmpty(x - 1, y + 1);
  }
  if(x < gSize - 1 && y > 0 && grid[x + 1][y - 1].discovered === 0){
      grid[x + 1][y - 1].discovered = 1;
      if(grid[x + 1][y - 1].count === 0)
        clearEmpty(x + 1, y - 1);
  }
  if(x < gSize - 1 && y < gSize - 1 && grid[x + 1][y + 1].discovered === 0){
      grid[x + 1][y + 1].discovered = 1;
      if(grid[x + 1][y + 1].count === 0)
        clearEmpty(x + 1, y + 1);
  }
}

function bombsLeft(){
  var left = 0;
  for(var i = 0;i < gSize; i++){
    for(var j = 0; j < gSize; j++){
      if(grid[i][j].count === -1 && grid[i][j].flagged === 0)
        left++;
    }
  }
  return left;
}

function checkWin(){
  var cw = true;
  for(var i = 0; i < gSize; i++){
    for(var j = 0; j < gSize; j++){
      if(grid[i][j].count >= 0 && grid[i][j].discovered === 0)
        cw = false;
      if(grid[i][j].count === -1 && grid[i][j].flagged === 0)
        cw = false;
    }
  }
  if(cw == true){
    print("You win!");
    for(var i = 0; i < gSize; i++){
      for(var j = 0; j < gSize; j++){
        grid[i][j].locked = 1;
        gameComplete = true;
        timerEnd = millis();
      }
    }
  }
}

function endgame(x, y){
  if(grid[x][y].count === -1){
    print("You lost");
    for(var i = 0; i < gSize; i++){
      for(var j = 0; j < gSize; j++){
        grid[i][j].discovered = 1;
        grid[i][j].locked = 1;
        gameComplete = true;
        timerEnd = millis();
      }
    }
  }
}