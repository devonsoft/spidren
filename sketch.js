var MENU_STATE_00 = 0;
var MENU_STATE_01 = 1;
var MENU_STATE_02 = 2;

var PLAY_STATE = 3;
var GAMEOVER_STATE = 4;
var WIN_STATE = 5;

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

function preload() 
{
  the_grass = loadImage("grass.png");
  the_keyboardImage = loadImage("keyboard.png");
  the_pink = loadImage("background.png"); 
  the_font = loadFont("AmaticSC-Regular.ttf");
  the_babbyImage = loadImage("babby.png");
  the_body0Image = loadImage("body0.png");
  the_body1Image = loadImage("body1.png");
  the_headImage = loadImage("head.png");
  the_leg0Image = loadImage("leg0.png");
  the_leg1Image = loadImage("leg1.png");
  the_leg2Image = loadImage("leg2.png");
  the_mandibleImage = loadImage("mandible.png");
}

function scaleToWindow()
{ 
  var aspectCorrectScale = window.innerWidth / 800.0;
  var heightScale = window.innerHeight / 600.0;
  if (heightScale < aspectCorrectScale)
    aspectCorrectScale = heightScale;

  document.getElementById("defaultCanvas0").style.width = 800.0 * aspectCorrectScale;
  document.getElementById("defaultCanvas0").style.height = 600.0 * aspectCorrectScale;
  document.getElementById("defaultCanvas0").style.marginLeft = "auto";
  document.getElementById("defaultCanvas0").style.marginRight = "auto";
}

window.onresize = function() 
{ 
  scaleToWindow();
}

function gameStart()
{
  the_transitionTimer = 2;
  the_gameState = PLAY_STATE;
  stroke(255, 100);
  the_spider = new Spider();
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
  the_canvas = createCanvas(800, 600);
  scaleToWindow();
  
  the_fullscreenIcon = new FullscreenIcon(width - 20, height - 20, 12);
  
  frameRate(30);
  the_ground = height-35;
  //the_grass = requestImage("grass.png");
  //the_font = createFont("Amatic SC Regular", 32);
  //the_keyboardImage = requestImage("keyboard.png");
  //the_pink = requestImage("background.png");
}

