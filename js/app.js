// ===== STAY SAFE MARMARIS — MAIN APP =====
// State
const AppState = {
  currentPage: 'intro',
  user: null,
  bill: [],
  selectedBar: null,
  currentCategory: 'spirits',
  exchangeRates: { GBP_TRY: 43.2, EUR_TRY: 36.8 },
  ratesLastUpdated: null,
  votes: JSON.parse(localStorage.getItem('ssm_votes') || '{}'),
  customBars: JSON.parse(localStorage.getItem('ssm_custom_bars') || '[]'),
  top10Filter: 'all',
  top10Limit: 10,
  scanFile: null
};

// ===== NAVIGATION =====
function showPage(pageId, addHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
    AppState.currentPage = pageId;
    page.scrollTop = 0;
    if (addHistory) history.pushState({ page: pageId }, '', '#' + pageId);
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) showPage(e.state.page, false);
  else showPage('menu', false);
});

// ===== INTRO =====
function initIntro() {
  generateStars();
  generateBubbles();
  // Auto-advance after 4.5 seconds
  setTimeout(() => transitionToMenu(), 4500);
  // Click/tap to skip
  document.getElementById('page-intro').addEventListener('click', transitionToMenu, { once: true });
}

function generateStars() {
  const container = document.getElementById('stars-container');
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 3}s;
      animation-duration:${2 + Math.random() * 3}s;
    `;
    container.appendChild(star);
  }
}

function generateBubbles() {
  const container = document.getElementById('page-intro');
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 60 + Math.random() * 120;
    bubble.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 4}s;
      animation-duration:${6 + Math.random() * 6}s;
      opacity:${0.2 + Math.random() * 0.3};
    `;
    container.appendChild(bubble);
  }
}

let introTransitioned = false;
function transitionToMenu() {
  if (introTransitioned) return;
  introTransitioned = true;
  const intro = document.getElementById('page-intro');
  intro.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  intro.style.opacity = '0';
  intro.style.transform = 'scale(1.05)';
  setTimeout(() => {
    intro.style.display = 'none';
    showPage('menu');
  }, 800);
}


// ===== AUTH =====
function initAuth() {
  const users = JSON.parse(localStorage.getItem('ssm_users') || '[]');
  const savedUser = localStorage.getItem('ssm_current_user');
  if (savedUser) AppState.user = JSON.parse(savedUser);
  updateAuthUI();
}

