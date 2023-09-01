//? Animación del logo
let animationExecuted = false;
function animeLogo() {
    anime({
        targets: '.logo path',
        opacity: 1,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInQuart',
        duration: 5000,
        fill: {
            value: '#FFECD1',
            delay: 3300,
            duration: 800,
            easing: 'easeInOutSine'
        },
    });
};

const logoHover = document.getElementById("home");
logoHover.addEventListener("mouseenter", (event) => {
    if (!animationExecuted) {
        animeLogo();
        animationExecuted = true;
    }
    event.target.style.opacity = '1';
    event.target.style.scale = '1.1';
});

//? Fondo de estrellas moviéndose
var numberOfStars = 100;
var duration = 5000;
var midScreenX = window.innerWidth / 2;
var midScreenY = window.innerHeight / 2;
var fragment = document.createDocumentFragment();
var radius = 0;

function createStar() {
    radius = (Math.random() * (5000 - 100 + 1) + 100);
    var star = document.createElement('div');
    star.classList.add('star');
    star.style.borderRadius = '5px';
    star.style.backgroundColor = '#FFECD1';
    star.style.boxShadow = '0 0 5px 5px #FFECD1';
    star.style.width = '5px';
    star.style.height = '5px';
    return star;
};

for (var i = 0; i < numberOfStars; i++) {
    var rangeBorn = 200;//!Max=200 Min=100 
    var angle = Math.random() * Math.PI * 2;
    var starsRight = [createStar(), rangeBorn, 1];
    var starsLeft = [createStar(), -rangeBorn, -1];
    function animation(target, rangeBorn, direction) {
        anime({
            targets: target,
            opacity: [1, 0],
            scale: [0, 5],
            left: [(midScreenX+anime.random(0, rangeBorn)) + 'px', (Math.abs(Math.cos(angle))*direction) * radius + midScreenX + 'px'],
            top: [(midScreenY+anime.random(-100, 100)) + 'px', Math.sin(angle) * radius + midScreenY + 'px'],
            delay: (duration / numberOfStars) * i,
            duration: duration,
            easing: 'easeInExpo',
            loop: true
        });
        fragment.appendChild(target);
    };
    animation(starsRight[0], starsRight[1], starsRight[2]);
    animation(starsLeft[0], starsLeft[1], starsLeft[2]);
};

document.body.appendChild(fragment);