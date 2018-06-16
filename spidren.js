var isFirefox = typeof InstallTrigger !== 'undefined';

var MENU_STATE_00 = 0;
var MENU_STATE_01 = 1;
var MENU_STATE_02 = 2;
var PLAY_STATE = 3;
var GAMEOVER_STATE = 4;
var WIN_STATE = 5;

var the_scenes = new Array(4);

var BABBY_COUNT = 1;

var the_gameState = MENU_STATE_00;

var PI = Math.PI;
var HALF_PI = Math.PI * 0.5;
var QUARTER_PI = Math.PI * 0.25;

var the_babbySpiders = new Array(BABBY_COUNT);
var the_spider = null;
var the_font;
var the_ground;
var the_grassSprite;
var the_keyboardSprite;
var the_babbyWalkTextures = [];
var the_babbyDeadTextures = [];
var the_body0Image;
var the_body1Image;
var the_headNormalImage;
var the_headAnnoyedImage;
var the_headAngryImage;
var the_headPainImage;
var the_leg0Image;
var the_leg1Image;
var the_leg2Image;
var the_mandibleEatingTextures = [];
var the_mandibleNormalTextures = [];
var the_bloodTexture;
var the_blood = null;

var the_transitionTimer = 2;
var the_screen_offset = 0;
var the_screenShakeTimer = 0;
var the_doOnce = true;
var the_canvas = null;
var the_fullscreenIcon;

var jtr = 4;
var vx = 0;
var vy = 0;

var frameCount = 0;

var the_scale = 2.0;

function DPI(size)
{
  return size * the_scale;
}

var width = DPI(800);;//1920;//DPI(800);
var height = DPI(450);;//1080;//DPI(600);

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

var app = new PIXI.Application(width, height, {backgroundColor : 0x000000, antialias: true});
the_canvas = app.view;
document.body.appendChild(app.view);
app.stop();
var loader = PIXI.loader;

loader.add('babbySpritesheet', 'babby.json');
loader.add('headSpritesheet', 'head.json');
loader.add('mandibleSpritesheet', 'mandible.json');
loader.add('grass', 'grass.png');
loader.add('keyboard', 'keyboard.png');
loader.add('body0', 'body0.png');
loader.add('body1', 'body1.png');
loader.add('leg0', 'leg0.png');
loader.add('leg1', 'leg1.png');
loader.add('leg2', 'leg2.png');
  
loader.load(function(loader, resources)
{
  the_headNormalImage = PIXI.Texture.fromFrame('Head_Normal.png');
  the_headAnnoyedImage = PIXI.Texture.fromFrame('Head_Annoyed.png');
  the_headAngryImage = PIXI.Texture.fromFrame('Head_Angry.png');
  the_headPainImage = PIXI.Texture.fromFrame('Head_Pain.png');
  the_body0Image = resources.body0.texture;
  the_body1Image = resources.body1.texture;
  the_leg0Image = resources.leg0.texture;
  the_leg1Image = resources.leg1.texture;
  the_leg2Image = resources.leg2.texture;

  var i;
  for (i = 0; i < 4; i++) 
  {
       var texture = PIXI.Texture.fromFrame('Babby_Walk ' + (i+1) + '.png');
       the_babbyWalkTextures.push(texture);
  }
  for (i = 0; i < 1; i++) 
  {
       var texture = PIXI.Texture.fromFrame('Babby_Dead ' + (i+1) + '.png');
       the_babbyDeadTextures.push(texture);
  }
  
  the_mandibleNormalTextures.push(PIXI.Texture.fromFrame('Mandible_Normal.png'));
  for (i = 0; i < 3; i++) 
  {
       var texture = PIXI.Texture.fromFrame('Mandible_Eating ' + (i+1) + '.png');
       the_mandibleEatingTextures.push(texture);
  }  
  
  the_keyboardSprite = new PIXI.Sprite(resources.keyboard.texture);
  the_keyboardSprite.anchor.set(0.5);
  the_keyboardSprite.x = width / 2;
  the_keyboardSprite.y = height / 2;
  the_keyboardSprite.scale.set(height / the_keyboardSprite.height);
  the_grassSprite = new PIXI.Sprite(resources.grass.texture);
  
  var graphics = new PIXI.Graphics();
  graphics.beginFill(PIXI.utils.rgb2hex([1.0, 0.1875, 0.0625]), 0.5);
  graphics.drawCircle(0, 0, 100); 
  graphics.endFill();
  the_bloodTexture = graphics.generateTexture();
  
  setup();
  app.start();
});

function gameStart()
{
  the_transitionTimer = 2;
  the_gameState = PLAY_STATE;
  
  if (the_spider)
    the_spider.remove();
  the_spider = new Spider(); 
  if (the_blood)
    the_blood.remove();
  
  for (var i = 0; i < the_babbySpiders.length; i++)
  {
    the_babbySpiders[i].remove();
  }
  the_babbySpiders = new Array(BABBY_COUNT);
}

function mouseReleased()
{
  //console.log("ok");
  if (the_gameState < PLAY_STATE)
  {
    the_scenes[the_gameState].visible = false;
    the_scenes[++the_gameState].visible = true;
    //console.log(the_gameState);
  } 
  else if (the_gameState > PLAY_STATE && the_transitionTimer <= 0)
  {
    the_scenes[the_gameState].visible = false;
    the_gameState = PLAY_STATE;
    the_scenes[the_gameState].visible = true;
    the_doOnce = true;
  }
  
  /*if (the_fullscreenIcon)
  {
    the_fullscreenIcon.setFullscreen();
  }*/
}

/*var pkeys=[];*/

function controlSpider(code)
{

}

function keyPressed(e) 
{
  var code = e.keyCode ? e.keyCode : e.which; //e.key.toUpperCase().charCodeAt(0);
  
  // semicolon on firefox
  if (code == 59 && isFirefox)
    code = 186;
  
  switch (code) 
  {
    case 84:  the_spider.m_legs[0].pressButton(0); break; // t
    case 70:  the_spider.m_legs[0].pressButton(1); break; // f
    case 86:  the_spider.m_legs[0].pressButton(2); break; // v
    
    case 89:  the_spider.m_legs[1].pressButton(0); break; // y
    case 74:  the_spider.m_legs[1].pressButton(1); break; // j
    case 78:  the_spider.m_legs[1].pressButton(2); break; // n
    
    case 85:  the_spider.m_legs[2].pressButton(0); break; // u
    case 75:  the_spider.m_legs[2].pressButton(1); break; // k
    case 77:  the_spider.m_legs[2].pressButton(2); break; // m
    
    case 82:  the_spider.m_legs[3].pressButton(0); break; // r
    case 68:  the_spider.m_legs[3].pressButton(1); break; // d
    case 67:  the_spider.m_legs[3].pressButton(2); break; // c
    
    case 73:  the_spider.m_legs[4].pressButton(0); break; // i
    case 76:  the_spider.m_legs[4].pressButton(1); break; // l
    case 188: the_spider.m_legs[4].pressButton(2); break; // ,
    
    case 69:  the_spider.m_legs[5].pressButton(0); break; // e
    case 83:  the_spider.m_legs[5].pressButton(1); break; // s
    case 88:  the_spider.m_legs[5].pressButton(2); break; // x
    
    case 79:  the_spider.m_legs[6].pressButton(0); break; // o
    case 186: the_spider.m_legs[6].pressButton(1); break; // ;
    case 190: the_spider.m_legs[6].pressButton(2); break; // .
    
    case 87:  the_spider.m_legs[7].pressButton(0); break; // w
    case 65:  the_spider.m_legs[7].pressButton(1); break; // a
    case 90:  the_spider.m_legs[7].pressButton(2); break; // z
  }	
}