function updateAuthUI() {
  const btn = document.getElementById('menu-user-btn');
  if (!btn) return;
  if (AppState.user) {
    btn.innerHTML = `<span>👤</span> ${AppState.user.name.split(' ')[0]}`;
  } else {
    btn.innerHTML = `<span>👤</span> Sign In`;
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  if (!email || !pass) { showToast('Please fill all fields', 'error'); return; }
  const users = JSON.parse(localStorage.getItem('ssm_users') || '[]');
  const user = users.find(u => u.email === email && u.password === btoa(pass));
  if (!user) { showToast('Invalid email or password', 'error'); return; }
  AppState.user = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem('ssm_current_user', JSON.stringify(AppState.user));
  updateAuthUI();
  showPage('menu');
  showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  if (!name || !email || !pass) { showToast('Please fill all fields', 'error'); return; }
  if (pass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  const users = JSON.parse(localStorage.getItem('ssm_users') || '[]');
  if (users.find(u => u.email === email)) { showToast('Email already registered', 'error'); return; }
  const user = { id: Date.now(), name, email, password: btoa(pass), reviews: [], savedBars: [], joinDate: new Date().toISOString() };
  users.push(user);
  localStorage.setItem('ssm_users', JSON.stringify(users));
  AppState.user = { id: user.id, name, email };
  localStorage.setItem('ssm_current_user', JSON.stringify(AppState.user));
  updateAuthUI();
  showPage('menu');
  showToast(`Welcome to Stay Safe Marmaris, ${name.split(' ')[0]}! 🌊`, 'success');
}

function logout() {
  AppState.user = null;
  localStorage.removeItem('ssm_current_user');
  updateAuthUI();
  showPage('menu');
  showToast('Logged out successfully', 'info');
}


// ===== BILL SAVER =====
function initBillPage() {
  populateBarDropdown();
  renderDrinkGrid('spirits');
  renderBill();
  setActiveCategory('spirits');
}

function getAllBars() {
  return [...BARS_DATA, ...AppState.customBars];
}

function populateBarDropdown() {
  const sel = document.getElementById('bar-select');
  sel.innerHTML = '<option value="">-- Select a Bar / Restaurant --</option>';
  const all = getAllBars();
  all.forEach(bar => {
    const opt = document.createElement('option');
    opt.value = bar.id;
    opt.textContent = `${bar.name} — ${bar.location}`;
    if (bar.rating) opt.textContent += ` ⭐${bar.rating}`;
    sel.appendChild(opt);
  });
  if (AppState.selectedBar) sel.value = AppState.selectedBar.id;
}

function selectBar(id) {
  const all = getAllBars();
  AppState.selectedBar = all.find(b => String(b.id) === String(id)) || null;
  renderDrinkGrid(AppState.currentCategory);
}

function setActiveCategory(cat) {
  AppState.currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`.cat-btn[data-cat="${cat}"]`).forEach(b => b.classList.add('active'));
  renderDrinkGrid(cat);
}

function renderDrinkGrid(cat) {
  const grid = document.getElementById('drink-grid');
  grid.innerHTML = '';
  const bar = AppState.selectedBar;
  const menu = bar ? bar.menu : DEFAULT_PRICES;
  const items = menu[cat] || [];
  const gbpRate = AppState.exchangeRates.GBP_TRY;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'drink-card';
    const gbp = (item.price / gbpRate).toFixed(2);
    card.innerHTML = `
      <div class="drink-name">${item.name}</div>
      <div class="drink-price">₺${item.price}</div>
      <div class="drink-price-gbp">≈ £${gbp}</div>
    `;
    card.addEventListener('click', () => addToBill(item, cat));
    grid.appendChild(card);
  });

  // Add custom item card
  const addCard = document.createElement('div');
  addCard.className = 'drink-card';
  addCard.style.border = '1px dashed rgba(255,255,255,0.2)';
  addCard.innerHTML = `
    <div class="drink-name" style="color:var(--text-muted)">+ Custom</div>
    <div class="drink-price" style="color:var(--text-muted)">Add item</div>
  `;
  addCard.addEventListener('click', () => openCustomItemModal(cat));
  grid.appendChild(addCard);
}

function addToBill(item, cat) {
  // For spirits, offer mixer popup
  if (cat === 'spirits') {
    openMixerModal(item);
    return;
  }
  addItemToBill({ name: item.name, price: item.price, qty: 1 });
}

function addItemToBill(item) {
  const existing = AppState.bill.find(b => b.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    AppState.bill.push({ ...item, qty: 1 });
  }
  renderBill();
  showToast(`${item.name} added 🍹`, 'success');
  // Bounce bill panel
  const panel = document.getElementById('bill-panel');
  panel.style.transform = 'scale(1.01)';
  setTimeout(() => panel.style.transform = '', 150);
}

function removeBillItem(index) {
  AppState.bill.splice(index, 1);
  renderBill();
}

function updateQty(index, delta) {
  AppState.bill[index].qty += delta;
  if (AppState.bill[index].qty <= 0) AppState.bill.splice(index, 1);
  renderBill();
}

function renderBill() {
  const items = document.getElementById('bill-items');
  const count = document.getElementById('bill-count');
  const total = AppState.bill.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = AppState.bill.reduce((s, i) => s + i.qty, 0);
  const gbpRate = AppState.exchangeRates.GBP_TRY;
  const gbpTotal = (total / gbpRate).toFixed(2);

  count.textContent = totalQty;
  items.innerHTML = '';

  if (AppState.bill.length === 0) {
    items.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:0.85rem;">Your bill is empty — add drinks above</div>';
  } else {
    AppState.bill.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'bill-item';
      row.innerHTML = `
        <div class="bill-item-name">${item.name}</div>
        <div class="bill-item-qty">
          <button class="qty-btn" onclick="updateQty(${idx}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
        </div>
        <div class="bill-item-price">₺${item.price * item.qty}</div>
      `;
      items.appendChild(row);
    });
  }

  document.getElementById('bill-subtotal').textContent = `₺${total}`;
  document.getElementById('bill-total-try').textContent = `₺${total}`;
  document.getElementById('bill-total-gbp').textContent = `≈ £${gbpTotal}`;
}

function clearBill() {
  if (AppState.bill.length === 0) return;
  if (confirm('Clear all items from bill?')) {
    AppState.bill = [];
    renderBill();
    showToast('Bill cleared', 'info');
  }
}