function draw() 
{
  //push();
  //scale((width / 800.0), (width / 800.0));
  if (the_gameState == MENU_STATE_00)
  {
    drawGradient(0, width, 0, height, 120);
    textFont(the_font);
    textAlign(CENTER, CENTER);
    textSize(128);
    fill("#3a0e05");
    text("SPIDREN", width/2 + random(-5, 5), height/2 + random(-5, 5));
    textSize(64);
    text("@devonsoft", width/2 + random(-5, 5), height/2 + random(-5, 5) + 100);
  } 
  else if (the_gameState == MENU_STATE_01)
  {
    drawGradient(0, width, 0, height, 255);
    if (the_keyboardImage.width > 0)
    {
      imageMode(CORNER);
      image(the_keyboardImage, 0, 0, width, height);
    }
  } 
  else if (the_gameState == MENU_STATE_02)
  {
    drawGradient(0, width, 0, height, 255);
    textFont(the_font);
    textAlign(CENTER, CENTER);
    textSize(128);
    fill("#3a0e05");
    textSize(64);
    text("FOCUS ON ONE LEG AT A TIME (R + D, C)", width/2 + random(-5, 5), height/2 + random(-5, 5));
    textSize(32);
    text("most keyboards do not allow enough simultaneous keys for more than one leg", width/2, height/2 + 50);
  } 
  else if (the_gameState == PLAY_STATE)
  {
    if (the_doOnce)
    {
      gameStart();
      the_doOnce = false;
    }
    push();
    translate(random(-the_screen_offset, the_screen_offset), random(-the_screen_offset, the_screen_offset));
    drawGradient(0, width, 0, height, 255);

    the_spider.draw();
    var deadBabbyCount = 0;
    for (var i = the_babbySpiders.length-1; i >= 0 && !the_spider.buttExploding; i--)
    {
      the_babbySpiders[i].draw();
      if (the_babbySpiders[i].isDead)
        deadBabbyCount += 1;
    }
    if (deadBabbyCount >= BABBY_COUNT)
    {
      the_gameState = WIN_STATE;

      if (BABBY_COUNT < 3)
        BABBY_COUNT += 1;
      else if (BABBY_COUNT < 7)
        BABBY_COUNT += 2;
      else if (BABBY_COUNT >= 7)
        BABBY_COUNT *= 2;
      the_babbySpiders = new Array(BABBY_COUNT);
    } else
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

          /*if (!isOverlapping && the_spider.tipCount == 1 && !babby.isStabbed && dist(babby.x, babby.y, leg.m_segments[2].m_x, leg.m_segments[2].m_y) < babby.radius * 3)
           {
           isOverlapping = true;
           }
           else
           println("not dist" + frameCount);*/

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
            } else if (babby.speed <= babby.normalSpeed ||  the_spider.tipCount == 1)
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

                //leg.health -= 0.02;
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
                leg.getTipSegment().m_angle = -HALF_PI;
              }
            }
          } else if (leg.m_isReaching && leg.stabbedBabby == null && leg.getTipSegment().isBeingCarried == false)
          {
            isOverlapping = dist(leg.m_tipX, leg.m_tipY, babby.x, babby.y) < babby.radius * 2;
            if (isOverlapping)
            {
              babby.isStabbed = true;
              babby.isClimbing = false;
              if (babby.carriedSegment != null)
              {
                babby.carriedSegment.isBeingCarried = false;
              }
              babby.stabLeg = leg;
              leg.stabbedBabby = babby;
            }
          } else if (the_spider.tipCount == 1 && !babby.isFeeding && !babby.isStabbed)
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
    imageMode(CORNER);
    if (the_grass.width > 0)
    {
      var h =  float(width) / float(the_grass.width) * the_grass.height;
      image(the_grass, 0, height - h + 8, width, h);
    }

    imageMode(CENTER);
    push();
    translate(the_spider.x, the_spider.y);
    scale(0.5, 0.5);
    if (the_spider.mandible.startFrame == 1)
      the_spider.mandible.draw();
    pop();

    the_screenShakeTimer -= 1 / 30.0;
    //print(the_screenShakeTimer);
    if (the_screenShakeTimer > 0)
    {
      //imageMode(CENTER);
      the_screen_offset = 20.0 * the_screenShakeTimer;
      //print(offset);
      //the_screen = get(0, 0, 45, 45);
      //image(the_screen, width/2 +random(-offset, offset), height/2+random(-offset, offset));
    } else
      the_screen_offset = 0.0;
    pop();
  } else if (the_gameState == GAMEOVER_STATE)
  {
    the_transitionTimer -= 1 / 30.0;
    if (the_transitionTimer > 0)
    {
      drawGradient(0, width, 0, height, 10);
    } else
    {
      drawGradient(0, width, 0, height, 120);
      textFont(the_font);
      textAlign(CENTER, CENTER);
      textSize(80);
      fill("#3a0e05");

      text("THE CHILD BECOMES THE PARENT", width/2 + random(-5, 5), height/2 + random(-5, 5));
    }
  } else if (the_gameState == WIN_STATE)
  {
    the_transitionTimer -= 1 / 30.0;
    if (the_transitionTimer > 0)
    {
      drawGradient(0, width, 0, height, 10);
    } else
    {
      drawGradient(0, width, 0, height, 120);
      textFont(the_font);
      textAlign(CENTER, CENTER);
      textSize(80);
      fill("#3a0e05");
      text("YOU CAN BREED AGAIN", width/2 + random(-5, 5), height/2 + random(-5, 5));
    }
  }
  
  the_fullscreenIcon.draw();
  
  /*textFont("Arial");
  textAlign(RIGHT, TOP);
  textSize(80);
  fill(255, 255, 255);

  text(int(frameRate()), width - 12, 0);*/
  //pop();
}

function mouseReleased()
{
  if (the_gameState < PLAY_STATE)
  {
    the_gameState++;
  } else if (the_gameState > PLAY_STATE && the_transitionTimer <= 0)
  {
    the_gameState = PLAY_STATE;
    the_doOnce = true;
  }
  
  if (the_fullscreenIcon)
  {
    the_fullscreenIcon.setFullscreen();
  }
}

