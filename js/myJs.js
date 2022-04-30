
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39
const KEY_DOWN = 40;
const KEY_SPACE = 32;
const KEY_Z = 90;
const KEY_X = 88;

let PLAYER_MOVEMENT = 4;
let PLAYER_BOTTOM = 80;
let LASER_SPEED = 50;
let SHOOTING_INTERVAL = 10;
let BOOSTED_SHOOT = 1;

let JUMP_HEIGHT = 20;
let JUMP = 20;

let lastLoopRun = 0;

const closeTutorial = () => {
    let tutorial = document.querySelector(".tutorial");
    tutorial.style.display = "none";
}

const createSprite = (element, x, y, w, h) => {
    var sprite = new Object();
    sprite.element = element;
    sprite.x = x;
    sprite.y = y;
    sprite.w = w;
    sprite.h = h;
    return sprite;
}


let controller = new Object();

function toggleKey(keyCode, isPressed) {
    if (keyCode == KEY_LEFT) {
        controller.left = isPressed;
    }
    if (keyCode == KEY_RIGHT) {
        controller.right = isPressed;
    }
    if (keyCode == KEY_UP) {
        controller.up = isPressed;
    }
    if (keyCode == KEY_DOWN) {
        controller.down = isPressed
    }
    if (keyCode == KEY_SPACE) {
        controller.space = isPressed;
    }
    if (keyCode == KEY_Z) {
        controller.z = isPressed;
    }
    if (keyCode == KEY_X) {
        controller.x = isPressed;
    }
}

let item = new Object();
item.isPlayerLeft = false;
item.isplayerRight = true;
item.shootingFireCount = 0;
item.playerShadowYDecreement = 0.4;
item.bodyActionBeforeShoot = 0;
item.headActionBeforShoot = 17;
item.handActionAfterShoot = 36;
item.effectYRegulator = 0;
item.bodyBackground = document.getElementById('Bbackground');
item.CurrentWindowWidth = 1366 - 47; //parseInt(getComputedStyle(item.bodyBackground).getPropertyValue('width'));

let bodyRightIncreement = 0;
let headRight = 17;
let handRight = 36;
function playerRight() {
    player.x += PLAYER_MOVEMENT;
    mainObject.style.transform = 'scaleX(1)';
    playerShadow.x = player.x - 20;
    ovalObject.style.backgroundImage = "url('objects/laserOvalRight.png')";
    shootObject.style.backgroundImage = "url('objects/shootingEffectRight.png')";
    laserObject.style.backgroundImage = "url('objects/laserRight.png')";
    bodyRightIncreement += 0.5;
    headRight += 0.5;
    handRight += 0.5;
    playerHand.style.left = handRight + 'px';
    if (handRight >= 39) {
        handRight = 39;
    }
    playerHead.style.left = headRight + 'px';
    if (headRight >= 22) {
        headRight = 22;
    }
    playerBody.style.transform = 'rotate(' + bodyRightIncreement + 'deg)';
    if (bodyRightIncreement >= 5) {
        bodyRightIncreement = 5;
    }
    wheelLG.classList.add('animateWheelRight');
    wheelMD.classList.add('animateWheelRight');
    wheelSM.classList.add('animateWheelRight');
    if (player.x < 1100 && player.x > 100) {
        planets.x -= 0.1;
    }
}

let bodyLeftIncreement = 0;
let headLeft = 17;
let handLeft = 36;
function playerLeft() {
    player.x -= PLAYER_MOVEMENT;
    item.playerShadowYDecreement = -0.4;
    mainObject.style.transform = 'scaleX(-1)';
    playerShadow.x = player.x;
    ovalObject.style.backgroundImage = "url('objects/laserOvalLeft.png')";
    shootObject.style.backgroundImage = "url('objects/shootingEffectLeft.png')";
    laserObject.style.backgroundImage = "url('objects/laserLeft.png')";
    bodyLeftIncreement += 0.5;
    headLeft += 0.5;
    handLeft += 0.5;
    playerHand.style.left = handLeft + 'px';
    if (handLeft >= 39) {
        handLeft = 39;
    }
    playerHead.style.left = headLeft + 'px';
    if (headLeft >= 22) {
        headLeft = 22;
    }
    playerBody.style.transform = 'rotate(' + bodyLeftIncreement + 'deg)';
    if (bodyLeftIncreement >= 5) {
        bodyLeftIncreement = 5;
    }
    wheelLG.classList.add('animateWheelLeft');
    wheelMD.classList.add('animateWheelLeft');
    wheelSM.classList.add('animateWheelLeft');
    if (player.x < 1100 && player.x > 100) {
        planets.x += 0.1;
    }
}

