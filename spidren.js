// Phaser 3.9 Conversion

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Global variables
        this.isFirefox = typeof InstallTrigger !== 'undefined';
        this.MENU_STATE_00 = 0;
        this.MENU_STATE_01 = 1;
        this.MENU_STATE_02 = 2;
        this.PLAY_STATE = 3;
        this.GAMEOVER_STATE = 4;
        this.WIN_STATE = 5;
        this.the_scenes = new Array(4);
        this.BABBY_COUNT = 1;
        this.the_gameState = this.MENU_STATE_00;
        this.PI = Math.PI;
        this.HALF_PI = Math.PI * 0.5;
        this.QUARTER_PI = Math.PI * 0.25;
        this.the_babbySpiders = [];
        this.the_spider = null;
        this.the_font = "Amatic SC Regular";
        this.the_ground = 0;
        this.the_grassSprite = null;
        this.the_keyboardSprite = null;
        this.the_babbyWalkTextures = [];
        this.the_babbyDeadTextures = [];
        this.the_body0Image = null;
        this.the_body1Image = null;
        this.the_headNormalImage = null;
        this.the_headAnnoyedImage = null;
        this.the_headAngryImage = null;
        this.the_headPainImage = null;
        this.the_leg0Image = null;
        this.the_leg1Image = null;
        this.the_leg2Image = null;
        this.the_mandibleEatingTextures = [];
        this.the_mandibleNormalTextures = [];
        this.the_bloodTexture = null;
        this.the_blood = null;
        this.the_transitionTimer = 2;
        this.the_screen_offset = 0;
        this.the_screenShakeTimer = 0;
        this.the_jitterTimer = 2.0;
        this.the_doOnce = true;
        this.jtr = 4;
        this.vx = 0;
        this.vy = 0;
        this.frameFloat = 0.0;
        this.frameCount = 0;
        this.the_scale = 2.0;
        
        // Phaser specific
        this.width = this.DPI(800);
        this.height = this.DPI(450);
    }

    DPI(size) {
        return size * this.the_scale;
    }

    preload() {
        // Load assets
        this.load.atlas('babbySpritesheet', 'babby.png', 'babby.json');
        this.load.atlas('headSpritesheet', 'head.png', 'head.json');
        this.load.atlas('mandibleSpritesheet', 'mandible.png', 'mandible.json');
        this.load.image('grass', 'grass.png');
        this.load.image('keyboard', 'keyboard.png');
        this.load.image('body0', 'body0.png');
        this.load.image('body1', 'body1.png');
        this.load.image('leg0', 'leg0.png');
        this.load.image('leg1', 'leg1.png');
        this.load.image('leg2', 'leg2.png');
    }

    create() {
        // Setup game container
        this.gameContainer = this.add.container(0, 0);
        this.add.rectangle(0, 0, this.width, this.height, 0x000000).setOrigin(0, 0);
        
        // Setup camera
        this.cameras.main.setSize(this.width, this.height);
        this.cameras.main.setZoom(1);
        
        // Setup input
        this.input.on('pointerup', this.mouseReleased, this);
        this.input.keyboard.on('keydown', this.keyPressed, this);
        this.input.keyboard.on('keyup', this.keyReleased, this);
        
        // Setup scaling
        this.scale.on('resize', this.scaleToWindow, this);
        this.scaleToWindow();
        
        // Load assets
        this.load.on('complete', () => {
            this.setup();
        });
        
        // Start loading
        this.load.start();
    }

    scaleToWindow() {
        const aspectCorrectScale = window.innerWidth / this.width;
        const heightScale = window.innerHeight / this.height;
        const scale = Math.min(aspectCorrectScale, heightScale);
        
        // Apply scaling to game container
        this.gameContainer.setScale(scale);
        this.gameContainer.setPosition(
            (window.innerWidth - this.width * scale) / 2,
            (window.innerHeight - this.height * scale) / 2
        );
    }

    setup() {
        // Initialize variables
        this.the_babbySpiders = [];
        this.the_screenShakeTimer = 0;
        this.the_transitionTimer = 2;
        this.the_doOnce = true;
        
        // Setup ground
        this.the_ground = this.height - this.DPI(35);
        
        // Create title screen
        this.createTitleScreen();
        
        // Create controls screen
        this.createControlsScreen();
        
        // Create second controls screen
        this.createSecondControlsScreen();
        
        // Create play state
        this.createPlayState();
        
        // Setup game states
        this.the_scenes[this.MENU_STATE_00].setVisible(true);
        this.the_scenes[this.MENU_STATE_00].setActive(true);
        
        // Setup blood effect
        this.the_blood = new Blood(this, this.gameContainer);
    }

    createTitleScreen() {
        const titleText = this.add.text(this.width/2, this.height/2, 'SPIDREN', {
            fontSize: this.DPI(128),
            fontFamily: this.the_font,
            color: '#3a0e05',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitleText = this.add.text(this.width/2, this.height/2 + this.DPI(100), '@devonsoft', {
            fontSize: this.DPI(64),
            fontFamily: this.the_font,
            color: '#3a0e05',
            align: 'center'
        }).setOrigin(0.5);
        
        this.the_scenes[this.MENU_STATE_00] = {
            titleText: titleText,
            subtitleText: subtitleText,
            update: (delta) => {
                if (this.frameCount % 2 === 0) {
                    titleText.x += (this.width/2 + this.random(-this.jtr, this.jtr) - titleText.x) / 2 * delta;
                    titleText.y += (this.height/2 + this.random(-this.jtr, this.jtr) - titleText.y) / 2 * delta;
                    subtitleText.x += (this.width/2 + this.random(-this.jtr, this.jtr) - subtitleText.x) / 2 * delta;
                    subtitleText.y += (this.height/2 + this.random(-this.jtr, this.jtr) + this.DPI(100) - subtitleText.y) / 2 * delta;
                }
            },
            setVisible: (visible) => {
                titleText.setVisible(visible);
                subtitleText.setVisible(visible);
            },
            setActive: (active) => {
                // No-op for this simple example
            }
        };
    }

    createControlsScreen() {
        this.the_keyboardSprite = this.add.image(this.width/2, this.height/2, 'keyboard');
        this.the_keyboardSprite.setScale(this.height / this.the_keyboardSprite.displayHeight);
        
        this.the_scenes[this.MENU_STATE_01] = {
            update: () => {},
            setVisible: (visible) => {
                this.the_keyboardSprite.setVisible(visible);
            },
            setActive: (active) => {
                // No-op for this simple example
            }
        };
    }

    createSecondControlsScreen() {
        const titleText = this.add.text(this.width/2, this.height/2, 'FOCUS ON ONE LEG AT A TIME (R + D, C)', {
            fontSize: this.DPI(64),
            fontFamily: this.the_font,
            color: '#3a0e05',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitleText = this.add.text(this.width/2, this.height/2 + this.DPI(50), 
            'most keyboards do not allow enough simultaneous keys for more than one leg', {
            fontSize: this.DPI(32),
            fontFamily: this.the_font,
            color: '#3a0e05',
            align: 'center'
        }).setOrigin(0.5);
        
        this.the_scenes[this.MENU_STATE_02] = {
            titleText: titleText,
            subtitleText: subtitleText,
            update: (delta) => {
                if (this.frameCount % 2 === 0) {
                    this.vx = (this.width/2 + this.random(-this.jtr, this.jtr) - this.the_scenes[this.MENU_STATE_02].titleText.x) / 2;
                    this.vy = (this.height/2 + this.random(-this.jtr, this.jtr) - this.the_scenes[this.MENU_STATE_02].titleText.y) / 2;
                }
                this.the_scenes[this.MENU_STATE_02].titleText.x += this.vx * delta;
                this.the_scenes[this.MENU_STATE_02].titleText.y += this.vy * delta;
            },
            setVisible: (visible) => {
                titleText.setVisible(visible);
                subtitleText.setVisible(visible);
            },
            setActive: (active) => {
                // No-op for this simple example
            }
        };
    }

    createPlayState() {
        // Create grass background
        const h = this.DPI(800) / this.textures.get('grass').width * this.textures.get('grass').height;
        const backgroundGrass = this.add.image(0, this.height - h + this.DPI(4), 'grass');
        backgroundGrass.setScale(this.width / backgroundGrass.displayWidth, h / backgroundGrass.displayHeight);
        
        this.the_scenes[this.PLAY_STATE] = {
            update: (delta) => {
                if (this.the_doOnce) {
                    this.the_transitionTimer = 2;
                    this.the_gameState = this.PLAY_STATE;
                    
                    if (this.the_spider) {
                        this.the_spider.remove();
                    }
                    this.the_spider = new Spider(this, this.gameContainer);
                    
                    // Reset babby spiders
                    for (let i = 0; i < this.the_babbySpiders.length; i++) {
                        if (this.the_babbySpiders[i]) {
                            this.the_babbySpiders[i].remove();
                        }
                    }
                    this.the_babbySpiders = new Array(this.BABBY_COUNT);
                    
                    this.the_doOnce = false;
                }
                
                // Screen shake effect
                if (this.the_blood) {
                    this.the_blood.run(delta);
                }
                
                if (this.the_spider) {
                    this.the_spider.update(delta);
                }
                
                // Handle babby spiders
                let deadBabbyCount = 0;
                for (let i = this.the_babbySpiders.length-1; i >= 0 && !this.the_spider.buttExploding; i--) {
                    if (this.the_babbySpiders[i]) {
                        this.the_babbySpiders[i].update(delta);
                        if (this.the_babbySpiders[i].isDead) {
                            deadBabbyCount += 1;
                        }
                    }
                }
                
                if (deadBabbyCount >= this.BABBY_COUNT) {
                    this.the_gameState = this.WIN_STATE;
                    this.the_scenes[this.the_gameState].setVisible(true);
                    this.the_scenes[this.the_gameState].alpha = 0;
                    
                    if (this.BABBY_COUNT < 3) {
                        this.BABBY_COUNT += 1;
                    } else if (this.BABBY_COUNT < 7) {
                        this.BABBY_COUNT += 2;
                    } else if (this.BABBY_COUNT >= 7) {
                        this.BABBY_COUNT *= 2;
                    }
                }
            },
            setVisible: (visible) => {
                // Implementation depends on actual scene management
            },
            setActive: (active) => {
                // No-op for this simple example
            }
        };
    }

    mouseReleased() {
        if (this.the_gameState < this.PLAY_STATE) {
            this.the_scenes[this.the_gameState].setVisible(false);
            this.the_gameState++;
            this.the_scenes[this.the_gameState].setVisible(true);
        } else if (this.the_gameState > this.PLAY_STATE && this.the_transitionTimer <= 0) {
            this.the_scenes[this.the_gameState].setVisible(false);
            this.the_gameState = this.PLAY_STATE;
            this.the_scenes[this.the_gameState].setVisible(true);
            this.the_doOnce = true;
        }
    }

    keyPressed(event) {
        const code = event.keyCode ? event.keyCode : event.which;
        
        // Handle Firefox semicolon
        if (code === 59 && this.isFirefox) {
            event.keyCode = 186;
        }
        
        // Handle key presses for spider legs
        switch (code) {
            case 84: this.the_spider.m_legs[0].pressButton(0); break; // t
            case 70: this.the_spider.m_legs[0].pressButton(1); break; // f
            case 86: this.the_spider.m_legs[0].pressButton(2); break; // v
            
            case 89: this.the_spider.m_legs[1].pressButton(0); break; // y
            case 74: this.the_spider.m_legs[1].pressButton(1); break; // j
            case 78: this.the_spider.m_legs[1].pressButton(2); break; // n
            
            case 85: this.the_spider.m_legs[2].pressButton(0); break; // u
            case 75: this.the_spider.m_legs[2].pressButton(1); break; // k
            case 77: this.the_spider.m_legs[2].pressButton(2); break; // m
            
            case 82: this.the_spider.m_legs[3].pressButton(0); break; // r
            case 68: this.the_spider.m_legs[3].pressButton(1); break; // d
            case 67: this.the_spider.m_legs[3].pressButton(2); break; // c
            
            case 73: this.the_spider.m_legs[4].pressButton(0); break; // i
            case 76: this.the_spider.m_legs[4].pressButton(1); break; // l
            case 188: this.the_spider.m_legs[4].pressButton(2); break; // ,
            
            case 69: this.the_spider.m_legs[5].pressButton(0); break; // e
            case 83: this.the_spider.m_legs[5].pressButton(1); break; // s
            case 88: this.the_spider.m_legs[5].pressButton(2); break; // x
            
            case 79: this.the_spider.m_legs[6].pressButton(0); break; // o
            case 186: this.the_spider.m_legs[6].pressButton(1); break; // ;
            case 190: this.the_spider.m_legs[6].pressButton(2); break; // .
            
            case 87: this.the_spider.m_legs[7].pressButton(0); break; // w
            case 65: this.the_spider.m_legs[7].pressButton(1); break; // a
            case 90: this.the_spider.m_legs[7].pressButton(2); break; // z
        }
    }

    keyReleased(event) {
        const code = event.keyCode ? event.keyCode : event.which;
        
        if (code === 27) { // esc
            this.the_scenes[this.the_gameState].setVisible(false);
            this.the_gameState = this.MENU_STATE_00;
            this.the_scenes[this.the_gameState].setVisible(true);
            this.the_doOnce = true;
            this.BABBY_COUNT = 1;
        } else if (this.the_gameState < this.PLAY_STATE) {
            this.the_scenes[this.the_gameState].setVisible(false);
            this.the_gameState++;
            this.the_scenes[this.the_gameState].setVisible(true);
        } else if (this.the_gameState > this.PLAY_STATE && this.the_transitionTimer <= 0) {
            this.the_scenes[this.the_gameState].setVisible(false);
            this.the_gameState = this.PLAY_STATE;
            this.the_scenes[this.the_gameState].setVisible(true);
            this.the_doOnce = true;
        } else {
            // Handle key releases for spider legs
            if (code === 59 && this.isFirefox) {
                event.keyCode = 186;
            }
            
            switch (code) {
                case 84: this.the_spider.m_legs[0].m_buttons[0] = 0; break; // t
                case 70: this.the_spider.m_legs[0].m_buttons[1] = 0; break; // f
                case 86: this.the_spider.m_legs[0].m_buttons[2] = 0; break; // v
                
                case 89: this.the_spider.m_legs[1].m_buttons[0] = 0; break; // y
                case 74: this.the_spider.m_legs[1].m_buttons[1] = 0; break; // j
                case 78: this.the_spider.m_legs[1].m_buttons[2] = 0; break; // n
                
                case 85: this.the_spider.m_legs[2].m_buttons[0] = 0; break; // u
                case 75: this.the_spider.m_legs[2].m_buttons[1] = 0; break; // k
                case 77: this.the_spider.m_legs[2].m_buttons[2] = 0; break; // m
                
                case 82: this.the_spider.m_legs[3].m_buttons[0] = 0; break; // r
                case 68: this.the_spider.m_legs[3].m_buttons[1] = 0; break; // d
                case 67: this.the_spider.m_legs[3].m_buttons[2] = 0; break; // c
                
                case 73: this.the_spider.m_legs[4].m_buttons[0] = 0; break; // i
                case 76: this.the_spider.m_legs[4].m_buttons[1] = 0; break; // l
                case 188: this.the_spider.m_legs[4].m_buttons[2] = 0; break; // ,
                
                case 69: this.the_spider.m_legs[5].m_buttons[0] = 0; break; // e
                case 83: this.the_spider.m_legs[5].m_buttons[1] = 0; break; // s
                case 88: this.the_spider.m_legs[5].m_buttons[2] = 0; break; // x
                
                case 79: this.the_spider.m_legs[6].m_buttons[0] = 0; break; // o
                case 186: this.the_spider.m_legs[6].m_buttons[1] = 0; break; // ;
                case 190: this.the_spider.m_legs[6].m_buttons[2] = 0; break; // .
                
                case 87: this.the_spider.m_legs[7].m_buttons[0] = 0; break; // w
                case 65: this.the_spider.m_legs[7].m_buttons[1] = 0; break; // a
                case 90: this.the_spider.m_legs[7].m_buttons[2] = 0; break; // z
            }
        }
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    distSQ(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return dx * dx + dy * dy;
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt(this.distSQ(x1, y1, x2, y2));
    }

    circleLineIntersect(x1, y1, x2, y2, cx, cy, cr) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const a = dx * dx + dy * dy;
        const b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
        const c = cx * cx + cy * cy;
        c += x1 * x1 + y1 * y1;
        c -= 2 * (cx * x1 + cy * y1);
        c -= cr * cr;
        const bb4ac = b * b - 4 * a * c;

        if (bb4ac < 0) {
            return false;
        } else {
            const mu = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            const ix1 = x1 + mu * dx;
            const iy1 = y1 + mu * dy;
            const mu2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            const ix2 = x1 + mu2 * dx;
            const iy2 = y1 + mu2 * dy;

            let testX, testY;
            if (this.dist(x1, y1, cx, cy) < this.dist(x2, y2, cx, cy)) {
                testX = x2;
                testY = y2;
            } else {
                testX = x1;
                testY = y1;
            }
            
            return (this.dist(testX, testY, ix1, iy1) < this.dist(x1, y1, x2, y2) || 
                   this.dist(testX, testY, ix2, iy2) < this.dist(x1, y1, x2, y2));
        }
    }

    update() {
        this.frameFloat += 1/60; // Assuming delta is 1/60
        this.frameCount = Math.floor(this.frameFloat);
        
        // Update active scene
        if (this.the_scenes[this.the_gameState]) {
            this.the_scenes[this.the_gameState].update(1/60);
        }
    }
}

// Blood effect class
class Blood {
    constructor(scene, parent) {
        this.scene = scene;
        this.parent = parent;
        this.particles = [];
        
        // Create particle container for performance
        this.particleContainer = scene.add.particles(0, 0);
    }
    
    addParticle(xx, yy) {
        // Create particle sprite with texture
        const particle = this.scene.add.sprite(xx, yy, 'blood');
        particle.setScale(0.1); // Set initial scale
        
        // Store particle properties
        const particleData = {
            sprite: particle,
            velocity: {
                x: this.scene.random(-1, 1),
                y: this.scene.random(-2.0, -1.0)
            },
            acceleration: {
                x: 0,
                y: 0.1
            },
            lifespan: 1.0,
            radiusX: this.scene.DPI(this.scene.random(0.075, 0.15)),
            radiusY: this.scene.DPI(this.scene.random(0.075, 0.15))
        };
        
        this.particles.push(particleData);
    }

    run(delta) {
        // Update and remove dead particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle position
            particle.velocity.x += particle.acceleration.x;
            particle.velocity.y += particle.acceleration.y;
            particle.sprite.x += particle.velocity.x * delta;
            particle.sprite.y += particle.velocity.y * delta;
            
            // Update lifespan
            particle.lifespan -= 0.009 * delta;
            
            // Scale with lifespan
            const scale = particle.lifespan;
            particle.sprite.setScale(
                particle.radiusX * scale, 
                particle.radiusY * scale
            );
            
            // Remove dead particles
            if (particle.lifespan < 0) {
                particle.sprite.destroy();
                this.particles.splice(i, 1);
            }
        }
    }

    remove() {
        // Destroy all particles
        this.particles.forEach(particle => {
            particle.sprite.destroy();
        });
        this.particles = [];
    }
}

// BabbySpider class
class BabbySpider {
    constructor(scene, parent) {
        this.scene = scene;
        this.parent = parent;
        
        // Position and movement
        this.x = this.scene.random(this.DPI(50), this.scene.height - this.DPI(50));
        this.y = this.scene.height - this.DPI(50);
        this.direction = { x: 1, y: 0 };
        this.speed = 4.0;
        this.normalSpeed = 4.0;
        this.radius = this.scene.DPI(15.0);
        
        // States
        this.isSpawning = true;
        this.isFeeding = false;
        this.isThrowing = false;
        this.isStabbed = false;
        this.isClimbing = false;
        this.isDead = false;
        
        this.carriedSegment = null;
        this.stabLeg = null;
        this.health = 1.0;
        
        // Create sprite
        this.sprite = this.scene.add.sprite(this.x, this.y, 'babbySpritesheet');
        this.sprite.setOrigin(0.5);
        
        // Set animation
        this.scene.anims.create({
            key: 'babby_walk',
            frames: this.scene.anims.generateFrameNames('babbySpritesheet', {
                prefix: 'Babby_Walk ',
                start: 1,
                end: 4,
                zeroPad: 1
            }),
            repeat: -1,
            frameRate: 10
        });
        
        this.sprite.play('babby_walk');
    }
    
    remove() {
        this.sprite.destroy();
    }
    
    update(delta) {
        const dt = delta;
        
        if (this.isDead || this.isSpawning) { 
            if (this.y >= this.scene.the_ground - this.radius) {
                this.y = this.scene.the_ground - this.radius;
                this.speed = this.normalSpeed;
                this.isSpawning = false;
            } else {
                this.velocity.y += (0.08) * dt;
                this.x += this.velocity.x * dt;
                this.y += this.velocity.y * dt;
            }
        } else if (this.isClimbing) {
            if (this.stabLeg != null) {
                const tempDirection = {
                    x: this.stabLeg.m_segments[2].m_x - this.x,
                    y: this.stabLeg.m_segments[2].m_y - this.y
                };
                
                const magnitude = this.scene.dist(0, 0, tempDirection.x, tempDirection.y);
                
                if (Math.abs(tempDirection.x) > this.scene.DPI(200)) {
                    this.isClimbing = false;
                } else {
                    tempDirection.x = magnitude > 0 ? tempDirection.x / magnitude : 0;
                    tempDirection.y = magnitude > 0 ? tempDirection.y / magnitude : 0;
                    this.y += tempDirection.y * this.speed * dt;
                    this.x += tempDirection.x * this.speed * dt;
                }
                this.velocity.y = 0;
            }
        } else if (this.isStabbed) {
            if (this.stabLeg != null) {
                this.x = this.stabLeg.m_tipX;
                this.y = this.stabLeg.m_tipY;

                if (this.scene.dist(this.x, this.y, this.scene.the_spider.x, this.scene.the_spider.y + this.scene.DPI(50)) < this.radius * 3) {
                    // Add blood particles
                    for (let p = 0; p < 10; p++) {
                        this.scene.the_blood.addParticle(this.x, this.y);
                    }
                    this.health -= 0.01 * dt; 
                }
            }
        } else if (this.isThrowing) {
            if (this.carriedSegment != null) {
                this.carriedSegment.m_y -= 10 * dt;
                if (this.carriedSegment.m_y < (this.scene.the_spider.y + this.carriedSegment.m_length)) {
                    this.carriedSegment.m_isDripping = true;
                    this.carriedSegment.m_dripY = this.carriedSegment.m_y - this.carriedSegment.m_length;
                    this.carriedSegment = null;
                    this.isThrowing = false;
                    this.scene.the_spider.tipCount -= 1;
                    if (this.scene.the_spider.tipCount <= 0) {
                        this.scene.the_gameState = this.scene.GAMEOVER_STATE;
                        this.scene.the_scenes[this.scene.the_gameState].setVisible(true);
                        this.scene.the_scenes[this.scene.the_gameState].alpha = 0; 
                    }
                }
            }
        } else if (this.isFeeding) {
            if (this.carriedSegment == null) {
                const tempDirection = {
                    x: this.stabLeg.m_segments[2].m_x - this.x,
                    y: this.stabLeg.m_segments[2].m_y - this.y
                };
                
                const magnitude = this.scene.dist(0, 0, tempDirection.x, tempDirection.y);
                tempDirection.x = magnitude > 0 ? tempDirection.x / magnitude : 0;
                tempDirection.y = magnitude > 0 ? tempDirection.y / magnitude : 0;
                
                this.y += tempDirection.y * this.speed * dt;
                this.x += tempDirection.x * this.speed * dt;
            }
            this.speed = this.normalSpeed;
        } else {
            // Normal movement
            this.velocity.x = this.direction.x * this.speed;
            this.x += this.velocity.x * dt;
            
            if (this.speed > this.normalSpeed) {
                this.speed *= 0.9;
            }

            if (this.carriedSegment != null) {
                this.carriedSegment.m_x = this.x;
                this.carriedSegment.m_y = this.y;

                const distSQ = (this.scene.width/2 - this.x) * (this.scene.width/2 - this.x);
                if (distSQ < this.scene.DPI(this.scene.random(4, 1000))) {
                    this.isThrowing = true;
                }
            }

            if (this.y < this.scene.the_ground - this.radius) {
                this.velocity.y += (0.04) * dt;
                this.y += this.velocity.y * dt;
            } else {
                this.y = this.scene.the_ground - this.radius;
            }

            if (this.x > this.scene.width - this.radius) {
                this.direction.x = -this.direction.x;
                this.x = this.scene.width - this.radius;
            } else if (this.x < this.radius) {
                this.direction.x = -this.direction.x;
                this.x = this.radius;
            }
        }

        // Update sprite position and scale
        this.sprite.setPosition(this.x, this.y);
        const s = (this.radius * 2.0) / 72.0;
        this.sprite.setScale(this.velocity.x < 0 ? -s : s, s);
        
        // Check if dead
        if (!this.isDead && this.health <= 0.0) {
            if (this.stabLeg != null) {
                this.stabLeg.stabbedBabby = null;
            }
            this.isDead = true;
            this.velocity = {
                x: this.scene.random(-1, 1),
                y: this.scene.random(-1, 0)
            };
        }
    }
}

// LegSegment class
class LegSegment {
    constructor(startAngle, minAngle, maxAngle, xx, yy, seglength, index, img, scene, parent) {
        this.scene = scene;
        this.parent = parent;
        
        this.m_x = xx;
        this.m_y = yy;
        this.m_startAngle = startAngle;
        this.m_angle = startAngle;
        this.m_minAngle = minAngle;
        this.m_maxAngle = maxAngle;
        this.m_length = seglength;
        
        // Create drip effect
        if (index === 2) {
            this.m_drip = scene.add.graphics();
            this.m_drip.fillStyle(0xFFFFFF, 192 / 255.0);
            this.m_drip.lineStyle(1, 0xFFFFFF, 192 / 255.0);
            this.m_drip.beginPath();
            this.m_drip.moveTo(0, 0);
            this.m_drip.lineTo(0, 1);
            this.m_drip.closePath();
            this.m_drip.visible = false;
        }

        // Create image sprite
        this.m_img = scene.add.sprite(xx, yy, img);
        this.m_img.setOrigin(0.5);
        
        // Setup properties
        this.m_isReaching = false;
        this.isBeingCarried = false;
        this.m_isDripping = false;
        this.m_targetX = 0;
        this.m_targetY = 0;
        this.atMaxAngle = false;
        this.atMinAngle = false;
    }

    update(isLeft, delta) {
        if (this.m_isDripping) {
            this.m_drip.visible = true;
            this.m_y += this.scene.the_spider.buttOffset;
            const startY = this.m_y - this.m_length;
            
            if (this.m_dripY < this.scene.the_ground) {
                this.m_dripY += this.scene.DPI(2) * delta;
            }
            
            const scaleY = this.m_dripY - startY;
            this.m_drip.x = this.m_x;
            this.m_drip.y = startY;
            this.m_drip.setScale(this.scene.DPI(this.scene.random(5, 15)), scaleY);
        }

        // Update image position and rotation
        this.m_img.x = this.m_x + Math.cos(this.m_angle) * (this.m_length * 0.5);
        this.m_img.y = this.m_y + Math.sin(this.m_angle) * (this.m_length * 0.5);
        this.m_img.rotation = this.m_angle;
        
        if (isLeft) {
            this.m_img.setScale(1, -1);
        }
        
        this.m_img.width = this.m_length * 1.12;
        this.m_img.height = this.scene.DPI(20);
    }

    calculatePosition(isLeft) {
        if (this.m_prev != null && !this.isBeingCarried) {    
            this.m_x = this.m_prev.m_x + Math.cos(this.m_prev.m_angle) * this.m_prev.m_length; 
            this.m_y = this.m_prev.m_y + Math.sin(this.m_prev.m_angle) * this.m_prev.m_length;
        }
    }

    calculateAngle() {
        if (this.isBeingCarried) return;

        let min, max;
        if (this.m_prev != null) {
            min = this.m_prev.m_angle + this.m_startAngle + this.m_minAngle;
            max = this.m_prev.m_angle + this.m_startAngle + this.m_maxAngle;
        } else {
            min = this.m_startAngle + this.m_minAngle;
            max = this.m_startAngle + this.m_maxAngle;
        }
        
        this.m_angle = Math.max(min, Math.min(max, this.m_angle));
        
        this.atMaxAngle = false;
        this.atMinAngle = false;
        if (this.m_angle === max) {
            this.atMaxAngle = true;
        }
        if (this.m_angle === min) {
            this.atMinAngle = true;
        }
    }

    isCircleOverlapping(cx, cy, cr) {
        const x2 = this.m_x + Math.cos(this.m_angle) * this.m_length;
        const y2 = this.m_y + Math.sin(this.m_angle) * this.m_length; 
        return this.scene.circleLineIntersect(
            this.m_x, this.m_y, x2, y2, cx, cy, cr
        );
    }

    reach() {
        if (this.isBeingCarried) return;
        
        const dx = this.m_targetX - this.m_x;
        const dy = this.m_targetY - this.m_y;
        this.m_angle = Math.atan2(dy, dx); 

        if (this.m_prev != null) {
            this.m_prev.m_targetX = this.m_targetX - Math.cos(this.m_angle) * this.m_length;
            this.m_prev.m_targetY = this.m_targetY - Math.sin(this.m_angle) * this.m_length;
        }
    }

    curl(amount) {
        if (!this.isBeingCarried) {
            this.m_angle += amount;
        }
    }
}

// Leg class
class Leg {
    constructor(startX, startY, startAngle, startLength, parentY, scene, parent) {
        this.scene = scene;
        this.parent = parent;
        
        this.m_segmentCount = 3;
        this.m_segments = [];
        this.m_buttons = new Array(this.m_segmentCount);
        
        this.m_isLeft = true;
        
        const heightChange = this.scene.height - this.scene.DPI(360);
        const offset = ((parentY - heightChange) / (startY - heightChange));
        
        // Create segments based on angle
        if (startAngle > this.scene.HALF_PI) {
            this.m_segments[0] = new LegSegment(startAngle, -this.scene.QUARTER_PI, this.scene.QUARTER_PI, startX, startY, startLength, 0, 'leg0', this.scene, this);
            this.m_segments[1] = new LegSegment(-this.scene.QUARTER_PI * offset, -this.scene.QUARTER_PI * offset, 0, 0, 0, startLength * offset, 1, 'leg1', this.scene, this);
            this.m_segments[2] = new LegSegment(-this.scene.QUARTER_PI * offset, -this.scene.QUARTER_PI * offset, 0, 0, 0, startLength * offset, 2, 'leg2', this.scene, this);
            this.m_isLeft = true;
        } else {
            this.m_segments[0] = new LegSegment(startAngle, -this.scene.QUARTER_PI, this.scene.QUARTER_PI, startX, startY, startLength, 0, 'leg0', this.scene, this);
            this.m_segments[1] = new LegSegment(this.scene.QUARTER_PI * offset, 0, this.scene.QUARTER_PI * offset, 0, 0, startLength * offset, 1, 'leg1', this.scene, this);
            this.m_segments[2] = new LegSegment(this.scene.QUARTER_PI * offset, 0, this.scene.QUARTER_PI * offset, 0, 0, startLength * offset, 2, 'leg2', this.scene, this);
            this.m_isLeft = false;
        }

        // Link segments
        for (let i = 1; i < this.m_segments.length; i++) {
            this.m_segments[i].m_prev = this.m_segments[i-1];
            this.m_segments[i].m_angle = this.m_segments[i-1].m_angle + this.m_segments[i].m_startAngle;
        }
        
        this.setup();
    }

    setup() {
        this.m_isReaching = false;
        this.shouldRemoveHealth = false;
        
        for (let i = 0; i < this.m_buttons.length; i++) {
            this.m_buttons[i] = 0;
        }
        
        this.m_dx = 0;
        this.m_tipX = 0;
        this.m_tipY = 0;
        this.health = 1.0;
        this.stabbedBabby = null;
        this.curlSpeed = 0.1;
        
        for (let i = 1; i < this.m_segments.length; i++) {
            // Reset segment properties if needed
        }
    }

    update(delta) {   
        if (this.m_buttons[1] !== 0) {
            // Debug print
        }

        if (!this.m_isReaching) {
            for (let i = 0; i < this.m_segments.length; i++) {
                this.m_segments[i].calculateAngle();
            }
        }

        for (let i = 0; i < this.m_segments.length; i++) {
            this.m_segments[i].calculatePosition(this.m_isLeft);
        }

        for (let i = 0; i < this.m_segments.length; i++) {
            if (this.shouldRemoveHealth && i === 2) {
                this.health -= 0.02 * delta;
                
                if (this.scene.frameCount % 4 === 0) {
                    // Blend mode handling would go here if needed
                }
                
                this.m_segments[i].update(this.m_isLeft, delta);
            } else {
                if (!this.m_segments[i].isBeingCarried) {
                    this.m_segments[i].update(this.m_isLeft, delta);
                }
            }
        }

        for (let i = 0; i < this.m_buttons.length; i++) {
            if (this.m_buttons[i] === 1) {
                this.m_buttons[i] = 2;
            }
        }

        const tip = this.getTipSegment();
        const tx = tip.m_x + Math.cos(tip.m_angle) * tip.m_length;
        const ty = tip.m_y + Math.sin(tip.m_angle) * tip.m_length;
        this.m_dx = tx - this.m_tipX;
        this.m_tipY = ty;
        this.m_tipX = tx;
        
        this.shouldRemoveHealth = false;
    }

    reach(i) {
        if (this.m_tipY >= this.scene.the_ground || this.m_segments[i].isBeingCarried) {  
            this.m_isReaching = false;
        } else if (i === this.m_segments.length-1) {
            if (this.m_buttons[2] === 1 && 
                this.m_buttons[1] === 2 && 
                this.m_buttons[0] === 2 &&
                ((this.m_segments[0].atMaxAngle && this.m_segments[1].atMinAngle) ||
                 (this.m_segments[0].atMinAngle && this.m_segments[1].atMaxAngle))) {
                this.m_isReaching = true;
                this.m_targetX = this.m_tipX;
                this.m_targetY = this.m_tipY + this.scene.DPI(20);
            }
            
            this.m_segments[i].m_targetX = this.m_targetX;
            this.m_targetY = this.m_targetY + this.scene.DPI(50);
            this.m_segments[i].m_targetY = this.m_targetY;
        }

        if (this.m_isReaching) {      
            if (this.m_tipY < this.scene.the_ground) {
                this.m_segments[i].reach();
            } else {
                this.m_isReaching = false;
            }
        }
    }

    curlUp(i) {
        if (this.m_isReaching) return;

        if (this.m_isLeft) {
            this.m_segments[i].curl((i+1) * this.curlSpeed); 
        } else {
            this.m_segments[i].curl((i+1) * -this.curlSpeed);
        }
    }

    curlDown(i) {
        if (this.m_isReaching) return;

        if (this.m_isLeft) {
            this.m_segments[i].curl((i+1) * -this.curlSpeed);
        } else {
            this.m_segments[i].curl((i+1) * this.curlSpeed);
        }
    }

    pressButton(i) {
        if (this.m_buttons[i] === 0) {
            this.m_buttons[i] = 1;
        }
    }

    isOverlappingTipSegment(b) {
        if (this.getTipSegment().isBeingCarried) {
            return false;
        }

        const x1 = this.getTipSegment().m_x;
        const y1 = this.getTipSegment().m_y;
        const d = this.getTipSegment().m_length * 0.5 + b.radius;

        return this.scene.circleLineIntersect(
            this.getTipSegment().m_x, 
            this.getTipSegment().m_y, 
            this.m_tipX, 
            this.m_tipY, 
            b.x, 
            b.y, 
            b.radius
        );
    }

    isBeingCarried() {
        return this.getTipSegment().isBeingCarried;
    }

    getTipSegment() {
        return this.m_segments[this.m_segments.length-1];
    }
}

// Spider class
class Spider {
    constructor(scene, parent) {
        this.scene = scene;
        this.parent = parent;
        
        this.tipCount = 8;
        this.m_legs = [];
        this.x = this.scene.width / 2;
        this.y = this.scene.height - this.scene.DPI(230);
        
        // Create web strand
        this.webStrand = scene.add.graphics();
        const lineWidth = this.scene.DPI(5);
        this.webStrand.fillStyle(0xC0E0C0, 0.5);
        this.webStrand.lineStyle(lineWidth, 0xC0E0C0, 0.5);
        this.webStrand.beginPath();
        this.webStrand.moveTo(this.x, 0);
        this.webStrand.lineTo(this.x, 1);
        this.webStrand.closePath();
        
        // Create body parts
        this.butt = scene.add.sprite(this.x, this.y - this.scene.DPI(80), 'body0');
        this.butt.setOrigin(0.5);
        
        this.body = scene.add.sprite(this.x, this.y - this.scene.DPI(50), 'body1');
        this.body.setOrigin(0.5);
        
        // Create legs
        this.m_legs[6] = new Leg(this.x + this.scene.DPI(68), this.y - this.scene.DPI(30), -this.scene.QUARTER_PI, this.scene.DPI(98), this.y, this.scene, this);
        this.m_legs[7] = new Leg(this.x - this.scene.DPI(68), this.y - this.scene.DPI(30), Math.PI + this.scene.QUARTER_PI, this.scene.DPI(98), this.y, this.scene, this);
        
        // Additional legs...
        this.m_legs[4] = new Leg(this.x + this.scene.DPI(65), this.y - this.scene.DPI(20), -this.scene.QUARTER_PI * 0.65, this.scene.DPI(90), this.y, this.scene, this);
        this.m_legs[5] = new Leg(this.x - this.scene.DPI(65), this.y - this.scene.DPI(20), Math.PI + this.scene.QUARTER_PI * 0.65, this.scene.DPI(90), this.y, this.scene, this);
        
        this.m_legs[3] = new Leg(this.x - this.scene.DPI(60), this.y - this.scene.DPI(10), Math.PI + this.scene.QUARTER_PI * 0.33, this.scene.DPI(84), this.y, this.scene, this);
        this.m_legs[0] = new Leg(this.x - this.scene.DPI(50), this.y, Math.PI, this.scene.DPI(80), this.y, this.scene, this);
        
        this.m_legs[2] = new Leg(this.x + this.scene.DPI(60), this.y - this.scene.DPI(10), -this.scene.QUARTER_PI * 0.33, this.scene.DPI(84), this.y, this.scene, this);
        this.m_legs[1] = new Leg(this.x + this.scene.DPI(50), this.y, 0, this.scene.DPI(80), this.y, this.scene, this);
        
        // Head and mandible
        this.head = scene.add.sprite(this.x, this.y, 'headNormal');
        this.head.setOrigin(0.5);
        
        // Mandible
        this.mandible = scene.add.sprite(this.x, this.y, 'mandibleNormal');
        this.mandible.setOrigin(0.5);
        
        this.setup();
    }

    setup() {
        this.buttDirection = -0.01;
        this.buttOffset = 0;
        this.buttExploding = true;
        this.y = 0;
        
        for (let i = 0; i < this.m_legs.length; i++) {
            this.m_legs[i].setup();
        }
    }
    
    remove() {
        // Implementation depends on Phaser's object destruction methods
    }
    
    update(delta) {  
        if (this.buttExploding) {
            if (this.y >= this.scene.height - this.scene.DPI(230)) {
                this.y = this.scene.height - this.scene.DPI(230);
                this.buttExploding = false;
                this.butt.setVisible(false); 
                this.buttOffset = 0;
                this.buttDirection = -0.01;
                
                // Create babby spiders
                for (let i = 0; i < this.scene.BABBY_COUNT; i++) {
                    this.scene.the_babbySpiders[i] = new BabbySpider(this.scene, this.parent);
                }
                
                this.scene.the_blood = new Blood(this.scene, this.parent);
            } else {
                this.y += 5 * delta;
            }
        }  

        // Update head based on tip count
        if (this.tipCount < 2) {
            this.head.setTexture('headPain');
        } else if (this.tipCount < 5) {
            this.head.setTexture('headAngry');
        } else if (this.tipCount < 7) {
            this.head.setTexture('headAnnoyed');
        }

        this.buttOffset += this.buttDirection;

        if (this.buttOffset > 0.6 || this.buttOffset < -0.6) {
            this.buttDirection = -this.buttDirection;
        }
        
        this.y += this.buttOffset;

        // Update leg positions
        this.m_legs[0].m_segments[0].m_x = this.x - this.scene.DPI(50);
        this.m_legs[0].m_segments[0].m_y = this.y; 
        this.m_legs[3].m_segments[0].m_x = this.x - this.scene.DPI(60);
        this.m_legs[3].m_segments[0].m_y = this.y - this.scene.DPI(10);   
        this.m_legs[5].m_segments[0].m_x = this.x - this.scene.DPI(65);
        this.m_legs[5].m_segments[0].m_y = this.y - this.scene.DPI(20);
        this.m_legs[7].m_segments[0].m_x = this.x - this.scene.DPI(68);
        this.m_legs[7].m_segments[0].m_y = this.y - this.scene.DPI(30);

        this.m_legs[1].m_segments[0].m_x = this.x + this.scene.DPI(50);
        this.m_legs[1].m_segments[0].m_y = this.y; 
        this.m_legs[2].m_segments[0].m_x = this.x + this.scene.DPI(60);
        this.m_legs[2].m_segments[0].m_y = this.y - this.scene.DPI(10);   
        this.m_legs[4].m_segments[0].m_x = this.x + this.scene.DPI(65);
        this.m_legs[4].m_segments[0].m_y = this.y - this.scene.DPI(20);
        this.m_legs[6].m_segments[0].m_x = this.x + this.scene.DPI(68);
        this.m_legs[6].m_segments[0].m_y = this.y - this.scene.DPI(30);

        const explodeOffset = this.buttExploding ? this.scene.DPI(-100) : 0;

        if (this.buttExploding) {
            this.butt.x = this.x;
            this.butt.y = this.y - this.scene.DPI(80) + explodeOffset;
            const s = this.scene.DPI(0.2 + Math.sin(this.y * 0.5 * 0.01));
            this.butt.setScale(s);
        }
        
        // Update legs
        for (let i = this.m_legs.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.m_legs[i].m_segments.length; j++) {
                this.m_legs[i].reach(j);

                if (this.m_legs[i].m_buttons[j] !== 0) {
                    if (j === 0) {
                        this.m_legs[i].curlUp(j);
                    } else {
                        this.m_legs[i].curlDown(j);
                    }
                } else {
                    if (j === 0) {
                        this.m_legs[i].curlDown(j);
                    } else {
                        this.m_legs[i].curlUp(j);
                    }
                }
            }
            this.m_legs[i].update(delta);
        }
        
        // Update body and head
        this.body.x = this.x;
        this.body.y = this.y - this.scene.DPI(50);

        this.head.x = this.x;
        this.head.y = this.y;
        this.mandible.x = this.x;
        this.mandible.y = this.y;
    }
}

// Main game configuration
const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: GameScene,
    backgroundColor: '#000000',
    parent: 'gameContainer'
};

// Create the game
const game = new Phaser.Game(config);