function keyPressed()
{
  if (the_gameState < PLAY_STATE)
  {
    return;
  } else if (the_gameState > PLAY_STATE)
  {
    return;
  }
  //print(key);

  if (key == 't' || key == 'T')
    the_spider.m_legs[0].pressBkeyutton(0);
  else if (key == 'f' || key == 'F')
    the_spider.m_legs[0].pressButton(1); 
  else if (key == 'v' || key == 'V')
    the_spider.m_legs[0].pressButton(2);

  else if (key == 'y' || key == 'Y')
    the_spider.m_legs[1].pressButton(0);
  else if (key == 'j' || key == 'J')
    the_spider.m_legs[1].pressButton(1);
  else if (key == 'n' || key == 'N')
    the_spider.m_legs[1].pressButton(2);

  else if (key == 'u' || key == 'U')
    the_spider.m_legs[2].pressButton(0);
  else if (key == 'k' || key == 'K')
    the_spider.m_legs[2].pressButton(1);
  else if (key == 'm' || key == 'M')
    the_spider.m_legs[2].pressButton(2);

  else if (key == 'r' || key == 'R')
    the_spider.m_legs[3].pressButton(0);
  else if (key == 'd' || key == 'D')
    the_spider.m_legs[3].pressButton(1);
  else if (key == 'c' || key == 'C')
    the_spider.m_legs[3].pressButton(2);

  else if (key == 'i' || key == 'I')
    the_spider.m_legs[4].pressButton(0);
  else if (key == 'l' || key == 'L')
    the_spider.m_legs[4].pressButton(1);
  else if (key == ',' || key == '<' || key == '¼')
    the_spider.m_legs[4].pressButton(2);

  else if (key == 'e' || key == 'E')
    the_spider.m_legs[5].pressButton(0);
  else if (key == 's' || key == 'S')
    the_spider.m_legs[5].pressButton(1);
  else if (key == 'x' || key == 'X')
    the_spider.m_legs[5].pressButton(2);

  else if (key == 'o' || key == 'O')
    the_spider.m_legs[6].pressButton(0);
  else if (key == ';' || key == ':')
    the_spider.m_legs[6].pressButton(1);
  else if (key == '.' || key == '>' || key == '¾')
    the_spider.m_legs[6].pressButton(2);

  else if (key == 'w' || key == 'W')
    the_spider.m_legs[7].pressButton(0);
  else if (key == 'a' || key == 'A')
    the_spider.m_legs[7].pressButton(1);
  else if (key == 'z' || key == 'Z')
    the_spider.m_legs[7].pressButton(2);
    
}