function showBillSummary() {
  if (AppState.bill.length === 0) { showToast('Add items to your bill first', 'error'); return; }
  const total = AppState.bill.reduce((s, i) => s + i.price * i.qty, 0);
  const gbp = (total / AppState.exchangeRates.GBP_TRY).toFixed(2);
  const eur = (total / AppState.exchangeRates.EUR_TRY).toFixed(2);
  const barName = AppState.selectedBar ? AppState.selectedBar.name : 'Unknown Bar';
  openSummaryModal(barName, total, gbp, eur);
}


// ===== MIXER MODAL =====
function openMixerModal(spirit) {
  const modal = document.getElementById('modal-mixer');
  const bar = AppState.selectedBar;
  const mixers = (bar ? bar.menu.mixers : DEFAULT_PRICES.mixers) || [];
  document.getElementById('mixer-spirit-name').textContent = spirit.name;
  document.getElementById('mixer-spirit-price').textContent = `₺${spirit.price}`;

  const list = document.getElementById('mixer-list');
  list.innerHTML = '';
  mixers.forEach(mixer => {
    const btn = document.createElement('button');
    btn.style.cssText = 'width:100%;padding:12px 16px;background:var(--dark3);border:1px solid var(--card-border);border-radius:10px;color:var(--text);font-size:0.9rem;cursor:pointer;text-align:left;font-family:inherit;margin-bottom:8px;display:flex;justify-content:space-between;transition:all 0.2s;';
    btn.innerHTML = `<span>${mixer.name}</span><span style="color:var(--primary)">+ ₺${mixer.price}</span>`;
    btn.onmouseover = () => { btn.style.borderColor = 'var(--primary)'; btn.style.background = 'rgba(0,201,255,0.08)'; };
    btn.onmouseout = () => { btn.style.borderColor = 'var(--card-border)'; btn.style.background = 'var(--dark3)'; };
    btn.onclick = () => {
      addItemToBill({ name: `${spirit.name} & ${mixer.name}`, price: spirit.price + mixer.price, qty: 1 });
      closeModal('modal-mixer');
    };
    list.appendChild(btn);
  });

  // No mixer option
  const noMixerBtn = document.createElement('button');
  noMixerBtn.style.cssText = 'width:100%;padding:12px 16px;background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.3);border-radius:10px;color:#ff6b35;font-size:0.9rem;cursor:pointer;font-family:inherit;';
  noMixerBtn.textContent = 'No mixer — just the shot';
  noMixerBtn.onclick = () => {
    addItemToBill({ name: spirit.name, price: spirit.price, qty: 1 });
    closeModal('modal-mixer');
  };
  list.appendChild(noMixerBtn);

  modal.classList.add('open');
}

// ===== CUSTOM ITEM MODAL =====
function openCustomItemModal(cat) {
  document.getElementById('custom-item-cat').value = cat;
  document.getElementById('custom-item-name').value = '';
  document.getElementById('custom-item-price').value = '';
  document.getElementById('modal-custom-item').classList.add('open');
}

function addCustomItem() {
  const name = document.getElementById('custom-item-name').value.trim();
  const price = parseInt(document.getElementById('custom-item-price').value);
  if (!name || !price || price < 1) { showToast('Please enter a valid name and price', 'error'); return; }
  addItemToBill({ name, price, qty: 1 });
  closeModal('modal-custom-item');
}

// ===== ADD NEW BAR MODAL =====
function openAddBarModal() {
  document.getElementById('new-bar-name').value = '';
  document.getElementById('new-bar-location').value = '';
  document.getElementById('modal-add-bar').classList.add('open');
}

function saveNewBar() {
  const name = document.getElementById('new-bar-name').value.trim();
  const location = document.getElementById('new-bar-location').value.trim();
  if (!name || !location) { showToast('Please enter bar name and location', 'error'); return; }
  const newBar = {
    id: 'custom_' + Date.now(),
    name, location,
    type: 'bar',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
    rating: 0, thumbsUp: 0, thumbsDown: 0,
    priceRange: '££',
    description: 'User-added venue',
    menu: JSON.parse(JSON.stringify(DEFAULT_PRICES))
  };
  AppState.customBars.push(newBar);
  localStorage.setItem('ssm_custom_bars', JSON.stringify(AppState.customBars));
  populateBarDropdown();
  AppState.selectedBar = newBar;
  document.getElementById('bar-select').value = newBar.id;
  closeModal('modal-add-bar');
  showToast(`${name} added! 🎉`, 'success');
}