function keyReleased(e) 
{
  if (the_gameState < PLAY_STATE)
  {
    the_scenes[the_gameState].visible = false;
    the_scenes[++the_gameState].visible = true;
  } 
  else if (the_gameState > PLAY_STATE && the_transitionTimer <= 0)
  {
    the_scenes[the_gameState].visible = false;
    the_gameState = PLAY_STATE;
    the_scenes[the_gameState].visible = true;
    the_doOnce = true;
  }
  else
  {
    var code = e.keyCode ? e.keyCode : e.which; //e.key.toUpperCase().charCodeAt(0);
    
    // semicolon on firefox
    if (code == 59 && isFirefox)
      code = 186;
    
    switch (code) 
    {
      case 84:  the_spider.m_legs[0].m_buttons[0] = 0; break; // t
      case 70:  the_spider.m_legs[0].m_buttons[1] = 0; break; // f
      case 86:                                                // v
        the_spider.m_legs[0].m_buttons[2] = 0;        
        //the_spider.m_legs[0].m_isReaching = false; 
        break; 
      
      case 89:  the_spider.m_legs[1].m_buttons[0] = 0; break; // y
      case 74:  the_spider.m_legs[1].m_buttons[1] = 0; break; // j
      case 78:                                                // n
        the_spider.m_legs[1].m_buttons[2] = 0;
        //the_spider.m_legs[1].m_isReaching = false; 
        break; 
      
      case 85:  the_spider.m_legs[2].m_buttons[0] = 0; break; // u
      case 75:  the_spider.m_legs[2].m_buttons[1] = 0; break; // k
      case 77:                                                // m
        the_spider.m_legs[2].m_buttons[2] = 0;
        //the_spider.m_legs[2].m_isReaching = false; 
        break; 
        
      case 82:  the_spider.m_legs[3].m_buttons[0] = 0; break; // r
      case 68:  the_spider.m_legs[3].m_buttons[1] = 0; break; // d
      case 67:                                                // c
        the_spider.m_legs[3].m_buttons[2] = 0;
        //the_spider.m_legs[3].m_isReaching = false; 
        break; 
      
      case 73:  the_spider.m_legs[4].m_buttons[0] = 0; break; // i
      case 76:  the_spider.m_legs[4].m_buttons[1] = 0; break; // l
      case 188:                                               // ,
        the_spider.m_legs[4].m_buttons[2] = 0;
        //the_spider.m_legs[4].m_isReaching = false; 
        break; 
      
      case 69:  the_spider.m_legs[5].m_buttons[0] = 0; break; // e
      case 83:  the_spider.m_legs[5].m_buttons[1] = 0; break; // s
      case 88:                                                // x
        the_spider.m_legs[5].m_buttons[2] = 0;
        //the_spider.m_legs[5].m_isReaching = false; 
        break; 
        
      case 79:  the_spider.m_legs[6].m_buttons[0] = 0; break; // o
      case 186: the_spider.m_legs[6].m_buttons[1] = 0; break; // ;
      case 190:                                               // .
        the_spider.m_legs[6].m_buttons[2] = 0;
        //the_spider.m_legs[6].m_isReaching = false; 
        break; 
        
      case 87:  the_spider.m_legs[7].m_buttons[0] = 0; break; // w
      case 65:  the_spider.m_legs[7].m_buttons[1] = 0; break; // a
      case 90:                                                // z
        the_spider.m_legs[7].m_buttons[2] = 0;
        //the_spider.m_legs[7].m_isReaching = false; 
        break; 
    }
  }
}

function createVector(x, y)
{
  return new PIXI.Point(x, y);
}

function random(min, max) 
{
  return Math.random() * (max - min) + min;
}

function int(f)
{
  return Math.floor(f);
}

function constrain(val, min, max) 
{
    return val > max ? max : val < min ? min : val;
}

