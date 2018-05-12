var MENU_STATE_00 = 0;
var MENU_STATE_01 = 1;
var MENU_STATE_02 = 2;

var PLAY_STATE = 3;
var GAMEOVER_STATE = 4;
var WIN_STATE = 5;
var the_scenes = new Array(2);

var BABBY_COUNT = 1;

var the_gameState = MENU_STATE_00;
var the_babbySpiders = new Array(BABBY_COUNT);
var the_spider = null;
var the_font;
var the_ground;
var the_grass;
var the_pink;
var the_keyboardImage;
var the_babbyImage;
var the_body0Image;
var the_body1Image;
var the_headImage;
var the_leg0Image;
var the_leg1Image;
var the_leg2Image;
var the_mandibleImage;

var the_transitionTimer = 2;
var the_screen_offset = 0;
var the_screenShakeTimer = 0;
var the_doOnce = true;
var the_canvas = null;
var the_fullscreenIcon;

var the_scale = 2;

function DPI(size)
{
  return size * the_scale;
}

var width = DPI(800);
var height = DPI(600);

//Create the renderer
/*var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();
//Tell the `renderer` to `render` the `stage`
renderer.render(stage);*/


function scaleToWindow()
{ 
  var aspectCorrectScale = window.innerWidth / width;
  var heightScale = window.innerHeight / height;
  if (heightScale < aspectCorrectScale)
    aspectCorrectScale = heightScale;
  //renderer.resize(800.0 * aspectCorrectScale, 600.0 * aspectCorrectScale);
  the_canvas.style.width = width * aspectCorrectScale + "px";
  the_canvas.style.height = height * aspectCorrectScale + "px";
  //document.getElementById("defaultCanvas0").style.marginLeft = "auto";
  //document.getElementById("defaultCanvas0").style.marginRight = "auto";
}

window.onresize = function() 
{ 
  scaleToWindow();
}

var app = new PIXI.Application(width, height, {backgroundColor : 0xFFFFFF});
the_canvas = app.view;
document.body.appendChild(app.view);

// create a new Sprite from an image path
//var bunny = PIXI.Sprite.fromImage('babby.png')

// center the sprite's anchor point
//bunny.anchor.set(0.5);

// move the sprite to the center of the screen
//bunny.x = app.renderer.width / 2;
//bunny.y = app.renderer.height / 2;

//app.stage.addChild(bunny);

setup();

function gameStart()
{
  the_transitionTimer = 2;
  the_gameState = PLAY_STATE;
  //stroke(255, 100);
  //the_spider = new Spider();
}

function mouseReleased()
{
 console.log("ok");
  if (the_gameState < PLAY_STATE)
  {
    the_scenes[the_gameState].visible = false;
    the_scenes[++the_gameState].visible = true;
    console.log(the_gameState);
  } 
  else if (the_gameState > PLAY_STATE && the_transitionTimer <= 0)
  {
    the_gameState = PLAY_STATE;
    the_doOnce = true;
  }
  
  /*if (the_fullscreenIcon)
  {
    the_fullscreenIcon.setFullscreen();
  }*/
}

function random(min, max) 
{
  return Math.random() * (max - min) + min;
}

function int(f)
{
  return Math.floor(f);
}

function drawGradient(left, right, top, bottom, alpha)
{
  var graphics = new PIXI.Graphics();
  
  var lineWidth = 4;
  var r;
  var g;
  var b;
    // set a fill and line style
  graphics.beginFill(0xFFFFFF);
  for (var i = top; i <= bottom; i += lineWidth)
  {
    var percent = i / height;
    percent *= 75.0;
    r = 245 + int(percent);
    if (r > 255)
      r = 255;
    g = 143 + int(percent);
    b = 143 + int(percent);
    
    graphics.lineStyle(lineWidth, PIXI.utils.rgb2hex([r / 255,g /255,b / 255]), alpha);
    graphics.moveTo(left,i);
    graphics.lineTo(right,i);
  }
  graphics.endFill();
  app.stage.addChild(graphics);

}
  