let handAngle = 0;
let handTop = 56;
function handUP() {
    handAngle--;
    handTop -= 0.6;
    if (handAngle <= -23 && handAngle <= 41) {
        handAngle = -23;
        handTop = 41;
    }
    playerHand.style.top = handTop + 'px';
    playerHand.style.transform = 'rotate(' + handAngle + 'deg)';
    playerHead.style.transform = 'rotate(' + handAngle * 0.6 + 'deg)';

}

function handDown() {
    handAngle++;
    handTop += 0.6;
    if (handAngle >= 0 && handTop >= 56) {
        handAngle = 0;
        handTop = 56;
    }
    playerHand.style.top = handTop + 'px';
    playerHand.style.transform = 'rotate(' + handAngle + 'deg)';
    playerHead.style.transform = 'rotate(' + handAngle * 0.6 + 'deg)';
}

function Jump() {
    JUMP -= 0.8;
    player.y += JUMP;
    playerShadow.h -= JUMP * 0.089;
    playerFoot.style.transform = "rotate(10deg)";
    playerHead.style.transform = 'rotate(-15deg)';
    if (player.y <= PLAYER_BOTTOM) {
        player.y = PLAYER_BOTTOM;
        playerFoot.style.transform = "rotate(0deg)";
        playerHead.style.transform = 'rotate(0deg)';
        JUMP = JUMP_HEIGHT;
        playerShadow.h = 38;
        playerShadow.x = player.x
    }
}

let opacityDecreement = 0;
function shootingObject(_effectYRegulator, _bodyActionBeforeShoot, _headActionBeforeShoot,
    _laserOvalXRegulator, _laserOvalYController, _laserOvalYAngleRegulator, _laserOvalAngleRegulator,
    _shootingEffAngleYRegulator, _shootingEffXRegulator, _shootingEffWAnimationIncreement, _shootingEffHAnimationIncreement,
    _laserXLeftRightController, _laserYController, _laserYAngleController, _pokeWhileJumpAndShoot) {

    item.effectYRegulator += _effectYRegulator;
    item.shootingFireCount++;
    item.bodyActionBeforeShoot += _bodyActionBeforeShoot;
    item.headActionBeforShoot += _headActionBeforeShoot;

    laserOval.x = player.x + _laserOvalXRegulator;
    laserOval.y = player.y + _laserOvalYController + Math.floor(handAngle) * _laserOvalYAngleRegulator;
    ovalObject.style.transform = 'rotate(' + handAngle * _laserOvalAngleRegulator + 'deg)';

    shootObject.style.display = 'block';
    shootEffect.y = player.y + (85 - item.effectYRegulator) + Math.floor(handAngle) * _shootingEffAngleYRegulator;
    shootEffect.x = player.x + _shootingEffXRegulator;
    shootEffect.w = item.shootingFireCount * _shootingEffWAnimationIncreement;
    shootEffect.h = item.shootingFireCount * _shootingEffHAnimationIncreement;

    playerBody.style.transform = 'rotate(' + item.bodyActionBeforeShoot + 'deg)';
    playerHead.style.left = item.headActionBeforShoot + 'px';


    if (player.x < item.CurrentWindowWidth * (33 / 100) && item.isplayerRight) {
        SHOOTING_INTERVAL = 10 * BOOSTED_SHOOT;
    }
    else {
        SHOOTING_INTERVAL = 10;
    }
    if (player.x > item.CurrentWindowWidth * (33 / 100)) {
        SHOOTING_INTERVAL = 15 * BOOSTED_SHOOT;
    }
    if (player.x > item.CurrentWindowWidth * (66 / 100)) {
        SHOOTING_INTERVAL = 20 * BOOSTED_SHOOT;
    }

    if (item.shootingFireCount >= SHOOTING_INTERVAL) {
        console.log(item.CurrentWindowWidth);
        if (player.y > 100) {
            player.x += _pokeWhileJumpAndShoot;
        }
        laserObject.style.display = 'block';
        laserSound.playbackRate = 1;
        laserSound.currentTime = 0;
        laserSound.play();
        opacityDecreement = 1;
        ovalObject.style.opacity = opacityDecreement;
        laser.x = player.x + _laserXLeftRightController;
        laser.y = player.y + _laserYController + Math.floor(handAngle) * _laserYAngleController;
        item.shootingFireCount = 0;
        item.bodyActionBeforeShoot = 0;
        item.headActionBeforShoot = 17;
        playerHand.style.left = (item.handActionAfterShoot - 3) + 'px';
        shootEffect.w = 0;
        shootEffect.h = 0;
        item.effectYRegulator = 0;

    }


}