function drawGradient(left, right, top, bottom, alpha, parent=null, mask=null, g=null)
{
  var graphics = g;
  if (graphics == null)
    var graphics = new PIXI.Graphics();
  
  var lineWidth = 1;
  var r;
  var g;
  var b;
  
  var vertScale = 4;
  top /= vertScale;
  bottom /= vertScale;
  
  left = 0;
  right = 1;
  
    // set a fill and line style
  graphics.beginFill(0xFFFFFF);
  for (var i = top; i <= bottom; i += lineWidth)
  {
    var percent = i * vertScale / height;
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
  if (mask)
    graphics.mask = mask;
    
  graphics.scale.set(width, vertScale);
    
  graphics.cacheAsBitmap = true;
  
  if (parent)
    parent.addChild(graphics);
  
  return graphics;
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
  the_babbySpiders = [];
  the_screenShakeTimer = 0;
  the_transitionTimer = 2;
  the_doOnce = true;
  scaleToWindow();
  
  //app.renderer.plugins.interaction.on('pointerup', mouseReleased);
  //app.stage.on('pointerup', mouseReleased);
  //app.stage.interactive = true;
  //app.stage.hitArea = new PIXI.Rectangle(0,0,1000,1000);
  
  //the_fullscreenIcon = new FullscreenIcon(width - 20, height - 20, 12);

  the_ground = height-DPI(35);
  //the_grass = requestImage("grass.png");
  the_font = "Amatic SC Regular";
  
  drawGradient(0, width, 0, height, 1, app.stage);
  
  // Title Screen
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
  the_scenes[0].titleText.x = width/2;
  the_scenes[0].titleText.y = height/2;
  the_scenes[0].subtitleText.x = width/2;
  the_scenes[0].subtitleText.y = height/2 + DPI(100);   
  the_scenes[0].update = function(delta)
  {
    if (frameCount % 2 == 0)
    {
      this.titleText.vx = (width/2 + random(-jtr, jtr) - this.titleText.x) / 2;
      this.titleText.vy = (height/2 + random(-jtr, jtr) - this.titleText.y) / 2;
      this.subtitleText.vx = (width/2 + random(-jtr, jtr) - this.subtitleText.x) / 2;;
      this.subtitleText.vy = (height/2 + random(-jtr, jtr) + DPI(100) - this.subtitleText.y) / 2;
    }
    this.titleText.x += this.titleText.vx;
    this.titleText.y += this.titleText.vy;
    this.subtitleText.x += this.subtitleText.vx;
    this.subtitleText.y += this.subtitleText.vy; 
  }
  the_scenes[0].addChild(the_scenes[0].titleText, the_scenes[0].subtitleText);
  
  // Controls Screen
  the_scenes[1] = new PIXI.Container();
  the_scenes[1].addChild(the_keyboardSprite);
  the_scenes[1].update = function(delta) {/*the_keyboardSprite.width = width; the_keyboardSprite.height = height;*/}
  
  // Second Controls Screen
  the_scenes[2] = new PIXI.Container();
  the_scenes[2].titleText = new PIXI.Text('FOCUS ON ONE LEG AT A TIME (R + D, C)', {
    fontSize: DPI(64),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(64)
  });
  the_scenes[2].titleText.anchor.set(0.5); 
  the_scenes[2].titleText.x = width/2;
  the_scenes[2].titleText.y = height/2;
  
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
    if (frameCount % 2 == 0)
    {
      vx = (width/2 + random(-jtr, jtr) - this.titleText.x) / 2;
      vy = (height/2 + random(-jtr, jtr) - this.titleText.y) / 2;
    }
    this.titleText.x += vx;
    this.titleText.y += vy;
  }
  the_scenes[2].addChild(the_scenes[2].titleText, the_scenes[2].subtitleText);
  
  // Play State
  the_scenes[3] = new PIXI.Container(); 
   
  var h =  DPI(800) / the_grassSprite.width * the_grassSprite.height;  
  var backgroundGrass = new PIXI.Sprite(the_grassSprite.texture);
  backgroundGrass.x = 0;
  backgroundGrass.y = height - h + DPI(4);
  backgroundGrass.width = width;
  backgroundGrass.height = h;
  app.stage.addChild(backgroundGrass);
  
  //the_spider = new Spider();
  
  the_scenes[3].update = function(delta)
  {
    if (the_doOnce)
    {
      gameStart();
      the_doOnce = false;
    }
    
    //if (frameCount % 2)
    {
      this.x = random(-the_screen_offset, the_screen_offset);
      this.y = random(-the_screen_offset, the_screen_offset);
    }
    if (the_blood)
      the_blood.run();
    the_spider.draw();

    var deadBabbyCount = 0;
    for (var i = the_babbySpiders.length-1; i >= 0 && !the_spider.buttExploding; i--)
    {
      the_babbySpiders[i].update();
      if (the_babbySpiders[i].isDead)
        deadBabbyCount += 1;
    }  
    if (deadBabbyCount >= BABBY_COUNT)
    {
      //the_scenes[the_gameState].visible = false;
      the_gameState = WIN_STATE;
      the_scenes[the_gameState].visible = true;
      the_scenes[the_gameState].alpha = 0;
    
      if (BABBY_COUNT < 3)
        BABBY_COUNT += 1;
      else if (BABBY_COUNT < 7)
        BABBY_COUNT += 2;
      else if (BABBY_COUNT >= 7)
        BABBY_COUNT *= 2;
    } 
    else
    {          
      for (var i = 0; i < the_babbySpiders.length && !the_spider.buttExploding; i++)
      {
        var isFeeding = false;
        var isHit = false;
        babby = the_babbySpiders[i];
        for (var j = 0; j < the_spider.m_legs.length; j++)
        {
          leg = the_spider.m_legs[j];
          var isOverlapping = false;
          if (!leg.m_isReaching && !babby.isStabbed && (babby.y >= the_ground || babby.carriedSegment == null)) 
            isOverlapping = leg.isOverlappingTipSegment(babby);

          if (isOverlapping)
          {
            if (leg.m_dx != 0)
            { 
              isHit = true;
              babby.speed = 20;
              babby.x += leg.m_dx;
              if (leg.m_dx > 0)
                babby.direction.x = 1;
              else if (leg.m_dx < 0)
                babby.direction.x = -1;
            } 
            else if (babby.speed <= babby.normalSpeed || the_spider.tipCount == 1)
            {
              isFeeding = true;

              if (babby.isClimbing)
              {
                babby.stabLeg = null;
                babby.isClimbing = false;
              }
              if (babby.carriedSegment == null && dist(babby.x, babby.y, leg.m_segments[2].m_x, leg.m_segments[2].m_y) < babby.radius)
              { 
                leg.shouldRemoveHealth = true;
              }

              babby.stabLeg = leg;

              if (leg.health <= 0)
              {
                babby.stabLeg = null;
                isFeeding = false;
                the_screenShakeTimer = 0.75;
                if (leg.stabbedBabby != null)
                {
                  leg.stabbedBabby.isDead = true;
                }

                babby.carriedSegment = leg.getTipSegment();
                leg.getTipSegment().isBeingCarried = true;
                var idx = the_scenes[PLAY_STATE].getChildIndex(babby.sprite);
                the_scenes[PLAY_STATE].setChildIndex(leg.getTipSegment().m_drip, idx-1);
                the_scenes[PLAY_STATE].setChildIndex(leg.getTipSegment().m_img, idx-1);
                leg.getTipSegment().m_angle = -HALF_PI;
              }
            }
          } 
          else if (leg.m_isReaching && leg.stabbedBabby == null && leg.getTipSegment().isBeingCarried == false)
          {
			var midTipX = leg.m_tipX + ((leg.getTipSegment().m_x - leg.m_tipX));// * 0.5);
			var midTipY = leg.m_tipY + ((leg.getTipSegment().m_y - leg.m_tipY));// * 0.5);
            isOverlapping = //dist(leg.m_tipX, leg.m_tipY, babby.x, babby.y) < babby.radius * 2;
				//circleLineIntersect(midTipX, midTipY, leg.m_tipX, leg.m_tipY, babby.x, babby.y, babby.radius * 2.0);
   				circleLineIntersect(leg.m_tipX, leg.m_tipY, leg.m_targetX, leg.m_targetY, babby.x, babby.y, babby.radius * 2.0);
            if (isOverlapping)
            {
              babby.isStabbed = true;
              babby.isClimbing = false;
              babby.stabLeg = leg;
              leg.stabbedBabby = babby;
            }
          } 
          else if (the_spider.tipCount == 1 && !babby.isFeeding && !babby.isStabbed)
          {
            if (!leg.isBeingCarried())
            {
              var distSQ = (leg.m_tipX - babby.x) * (leg.m_tipX - babby.x);
              if (distSQ < babby.speed * babby.speed)
              {
                babby.isClimbing = true;
                babby.stabLeg = leg;
              }
            }
          }
        }
        babby.isFeeding = isFeeding;
        if (isHit)
          babby.isFeeding = false;
      }
    }    
    
    the_screenShakeTimer -= 1 / 60.0;
    if (the_screenShakeTimer > 0)
    {
      the_screen_offset = DPI(20.0) * the_screenShakeTimer;
    } 
    else
      the_screen_offset = 0.0;
  
  }
  
  // GAMEOVER_STATE
  the_scenes[4] = new PIXI.Container();
  the_scenes[4].titleText = new PIXI.Text('THE CHILD BECOMES THE PARENT', {
    fontSize: DPI(80),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(80)
  });
  the_scenes[4].titleText.anchor.set(0.5); 
  the_scenes[4].titleText.x = width/2;
  the_scenes[4].titleText.y = height/2;
  the_scenes[4].alpha = 0;
  the_scenes[4].gradient = drawGradient(0, width, 0, height, 1, the_scenes[4]);
  the_scenes[4].addChild(the_scenes[4].titleText);
  the_scenes[4].update = function(delta)
  {
    the_transitionTimer -= 1 / 60.0;
    if (the_transitionTimer > 0)
    {
      this.titleText.alpha = 0;
      if (this.alpha < 1)
        this.alpha += 0.01;  
      else  
        this.alpha = 1;        
    }
    else
    {
      the_scenes[PLAY_STATE].alpha = 1;
      the_scenes[PLAY_STATE].visible = false;
      this.titleText.alpha = 1;
      if (frameCount % 2 == 0)
      {
        vx = (width/2 + random(-jtr, jtr) - this.titleText.x) / 2;
        vy = (height/2 + random(-jtr, jtr) - this.titleText.y) / 2;
      }
      this.titleText.x += vx;
      this.titleText.y += vy;
    }
  }
 
  // WIN_STATE
  the_scenes[5] = new PIXI.Container();
  the_scenes[5].titleText = new PIXI.Text('YOU CAN BREED AGAIN', {
    fontSize: DPI(80),
    fontFamily: the_font,
    fill: "#3a0e05",
    align: 'center',
    padding: DPI(80)
  });
  the_scenes[5].titleText.anchor.set(0.5); 
  the_scenes[5].titleText.x = width/2;
  the_scenes[5].titleText.y = height/2;
  the_scenes[5].alpha = 0;
  the_scenes[5].gradient = drawGradient(0, width, 0, height, 1, the_scenes[5]);
  the_scenes[5].addChild(the_scenes[5].titleText);
  the_scenes[5].update = function(delta)
  {
    the_transitionTimer -= 1 / 60.0;
    if (the_transitionTimer > 0)
    {
      this.titleText.alpha = 0;
      if (this.alpha < 1)
        this.alpha += 0.01;  
      else  
        this.alpha = 1;        
    }
    else
    {
      the_scenes[PLAY_STATE].alpha = 1;
      the_scenes[PLAY_STATE].visible = false;
      this.titleText.alpha = 1;
      if (frameCount % 2 == 0)
      {
        vx = (width/2 + random(-jtr, jtr) - this.titleText.x) / 2;
        vy = (height/2 + random(-jtr, jtr) - this.titleText.y) / 2;
      }
      this.titleText.x += vx;
      this.titleText.y += vy;
    }
  }
   
  for (var i = 0; i < the_scenes.length; i++)
  {
    app.stage.addChild(the_scenes[i]);
    the_scenes[i].visible = false;
  }
  
  the_scenes[0].visible = true;
 
  app.renderer.plugins.interaction.on('pointerup', mouseReleased);
  //app.renderer.plugins.interaction.on('keydown', keyPressed);
  //app.renderer.plugins.interaction.on('keyup', keyReleased);
  window.addEventListener('keydown', keyPressed, false);
  window.addEventListener('keyup', keyReleased, false);
  app.stage.interactive = true;
  app.stage.interactiveChildren = false;
}