function setup() 
{
  MENU_STATE_00 = 0;
  MENU_STATE_01 = 1;
  MENU_STATE_02 = 2;
  PLAY_STATE = 3;
  GAMEOVER_STATE = 4;
  WIN_STATE = 5;
  BABBY_COUNT = 1;
  the_gameState = MENU_STATE_00;  
  the_babbySpiders = new Array(BABBY_COUNT);
  the_screenShakeTimer = 0;
  the_transitionTimer = 2;
  the_doOnce = true;
  scaleToWindow();
  
  //app.renderer.plugins.interaction.on('pointerup', mouseReleased);
  //app.stage.on('pointerup', mouseReleased);
  //app.stage.interactive = true;
  //app.stage.hitArea = new PIXI.Rectangle(0,0,1000,1000);
  
  //the_fullscreenIcon = new FullscreenIcon(width - 20, height - 20, 12);
  
  //frameRate(30);
  the_ground = height-35;
  //the_grass = requestImage("grass.png");
  the_font = "Amatic SC Regular";
  //the_font = createFont("Amatic SC Regular", 32);
  //the_keyboardImage = requestImage("keyboard.png");
  //the_pink = requestImage("background.png");
  
  drawGradient(0, width, 0, height, 1);
  
  the_scenes[0] = new PIXI.Container();
  the_scenes[0].titleText = new PIXI.Text('SPIDREN', {
    fontSize: DPI(128),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(128)
  });
  the_scenes[0].titleText.anchor.set(0.5); 
  the_scenes[0].subtitleText = new PIXI.Text('@devonsoft', {
    fontSize: DPI(64),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(64)
  });    
  the_scenes[0].subtitleText.anchor.set(0.5);   
  the_scenes[0].update = function(delta)
  {
    this.titleText.x = width/2 + random(-5, 5);
    this.titleText.y = height/2 + random(-5, 5);
    this.subtitleText.x = width/2 + random(-5, 5);
    this.subtitleText.y = height/2 + random(-5, 5) + DPI(100); 
  }
  the_scenes[0].addChild(the_scenes[0].titleText, the_scenes[0].subtitleText);
  
  the_scenes[1] = new PIXI.Container();
  the_keyboardImage = PIXI.Sprite.fromImage('keyboard.png')
  //the_scenes[1].scale = the_scale;
  the_scenes[1].addChild(the_keyboardImage);
  the_scenes[1].update = function(delta) {the_keyboardImage.width = width; the_keyboardImage.height = height;}
  
  the_scenes[2] = new PIXI.Container();
  the_scenes[2].titleText = new PIXI.Text('FOCUS ON ONE LEG AT A TIME (R + D, C)', {
    fontSize: DPI(64),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(64)
  });
  the_scenes[2].titleText.anchor.set(0.5); 
  the_scenes[2].subtitleText = new PIXI.Text('most keyboards do not allow enough simultaneous keys for more than one leg', {
    fontSize: DPI(32),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(32)
  });    
  the_scenes[2].subtitleText.anchor.set(0.5);
  the_scenes[2].subtitleText.x = width/2;
  the_scenes[2].subtitleText.y = height/2 + DPI(50);
  the_scenes[2].update = function(delta)
  {
    this.titleText.x = width/2 + random(-5, 5);
    this.titleText.y = height/2 + random(-5, 5);
  }
  the_scenes[2].addChild(the_scenes[2].titleText, the_scenes[2].subtitleText);
   
  for (var i = 0; i < the_scenes.length; i++)
  {
    app.stage.addChild(the_scenes[i]);
    the_scenes[i].visible = false;
  }
  
  the_scenes[0].visible = true;
  for (var i = 1; i < the_scenes.length; i++)
  {
    the_scenes[i].visible = false;
  }
  
  app.renderer.plugins.interaction.on('pointerup', mouseReleased);
  //app.stage.on('pointerup', mouseReleased);
  app.stage.interactive = true;
  
 
}
// Listen for animate update
app.ticker.add(function(delta) 
{

  the_scenes[the_gameState].update(delta);
  
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    //bunny.rotation += 0.1 * delta;
});