function ShootLeft() {
    shootingObject(0.9, 0.2, 0.4, -25, 71, -1.6, -1, -1.55, -20, 2.2, 2.2, -75, 84, -2.3, 5);
}

function ShootRight() {
    shootingObject(1.2, 0.2, 0.4, 121, 70, -1.6, 1, -1.8, 130, 2.2, 2.2, 138, 85, -2, -5);
}



function handleControls() {
    if (controller.left) {
        playerLeft();
        item.isPlayerLeft = true;
        item.isplayerRight = false;
    }
    if (controller.right) {
        playerRight();
        item.isPlayerLeft = false;
        item.isplayerRight = true;
    }
    if (controller.up) {
        handUP();
    }
    if (controller.down) {
        handDown();
    }
    if (controller.space) {
        PLAYER_MOVEMENT = 8;
        BOOSTED_SHOOT = 0.5;
        LASER_SPEED = 200;
    }
    if (controller.z) {
        Jump();
    }
    if (controller.x && laser.x >= item.CurrentWindowWidth) {
        ShootRight();
    }
    if (controller.x && laser.x <= -50) {
        ShootLeft();
    }
    EnsureBounds();
}

function EnsureBounds() {
    if (player.x <= 0) {
        player.x = 0;
    }
    if (player.x >= 1240) {
        player.x = 1240;
    }
}

function SetPosition(sprite) {
    var x = document.getElementById(sprite.element);
    x.style.bottom = sprite.y + 'px';
    x.style.left = sprite.x + 'px';
    x.style.width = sprite.w + 'px';
    x.style.height = sprite.h + 'px';
}

function showSprites() {
    SetPosition(player);
    SetPosition(playerShadow);
    SetPosition(shootEffect);
    SetPosition(laserOval);
    SetPosition(planets);
    SetPosition(laser);
}


