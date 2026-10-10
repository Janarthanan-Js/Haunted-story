// ---------- Config ----------
// Where the sightings come from
const API_URL = '/api';

// Holds the data after it is loaded
let sightings = [];


// ---------- Load data ----------
async function loadSightings() {
  try {
    const data = await fetch(API_URL);
    const response = await data.json();

    sightings = response;

    renderCards(sightings);
  } catch (err) {
    console.log(err);
  }
}


// ---------- Helpers ----------
function formatDate(iso) {
  const d = new Date(iso);

  const day = d.getDate();

  const month = d.toLocaleString('en-GB', {
    month: 'long'
  });

  const year = d.getFullYear();

  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${day} ${month} ${year} at ${time}`;
}


// ---------- Render cards ----------
function renderCards(cardsData) {

  const container = document.querySelector('#sightings-list');

  let cardsHTML = '';

  // Newest first
  const sorted = [...cardsData].sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );

  sorted.forEach((card) => {

    cardsHTML += `
      <article class="card">
        <p class="meta">
          ${formatDate(card.datetime)}, ${card.location}
        </p>

        <h3>${card.title}</h3>

        <p>${card.details}</p>

        <a
          href="#"
          class="read-full"
          data-id="${card.id}"
        >
          Read in full
        </a>
      </article>
    `;
  });

  container.innerHTML = cardsHTML;
}


// ---------- Modal ----------

const modal = document.querySelector('#detail-modal');

const detailMeta = document.querySelector('#detail-meta');

const detailTitle = document.querySelector('#detail-title');

const detailBody = document.querySelector('#detail-body');


// Click "Read in full"
document
  .querySelector('#sightings-list')
  .addEventListener('click', (e) => {

    if (!e.target.classList.contains('read-full')) {
      return;
    }

    e.preventDefault();

    const id = Number(e.target.dataset.id);

    const sighting = sightings.find(
      (s) => Number(s.id) === id
    );

    if (!sighting) {
      console.log('Sighting not found:', id);
      return;
    }

    detailMeta.textContent =
      `${formatDate(sighting.datetime)}, ${sighting.location}`;

    detailTitle.textContent = sighting.title;

    detailBody.textContent = sighting.details;

    modal.classList.remove('hidden');
  });


// Close button
document
  .querySelector('#close-modal')
  .addEventListener('click', () => {

    modal.classList.add('hidden');

  });


// Click dark background to close
modal.addEventListener('click', (e) => {

  if (e.target === modal) {
    modal.classList.add('hidden');
  }

});


// ---------- Navigation ----------

const views = document.querySelectorAll('.view');

const navLinks = document.querySelectorAll('.nav-link');


function showView(viewId) {

  views.forEach((v) => {
    v.classList.remove('active');
  });

  document
    .getElementById(viewId)
    .classList.add('active');


  navLinks.forEach((link) => {

    link.classList.toggle(
      'active',
      link.dataset.view === viewId
    );

  });

  // NEW: the news stream only runs while the Live News view is open
  if (viewId === 'news') {
    startNews();
  } else {
    stopNews();
  }
}


navLinks.forEach((link) => {

  link.addEventListener('click', (e) => {

    e.preventDefault();

    showView(link.dataset.view);

  });

});


// ---------- Live News (NEW) ----------

// Where the live headlines will come from (Server-Sent Events endpoint).
// Change this to whatever route you create in Node.
const NEWS_STREAM_URL = '/api/news';

// true  = rotate the hardcoded headlines below (no server needed)
// false = connect to NEWS_STREAM_URL with EventSource
const USE_DEMO_NEWS = false;

const DEMO_INTERVAL_MS = 4000;

const DEMO_HEADLINES = [
  'ABC News: Paranormal investigators probe New York theater',
  'Spirit Herald: Strange lights reported over Edinburgh cemetery',
  'Local News: Lighthouse keeper claims nightly visits from a pale sailor',
  'Ghost Gazette: Hotel guests hear piano music from an empty ballroom'
];

const newsCard = document.querySelector('#news-card');
const newsHeadline = document.querySelector('#news-headline');

let newsSource = null;   // the EventSource (real mode)
let demoTimer = null;    // the setInterval id (demo mode)


// Single place that puts a headline on screen.
// Demo mode and the real server both call this.
function updateNews(text) {
  // textContent (not innerHTML) so server text can never inject HTML
  newsHeadline.textContent = text;

  // Restart the fade-in animation
  newsCard.classList.remove('fresh');
  void newsCard.offsetWidth;
  newsCard.classList.add('fresh');
}


function startNews() {
  stopNews(); // never run two streams at once

  if (USE_DEMO_NEWS) {
    let i = 0;
    updateNews(DEMO_HEADLINES[i]);

    demoTimer = setInterval(() => {
      i = (i + 1) % DEMO_HEADLINES.length;
      updateNews(DEMO_HEADLINES[i]);
    }, DEMO_INTERVAL_MS);

    return;
  }

  // Real mode: the server pushes a message, we show it
  newsSource = new EventSource(NEWS_STREAM_URL);

  newsSource.onmessage = (e) => {
    // Server sends: data: {"event":"news-update","story":"..."}
    try {
      updateNews(JSON.parse(e.data).story);
    } catch (err) {
      console.error('Bad news message:', e.data, err);
    }
  };

  newsSource.onerror = () => {
    // EventSource reconnects by itself, we just tell the user
    updateNews('The signal faded... reconnecting');
  };
}


function stopNews() {
  clearInterval(demoTimer);
  demoTimer = null;

  if (newsSource) {
    newsSource.close();
    newsSource = null;
  }
}


// "Check out our news feed!" links (home page + news page footer)
document.querySelectorAll('.news-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showView(link.dataset.view);
  });
});


// ---------- Start ----------

loadSightings();