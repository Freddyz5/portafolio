//?Menu responsive
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");
const about = document.getElementById("nav-about");
const projects = document.getElementById("nav-projects");
const contact = document.getElementById("nav-contact");
let menuClicked = 0;

function menuVisible() {
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menuClicked = 1;
}
function menuHidden() {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menuClicked = 0;
}
function menuResponsive() {
    menuButton.addEventListener("click", (event) => {
        menuButton.href = '#none';
        if (menuClicked === 0) {
            menuVisible();
        } else {
            menuHidden();
            menuButton.href = '#home';
        }
    })
    about.addEventListener("click", (event) => {
        menuHidden();
    });
    projects.addEventListener("click", (event) => {
        menuHidden();
    });
    contact.addEventListener("click", (event) => {
        menuHidden();
    });
};

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
            value: '#A31621',
            delay: 3300,
            duration: 800,
            easing: 'easeInOutSine'
        },
    });
};

const logoHover = document.getElementById("home");
const logoPath = document.getElementById("path");
if (window.innerWidth > 700) {
    logoHover.addEventListener("mouseenter", (event) => {
        if (!animationExecuted) {
            animeLogo();
            animationExecuted = true;
        }
        event.target.style.opacity = '1';
        event.target.style.scale = '1.1';
    });
} else {
    menuResponsive();
    animeLogo();
    logoHover.style.opacity = '1';
    logoHover.style.scale = '1.1';
}

//?Translate
const translateButton = document.getElementById("translateButton");
const htmlElements = document.getElementsByClassName("translate");
const text = [];
const textTranslated = [ 
    "Sobre mi",
    "Proyectos",
    "Contacto",
    "Acerca de",
    "Soy un desarrollador Frontend con conocimientos en HTML, CSS y JavaScript. He adquirido experiencia de forma autodidacta en estos lenguajes y me caracterizo por mi curiosidad y pasión por crear y mantener proyectos relacionados con estas tecnologías. Mi objetivo es contribuir y mejorar mis habilidades esenciales en este campo mediante la colaboración en proyectos reales.",
    "Proyectos",
    "Pagina de tributo",
    "Creación en honor a la vida, logros e impacto de una figura notable.",
    "Página de Aterrizaje de Producto",
    "Creando una página de aterrizaje cautivadora para mostrar un producto destacado y aumentar las conversiones.",
    "Máquina de Frases Aleatorias",
    "Entregando inspiración y sabiduría con cada clic.",
    "Página de Fans de Dark Souls",
    "Diseñando una página de aterrizaje inmersiva para un videojuego dinámico, invitando a los jugadores a explorar su reino virtual.",
    "Trabajemos juntos...",
];
let translateClicked = 1;

for (let i = 0; i < htmlElements.length; i++) {
    text[i] = htmlElements[i].textContent;
}

translateButton.addEventListener("click", (event) => {
    if (translateClicked === 1) {
        translateClicked = 0;
        for (let j = 0; j < htmlElements.length; j++) {
            htmlElements[j].innerText = textTranslated[j];
        }
    } else {
        translateClicked = 1;
        for (let k = 0; k < htmlElements.length; k++) {
            htmlElements[k].innerText = text[k];
        }
    }
})

//? Fondo de estrellas moviéndose
// var numberOfStars = 100;
// var duration = 5000;
// var midScreenX = window.innerWidth / 2;
// var midScreenY = window.innerHeight / 2;
// var fragment = document.createDocumentFragment();
// var radius = 0;

// function createStar() {
//     radius = (Math.random() * (5000 - 100 + 1) + 100);
//     var star = document.createElement('div');
//     star.classList.add('star');
//     star.style.borderRadius = '5px';
//     star.style.backgroundColor = '#FFECD1';
//     star.style.boxShadow = '0 0 5px 5px #FFECD1';
//     star.style.width = '5px';
//     star.style.height = '5px';
//     return star;
// };

// for (var i = 0; i < numberOfStars; i++) {
//     var rangeBorn = 200;//!Max=200 Min=100
//     var angle = Math.random() * Math.PI * 2;
//     var starsRight = [createStar(), rangeBorn, 1];
//     var starsLeft = [createStar(), -rangeBorn, -1];
//     function animation(target, rangeBorn, direction) {
//         anime({
//             targets: target,
//             opacity: [1, 0],
//             scale: [0, 5],
//             left: [(midScreenX+anime.random(0, rangeBorn)) + 'px', (Math.abs(Math.cos(angle))*direction) * radius + midScreenX + 'px'],
//             top: [(midScreenY+anime.random(-100, 100)) + 'px', Math.sin(angle) * radius + midScreenY + 'px'],
//             delay: (duration / numberOfStars) * i,
//             duration: duration,
//             easing: 'easeInExpo',
//             loop: true
//         });
//         fragment.appendChild(target);
//     };
//     animation(starsRight[0], starsRight[1], starsRight[2]);
//     animation(starsLeft[0], starsLeft[1], starsLeft[2]);
// };

// document.body.appendChild(fragment);