function updatePosition() {
    if (item.isplayerRight) {
        laser.x += LASER_SPEED;
        laser.y -= Math.sin(Math.PI * handAngle / 165) * LASER_SPEED;
        shootEffect.x = player.x + 130;
        shootEffect.y = player.y + 82 + Math.floor(handAngle) * (-1.6);
        shootObject.style.display = 'none';
        laserObject.style.transform = 'rotate(' + handAngle + 'deg)';
        if (laser.x >= item.CurrentWindowWidth) {
            laser.x = item.CurrentWindowWidth;
            laser.y = -800;

            //laserObject.style.display = 'none';
        }
    }
    if (item.isPlayerLeft) {
        laser.x -= LASER_SPEED;
        laser.y -= Math.sin(Math.PI * handAngle / 180) * LASER_SPEED;
        shootEffect.x = player.x - 5;
        shootEffect.y = player.y + 82 + Math.floor(handAngle) * (-1.6);
        shootObject.style.display = 'none';
        laserObject.style.transform = 'rotate(' + handAngle * (-1) + 'deg)';
        if (laser.x <= -50) {
            laser.x = -50;
            laser.y = -800;
            //laserObject.style.display = 'none';
        }
    }
    if (opacityDecreement <= 1) {
        opacityDecreement -= 0.04;
        ovalObject.style.opacity = opacityDecreement;
        if (opacityDecreement <= 0) {
            opacityDecreement = 0;
        }
    }
    if (!controller.right) {
        bodyRightIncreement = 0;
        headRight = 17;
        handRight = 36;
        playerHand.style.left = '36px';
        playerHead.style.left = '17px';
        playerBody.style.transform = 'rotate(0deg)';
        wheelLG.classList.remove('animateWheelRight');
        wheelMD.classList.remove('animateWheelRight');
        wheelSM.classList.remove('animateWheelRight');
    }
    if (!controller.left) {
        bodyLeftIncreement = 0;
        headLeft = 17;
        handleft = 36;
        playerHand.style.left = '36px';
        playerHead.style.left = '17px';
        playerBody.style.transform = 'rotate(0deg)';
        wheelLG.classList.remove('animateWheelLeft');
        wheelMD.classList.remove('animateWheelLeft');
        wheelSM.classList.remove('animateWheelLeft');
    }
    if (!controller.space) {
        PLAYER_MOVEMENT = 4;
        BOOSTED_SHOOT = 1;
        SHOOTING_INTERVAL = 10;
        LASER_SPEED = 50;
    }
    if (!controller.z) {
        item.jumpKeyPressInterval = 0;
    }
    if (!controller.z && player.y > PLAYER_BOTTOM) {
        JUMP -= 0.8;
        player.y += JUMP;
        playerShadow.h -= JUMP * 0.089;
        if (player.y < PLAYER_BOTTOM) {
            player.y = PLAYER_BOTTOM;
            playerShadow.h = 38;
            playerShadow.x = player.x - 10;
            playerFoot.style.transform = "rotate(0deg)";
            playerHead.style.transform = 'rotate(0deg)';
            mainObject.classList.remove('animatePlayer');
            return null;
        }
    }
    if (!controller.x) {
        item.shootingFireCount = 0;
        shootEffect.w = 0;
        shootEffect.h = 0;
        item.effectYRegulator = 0;
    }

    item.CurrentWindowWidth = 1366;//parseInt(getComputedStyle(item.bodyBackground).getPropertyValue('width'));
}

document.onkeydown = function (e) {
    toggleKey(e.keyCode, true);
}

document.onkeyup = function (e) {
    toggleKey(e.keyCode, false);
}

function loop() {
    if (new Date().getTime() - lastLoopRun > 10) {
        showSprites();
        updatePosition();
        handleControls();

        lastLoopRun = new Date().getTime();
    }
    setTimeout('loop();', 2);
}


const player = createSprite('player', 200, PLAYER_BOTTOM, null, null);
const mainObject = document.getElementById('player');
const playerShadow = createSprite('playerShadow', 180, 65, 145, 38);
const playerFoot = document.getElementById('playerFoot');
const wheelLG = document.getElementById('wheelLG');
const wheelMD = document.getElementById('wheelMD');
const wheelSM = document.getElementById('wheelSM');
const playerBody = document.getElementById('playerBody');
const playerHand = document.getElementById('playerHand');
const playerHead = document.getElementById('playerHead');

const laser = createSprite('laser', -100, -2000, null, null);
const laserObject = document.getElementById('laser');
const laserSound = new Audio('objects/laserSound.mp3');
const shootEffect = createSprite('shootEffect', 50, 0, null, null);
const shootObject = document.getElementById('shootEffect');
const laserOval = createSprite('laserOval', -100, -20, null, null);
const ovalObject = document.getElementById('laserOval');

const planets = createSprite('planets', 0, null, null, null);

loop();