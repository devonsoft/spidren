var MENU_STATE_00 = 0;
var MENU_STATE_01 = 1;
var MENU_STATE_02 = 2;

var PLAY_STATE = 3;
var GAMEOVER_STATE = 4;
var WIN_STATE = 5;
var the_scenes = new Array(4);

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
var the_babbyWalkTextures = [];
var the_babbyDeadTextures = [];
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

var the_scale = 2.0;

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


app.stop();
var loader = PIXI.loader;

loader.add('babbySpritesheet', 'babby.json');
loader.add('grass', 'grass.png');
loader.add('keyboard', 'keyboard.png');
loader.add('body0', 'body0.png');
loader.add('body1', 'body1.png');
loader.add('head', 'head.png');
loader.add('leg0', 'leg0.png');
loader.add('leg1', 'leg1.png');
loader.add('leg2', 'leg2.png');
loader.add('mandible', 'mandible.png');
  
loader.load(function(loader, resources)
{
    var i;
    the_keyboardImage = new PIXI.Sprite(resources.keyboard.texture);
    the_grass = new PIXI.Sprite(resources.grass.texture);
    the_body0Image = new PIXI.Sprite(resources.body0.texture);
    the_body1Image = new PIXI.Sprite(resources.body1.texture);
    the_headImage = new PIXI.Sprite(resources.head.texture);
    the_leg0Image = new PIXI.Sprite(resources.leg0.texture);
    the_leg1Image = new PIXI.Sprite(resources.leg1.texture);
    the_leg2Image = new PIXI.Sprite(resources.leg2.texture);
    the_mandibleImage = new PIXI.Sprite(resources.mandible.texture);
  
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
    setup();
    app.start();
});

function gameStart()
{
  the_transitionTimer = 2;
  the_gameState = PLAY_STATE;
  //stroke(255, 100);
  //the_spider = new Spider();
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
    the_gameState = PLAY_STATE;
    the_doOnce = true;
  }
  
  /*if (the_fullscreenIcon)
  {
    the_fullscreenIcon.setFullscreen();
  }*/
}

var pkeys=[];
window.onkeydown = function (e) 
{
    var code = e.keyCode ? e.keyCode : e.which;
    pkeys[code]=true;

}
window.onkeyup = function (e) 
{
  var code = e.keyCode ? e.keyCode : e.which;
  pkeys[code]=false;
};

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

  the_ground = height-DPI(35);
  //the_grass = requestImage("grass.png");
  the_font = "Amatic SC Regular";
  
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
  
  // Play State
  the_scenes[3] = new PIXI.Container();
  
  var h =  width / the_grass.width * the_grass.height;
  the_grass.x = 0;
  the_grass.y = height - h// + DPI(8);
  the_grass.width = width;
  the_grass.height = h;
  the_scenes[3].addChild(the_grass);
  the_scenes[3].update = function(delta)
  {
    if (the_doOnce)
    {
      gameStart();
      the_doOnce = false;
      
      for (var i = 0; i < the_babbySpiders.length; i++)
      {
        the_babbySpiders[i] = new BabbySpider();
        this.addChild(the_babbySpiders[i].sprite);
      }
    }

    var deadBabbyCount = 0;
    for (var i = the_babbySpiders.length-1; i >= 0 /* && !the_spider.buttExploding*/; i--)
    {
      the_babbySpiders[i].update();
      if (the_babbySpiders[i].isDead)
        deadBabbyCount += 1;
    }    
    /*for (var i = 1; i < this.children.length; i++)
    {
      this.children[i].update(delta);
    }*/   
  }
   
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