// Listen for animate update
app.ticker.add(function(delta) 
{
  for (var i = 0; i < the_scenes.length; i++)
  {
    if (the_scenes[i].visible)
      the_scenes[i].update(delta);
  }
  //the_scenes[the_gameState].update(delta);
  
  frameCount += 1;
});

function distSQ(x1, y1, x2, y2)
{
  var dx = x1 - x2;
  var dy = y1 - y2;
  return dx * dx + dy * dy;
}

function dist(x1, y1, x2, y2)
{
  return Math.sqrt(distSQ(x1, y1, x2, y2));
}

function circleLineIntersect(x1, y1, x2, y2, cx, cy, cr)
{
  var dx = x2 - x1;
  var dy = y2 - y1;
  var a = dx * dx + dy * dy;
  var b = 2 * (dx * (x1 -cx) + dy * (y1 -cy));
  var c = cx * cx + cy * cy;
  c += x1 *  x1 + y1 * y1;
  c -= 2 * (cx * x1 + cy * y1);
  c -= cr * cr;
  var bb4ac = b * b - 4 * a * c;

  if (bb4ac < 0)
    return false;
  else
  {
    var mu = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
    var ix1 = x1 + mu*(dx);
    var iy1 = y1 + mu*(dy);
    mu = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
    var ix2 = x1 + mu*(dx);
    var iy2 = y1 + mu*(dy);

    var testX;
    var testY;
    if (dist(x1, y1, cx, cy) < dist(x2, y2, cx, cy))
    {
      testX = x2;
      testY = y2;
    } 
    else
    {
      testX = x1;
      testY = y1;
    }
    if (dist(testX, testY, ix1, iy1) < dist(x1, y1, x2, y2) || dist(testX, testY, ix2, iy2) < dist(x1, y1, x2, y2))
    {
      return true;
    } 
    else
      return false;
  }
}

// A class to describe a group of Particles
function ParticleSystem() 
{
  this.particles = new PIXI.particles.ParticleContainer(1500, {
    scale: true,
    position: true,
    rotation: false,
    uvs: false,
    alpha: true
  });
  the_scenes[PLAY_STATE].addChild(this.particles);
  
  this.remove = function() 
  {
    the_scenes[PLAY_STATE].removeChild(this.particles);
  }

  this.addParticle = function(xx, yy) 
  {
    var particle = new PIXI.Sprite(the_bloodTexture);
    particle.acceleration = createVector(0.0, 0.1);
    particle.velocity = createVector(random(-1, 1), random(-2.0, -1.0));
    particle.x = xx;// + random(-1,1);
    particle.y = yy + random(-2,2);
    particle.lifespan = 1.0;
    particle.radiusX = DPI(random(0.075, 0.15));
    particle.radiusY = DPI(random(0.075, 0.15));
    particle.scale.set(particle.radiusX, particle.radiusY);
    particle.update = function() 
    {
      this.alpha = this.lifespan;;
      var s = 
      this.scale.set(this.radiusX * this.lifespan, this.radiusY * this.lifespan);
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.lifespan -= .009;
    }
    particle.isDead = function()
    {
      if (this.lifespan < 0.0) 
      {
        return true;
      } 
      else 
      {
        return false;
      }
    }
    
    //this.particles.push(particle);
    this.particles.addChild(particle);
  }

  this.run = function() 
  {
    for (var i = this.particles.children.length-1; i >= 0; i--) 
    {
      var p = this.particles.children[i];
      p.update();
      if (p.isDead()) 
      {
        this.particles.removeChildAt(i);
      }
    }   
  }
};