// ===== BILL SUMMARY MODAL =====
function openSummaryModal(barName, total, gbp, eur) {
  document.getElementById('summary-bar').textContent = barName;
  document.getElementById('summary-try').textContent = `₺${total}`;
  document.getElementById('summary-gbp').textContent = `£${gbp}`;
  document.getElementById('summary-eur').textContent = `€${eur}`;
  document.getElementById('summary-items').textContent = AppState.bill.reduce((s,i) => s+i.qty, 0);
  document.getElementById('modal-summary').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
}


// ===== TOP 10 BARS =====
function initTop10Page() {
  renderTop10(AppState.top10Filter, AppState.top10Limit);
}

function setTop10Filter(filter, limit) {
  AppState.top10Filter = filter;
  AppState.top10Limit = limit || 10;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderTop10(filter, AppState.top10Limit);
}

function renderTop10(filter, limit) {
  const list = document.getElementById('bars-list');
  list.innerHTML = '';
  let bars = [...BARS_DATA, ...AppState.customBars];

  // Filter
  if (filter === 'bars') bars = bars.filter(b => b.type === 'bar');
  else if (filter === 'restaurants') bars = bars.filter(b => b.type === 'restaurant');

  // Apply stored votes
  bars = bars.map(bar => {
    const v = AppState.votes[bar.id];
    if (v) {
      return { ...bar, thumbsUp: bar.thumbsUp + (v === 'up' ? 1 : 0), thumbsDown: bar.thumbsDown + (v === 'down' ? 1 : 0) };
    }
    return bar;
  });

  // Sort by ratio
  bars.sort((a, b) => {
    const scoreA = a.thumbsUp - a.thumbsDown;
    const scoreB = b.thumbsUp - b.thumbsDown;
    return scoreB - scoreA;
  });

  bars = bars.slice(0, limit || 10);

  bars.forEach((bar, idx) => {
    const card = document.createElement('div');
    card.className = 'bar-card';
    const stars = getStarsHTML(bar.rating || 0);
    const typeClass = bar.type === 'restaurant' ? 'type-restaurant' : 'type-bar';
    const typeLabel = bar.type === 'restaurant' ? '🍽 Restaurant' : '🍹 Bar';
    const voted = AppState.votes[bar.id];

    card.innerHTML = `
      <div class="bar-card-img-wrap">
        <img class="bar-card-image" src="${bar.image}" alt="${bar.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80'">
        <div class="bar-card-rank">${idx + 1}</div>
      </div>
      <div class="bar-card-body">
        <div class="bar-card-top">
          <div>
            <div class="bar-card-name">${bar.name}</div>
            <div class="bar-card-loc">📍 ${bar.location}</div>
          </div>
          <span class="bar-card-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="bar-card-desc">${bar.description || ''}</div>
        <div class="bar-card-footer">
          <div class="bar-stars">
            <span class="stars-display">${stars}</span>
            <span style="color:var(--text-muted)">${bar.rating ? bar.rating.toFixed(1) : 'No rating'}</span>
          </div>
          <div class="bar-vote-btns">
            <button class="vote-btn up ${voted === 'up' ? 'voted' : ''}" onclick="vote(${bar.id}, 'up', this)">
              👍 <span id="up-${bar.id}">${bar.thumbsUp}</span>
            </button>
            <button class="vote-btn down ${voted === 'down' ? 'voted' : ''}" onclick="vote(${bar.id}, 'down', this)">
              👎 <span id="down-${bar.id}">${bar.thumbsDown}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function vote(barId, dir, btn) {
  if (!AppState.user) {
    showToast('Please sign in to vote', 'error');
    showPage('auth');
    return;
  }
  const prev = AppState.votes[barId];
  if (prev === dir) {
    // Un-vote
    delete AppState.votes[barId];
    btn.classList.remove('voted');
  } else {
    AppState.votes[barId] = dir;
  }
  localStorage.setItem('ssm_votes', JSON.stringify(AppState.votes));
  renderTop10(AppState.top10Filter, AppState.top10Limit);
  showToast(dir === 'up' ? 'Thanks for the 👍!' : 'Thanks for the feedback 👎', 'info');
}

function getStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '⭐'.repeat(full) + (half ? '✨' : '') + '☆'.repeat(empty);
}


// ===== CURRENCY CONVERTER =====
async function initCurrencyPage() {
  await fetchExchangeRates();
  updateRateDisplay();
  calcGBP();
  calcEUR();
}

async function fetchExchangeRates() {
  try {
    // Try to fetch live rates
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    if (res.ok) {
      const data = await res.json();
      AppState.exchangeRates.GBP_TRY = parseFloat(data.rates.TRY.toFixed(2));
      AppState.exchangeRates.EUR_TRY = parseFloat((data.rates.TRY / data.rates.EUR).toFixed(2));
      AppState.ratesLastUpdated = new Date();
    }
  } catch (e) {
    // Use fallback rates already set
    console.log('Using cached rates');
  }
}

function updateRateDisplay() {
  const r = AppState.exchangeRates;
  document.getElementById('rate-gbp-try').textContent = `£1 = ₺${r.GBP_TRY}`;
  document.getElementById('rate-eur-try').textContent = `€1 = ₺${r.EUR_TRY}`;
  const updated = AppState.ratesLastUpdated;
  document.getElementById('rate-updated').textContent = updated
    ? `Updated: ${updated.toLocaleTimeString()}`
    : 'Using estimated rates';
}

function calcGBP() {
  const val = parseFloat(document.getElementById('gbp-input').value) || 0;
  const result = (val * AppState.exchangeRates.GBP_TRY).toFixed(0);
  document.getElementById('gbp-result').textContent = `₺${Number(result).toLocaleString()}`;
  document.getElementById('gbp-rate-note').textContent = `at ₺${AppState.exchangeRates.GBP_TRY} per £1`;
}

function calcEUR() {
  const val = parseFloat(document.getElementById('eur-input').value) || 0;
  const result = (val * AppState.exchangeRates.EUR_TRY).toFixed(0);
  document.getElementById('eur-result').textContent = `₺${Number(result).toLocaleString()}`;
  document.getElementById('eur-rate-note').textContent = `at ₺${AppState.exchangeRates.EUR_TRY} per €1`;
}

function calcTRYtoGBP() {
  const val = parseFloat(document.getElementById('try-gbp-input').value) || 0;
  const result = (val / AppState.exchangeRates.GBP_TRY).toFixed(2);
  document.getElementById('try-gbp-result').textContent = `£${result}`;
}

function calcTRYtoEUR() {
  const val = parseFloat(document.getElementById('try-eur-input').value) || 0;
  const result = (val / AppState.exchangeRates.EUR_TRY).toFixed(2);
  document.getElementById('try-eur-result').textContent = `€${result}`;
}

function setQuickAmount(inputId, amount) {
  document.getElementById(inputId).value = amount;
  if (inputId === 'gbp-input') calcGBP();
  else if (inputId === 'eur-input') calcEUR();
  else if (inputId === 'try-gbp-input') calcTRYtoGBP();
  else if (inputId === 'try-eur-input') calcTRYtoEUR();
}


// ===== REVIEW SYSTEM =====
function openReviewModal(barId) {
  if (!AppState.user) { showToast('Please sign in to leave a review', 'error'); showPage('auth'); return; }
  document.getElementById('review-bar-id').value = barId;
  document.getElementById('review-text').value = '';
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
  document.getElementById('modal-review').classList.add('open');
}

function setReviewStar(n) {
  document.querySelectorAll('.star-pick').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
  document.getElementById('review-rating').value = n;
}

function submitReview() {
  const barId = document.getElementById('review-bar-id').value;
  const rating = parseInt(document.getElementById('review-rating').value) || 0;
  const text = document.getElementById('review-text').value.trim();
  if (rating === 0) { showToast('Please select a star rating', 'error'); return; }
  
  const reviews = JSON.parse(localStorage.getItem('ssm_reviews') || '[]');
  reviews.push({
    barId, rating, text,
    userId: AppState.user.id, userName: AppState.user.name,
    date: new Date().toISOString()
  });
  localStorage.setItem('ssm_reviews', JSON.stringify(reviews));
  closeModal('modal-review');
  showToast(`Thanks for your review! ⭐`, 'success');
}

// ===== PROFILE =====
function initProfilePage() {
  if (!AppState.user) { showPage('auth'); return; }
  document.getElementById('profile-name').textContent = AppState.user.name;
  document.getElementById('profile-email').textContent = AppState.user.email;
  document.getElementById('profile-initial').textContent = AppState.user.name.charAt(0).toUpperCase();
  
  const reviews = JSON.parse(localStorage.getItem('ssm_reviews') || '[]');
  const userReviews = reviews.filter(r => r.userId === AppState.user.id);
  const savedBars = Object.keys(AppState.votes).length;
  
  document.getElementById('stat-reviews').textContent = userReviews.length;
  document.getElementById('stat-saved').textContent = savedBars;
  document.getElementById('stat-bills').textContent = localStorage.getItem('ssm_bill_count') || '0';
}

// ===== ADMIN PAGE =====
function initAdminPage() {
  const allBars = getAllBars();
  const reviews = JSON.parse(localStorage.getItem('ssm_reviews') || '[]');
  const users = JSON.parse(localStorage.getItem('ssm_users') || '[]');
  
  document.getElementById('admin-total-bars').textContent = allBars.length;
  document.getElementById('admin-total-reviews').textContent = reviews.length;
  document.getElementById('admin-total-users').textContent = users.length;
  document.getElementById('admin-custom-bars').textContent = AppState.customBars.length;
  
  const list = document.getElementById('admin-bar-list');
  list.innerHTML = '';
  allBars.forEach(bar => {
    const row = document.createElement('div');
    row.className = 'admin-bar-row';
    row.innerHTML = `
      <div class="admin-bar-info">
        <div class="admin-bar-name">${bar.name}</div>
        <div class="admin-bar-meta">${bar.location} • ${bar.type}</div>
      </div>
      <div class="admin-bar-actions">
        <button class="admin-btn edit" onclick="showToast('Edit: ${bar.name}', 'info')">Edit</button>
        ${String(bar.id).startsWith('custom_') ? `<button class="admin-btn del" onclick="deleteCustomBar('${bar.id}')">Del</button>` : ''}
      </div>
    `;
    list.appendChild(row);
  });
}

function deleteCustomBar(id) {
  if (!confirm('Delete this bar?')) return;
  AppState.customBars = AppState.customBars.filter(b => b.id !== id);
  localStorage.setItem('ssm_custom_bars', JSON.stringify(AppState.customBars));
  initAdminPage();
  showToast('Bar removed', 'info');
}

// ===== MENU SCAN (SIMULATED AI) =====
function openScanModal() {
  document.getElementById('modal-scan').classList.add('open');
}

function handleScanUpload(input) {
  if (input.files && input.files[0]) {
    AppState.scanFile = input.files[0];
    document.getElementById('scan-filename').textContent = input.files[0].name;
    document.getElementById('scan-process-btn').style.display = 'block';
    showToast('Menu photo selected!', 'success');
  }
}

function processScanImage() {
  // Simulated AI processing
  const scanResult = document.getElementById('scan-result');
  scanResult.innerHTML = '<div class="loading"><div class="spinner"></div>Analysing menu...</div>';
  
  setTimeout(() => {
    // Simulate menu detection
    const detectedItems = [
      { name: "Mojito", price: 280 },
      { name: "Vodka Shot", price: 120 },
      { name: "Efes Beer", price: 160 },
      { name: "Long Island", price: 340 }
    ];
    
    scanResult.innerHTML = '<h4 style="margin-bottom:10px;color:var(--success)">✅ Detected Prices:</h4>';
    detectedItems.forEach(item => {
      scanResult.innerHTML += `
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--dark3);border-radius:8px;margin-bottom:6px;">
          <span>${item.name}</span>
          <span style="color:var(--primary)">₺${item.price}</span>
        </div>
      `;
    });
    scanResult.innerHTML += '<p style="color:var(--text-muted);font-size:0.8rem;margin-top:10px;">These are estimated prices based on similar menus. Edit as needed.</p>';
    showToast('Menu analysed! 📸', 'success');
  }, 2500);
}


// ===== UTILITY FUNCTIONS =====
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

function handleUserBtnClick() {
  if (AppState.user) showPage('profile');
  else showPage('auth');
}

function showAuthTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initIntro();
  
  // Set up navigation
  document.getElementById('btn-bill').addEventListener('click', () => {
    showPage('bill');
    initBillPage();
  });
  document.getElementById('btn-top10').addEventListener('click', () => {
    showPage('top10');
    initTop10Page();
  });
  document.getElementById('btn-currency').addEventListener('click', () => {
    showPage('currency');
    initCurrencyPage();
  });
  document.getElementById('menu-user-btn').addEventListener('click', handleUserBtnClick);
  
  // Bar select
  document.getElementById('bar-select').addEventListener('change', (e) => selectBar(e.target.value));
  
  // Close modals on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Handle hash navigation
  const hash = window.location.hash.slice(1);
  if (hash && hash !== 'intro') {
    introTransitioned = true;
    document.getElementById('page-intro').style.display = 'none';
    showPage(hash);
  }
});