function distSQ(x1, y1, x2, y2)
{
  var dx = x1 - x2;
  var dy = y1 - y2;
  return dx * dx + dy * dy;
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
    var mu = (-b +sqrt(b*b - 4*a*c)) / (2*a);
    var ix1 = x1 + mu*(dx);
    var iy1 = y1 + mu*(dy);
    mu = (-b - sqrt(b*b - 4*a*c)) / (2*a);
    var ix2 = x1 + mu*(dx);
    var iy2 = y1 + mu*(dy);

    var testX;
    var testY;
    if (dist(x1, y1, cx, cy) < dist(x2, y2, cx, cy))
    {
      testX = x2;
      testY = y2;
    } else
    {
      testX = x1;
      testY = y1;
    }
    if (dist(testX, testY, ix1, iy1) < dist(x1, y1, x2, y2) || dist(testX, testY, ix2, iy2) < dist(x1, y1, x2, y2))
    {
      return true;
    } else
      return false;
  }
}

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

  if (the_spider)
  {    
    this.x = the_spider.x;
    this.y = the_spider.y - DPI(150);
  }
  //this.blood = new ParticleSystem(createVector(width/2, 50));
  if (random(1) > 0.5)
    this.velocity = createVector((random(-8, -4)), (random(-4, 0)));
  else
    this.velocity = createVector((random(4, 8)), (random(-4, 0)));
  this.normalSpeed = (random(3.0, 8.0));

  //PIXI.Sprite.call(this, the_babbyWalkTextures);  
  this.sprite = new PIXI.extras.AnimatedSprite(the_babbyWalkTextures);//new AnimatedSprite(the_babbyImage, 100, 72);
  this.sprite.anchor.set(0.5);
  this.sprite.animationSpeed = 0.2;
  this.sprite.play();
  
  this.update = function(delta)
  {         
    if (this.isDead || this.isSpawning)
    { 
      if (this.y >= the_ground - this.radius)
      {
        this.y = the_ground - this.radius;
        this.speed = this.normalSpeed;
        this.isSpawning = false;
      } else
      {
        this.velocity.y += (0.08);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
    } else if (this.isClimbing)
    {
      if (this.stabLeg != null)
      {
        var tempDirection = createVector(
          this.stabLeg.m_segments[2].m_x - this.x, 
          this.stabLeg.m_segments[2].m_y - this.y);

        strokeWeight(2);
        stroke(192, 224, 192, 192);
        line(this.x, this.y, this.stabLeg.m_segments[2].m_x, this.stabLeg.m_segments[2].m_y);

        var magnitude = tempDirection.mag();

        if (abs(tempDirection.x) > DPI(200))
        {
          this.isClimbing = false;
        } else
        {
          tempDirection.div(magnitude);
          this.y += tempDirection.y * this.speed;
          this.x += tempDirection.x * this.speed;
        }
        this.velocity.y = 0;
      }
    } else if (this.isStabbed)
    {
      if (this.stabLeg != null)
      {
        this.x = this.stabLeg.m_tipX;
        this.y = this.stabLeg.m_tipY;

        //this.blood.origin = createVector(this.x, this.y);
        if (dist(this.x, this.y, the_spider.x, the_spider.y + DPI(50)) < this.radius * 3)
        {
          the_spider.mandible.setAnimation(1, 3, true);
          //this.blood.addParticle();
          this.health -= 0.02;
        } 
        else
          the_spider.mandible.setAnimation(0, 0, true);
      }
    } else if (this.isThrowing)
    {
      if (this.carriedSegment != null)
      {
        this.carriedSegment.m_y -= this.speed;
        if (this.carriedSegment.m_y < (the_spider.y + this.carriedSegment.m_length))
        {
          this.carriedSegment.m_isDripping = true;
          this.carriedSegment.m_dripY = this.carriedSegment.m_y - this.carriedSegment.m_length;
          this.carriedSegment = null;
          this.isThrowing = false;
          the_spider.tipCount -= 1;
          if (the_spider.tipCount <= 0)
            the_gameState = GAMEOVER_STATE;
        }
      }
    } else if (this.isFeeding)
    {
      if (this.carriedSegment == null)
      {
        var tempDirection = createVector(
          this.stabLeg.m_segments[2].m_x - this.x, 
          this.stabLeg.m_segments[2].m_y - this.y);
        var magnitude = tempDirection.mag();

        tempDirection.div(magnitude);
        this.y += tempDirection.y * this.speed;
        this.x += tempDirection.x * this.speed;
      }
      this.speed = this.normalSpeed;
    } else
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
      } else if (this.x < this.radius)
      {
        this.direction.x = -this.direction.x;
        this.x = this.radius;
      }
    }

    if (this.isDead)
      this.textures = the_babbyDeadTextures;

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
      //the_spider.mandible.setAnimation(0, 0, true);
    }
    //this.blood.run();
  }
};

  
function LegSegment(startAngle, minAngle, maxAngle, xx, yy, seglength, index, img)
{
  this.m_isReaching = false;
  this.m_prev = null;
  this.isBeingCarried = false;
  this.m_isDripping = false;

  this.m_x = xx;
  this.m_y = yy;
  this.m_startAngle = startAngle;
  this.m_angle = startAngle;
  this.m_minAngle = minAngle;
  this.m_maxAngle = maxAngle;
  this.m_length = seglength;

  this.m_img = img;

  this.m_targetX = 0;
  this.m_targetY = 0;

  this.draw = function(isLeft) 
  { 
    if (this.m_isDripping)
    {
      this.m_y += the_spider.buttOffset;
      if (this.m_dripY < the_ground)
      {
        this.m_dripY += DPI(2);
      }
      //stroke(255, 255, 255, 192);
      //strokeWeight(random(5, 15));
      //line(this.m_x, this.m_y - this.m_length, this.m_x, this.m_dripY);
    }

    this.m_img.x = this.m_x + Math.cos(this.m_angle) * (this.m_length * 0.5);
    this.m_img.y = this.m_y + Math.sin(this.m_angle) * (this.m_length * 0.5);
    this.m_img.rotation = this.m_angle;
    if (this.isLeft)
      this.m_img.scale.set(1, -1);
    this,m_img.width = this.m_length * 1.12;
    this,m_img.height = 20;
  }

  this.calculatePosition = function() 
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

    if (this.m_prev != null) 
    {
      this.m_angle = constrain(this.m_angle, this.m_prev.m_angle+this.m_startAngle+this.m_minAngle, this.m_prev.m_angle+this.m_startAngle+this.m_maxAngle);
    } 
    else
      this.m_angle = constrain(this.m_angle, this.m_startAngle+this.m_minAngle, this.m_startAngle+this.m_maxAngle);
  }

  this.isCircleOverlapping = function(cx, cy, cr)
  {
    var x2 = this.m_x + Math.cos(this.m_angle) * this.m_length;
    var y2 = this.m_y + Math.sin(this.m_angle) * this.m_length; 
    return circleLineIntersect(m_x, m_y, x2, y2, cx, cy, cr);
  }

  this.reach = function()
  {
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
  for (var i=0; i < this.m_buttons.length; i++)
  {
    this.m_buttons[i] = 0;
  }
  this.m_isLeft = true;
  this.m_isReaching = false;
  this.shouldRemoveHealth = false;
  this.m_dx = 0;
  this.m_tipX = 0;
  this.m_tipY = 0;
  this.health = 1.0;
  this.stabbedBabby = null;

  var heightChange = height - DPI(360);
  var offset = ((parentY - heightChange) / (startY - heightChange));

  if (startAngle > HALF_PI)
  {
    this.m_segments[0] = new LegSegment(startAngle, -QUARTER_PI, QUARTER_PI, startX, startY, startLength, 0, the_leg0Image);
    this.m_segments[1] = new LegSegment(-QUARTER_PI* offset, -QUARTER_PI * offset, 0, 0, 0, startLength * offset, 1, the_leg1Image);
    this.m_segments[2] = new LegSegment(-QUARTER_PI* offset, -QUARTER_PI * offset, 0, 0, 0, startLength * offset, 2, the_leg2Image);
    this.m_isLeft = true;
  } else
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
  //}

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
      this.m_segments[i].calculatePosition();

    for (var i = 0; i < this.m_segments.length; i++)
    {
      if (this.shouldRemoveHealth && i == 2)
      {
        this.health -= 0.04; // .02
        this.shouldRemoveHealth = false;

        if (frameCount % 2 == 0)
          this.m_segments[i].m_img.blendMode = PIXI.BLEND_MODES.ADD;
        else
          this.m_segments[i].m_img.blendMode = PIXI.BLEND_MODES.NORMAL;
          
        this.m_segments[i].draw(this.m_isLeft);

        //if (frameCount % 2 == 0)
        //  this.m_segments[i].m_img.filter(INVERT);
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
  }

  this.reach = function(i)
  {
    if (i ==this.m_segments.length-1)
    {
      if (this.m_buttons[2] == 1 
        && this.m_buttons[1] == 2 && this.m_buttons[0] == 2)
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
      this.m_segments[i].curl((i+1) * 0.2); // maybe 0.1
    else
      this.m_segments[i].curl((i+1) * -0.2);
  }

  this.curlDown = function(i)
  {
    if (this.m_isReaching)
      return;

    if (this.m_isLeft)
      this.m_segments[i].curl((i+1) * -0.2);
    else
      this.m_segments[i].curl((i+1) * 0.2);
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
  this.buttDirection = -0.01;
  this.buttOffset = 0;
  this.buttExploding = true;

  this.m_legs[0] = new Leg(this.x-50, this.y, PI, 80, this.y);    
  this.m_legs[3] = new Leg(this.x-60, this.y - 10, PI + QUARTER_PI * 0.33, 84, this.y);
  this.m_legs[5] = new Leg(this.x-65, this.y - 20, PI + QUARTER_PI * 0.65, 90, this.y); 
  this.m_legs[7] = new Leg(this.x-68, this.y - 30, PI + QUARTER_PI, 98, this.y);  

  this.m_legs[1] = new Leg(this.x+50, this.y, 0, 80, this.y);
  this.m_legs[2] = new Leg(this.x+60, this.y - 10, -QUARTER_PI * 0.33, 84, this.y);
  this.m_legs[4] = new Leg(this.x+65, this.y - 20, -QUARTER_PI * 0.65, 90, this.y);
  this.m_legs[6] = new Leg(this.x+68, this.y - 30, -QUARTER_PI, 98, this.y);

  this.head = new AnimatedSprite(the_headImage, 242, 242);
  this.mandible = new AnimatedSprite(the_mandibleImage, 242, 242);
  this.body = the_body1Image;
  this.butt = the_body0Image;
  this.y = 0;


  this.draw = function()  
  {
    if (this.buttExploding)
    {
      if (this.y >= height - DPI(230))
      {
        this.y = height - DPI(230);
        this.buttExploding = false;
        this.buttOffset = 0;
        this.buttDirection = -0.01;
        for (var i = 0; i < the_babbySpiders.length; i++)
        {
          the_babbySpiders[i] = new BabbySpider();
        }
      } else
      {
        this.y += 5;
      }
    }  

    if (this.tipCount < 2)
      this.head.setAnimation(3, 3, false);
    else if (this.tipCount < 5)
      this.head.setAnimation(2, 2, false);
    else if (this.tipCount < 7)
      this.head.setAnimation(1, 1, false);

    this.buttOffset += this.buttDirection;

    if (this.buttOffset > 0.6 || this.buttOffset < -0.6)
      this.buttDirection = -this.buttDirection;
    this.y += this.buttOffset;

    noFill();
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

    //strokeWeight(5);
    //stroke(192, 224, 192, 192);
    //line(this.x, 0, this.x, this.y);

    var explodeOffset = 0;
    if (this.buttExploding)
    {
      explodeOffset = DPI(-100);

      this.butt.x = this.x;
      this.butt.y = this.y - DPI(80) + explodeOffset;
      //var s = 0.45;
      //if (this.buttExploding)
      var s = DPI(0.2 + noise(this.y * 0.01));
      this.butt.scale.set(s, s);
    }


    for (var i=this.m_legs.length-1; i >= 0; i--)
    {
      for (var j=0; j < this.m_legs[i].m_segments.length; j++)
      {
        if (this.m_legs[i].m_buttons[2] != 0)
          this.m_legs[i].reach(j);

        if (this.m_legs[i].m_buttons[j] != 0)
        {
          if (j == 0)
            this.m_legs[i].curlUp(j);
          else
            this.m_legs[i].curlDown(j);
        } else
        {
          if (j == 0)
            this.m_legs[i].curlDown(j);
          else
            this.m_legs[i].curlUp(j);
        }
      }

      var divisor = 1;
      if (i > 3)
        divisor = 2;

      var amount = 255 / divisor;

      var offset = 128;
      if (this.buttExploding)
        offset = 0;

      if (i == 3)
      {
        drawGradient(96, width - 96, offset, height, 48);
      }
      if (i == 5)
      {
        drawGradient(96, width - 96, offset, height, 64); 

        push();
        translate(this.x, this.y-50);
        scale(0.5, 0.5);
        image(this.body, 0, 0);
        pop();
      }

      this.m_legs[i].draw();
    }

    this.head.x = this.x;
    this.head.y = this.y;
    //scale(0.5, 0.5);
    //this.head.draw();
    //if (this.mandible.startFrame != 1)
    //  this.mandible.draw();

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