function BabbySpider()
{
  this.x = random(DPI(50), height - DPI(50));
  this.y = height - DPI(50);
  this.direction = createVector(1, 0);
  this.speed = (4.0);
  this.normalSpeed = (4.0);
  this.radius = DPI(15.0);

  // states
  this.isSpawning = true;
  this.isFeeding = false;
  this.isThrowing = false;
  this.isStabbed = false;
  this.isClimbing = false;
  this.isDead = false;

  this.carriedSegment = null;
  this.stabLeg = null;
  this.health = 1.0;
  
  this.tempDirection = 0.0;

  if (the_spider)
  {    
    this.x = the_spider.x;
    this.y = the_spider.y - DPI(150);
  }
  if (random(1) > 0.5)
    this.velocity = createVector((random(-8, -4)), (random(-4, 0)));
  else
    this.velocity = createVector((random(4, 8)), (random(-4, 0)));
  this.normalSpeed = (random(3.0, 8.0));
  
  this.sprite = new PIXI.extras.AnimatedSprite(the_babbyWalkTextures);
  this.sprite.anchor.set(0.5);
  this.sprite.animationSpeed = 0.2;
  this.sprite.play();
  
  the_scenes[PLAY_STATE].addChild(this.sprite);
  
  this.remove = function()
  {
    the_scenes[PLAY_STATE].removeChild(this.sprite);
  }
  
  this.update = function(delta)
  {         
    if (this.isDead || this.isSpawning)
    { 
      if (this.y >= the_ground - this.radius)
      {
        this.y = the_ground - this.radius;
        this.speed = this.normalSpeed;
        this.isSpawning = false;
      } 
      else
      {
        this.velocity.y += (0.08);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
    } 
    else if (this.isClimbing)
    {
      if (this.stabLeg != null)
      {
      
        var tempDirection = createVector(
          this.stabLeg.m_segments[2].m_x - this.x, 
          this.stabLeg.m_segments[2].m_y - this.y);

        //strokeWeight(2);
        //stroke(192, 224, 192, 192);
        //line(this.x, this.y, this.stabLeg.m_segments[2].m_x, this.stabLeg.m_segments[2].m_y);

        var magnitude = dist(0, 0, tempDirection.x, tempDirection.y);

        if (Math.abs(tempDirection.x) > DPI(200))
        {
          this.isClimbing = false;
        } 
        else
        {
          tempDirection.x = magnitude > 0 ? tempDirection.x / magnitude : 0;
          tempDirection.y = magnitude > 0 ? tempDirection.y / magnitude : 0;
          this.y += tempDirection.y * this.speed;
          this.x += tempDirection.x * this.speed;
        }
        this.velocity.y = 0;
      }
    } 
    else if (this.isStabbed)
    {
      if (this.stabLeg != null)
      {
        this.x = this.stabLeg.m_tipX;
        this.y = this.stabLeg.m_tipY;

        if (dist(this.x, this.y, the_spider.x, the_spider.y + DPI(50)) < this.radius * 3)
        {
          //the_spider.mandible.textures = the_mandibleEatingTextures;
          
          the_spider.mandible.visible = false;
          the_spider.mandibleTopLayer.visible = true;
          
          for (var p = 0; p < 10; p++)
            the_blood.addParticle(this.x, this.y);
          this.health -= 0.01; 
        } 
        else
        {
          the_spider.mandible.visible = true;
          the_spider.mandibleTopLayer.visible = false;
        }
      }
    } 
    else if (this.isThrowing)
    {
      if (this.carriedSegment != null)
      {
        this.carriedSegment.m_y -= 10;//this.speed;
        if (this.carriedSegment.m_y < (the_spider.y + this.carriedSegment.m_length))
        {
          this.carriedSegment.m_isDripping = true;
          this.carriedSegment.m_dripY = this.carriedSegment.m_y - this.carriedSegment.m_length;
          this.carriedSegment = null;
          this.isThrowing = false;
          the_spider.tipCount -= 1;
          if (the_spider.tipCount <= 0)
          {
            //the_scenes[the_gameState].visible = false;
            the_gameState = GAMEOVER_STATE;
            the_scenes[the_gameState].visible = true;
            the_scenes[the_gameState].alpha = 0; 
          }
        }
      }
    } 
    else if (this.isFeeding)
    {
      if (this.carriedSegment == null)
      {
        if (!this.stabLeg.shouldRemoveHealth || frameCount % 2 == 0)
        {
          this.tempDirection = createVector(
            this.stabLeg.m_segments[2].m_x - this.x, 
            this.stabLeg.m_segments[2].m_y - this.y);
        }
        var magnitude = dist(0, 0, this.tempDirection.x, this.tempDirection.y);

        this.tempDirection.x = magnitude > 0 ? this.tempDirection.x / magnitude : 0;
        this.tempDirection.y = magnitude > 0 ? this.tempDirection.y / magnitude : 0;
        this.y += this.tempDirection.y * this.speed;
        this.x += this.tempDirection.x * this.speed;
      }
      this.speed = this.normalSpeed;
    } 
    else
    {
      this.velocity.x = this.direction.x * this.speed;
      this.x += this.velocity.x;
      if (this.speed > this.normalSpeed)
        this.speed *= 0.9;

      if (this.carriedSegment != null)
      {
        this.carriedSegment.m_x = this.x;
        this.carriedSegment.m_y = this.y;

        var distSQ = (width/2 - this.x) * (width/2 - this.x);
        if (distSQ < DPI(random(4, 1000)))
          this.isThrowing = true;
      }

      if (this.y < the_ground - this.radius)
      {
        this.velocity.y += (0.04);
        this.y += this.velocity.y;
      } else
        this.y = the_ground - this.radius;

      if (this.x > width - this.radius)
      {
        this.direction.x = -this.direction.x;
        this.x = width - this.radius;
      } 
      else if (this.x < this.radius)
      {
        this.direction.x = -this.direction.x;
        this.x = this.radius;
      }
    }

    if (this.isDead)
      this.sprite.textures = the_babbyDeadTextures;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    var s = this.radius * 2.0 / 72.0;
    if (this.velocity.x < 0)
      this.sprite.scale.set(-s, s);
    else
     this.sprite.scale.set(s, s);
     
    if (!this.isDead && this.health <= 0.0)
    {
      if (this.stabLeg != null)
        this.stabLeg.stabbedBabby = null;
      this.isDead = true;
      this.velocity = createVector(random(-1, 1), random(-1, 0));
      the_spider.mandible.visible = true;
      the_spider.mandibleTopLayer.visible = false;
    }
  }
};

  
function LegSegment(startAngle, minAngle, maxAngle, xx, yy, seglength, index, img)
{

  this.m_prev = null;

  this.m_x = xx;
  this.m_y = yy;
  this.m_startAngle = startAngle;
  this.m_angle = startAngle;
  this.m_minAngle = minAngle;
  this.m_maxAngle = maxAngle;
  this.m_length = seglength;
  
  if (index == 2)    
  {
    this.m_drip = new PIXI.Graphics();
    this.m_drip.beginFill(0xFFFFFF);
    this.m_drip.lineStyle(1, PIXI.utils.rgb2hex([1.0, 1.0, 1.0]), 192 / 255.0);
    this.m_drip.moveTo(0,0); 
    this.m_drip.lineTo(0,1);
    this.m_drip.endFill();   
    //this.m_drip.cacheAsBitmap = true;
    the_scenes[PLAY_STATE].addChild(this.m_drip);
    this.m_drip.visible = false;
  }

  this.m_img = new PIXI.Sprite(img);
  this.m_img.anchor.set(0.5);
  the_scenes[PLAY_STATE].addChild(this.m_img);
   
  this.setup = function()
  {
    this.m_isReaching = false;
    this.isBeingCarried = false;
    this.m_isDripping = false;
    this.m_targetX = 0;
    this.m_targetY = 0;
    this.atMaxAngle = false;
    this.atMinAngle = false;     
  }
  
  this.setup();

  this.draw = function(isLeft) 
  { 
    if (this.m_isDripping)
    {
      this.m_drip.visible = true;
      this.m_y += the_spider.buttOffset;
      var startY = this.m_y - this.m_length;
      if (this.m_dripY < the_ground)
      {
        this.m_dripY += DPI(2);
      }
      
      var scaleY = this.m_dripY - startY;
      this.m_drip.x = this.m_x;
      this.m_drip.y = startY;
      this.m_drip.scale.x = DPI(random(5, 15));
      this.m_drip.scale.y = scaleY;
    }

    this.m_img.x = this.m_x + Math.cos(this.m_angle) * (this.m_length * 0.5);
    this.m_img.y = this.m_y + Math.sin(this.m_angle) * (this.m_length * 0.5);
    this.m_img.rotation = this.m_angle;
    if (isLeft)
      this.m_img.scale.set(1, -1);
    this.m_img.width = this.m_length * 1.12;
    this.m_img.height = DPI(20);
  }

  this.calculatePosition = function(isleft) 
  {
    if (this.m_prev != null && !this.isBeingCarried)
    {    
      this.m_x = this.m_prev.m_x + Math.cos(this.m_prev.m_angle) * this.m_prev.m_length; 
      this.m_y = this.m_prev.m_y + Math.sin(this.m_prev.m_angle) * this.m_prev.m_length;
    }
  }

  this.calculateAngle = function() 
  {
    if (this.isBeingCarried)
      return;

    var min;
    var max;
    if (this.m_prev != null) 
    {
      min = this.m_prev.m_angle+this.m_startAngle+this.m_minAngle;
      max = this.m_prev.m_angle+this.m_startAngle+this.m_maxAngle;
    } 
    else
    {
      min = this.m_startAngle+this.m_minAngle;
      max = this.m_startAngle+this.m_maxAngle;
    }
    this.m_angle = constrain(this.m_angle, min, max);
    
    this.atMaxAngle = false;
    this.atMinAngle = false;
    if (this.m_angle == max)
      this.atMaxAngle = true;
    if (this.m_angle == min)
      this.atMinAngle = true;

  }

  this.isCircleOverlapping = function(cx, cy, cr)
  {
    var x2 = this.m_x + Math.cos(this.m_angle) * this.m_length;
    var y2 = this.m_y + Math.sin(this.m_angle) * this.m_length; 
    return circleLineIntersect(m_x, m_y, x2, y2, cx, cy, cr);
  }

  this.reach = function()
  {
    if (this.isBeingCarried)
      return;
    
    var dx = this.m_targetX - this.m_x;
    var dy = this.m_targetY - this.m_y;
    //print(this.m_targetX);
    this.m_angle = Math.atan2(dy, dx); 

    //print(this.m_angle);

    if (this.m_prev != null)
    {
      this.m_prev.m_targetX = this.m_targetX - Math.cos(this.m_angle) * this.m_length;
      this.m_prev.m_targetY = this.m_targetY - Math.sin(this.m_angle) * this.m_length;
    }
  }

  this.curl = function(amount)
  {
    if (!this.isBeingCarried)
      this.m_angle += amount;
  }
};

function Leg(startX, startY, startAngle, startLength, parentY)
{
  this.m_segmentCount = 3;
  this.m_segments = new Array(this.m_segmentCount);
  this.m_buttons = new Array(this.m_segmentCount);

  this.m_isLeft = true;

  var heightChange = height - DPI(360);
  var offset = ((parentY - heightChange) / (startY - heightChange));

  if (startAngle > HALF_PI)
  {
    this.m_segments[0] = new LegSegment(startAngle, -QUARTER_PI, QUARTER_PI, startX, startY, startLength, 0, the_leg0Image);
    this.m_segments[1] = new LegSegment(-QUARTER_PI* offset, -QUARTER_PI * offset, 0, 0, 0, startLength * offset, 1, the_leg1Image);
    this.m_segments[2] = new LegSegment(-QUARTER_PI* offset, -QUARTER_PI * offset, 0, 0, 0, startLength * offset, 2, the_leg2Image);
    this.m_isLeft = true;
  } 
  else
  {
    this.m_segments[0] = new LegSegment(startAngle, -QUARTER_PI, QUARTER_PI, startX, startY, startLength, 0, the_leg0Image);
    this.m_segments[1] = new LegSegment(QUARTER_PI* offset, 0, QUARTER_PI * offset, 0, 0, startLength * offset, 1, the_leg1Image);  
    this.m_segments[2] = new LegSegment(QUARTER_PI* offset, 0, QUARTER_PI * offset, 0, 0, startLength * offset, 2, the_leg2Image);
    this.m_isLeft = false;
  }

  for (var i = 1; i < this.m_segments.length; i++)
  {
    this.m_segments[i].m_prev = this.m_segments[i-1];
    this.m_segments[i].m_angle = this.m_segments[i-1].m_angle+this.m_segments[i].m_startAngle;
  }   

  this.setup = function()
  {
    this.m_isReaching = false;
    this.shouldRemoveHealth = false;
    for (var i=0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i] = 0;
    }  
    this.m_dx = 0;
    this.m_tipX = 0;
    this.m_tipY = 0;
    this.health = 1.0;
    this.stabbedBabby = null;
    this.curlSpeed = 0.1;
    
    for (var i = 1; i < this.m_segments.length; i++)
    {
      this.m_segments[i].setup();
    }
  }
  
  this.setup();
  
  this.draw = function()
  {   
    if (this.m_buttons[1] != 0)
    {
      //println("x " + m_segments[1].m_x);
      //println("y " + m_segments[1].m_y);
    }

    if (!this.m_isReaching)
    {
      for (var i=0; i < this.m_segments.length; i++) 
        this.m_segments[i].calculateAngle();
    }

    for (var i=0; i < this.m_segments.length; i++) 
      this.m_segments[i].calculatePosition(this.m_isLeft);

    for (var i = 0; i < this.m_segments.length; i++)
    {
      this.m_segments[i].m_img.blendMode = PIXI.BLEND_MODES.NORMAL;
      if (this.shouldRemoveHealth && i == 2)
      {
        this.health -= 0.02; // .02

        if (frameCount % 4 == 0)
          this.m_segments[i].m_img.blendMode = PIXI.BLEND_MODES.ADD;
          
        this.m_segments[i].draw(this.m_isLeft);
      } 
      else
      {
        if (!this.m_segments[i].isBeingCarried)
          this.m_segments[i].draw(this.m_isLeft);
      }
    }

    for (var i=0; i < this.m_buttons.length; i++)
    {
      if (this.m_buttons[i] == 1)
        this.m_buttons[i] = 2;
    }

    var tip = this.getTipSegment();
    var tx = tip.m_x + Math.cos(tip.m_angle) * tip.m_length;
    var ty = tip.m_y + Math.sin(tip.m_angle) * tip.m_length;
    this.m_dx = tx - this.m_tipX;
    this.m_tipY = ty;
    this.m_tipX = tx;
    
    this.shouldRemoveHealth = false;
  }

  this.reach = function(i)
  {
    if (this.m_tipY >= the_ground || this.m_segments[i].isBeingCarried)
    {  
      this.m_isReaching = false;
    }    
    else if (i == this.m_segments.length-1)
    {
      if (this.m_buttons[2] == 1 
        && this.m_buttons[1] == 2 
        && this.m_buttons[0] == 2
        && ((this.m_segments[0].atMaxAngle && this.m_segments[1].atMinAngle)
          || (this.m_segments[0].atMinAngle && this.m_segments[1].atMaxAngle)))
      {
        this.m_isReaching = true;
        this.m_targetX = this.m_tipX;
        this.m_targetY = this.m_tipY + DPI(20);
      }
      this.m_segments[i].m_targetX = this.m_targetX;
      this.m_targetY = this.m_targetY + DPI(50);
      this.m_segments[i].m_targetY = this.m_targetY;
    }

    if (this.m_isReaching)
    {      
      if (this.m_tipY < the_ground)
        this.m_segments[i].reach();
      else
      {
        this.m_isReaching = false;
      }
    }
  }

  this.curlUp = function(i)
  {
    if (this.m_isReaching)
      return;

    if (this.m_isLeft)
      this.m_segments[i].curl((i+1) * this.curlSpeed); 
    else
      this.m_segments[i].curl((i+1) * -this.curlSpeed);
  }

  this.curlDown = function(i)
  {
    if (this.m_isReaching)
      return;

    if (this.m_isLeft)
      this.m_segments[i].curl((i+1) * -this.curlSpeed);
    else
      this.m_segments[i].curl((i+1) * this.curlSpeed);
  }

  this.pressButton = function(i)
  {
    if (this.m_buttons[i] == 0)
      this.m_buttons[i] = 1;
  }

  this.isOverlappingTipSegment = function(b)
  {
    if (this.getTipSegment().isBeingCarried)
      return false;

    var x1 = this.getTipSegment().m_x;
    var y1 = this.getTipSegment().m_y;
    var d = this.getTipSegment().m_length * 0.5 + b.radius;

    return circleLineIntersect(this.getTipSegment().m_x, this.getTipSegment().m_y, this.m_tipX, this.m_tipY, b.x, b.y, b.radius);
  }

  this.isBeingCarried = function()
  {
    return this.getTipSegment().isBeingCarried;
  }

  this.getTipSegment = function()
  {
    return this.m_segments[this.m_segments.length-1];
  }
};

