// Variables globales
let compteur = 0; // Compteur qui permet de connaître l'image sur laquelle on se trouve
let timer, elements, slides, slideWidth, speed, transition;
let currentIndex = 0;

const events = [
  { title: "Événement 1", expiration: "2024-02-10" },
  { title: "Événement 2", expiration: "2024-03-15" },
  { title: "Événement 3", expiration: "2024-03-17" },

  // Ajoutez d'autres événements selon vos besoins
];

function updateCarousel() {
  const event = events[currentIndex];
  const titleElement = document.querySelector(".event__title"); // Assurez-vous que cet élément existe dans votre HTML
  const currentDateElement = document.getElementById("current-date"); // Idem
  const expirationElement = document.getElementById("expiration-date"); // Idem

  titleElement.textContent = event.title;
  currentDateElement.textContent = new Date().toLocaleDateString("fr-FR");
  expirationElement.textContent = event.expiration;
}
updateCarousel();

document.addEventListener("DOMContentLoaded", () => {
  // On récupère le diaporama
  const diapo = document.querySelector(".diapo");
  // On récupère le data-speed
  speed = diapo.dataset.speed;
  transition = diapo.dataset.transition;

  elements = document.querySelector(".elements");

  // On clone la 1ère image
  let firstImage = elements.firstElementChild.cloneNode(true);

  // On injecte le clone à la fin du diapo
  elements.appendChild(firstImage);

  slides = Array.from(elements.children);

  // On récupère la largeur d'une slide
  slideWidth = diapo.getBoundingClientRect().width;

  // On récupère les flèches
  let next = document.querySelector("#nav-droite");
  let prev = document.querySelector("#nav-gauche");

  /*document.querySelector("#nav-droite").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + events.length) % events.length;
    updateCarousel();

    // Flèche de navigation gauche
    document.querySelector("#nav-gauche").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % events.length;
      updateCarousel();
    });

    // Initialiser avec le premier événement
    updateCarousel();
  });
*/
  document.querySelector(".diapo").addEventListener("mouseover", () => {
    currentIndex = (currentIndex - 1 + events.length) % events.length;
    updateCarousel();
  });

  // On gère le clic
  next.addEventListener("click", slideNext);
  prev.addEventListener("click", slidePrev);

  // On automatise le défilement
  timer = setInterval(slideNext, speed);

  // On gère l'arrêt et la reprise
  diapo.addEventListener("mouseover", stopTimer);
  diapo.addEventListener("mouseout", startTimer);
});

/**
 * Cette fonction fait défiler le diaporama vers la droite
 */
function slideNext() {
  // On incrémente le compteur
  compteur++;
  elements.style.transition = transition + "ms linear";

  let decal = -slideWidth * compteur;
  elements.style.transform = `translateX(${decal}px)`;

  // On attend la fin de la transition et on "rembobine" de façon cachée
  setTimeout(function () {
    if (compteur >= slides.length - 1) {
      compteur = 0;
      elements.style.transition = "unset";
      elements.style.transform = "translateX(0)";
    }
  }, transition);
}

/**
 * Cette fonction fait défiler le diaporama vers la gauche
 */
function slidePrev() {
  // On décrémente le compteur
  compteur--;
  elements.style.transition = transition + "ms linear";

  if (compteur < 0) {
    compteur = slides.length - 1;
    let decal = -slideWidth * compteur;
    elements.style.transition = "unset";
    elements.style.transform = `translateX(${decal}px)`;
    setTimeout(slidePrev, 1);
  }

  let decal = -slideWidth * compteur;
  elements.style.transform = `translateX(${decal}px)`;
}

function stopTimer() {
  clearInterval(timer);
}

function startTimer() {
  timer = setInterval(slideNext, speed);
}