function keyReleased()
{
  if (the_gameState < PLAY_STATE)
  {
    the_gameState++;
    return;
  } else if (the_gameState > PLAY_STATE && the_transitionTimer <= 0)
  {
    the_gameState = PLAY_STATE;
    the_doOnce = true;
    return;
  }

  if (key == 't' || key == 'T')
    the_spider.m_legs[0].m_buttons[0] = 0;
  else if (key == 'f' || key == 'F')
    the_spider.m_legs[0].m_buttons[1]  = 0;
  else if (key == 'v' || key == 'V')
  {
    the_spider.m_legs[0].m_buttons[2]  = 0;
    the_spider.m_legs[0].m_isReaching = false;
  } else if (key == 'y' || key == 'Y')
    the_spider.m_legs[1].m_buttons[0] = 0;
  else if (key == 'j' || key == 'J')
    the_spider.m_legs[1].m_buttons[1]  = 0;
  else if (key == 'n' || key == 'N')
  {
    the_spider.m_legs[1].m_buttons[2]  = 0;
    the_spider.m_legs[1].m_isReaching = false;
  } else if (key == 'u' || key == 'U')
    the_spider.m_legs[2].m_buttons[0] = 0;
  else if (key == 'k' || key == 'K')
    the_spider.m_legs[2].m_buttons[1]  = 0;
  else if (key == 'm' || key == 'M')
  {
    the_spider.m_legs[2].m_buttons[2]  = 0;
    the_spider.m_legs[2].m_isReaching = false;
  } else if (key == 'r' || key == 'R')
    the_spider.m_legs[3].m_buttons[0] = 0;
  else if (key == 'd' || key == 'D')
    the_spider.m_legs[3].m_buttons[1]  = 0;
  else if (key == 'c' || key == 'C')
  {
    the_spider.m_legs[3].m_buttons[2]  = 0;
    the_spider.m_legs[3].m_isReaching = false;
  } else if (key == 'i' || key == 'I')
    the_spider.m_legs[4].m_buttons[0] = 0;
  else if (key == 'l' || key == 'L')
    the_spider.m_legs[4].m_buttons[1] = 0;
  else if (key == ',' || key == '<' || key == '¼')
  {
    the_spider.m_legs[4].m_buttons[2]  = 0;
    the_spider.m_legs[4].m_isReaching = false;
  } else if (key == 'e' || key == 'E')
    the_spider.m_legs[5].m_buttons[0] = 0;
  else if (key == 's' || key == 'S')
    the_spider.m_legs[5].m_buttons[1] = 0;
  else if (key == 'x' || key == 'X')
  {
    the_spider.m_legs[5].m_buttons[2]  = 0;
    the_spider.m_legs[5].m_isReaching = false;
  } else if (key == 'o' || key == 'O')
    the_spider.m_legs[6].m_buttons[0] = 0;
  else if (key == ';' || key == ':')
    the_spider.m_legs[6].m_buttons[1] = 0;
  else if (key == '.' || key == '>' || key == '¾')
  {
    the_spider.m_legs[6].m_buttons[2]  = 0;
    the_spider.m_legs[6].m_isReaching = false;
  } else if (key == 'w' || key == 'W')
    the_spider.m_legs[7].m_buttons[0] = 0;
  else if (key == 'a' || key == 'A')
    the_spider.m_legs[7].m_buttons[1] = 0;
  else if (key == 'z' || key == 'Z')
  {
    the_spider.m_legs[7].m_buttons[2]  = 0;
    the_spider.m_legs[7].m_isReaching = false;
  }
  else if (keyCode == 122)
  {
    /*var isFullscreen = fullscreen();
    print("doin it");
    print(isFullscreen);
    fullscreen(!isFullscreen);
    if (isFullscreen)
      the_fullscreenIcon.isFullscreen = true;
    else
      the_fullscreenIcon.isFullscreen = false;*/
    /*var elem = document.getElementById("defaultCanvas0");
    if (elem.requestFullscreen) 
    {
      elem.requestFullscreen();
    }*/
  }
}

function drawGradient(left, right, top, bottom, alpha)
{
  if (the_pink.width > 0)
  {
    imageMode(CORNER);
    tint(255, 255, 255, alpha);
    image(the_pink, 0, 0, width, height);
    noTint();
    imageMode(CENTER);
  }
  /*
  var lineWidth = 8;
  strokeWeight(lineWidth);
  var r;
  var g;
  var b;
   for (var i = top; i < bottom; i += lineWidth)
   {
   var percent = float(i) / float(height);
   percent *= 75.0;
   r = 245 + int(percent);
   r = constrain(r, 0, 255);
   g = 143 + int(percent);
   b = 143 + int(percent);
   stroke(r, g, b, alpha);
   line(left,i,right,i);
   }
   strokeWeight(0);*/
}

function FullscreenIcon(x, y, iconWidth)
{
  this.x = x;
  this.y = y;
  this.iconWidth = iconWidth;
  this.lineWidth = 2;
  this.isFullscreen = false;
  this.isHover = false;
  
  this.setFullscreen = function()
  {
    if (this.isHover)
    {
      var isFullscreen = fullscreen();
      fullscreen(!isFullscreen);
      this.isFullscreen = !isFullscreen;
    }
  }
  
  this.draw = function()
  {
    var hw = this.iconWidth / 2;
    var x = this.x;
    var y = this.y;
    
    if (mouseX < x + hw && mouseX > x - hw && mouseY < y + hw && mouseY > y - hw)
    {
      this.isHover = true;
      // Scale up by 1/3
      if (!this.isFullscreen)
        hw = (this.iconWidth * 2) / 3;
    }
    else
    {
      this.isHover = false;
      if (this.isFullscreen)
        hw = (this.iconWidth * 2) / 3;
    }
    
    
    strokeWeight(this.lineWidth);
    stroke(255, 255, 255);

    var space = (hw * 2) / 5;
    //print("hello");
    if (this.isFullscreen)
    {
      // Left
      line(x - space, y - space, x - space, y - hw);
      line(x - space, y - space, x - hw, y - space);
      line(x - space, y + space, x - space, y + hw);
      line(x - space, y + space, x - hw, y + space);
      
      // Right
      line(x + space, y - space, x + space, y - hw);
      line(x + space, y - space, x + hw, y - space);
      line(x + space, y + space, x + space, y + hw);
      line(x + space, y + space, x + hw, y + space); 
    }
    else
    {
      // Left
      line(x - hw, y - space, x - hw, y - hw);
      line(x - hw, y + space, x - hw, y + hw);
      line(x - hw, y - hw, x - space, y - hw);
      line(x - hw, y + hw, x - space, y + hw);
      
      // Right
      line(x + hw, y - space, x + hw, y - hw);
      line(x + hw, y + space, x + hw, y + hw);
      line(x + hw, y - hw, x + space, y - hw);
      line(x + hw, y + hw, x + space, y + hw);
    }
    strokeWeight(0);
  }
}

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