function Spider()
{
  this.tipCount = 8;
  this.m_legs = new Array(this.tipCount);
  this.x = width / 2;
  this.y = height - DPI(230);
     
  this.webStrand = new PIXI.Graphics(); 
  var lineWidth = DPI(5);
  this.webStrand.beginFill(0xFFFFFF);
  this.webStrand.lineStyle(lineWidth, PIXI.utils.rgb2hex([192 / 255, 224 / 255, 192 / 255]), 0.5);
  this.webStrand.moveTo(this.x, 0);
  this.webStrand.lineTo(this.x, 1);
  this.webStrand.endFill();  
  this.webStrand.cacheAsBitmap = true;

  the_scenes[PLAY_STATE].addChild(this.webStrand);
  
  this.butt = new PIXI.Sprite(the_body0Image);
  this.butt.anchor.set(0.5);
  the_scenes[PLAY_STATE].addChild(this.butt);
 
  this.m_legs[6] = new Leg(this.x+DPI(68), this.y - DPI(30), -QUARTER_PI, DPI(98), this.y);
  this.m_legs[7] = new Leg(this.x-DPI(68), this.y - DPI(30), PI + QUARTER_PI, DPI(98), this.y);  
    
  drawGradient(0, width, 0, height, 64.0 / 256.0, the_scenes[3]); 
  
  this.body = new PIXI.Sprite(the_body1Image);
  this.body.anchor.set(0.5);  

  this.m_legs[4] = new Leg(this.x+DPI(65), this.y - DPI(20), -QUARTER_PI * 0.65, DPI(90), this.y);
  this.m_legs[5] = new Leg(this.x-DPI(65), this.y - DPI(20), PI + QUARTER_PI * 0.65, DPI(90), this.y); 
    
  the_scenes[PLAY_STATE].addChild(this.body);
        
  gradient = drawGradient(0, width, 0, height, 48.0 / 256.0, the_scenes[3]);
  gradient.alpha = 1.0;
  
  var h =  DPI(800) / the_grassSprite.width * the_grassSprite.height;
    
  the_grassSprite.x = 0;
  the_grassSprite.y = height - h + DPI(4);
  the_grassSprite.width = width;
  the_grassSprite.height = h;
  the_scenes[PLAY_STATE].addChild(the_grassSprite);
 
  this.m_legs[3] = new Leg(this.x-DPI(60), this.y - DPI(10), PI + QUARTER_PI * 0.33, DPI(84), this.y); 
  this.m_legs[0] = new Leg(this.x-DPI(50), this.y, PI, DPI(80), this.y);    
  
  this.m_legs[2] = new Leg(this.x+DPI(60), this.y - DPI(10), -QUARTER_PI * 0.33, DPI(84), this.y);
  this.m_legs[1] = new Leg(this.x+DPI(50), this.y, 0, DPI(80), this.y);
  
  this.head = new PIXI.Sprite(the_headNormalImage);
  this.head.anchor.set(0.5);
  the_scenes[PLAY_STATE].addChild(this.head);
  
  this.mandibleTopLayer = new PIXI.extras.AnimatedSprite(the_mandibleEatingTextures);
  this.mandibleTopLayer.anchor.set(0.5);
  this.mandibleTopLayer.animationSpeed = 0.2;
  this.mandibleTopLayer.play();
  this.mandibleTopLayer.visible = false;
  
  this.mandible = new PIXI.Sprite(the_mandibleNormalTextures[0]);
  this.mandible.anchor.set(0.5);
  the_scenes[PLAY_STATE].addChild(this.mandible);
   
  this.setup = function()
  {
    this.buttDirection = -0.01;
    this.buttOffset = 0;
    this.buttExploding = true;
    this.y = 0;
    
    for (var i=0; i < this.m_legs.length; i++)
    {
      this.m_legs[i].setup();
    }
  }
  
  this.setup();
    
  this.remove = function()
  {
    // Probably dont need to remove all these but easier than resetting for now
    the_scenes[PLAY_STATE].removeChild(this.webStrand);
    the_scenes[PLAY_STATE].removeChild(this.butt);
    the_scenes[PLAY_STATE].removeChild(this.body);
    the_scenes[PLAY_STATE].removeChild(this.head);
    the_scenes[PLAY_STATE].removeChild(this.mandibleTopLayer);
    the_scenes[PLAY_STATE].removeChild(this.mandible);
    the_scenes[PLAY_STATE].removeChild(the_grassSprite);
    
    for (var i=0; i < this.m_legs.length; i++)
    {
      for (var j = 0; j < this.m_legs[i].m_segments.length; j++)
      {
        the_scenes[PLAY_STATE].removeChild(this.m_legs[i].m_segments[j].m_img);
      }    
      the_scenes[PLAY_STATE].removeChild(this.m_legs[i].getTipSegment().m_drip);
    }
  }
  
  this.draw = function()  
  {
    if (this.buttExploding)
    {
      if (this.y >= height - DPI(230))
      {
        this.y = height - DPI(230);
        this.buttExploding = false;
        this.butt.visible = false; 
        this.buttOffset = 0;
        this.buttDirection = -0.01;
        for (var i = 0; i < BABBY_COUNT; i++)
        {
          the_babbySpiders[i] = new BabbySpider();
        }
        
        the_blood = new ParticleSystem();
          
        // make sure mandible animation renders on top of babbies
        the_scenes[PLAY_STATE].addChild(this.mandibleTopLayer);
      } 
      else
      {
        this.y += 5;
      }
    }  

    if (this.tipCount < 2)
      this.head.texture = the_headPainImage;
    else if (this.tipCount < 5)
      this.head.texture = the_headAngryImage;
    else if (this.tipCount < 7)
      this.head.texture = the_headAnnoyedImage;

    this.buttOffset += this.buttDirection;

    if (this.buttOffset > 0.6 || this.buttOffset < -0.6)
      this.buttDirection = -this.buttDirection;
    this.y += this.buttOffset;

    this.m_legs[0].m_segments[0].m_x = this.x-DPI(50);
    this.m_legs[0].m_segments[0].m_y = this.y; 
    this.m_legs[3].m_segments[0].m_x = this.x-DPI(60);
    this.m_legs[3].m_segments[0].m_y = this.y-DPI(10);   
    this.m_legs[5].m_segments[0].m_x = this.x-DPI(65);
    this.m_legs[5].m_segments[0].m_y = this.y-DPI(20);
    this.m_legs[7].m_segments[0].m_x = this.x-DPI(68);
    this.m_legs[7].m_segments[0].m_y = this.y-DPI(30);

    this.m_legs[1].m_segments[0].m_x = this.x+DPI(50);
    this.m_legs[1].m_segments[0].m_y = this.y; 
    this.m_legs[2].m_segments[0].m_x = this.x+DPI(60);
    this.m_legs[2].m_segments[0].m_y = this.y-DPI(10);   
    this.m_legs[4].m_segments[0].m_x = this.x+DPI(65);
    this.m_legs[4].m_segments[0].m_y = this.y-DPI(20);
    this.m_legs[6].m_segments[0].m_x = this.x+DPI(68);
    this.m_legs[6].m_segments[0].m_y = this.y-DPI(30);

    var explodeOffset = 0;
    if (this.buttExploding)
    {
      explodeOffset = DPI(-100);

      this.butt.x = this.x;
      this.butt.y = this.y - DPI(80) + explodeOffset;
      var s = DPI(0.2 + noise(this.y * 0.5 * 0.01));
      this.butt.scale.set(s);
    }
    
    for (var i=this.m_legs.length-1; i >= 0; i--)
    {
      for (var j=0; j < this.m_legs[i].m_segments.length; j++)
      {
        this.m_legs[i].reach(j);

        if (this.m_legs[i].m_buttons[j] != 0)
        {
          if (j == 0)
            this.m_legs[i].curlUp(j);
          else
            this.m_legs[i].curlDown(j);
        } 
        else
        {
          if (j == 0)
            this.m_legs[i].curlDown(j);
          else
            this.m_legs[i].curlUp(j);
        }
      }
      this.m_legs[i].draw();
    }
    
    this.webStrand.scale.y = this.y;
    
    this.body.x = this.x;
    this.body.y = this.y-DPI(50);

    this.head.x = this.x;
    this.head.y = this.y;
    this.mandible.x = this.x;
    this.mandible.y = this.y;
    this.mandibleTopLayer.x = this.x;
    this.mandibleTopLayer.y = this.y;

    // draw separated segments last
    for (var i=this.m_legs.length-1; i >= 0; i--)
    {
      for (var j = 0; j < this.m_legs[i].m_segments.length; j++)
      {
        if (this.m_legs[i].m_segments[j].isBeingCarried)
          this.m_legs[i].m_segments[j].draw(this.m_legs[i].m_isLeft);
      }
    }
  }
};