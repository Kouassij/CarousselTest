// Variables globales
let compteur = 0; // Compteur qui permet de connaître l'image sur laquelle on se trouve
let timer, elements, slides, slideWidth, speed, transition;
let currentIndex = 0; // Utiliser let pour déclarer currentIndex

const events = [
  {
    Date: new Date(2024, 0, 31), // Corrigé pour correspondre à janvier (0)
    title: "Je n'ai pas encore mes accès!!!!",
    expiration: "2024-03-15",
  },

  {
    Date: new Date(2024, 1, 1), // Février
    title: "25e anniversaire",
    expiration: "2024-03-17",
  },
  {
    Date: new Date(2024, 1, 7), // Mois en JavaScript commence à 0
    title: "Rendez-vous chez le médecin à 15h25.",
    expiration: "2024-02-10",
  },
];

window.onload = () => {
  initCarousel();
  bindCalendarToEvents();
  setupNavigation();
};

function initCarousel() {
  // Initialisations liées au carrousel
  diapo = document.querySelector(".diapo");
  speed = diapo.dataset.speed;
  transition = diapo.dataset.transition;

  elements = document.querySelector(".elements");
  let firstImage = elements.firstElementChild.cloneNode(true);
  elements.appendChild(firstImage);
  slides = Array.from(elements.children);

  slideWidth = diapo.getBoundingClientRect().width;
  updateCarousel(); // Mise à jour initiale pour afficher le premier événement
}

function updateCarousel() {
  const event = events[currentIndex];
  document.querySelectorAll(".event__title").forEach((el, idx) => {
    if (idx === currentIndex) {
      el.textContent = event.title; // Mettre à jour le titre
    }
  });
  // Mise à jour des dates actuelles et d'expiration pour tous les éléments
  document.querySelectorAll(".event__date").forEach((el) => {
    el.textContent = `Date du jour: ${new Date().toLocaleDateString("fr-FR")}`;
  });
  document.querySelectorAll(".event__expiration").forEach((el, idx) => {
    if (idx === currentIndex) {
      el.textContent = `Expire le: ${event.expiration}`; // Mettre à jour l'expiration
    }
  });
}

function bindCalendarToEvents() {
  const calendar = document.getElementById("choose-date");
  calendar.addEventListener("change", (event) => {
    const selectedDate = new Date(event.target.value);
    updateCarouselToDate(selectedDate);
  });
}

function updateCarouselToDate(Date) {
  const eventIndex = events.findIndex(
    (event) => event.Date.toDateString() === Date.toDateString()
  );

  if (eventIndex !== -1) {
    currentIndex = eventIndex;
    updateCarousel();
  } else {
    console.log("Aucun événement trouvé pour cette date.");
  }
}
function showCarousselEvent() {}

function setupNavigation() {
  let next = document.querySelector("#nav-droite");
  let prev = document.querySelector("#nav-gauche");

  next.addEventListener("click", () => {
    slideNext();
    currentIndex = (currentIndex + 1) % events.length;
    updateCarousel();
  });

  prev.addEventListener("click", () => {
    slidePrev();
    currentIndex = (currentIndex - 1 + events.length) % events.length;
    updateCarousel();
  });

  diapo.addEventListener("mouseover", stopTimer);
  diapo.addEventListener("mouseout", startTimer);
  timer = setInterval(slideNext, speed);
}

function slideNext() {
  moveToSlide(1);
}

function slidePrev() {
  moveToSlide(-1);
}

function moveToSlide(direction) {
  compteur += direction;
  if (compteur < 0) {
    compteur = slides.length - 1; // ajuster pour le clone
  } else if (compteur >= slides.length) {
    compteur = 1; // ajuster pour le clone
  }
  let decal = -slideWidth * compteur;
  elements.style.transition = `${transition}ms linear`;
  elements.style.transform = `translateX(${decal}px)`;

  if (compteur === slides.length - 1) {
    setTimeout(() => {
      elements.style.transition = "none";
      compteur = 0;
      elements.style.transform = "translateX(0)";
    }, transition);
  } else if (compteur === 0) {
    setTimeout(() => {
      elements.style.transition = "none";
      compteur = slides.length - 2;
      elements.style.transform = `translateX(${-slideWidth * compteur}px)`;
    }, transition);
  }
}

function stopTimer() {
  clearInterval(timer);
}

function startTimer() {
  timer = setInterval(slideNext, speed);
}