function AnimatedSprite(img, widthOfOneFrame, heightOfOneFrame)
{
  this.frameRow = 0;
  this.frameColumn = 0;
  this.startFrame = 0;
  this.endFrame = 0;
  this.currentFrame = 0.0;
  this.loop = true;
  this.frameSpeed = 12.0;
  this.spriteSheet = img;
  this.frameWidth = widthOfOneFrame;
  this.frameHeight = heightOfOneFrame;
  //this.img;

  this.setAnimation = function(start, end, looping)
  {
    if (start != this.startFrame || end != this.endFrame)
    {
      this.startFrame = start;
      this.endFrame = end;
      this.currentFrame = this.startFrame;
    }  

    this.loop = looping;
  }

  this.draw = function()
  {
    // Increment currentFrame by the frameRate related to current fps)
    this.currentFrame += (this.frameSpeed / frameRate());
    if (int(this.currentFrame) > this.endFrame)
    {
      if (this.loop == true)
      {
        this.currentFrame = this.startFrame;
      } else
      {
        this.currentFrame = this.endFrame;
      }
    }

    var colCount = this.spriteSheet.width / this.frameWidth;
    this.frameColumn = int(this.currentFrame);
    if (colCount > 0)
    {
      this.frameColumn = int(int(this.currentFrame % colCount));
      this.frameRow = int(this.currentFrame / colCount);
    }
    this.img = this.spriteSheet.get(
      this.frameColumn * this.frameWidth, 
      this.frameRow * this.frameHeight, 
      this.frameWidth, 
      this.frameHeight);

    image(this.img, 0, 0, this.frameWidth, this.frameHeight);
  }
};



// A simple Particle class

function Particle(l)
{
  this.acceleration = createVector(0.0, 0.2);
  this.velocity = createVector(random(-2.0, 2.0), random(-4.0, -2.0));
  this.location = l;
  this.lifespan = 255.0;
  this.radius = random(15.0, 20.0);


  this.run = function() 
  {
    this.update();
    this.display();
  }

  // Method to update location
  this.update = function() 
  {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.lifespan -= 3;
  }

  // Method to display
  this.display = function() 
  {
    fill(255, 48, 16, this.lifespan);
    noStroke();
    ellipse(this.location.x, this.location.y, this.radius * (this.lifespan / 255.0), this.radius * (this.lifespan / 255.9));
  }

  // Is the particle still useful?
  this.isDead = function()
  {
    if (this.lifespan < 0.0) 
    {
      return true;
    } else 
    {
      return false;
    }
  }
}

// A class to describe a group of Particles
function ParticleSystem(location) 
{
  this.origin = location;
  this.particles = [];

  this.addParticle = function() 
  {
    this.particles.push(new Particle(this.origin));
  }

  this.run = function() 
  {
    for (var i = this.particles.length-1; i >= 0; i--) 
    {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) 
      {
        this.particles.splice(i, 1);
      }
    }
  }
};

function BabbySpider()
{
  this.x = random(50, height - 50);
  this.y = height - 50;
  this.direction = createVector(1, 0);
  //this.velocity;
  this.speed = 4.0;
  this.normalSpeed = 4.0;
  this.radius = 15.0;
  //AnimatedSprite sprite;

  // states
  this.isSpawning = true;
  this.isFeeding = false;
  this.isThrowing = false;
  this.isStabbed = false;
  this.isClimbing = false;
  this.isDead = false;

  this.carriedSegment = null;
  this.stabLeg = null;
  //ParticleSystem blood;
  this.health = 1.0;

  if (the_spider)
  {    
    this.x = the_spider.x;
    this.y = the_spider.y - 150;
  }
  this.blood = new ParticleSystem(createVector(width/2, 50));
  if (random(1) > 0.5)
    this.velocity = createVector(random(-8, -4), random(-4, 0));
  else
    this.velocity = createVector(random(4, 8), random(-4, 0));
  this.normalSpeed = random(3.0, 8.0);
  this.sprite = new AnimatedSprite(the_babbyImage, 100, 72);
  this.sprite.setAnimation(0, 3, true);
  //sprite.frameSpeed =8;

  this.draw = function()
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
        this.velocity.y += 0.08;
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

        if (abs(tempDirection.x) > 200)
        {
          this.isClimbing = false;
        } else
        {
          tempDirection.div(magnitude);
          this.y += tempDirection.y * this.speed;
          this.x += tempDirection.x * this.speed;
        }

        /*blood.origin = new PVector(x,y);
         if (dist(x, y, the_spider.x, the_spider.y + 50) < radius * 3)
         {
         blood.addParticle();
         health -= 0.005;
         }          
         blood.run();*/

        this.velocity.y = 0;
      }
    } else if (this.isStabbed)
    {
      if (this.stabLeg != null)
      {
        this.x = this.stabLeg.m_tipX;
        this.y = this.stabLeg.m_tipY;

        this.blood.origin = createVector(this.x, this.y);
        if (dist(this.x, this.y, the_spider.x, the_spider.y + 50) < this.radius * 3)
        {
          the_spider.mandible.setAnimation(1, 3, true);
          this.blood.addParticle();
          this.health -= 0.02;
        } else
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
        if (distSQ < random(4, 1000))
          this.isThrowing = true;
      }

      if (this.y < the_ground - this.radius)
      {
        this.velocity.y += 0.04;
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
      this.sprite.setAnimation(4, 4, false);

    noStroke();
    push();
    translate(this.x, this.y);
    if (this.velocity.x < 0)
      scale(-1, 1);
    scale(this.radius * 2.0 / 72.0, this.radius * 2.0 / 72.0);
    this.sprite.draw();
    //ellipse(x, y, radius * 2, radius * 2);
    //stroke(20);
    pop();

    if (!this.isDead && this.health <= 0.0)
    {
      if (this.stabLeg != null)
        this.stabLeg.stabbedBabby = null;
      this.isDead = true;
      this.velocity = createVector(random(-1, 1), random(-1, 0));
      the_spider.mandible.setAnimation(0, 0, true);
    }
    this.blood.run();
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

  this.m_img = img;//loadImage("leg" + index + ".png");

  this.m_targetX = 0;
  this.m_targetY = 0;

  this.draw = function(isLeft) 
  { 
    if (this.m_isDripping)
    {
      this.m_y += the_spider.buttOffset;
      if (this.m_dripY < the_ground)
      {
        this.m_dripY += 2;
      }
      stroke(255, 255, 255, 192);
      strokeWeight(random(5, 15));
      line(this.m_x, this.m_y - this.m_length, this.m_x, this.m_dripY);
    }

    imageMode(CENTER);
    push();
    translate(this.m_x + cos(this.m_angle) * (this.m_length * 0.5), this.m_y + sin(this.m_angle) * (this.m_length * 0.5));
    rotate(this.m_angle);
    if (this.isLeft)
      scale(1, -1);
    if (this.m_img.width > 0)
      image(this.m_img, 0, 0, this.m_length * 1.12, 20);
    //line(0, 0, m_length, 0);
    pop();
  }

  this.calculatePosition = function() 
  {
    if (this.m_prev != null && !this.isBeingCarried)
    {    
      this.m_x = this.m_prev.m_x + cos(this.m_prev.m_angle) * this.m_prev.m_length; 
      this.m_y = this.m_prev.m_y + sin(this.m_prev.m_angle) * this.m_prev.m_length;
    }
  }

  this.calculateAngle = function() 
  {
    if (this.isBeingCarried)
      return;

    if (this.m_prev != null) 
    {
      this.m_angle = constrain(this.m_angle, this.m_prev.m_angle+this.m_startAngle+this.m_minAngle, this.m_prev.m_angle+this.m_startAngle+this.m_maxAngle);
    } else
      this.m_angle = constrain(this.m_angle, this.m_startAngle+this.m_minAngle, this.m_startAngle+this.m_maxAngle);
  }

  this.isCircleOverlapping = function(cx, cy, cr)
  {
    var x2 = this.m_x + cos(this.m_angle) * this.m_length;
    var y2 = this.m_y + sin(this.m_angle) * this.m_length; 
    return circleLineIntersect(m_x, m_y, x2, y2, cx, cy, cr);
  }

  this.reach = function()
  {
    var dx = this.m_targetX - this.m_x;
    var dy = this.m_targetY - this.m_y;
    //print(this.m_targetX);
    this.m_angle = atan2(dy, dx); 

    //print(this.m_angle);

    if (this.m_prev != null)
    {
      this.m_prev.m_targetX = this.m_targetX - cos(this.m_angle) * this.m_length;
      this.m_prev.m_targetY = this.m_targetY - sin(this.m_angle) * this.m_length;
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
  this.m_segments = new Array(this.m_segmentCount);//new LegSegment[m_segmentCount];
  this.m_buttons = new Array(this.m_segmentCount);// = new int[m_segmentCount];
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
  //this.m_targetX;
  //this.m_targetY;
  this.health = 1.0;
  this.stabbedBabby = null;

  //Leg(startX, startY, startAngle, startLength, parentY)
  //{ 
  var heightChange = height - 360;
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

    stroke(0);

    //this.m_segments[this.m_segments.length-1].m_targetX = mouseX;
    //this.m_segments[this.m_segments.length-1].m_targetY = mouseY;

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
        this.health -= 0.04;
        this.shouldRemoveHealth = false;

        if (frameCount % 2 == 0)
          this.m_segments[i].m_img.filter(INVERT);
        this.m_segments[i].draw(this.m_isLeft);

        if (frameCount % 2 == 0)
          this.m_segments[i].m_img.filter(INVERT);
      } else
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
    var tx = tip.m_x + cos(tip.m_angle) * tip.m_length;
    var ty = tip.m_y + sin(tip.m_angle) * tip.m_length;
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
        this.m_targetY = this.m_tipY + 20;
      }
      this.m_segments[i].m_targetX = this.m_targetX;
      this.m_targetY = this.m_targetY + 50;
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
      this.m_segments[i].curl((i+1) * 0.2);
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
  this.y = height - 230;
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
      if (this.y >= height - 230)
      {
        this.y = height - 230;
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
    this.m_legs[0].m_segments[0].m_x = this.x-50;
    this.m_legs[0].m_segments[0].m_y = this.y; 
    this.m_legs[3].m_segments[0].m_x = this.x-60;
    this.m_legs[3].m_segments[0].m_y = this.y-10;   
    this.m_legs[5].m_segments[0].m_x = this.x-65;
    this.m_legs[5].m_segments[0].m_y = this.y-20;
    this.m_legs[7].m_segments[0].m_x = this.x-68;
    this.m_legs[7].m_segments[0].m_y = this.y-30;

    this.m_legs[1].m_segments[0].m_x = this.x+50;
    this.m_legs[1].m_segments[0].m_y = this.y; 
    this.m_legs[2].m_segments[0].m_x = this.x+60;
    this.m_legs[2].m_segments[0].m_y = this.y-10;   
    this.m_legs[4].m_segments[0].m_x = this.x+65;
    this.m_legs[4].m_segments[0].m_y = this.y-20;
    this.m_legs[6].m_segments[0].m_x = this.x+68;
    this.m_legs[6].m_segments[0].m_y = this.y-30;

    strokeWeight(5);
    stroke(192, 224, 192, 192);
    line(this.x, 0, this.x, this.y);

    var explodeOffset = 0;
    if (this.buttExploding)
    {
      explodeOffset = -100;

      imageMode(CENTER);
      push();
      translate(this.x, this.y - 80 + explodeOffset);
      var s = 0.45;
      if (this.buttExploding)
        s = 0.2 + noise(this.y * 0.01);
      scale(s, s);
      image(this.butt, 0, 0);
      pop();
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
      //tint(255,255,255, amount);

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
      //noTint();
    }

    push();
    translate(this.x, this.y);
    scale(0.5, 0.5);
    this.head.draw();
    if (this.mandible.startFrame != 1)
      this.mandible.draw();
    pop();

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
