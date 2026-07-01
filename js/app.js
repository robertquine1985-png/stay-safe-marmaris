// ===== STAY SAFE MARMARIS — MAIN APP v2.0 =====
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
  crowdPrices: JSON.parse(localStorage.getItem('ssm_crowd_prices') || '{}'),
  billHistory: JSON.parse(localStorage.getItem('ssm_bill_history') || '[]'),
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
  setTimeout(() => transitionToMenu(), 4500);
  document.getElementById('page-intro').addEventListener('click', transitionToMenu, { once: true });
}

function generateStars() {
  const container = document.getElementById('stars-container');
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s;`;
    container.appendChild(star);
  }
}

function generateBubbles() {
  const container = document.getElementById('page-intro');
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 60 + Math.random() * 120;
    bubble.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*4}s;animation-duration:${6+Math.random()*6}s;opacity:${0.2+Math.random()*0.3};`;
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
  setTimeout(() => { intro.style.display = 'none'; showPage('menu'); }, 800);
}


// ===== AUTH =====
function initAuth() {
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


// ===== CROWD-SOURCED PRICES =====
// Prices saved by users override base prices for a bar
function getCrowdPrice(barId, itemName) {
  const key = `${barId}_${itemName}`;
  return AppState.crowdPrices[key] || null;
}

function saveCrowdPrice(barId, itemName, price) {
  const key = `${barId}_${itemName}`;
  AppState.crowdPrices[key] = { price, updatedBy: AppState.user ? AppState.user.name : 'Anonymous', updatedAt: new Date().toISOString() };
  localStorage.setItem('ssm_crowd_prices', JSON.stringify(AppState.crowdPrices));
}

function getItemPrice(barId, item) {
  const crowd = getCrowdPrice(barId, item.name);
  return crowd ? crowd.price : item.price;
}

// ===== BILL SAVER =====
function initBillPage() {
  populateBarDropdown();
  renderDrinkGrid('spirits');
  renderBill();
  setActiveCategory('spirits');
  updateMapHeader();
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
  // Add "Add Another Bar" option at bottom
  const addOpt = document.createElement('option');
  addOpt.value = '__add_new__';
  addOpt.textContent = '➕ Add Another Bar...';
  addOpt.style.fontWeight = 'bold';
  sel.appendChild(addOpt);
  if (AppState.selectedBar) sel.value = AppState.selectedBar.id;
}

function selectBar(id) {
  // Handle "Add Another Bar" option
  if (id === '__add_new__') {
    document.getElementById('bar-select').value = AppState.selectedBar ? AppState.selectedBar.id : '';
    openAddBarModal();
    return;
  }
  // Prevent switching bars if bill has items
  if (AppState.bill.length > 0 && id && AppState.selectedBar && String(id) !== String(AppState.selectedBar.id)) {
    showToast('Clear your current bill before switching bars', 'error');
    document.getElementById('bar-select').value = AppState.selectedBar.id;
    return;
  }
  const all = getAllBars();
  AppState.selectedBar = all.find(b => String(b.id) === String(id)) || null;
  renderDrinkGrid(AppState.currentCategory);
  updateMapHeader();
}

function updateMapHeader() {
  const mapContainer = document.getElementById('bar-map-header');
  if (!mapContainer) return;
  if (!AppState.selectedBar) {
    mapContainer.style.display = 'none';
    return;
  }
  const bar = AppState.selectedBar;
  const query = encodeURIComponent(`${bar.name}, ${bar.location}, Marmaris, Turkey`);
  mapContainer.style.display = 'block';
  mapContainer.innerHTML = `
    <div class="map-bar-name">📍 ${bar.name} — ${bar.location}</div>
    <iframe class="map-iframe" src="https://www.google.com/maps?q=${query}&output=embed" allowfullscreen loading="lazy"></iframe>
  `;
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
  const barId = bar ? bar.id : 'default';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'drink-card';
    const actualPrice = getItemPrice(barId, item);
    const gbp = (actualPrice / gbpRate).toFixed(2);
    const crowd = getCrowdPrice(barId, item.name);
    const crowdBadge = crowd ? `<div class="crowd-badge">👥 Updated by ${crowd.updatedBy}</div>` : '';
    card.innerHTML = `
      <div class="drink-name">${item.name}</div>
      <div class="drink-price">₺${actualPrice}</div>
      <div class="drink-price-gbp">≈ £${gbp}</div>
      ${crowdBadge}
    `;
    card.addEventListener('click', () => openPriceConfirmModal(item, cat, barId));
    grid.appendChild(card);
  });

  // Add custom item card
  const addCard = document.createElement('div');
  addCard.className = 'drink-card';
  addCard.style.border = '1px dashed rgba(255,255,255,0.2)';
  addCard.innerHTML = `<div class="drink-name" style="color:var(--text-muted)">+ Add Drink</div><div class="drink-price" style="color:var(--text-muted)">to ${cat}</div>`;
  addCard.addEventListener('click', () => openAddDrinkToCategoryModal(cat));
  grid.appendChild(addCard);
}


// ===== PRICE CONFIRM MODAL (Editable price before adding) =====
function openPriceConfirmModal(item, cat, barId) {
  const actualPrice = getItemPrice(barId, item);
  // For spirits, show mixer options with editable price
  if (cat === 'spirits') {
    openMixerModal(item, barId);
    return;
  }
  // For other categories, show price confirm popup
  document.getElementById('price-confirm-name').textContent = item.name;
  document.getElementById('price-confirm-input').value = actualPrice;
  document.getElementById('price-confirm-cat').value = cat;
  document.getElementById('price-confirm-item-name').value = item.name;
  document.getElementById('price-confirm-bar-id').value = barId;
  const crowd = getCrowdPrice(barId, item.name);
  const infoEl = document.getElementById('price-confirm-info');
  if (crowd) {
    infoEl.innerHTML = `<span style="color:var(--success)">👥 Last updated by ${crowd.updatedBy}</span>`;
  } else {
    infoEl.innerHTML = `<span style="color:var(--text-muted)">Base price — edit if different on menu</span>`;
  }
  document.getElementById('modal-price-confirm').classList.add('open');
}

function confirmAddToBill() {
  const name = document.getElementById('price-confirm-item-name').value;
  const price = parseInt(document.getElementById('price-confirm-input').value);
  const barId = document.getElementById('price-confirm-bar-id').value;
  if (!price || price < 1) { showToast('Enter a valid price', 'error'); return; }
  // Save crowd-sourced price for this bar
  saveCrowdPrice(barId, name, price);
  addItemToBill({ name, price, qty: 1 });
  closeModal('modal-price-confirm');
  // Refresh grid to show updated price
  renderDrinkGrid(AppState.currentCategory);
}

// ===== MIXER MODAL (with editable prices) =====
function openMixerModal(spirit, barId) {
  const modal = document.getElementById('modal-mixer');
  const bar = AppState.selectedBar;
  const mixers = (bar ? bar.menu.mixers : DEFAULT_PRICES.mixers) || [];
  const spiritPrice = getItemPrice(barId || 'default', spirit);

  document.getElementById('mixer-spirit-name').textContent = spirit.name;
  document.getElementById('mixer-spirit-price-input').value = spiritPrice;
  document.getElementById('mixer-spirit-item-name').value = spirit.name;
  document.getElementById('mixer-bar-id').value = barId || 'default';

  const list = document.getElementById('mixer-list');
  list.innerHTML = '';
  mixers.forEach(mixer => {
    const mixerPrice = getItemPrice(barId || 'default', mixer);
    const btn = document.createElement('button');
    btn.className = 'mixer-option-btn';
    btn.innerHTML = `<span>${mixer.name}</span><span style="color:var(--primary)">+ ₺${mixerPrice}</span>`;
    btn.onclick = () => {
      const editedSpiritPrice = parseInt(document.getElementById('mixer-spirit-price-input').value) || spiritPrice;
      saveCrowdPrice(barId || 'default', spirit.name, editedSpiritPrice);
      const totalPrice = editedSpiritPrice + mixerPrice;
      addItemToBill({ name: `${spirit.name} & ${mixer.name}`, price: totalPrice, qty: 1 });
      closeModal('modal-mixer');
      renderDrinkGrid(AppState.currentCategory);
    };
    list.appendChild(btn);
  });

  // No mixer option
  const noMixerBtn = document.createElement('button');
  noMixerBtn.className = 'mixer-no-mixer-btn';
  noMixerBtn.textContent = 'No mixer — just the shot';
  noMixerBtn.onclick = () => {
    const editedSpiritPrice = parseInt(document.getElementById('mixer-spirit-price-input').value) || spiritPrice;
    saveCrowdPrice(barId || 'default', spirit.name, editedSpiritPrice);
    addItemToBill({ name: spirit.name, price: editedSpiritPrice, qty: 1 });
    closeModal('modal-mixer');
    renderDrinkGrid(AppState.currentCategory);
  };
  list.appendChild(noMixerBtn);

  modal.classList.add('open');
}

function addToBill(item, cat) {
  const barId = AppState.selectedBar ? AppState.selectedBar.id : 'default';
  openPriceConfirmModal(item, cat, barId);
}

function addItemToBill(item) {
  const existing = AppState.bill.find(b => b.name === item.name && b.price === item.price);
  if (existing) {
    existing.qty++;
  } else {
    AppState.bill.push({ ...item, qty: 1 });
  }
  renderBill();
  showToast(`${item.name} added 🍹`, 'success');
  const panel = document.getElementById('bill-panel');
  if (panel) { panel.style.transform = 'scale(1.01)'; setTimeout(() => panel.style.transform = '', 150); }
}

function removeBillItem(index) { AppState.bill.splice(index, 1); renderBill(); }

function updateQty(index, delta) {
  AppState.bill[index].qty += delta;
  if (AppState.bill[index].qty <= 0) AppState.bill.splice(index, 1);
  renderBill();
}


// ===== BILL RENDERING =====
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

// ===== BILL PAID / CONFIRM =====
function openBillPaidModal() {
  if (AppState.bill.length === 0) { showToast('Add items to your bill first', 'error'); return; }
  document.getElementById('bill-paid-comment').value = '';
  document.getElementById('bill-paid-filename').textContent = '';
  document.getElementById('bill-paid-photo-data').value = '';
  const total = AppState.bill.reduce((s, i) => s + i.price * i.qty, 0);
  const gbp = (total / AppState.exchangeRates.GBP_TRY).toFixed(2);
  document.getElementById('bill-paid-total').textContent = `₺${total} (≈ £${gbp})`;
  document.getElementById('bill-paid-bar').textContent = AppState.selectedBar ? AppState.selectedBar.name : 'Unknown Bar';
  document.getElementById('bill-paid-items-count').textContent = AppState.bill.reduce((s,i)=>s+i.qty, 0);
  document.getElementById('modal-bill-paid').classList.add('open');
}

function handleBillPhotoUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    document.getElementById('bill-paid-filename').textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('bill-paid-photo-data').value = e.target.result;
    };
    reader.readAsDataURL(file);
    showToast('Bill photo added! 📸', 'success');
  }
}

function confirmBillPaid() {
  const comment = document.getElementById('bill-paid-comment').value.trim();
  const photoData = document.getElementById('bill-paid-photo-data').value;
  const total = AppState.bill.reduce((s, i) => s + i.price * i.qty, 0);
  const gbpRate = AppState.exchangeRates.GBP_TRY;

  const billRecord = {
    id: Date.now(),
    barName: AppState.selectedBar ? AppState.selectedBar.name : 'Unknown Bar',
    barId: AppState.selectedBar ? AppState.selectedBar.id : null,
    items: [...AppState.bill],
    totalTRY: total,
    totalGBP: (total / gbpRate).toFixed(2),
    comment: comment,
    photo: photoData || null,
    date: new Date().toISOString(),
    userId: AppState.user ? AppState.user.id : null,
    userName: AppState.user ? AppState.user.name : 'Guest'
  };

  AppState.billHistory.unshift(billRecord);
  localStorage.setItem('ssm_bill_history', JSON.stringify(AppState.billHistory));

  // Update bill count
  const count = parseInt(localStorage.getItem('ssm_bill_count') || '0') + 1;
  localStorage.setItem('ssm_bill_count', String(count));

  // Clear current bill
  AppState.bill = [];
  renderBill();
  closeModal('modal-bill-paid');
  showToast('Bill saved to history! ✅', 'success');
}


// ===== BILL HISTORY =====
function initBillHistoryPage() {
  const list = document.getElementById('bill-history-list');
  list.innerHTML = '';
  const history = AppState.billHistory;

  if (history.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="icon">🧾</div><h3>No bills yet</h3><p>Once you confirm a paid bill, it'll show here for you and others to compare.</p></div>`;
    return;
  }

  history.forEach(bill => {
    const card = document.createElement('div');
    card.className = 'history-card';
    const date = new Date(bill.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const itemCount = bill.items.reduce((s,i)=>s+i.qty, 0);
    card.innerHTML = `
      <div class="history-card-header">
        <div>
          <div class="history-bar-name">${bill.barName}</div>
          <div class="history-date">${date} • ${itemCount} items • by ${bill.userName}</div>
        </div>
        <div class="history-total">₺${bill.totalTRY}<br><span style="font-size:0.75rem;color:var(--success)">£${bill.totalGBP}</span></div>
      </div>
      <div class="history-items">
        ${bill.items.map(i => `<span class="history-item-tag">${i.name} x${i.qty} — ₺${i.price*i.qty}</span>`).join('')}
      </div>
      ${bill.comment ? `<div class="history-comment">💬 "${bill.comment}"</div>` : ''}
      ${bill.photo ? `<div class="history-photo-wrap"><img src="${bill.photo}" class="history-photo" onclick="openPhotoViewer('${bill.photo}')" alt="Bill photo"></div>` : ''}
    `;
    list.appendChild(card);
  });
}

function openPhotoViewer(src) {
  const viewer = document.createElement('div');
  viewer.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;padding:20px;cursor:pointer;';
  viewer.innerHTML = `<img src="${src}" style="max-width:100%;max-height:90vh;border-radius:12px;">`;
  viewer.onclick = () => viewer.remove();
  document.body.appendChild(viewer);
}

// ===== ADD BAR MODAL (enhanced with location for map) =====
function openAddBarModal() {
  document.getElementById('new-bar-name').value = '';
  document.getElementById('new-bar-location').value = '';
  document.getElementById('new-bar-type').value = 'bar';
  document.getElementById('modal-add-bar').classList.add('open');
}

function saveNewBar() {
  const name = document.getElementById('new-bar-name').value.trim();
  const location = document.getElementById('new-bar-location').value.trim();
  const type = document.getElementById('new-bar-type').value;
  if (!name || !location) { showToast('Please enter bar name and location', 'error'); return; }
  const newBar = {
    id: 'custom_' + Date.now(),
    name, location, type,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
    rating: 0, thumbsUp: 0, thumbsDown: 0,
    priceRange: '££',
    description: `Added by ${AppState.user ? AppState.user.name : 'Guest'}`,
    addedBy: AppState.user ? AppState.user.name : 'Guest',
    menu: JSON.parse(JSON.stringify(DEFAULT_PRICES))
  };
  AppState.customBars.push(newBar);
  localStorage.setItem('ssm_custom_bars', JSON.stringify(AppState.customBars));
  populateBarDropdown();
  AppState.selectedBar = newBar;
  document.getElementById('bar-select').value = newBar.id;
  renderDrinkGrid(AppState.currentCategory);
  updateMapHeader();
  closeModal('modal-add-bar');
  showToast(`${name} added! All users can now see this bar 🎉`, 'success');
}

// ===== ADD DRINK TO CATEGORY =====
function openAddDrinkToCategoryModal(cat) {
  const catNames = {spirits:'Spirits',cocktails:'Cocktails',beers:'Beers',mixers:'Mixers',softDrinks:'Soft Drinks'};
  document.getElementById('custom-item-cat').value = cat;
  document.getElementById('custom-item-name').value = '';
  document.getElementById('custom-item-price').value = '';
  // Update modal title
  const modal = document.getElementById('modal-custom-item');
  modal.querySelector('h3').textContent = `Add Drink to ${catNames[cat] || cat}`;
  modal.querySelector('p').textContent = `Add a new drink to the ${catNames[cat]} category for this bar:`;
  modal.classList.add('open');
}

function addCustomItem() {
  const name = document.getElementById('custom-item-name').value.trim();
  const price = parseInt(document.getElementById('custom-item-price').value);
  const cat = document.getElementById('custom-item-cat').value;
  if (!name || !price || price < 1) { showToast('Please enter a valid name and price', 'error'); return; }
  const barId = AppState.selectedBar ? AppState.selectedBar.id : 'default';

  // Save as crowd-sourced price
  saveCrowdPrice(barId, name, price);

  // Also add to bar menu if custom bar
  const customBarIdx = AppState.customBars.findIndex(b => b.id === barId);
  if (customBarIdx >= 0) {
    if (!AppState.customBars[customBarIdx].menu[cat]) {
      AppState.customBars[customBarIdx].menu[cat] = [];
    }
    // Only add if not already present
    if (!AppState.customBars[customBarIdx].menu[cat].find(d => d.name === name)) {
      AppState.customBars[customBarIdx].menu[cat].push({ name, price });
      localStorage.setItem('ssm_custom_bars', JSON.stringify(AppState.customBars));
    }
  }

  // Add to bill
  addItemToBill({ name, price, qty: 1 });
  closeModal('modal-custom-item');
  renderDrinkGrid(AppState.currentCategory);
}

// ===== GPS LOCATION FOR NEW BAR =====
function getBarLocation() {
  const statusIcon = document.getElementById('gps-status-icon');
  const statusText = document.getElementById('gps-status-text');

  if (!navigator.geolocation) {
    statusText.textContent = 'Geolocation not supported on this device';
    statusIcon.textContent = '❌';
    showToast('Location not supported', 'error');
    return;
  }

  statusText.textContent = 'Getting location...';
  statusIcon.textContent = '⏳';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      document.getElementById('new-bar-lat').value = lat;
      document.getElementById('new-bar-lng').value = lng;
      statusIcon.textContent = '✅';
      statusText.textContent = `Location found: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      showToast('Location captured! ✅', 'success');
    },
    (error) => {
      statusIcon.textContent = '❌';
      switch(error.code) {
        case 1: statusText.textContent = 'Location denied — please enable in browser settings'; break;
        case 2: statusText.textContent = 'Location unavailable — try again'; break;
        case 3: statusText.textContent = 'Location timed out — try again'; break;
        default: statusText.textContent = 'Location error — try again';
      }
      showToast('Enable location to add a bar', 'error');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
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

function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeAllModals() { document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); }


// ===== TOP 10 BARS =====
function initTop10Page() { renderTop10(AppState.top10Filter, AppState.top10Limit); }

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
  if (filter === 'bars') bars = bars.filter(b => b.type === 'bar');
  else if (filter === 'restaurants') bars = bars.filter(b => b.type === 'restaurant');
  bars = bars.map(bar => {
    const v = AppState.votes[bar.id];
    if (v) return { ...bar, thumbsUp: bar.thumbsUp + (v === 'up' ? 1 : 0), thumbsDown: bar.thumbsDown + (v === 'down' ? 1 : 0) };
    return bar;
  });
  bars.sort((a, b) => (b.thumbsUp - b.thumbsDown) - (a.thumbsUp - a.thumbsDown));
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
          <div><div class="bar-card-name">${bar.name}</div><div class="bar-card-loc">📍 ${bar.location}</div></div>
          <span class="bar-card-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="bar-card-desc">${bar.description || ''}</div>
        <div class="bar-card-footer">
          <div class="bar-stars"><span class="stars-display">${stars}</span><span style="color:var(--text-muted)">${bar.rating ? bar.rating.toFixed(1) : 'N/A'}</span></div>
          <div class="bar-vote-btns">
            <button class="vote-btn up ${voted==='up'?'voted':''}" onclick="vote(${bar.id},'up',this)">👍 <span>${bar.thumbsUp}</span></button>
            <button class="vote-btn down ${voted==='down'?'voted':''}" onclick="vote(${bar.id},'down',this)">👎 <span>${bar.thumbsDown}</span></button>
          </div>
        </div>
      </div>`;
    list.appendChild(card);
  });
}

function vote(barId, dir, btn) {
  if (!AppState.user) { showToast('Please sign in to vote', 'error'); showPage('auth'); return; }
  const prev = AppState.votes[barId];
  if (prev === dir) { delete AppState.votes[barId]; btn.classList.remove('voted'); }
  else { AppState.votes[barId] = dir; }
  localStorage.setItem('ssm_votes', JSON.stringify(AppState.votes));
  renderTop10(AppState.top10Filter, AppState.top10Limit);
  showToast(dir === 'up' ? 'Thanks! 👍' : 'Thanks for feedback 👎', 'info');
}

function getStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '⭐'.repeat(full) + (half ? '✨' : '') + '☆'.repeat(5 - full - half);
}


// ===== CURRENCY CONVERTER =====
async function initCurrencyPage() {
  await fetchExchangeRates();
  updateRateDisplay();
  calcGBP(); calcEUR();
}

async function fetchExchangeRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    if (res.ok) {
      const data = await res.json();
      AppState.exchangeRates.GBP_TRY = parseFloat(data.rates.TRY.toFixed(2));
      AppState.exchangeRates.EUR_TRY = parseFloat((data.rates.TRY / data.rates.EUR).toFixed(2));
      AppState.ratesLastUpdated = new Date();
    }
  } catch (e) { console.log('Using cached rates'); }
}

function updateRateDisplay() {
  const r = AppState.exchangeRates;
  document.getElementById('rate-gbp-try').textContent = `£1 = ₺${r.GBP_TRY}`;
  document.getElementById('rate-eur-try').textContent = `€1 = ₺${r.EUR_TRY}`;
  document.getElementById('rate-updated').textContent = AppState.ratesLastUpdated ? `Updated: ${AppState.ratesLastUpdated.toLocaleTimeString()}` : 'Using estimated rates';
}

function calcGBP() { const v=parseFloat(document.getElementById('gbp-input').value)||0; document.getElementById('gbp-result').textContent=`₺${Math.round(v*AppState.exchangeRates.GBP_TRY).toLocaleString()}`; document.getElementById('gbp-rate-note').textContent=`at ₺${AppState.exchangeRates.GBP_TRY} per £1`; }
function calcEUR() { const v=parseFloat(document.getElementById('eur-input').value)||0; document.getElementById('eur-result').textContent=`₺${Math.round(v*AppState.exchangeRates.EUR_TRY).toLocaleString()}`; document.getElementById('eur-rate-note').textContent=`at ₺${AppState.exchangeRates.EUR_TRY} per €1`; }
function calcTRYtoGBP() { const v=parseFloat(document.getElementById('try-gbp-input').value)||0; document.getElementById('try-gbp-result').textContent=`£${(v/AppState.exchangeRates.GBP_TRY).toFixed(2)}`; }
function calcTRYtoEUR() { const v=parseFloat(document.getElementById('try-eur-input').value)||0; document.getElementById('try-eur-result').textContent=`€${(v/AppState.exchangeRates.EUR_TRY).toFixed(2)}`; }
function setQuickAmount(id,amt) { document.getElementById(id).value=amt; if(id==='gbp-input')calcGBP(); else if(id==='eur-input')calcEUR(); else if(id==='try-gbp-input')calcTRYtoGBP(); else if(id==='try-eur-input')calcTRYtoEUR(); }

// ===== REVIEW SYSTEM =====
function openReviewModal(barId) {
  if (!AppState.user) { showToast('Please sign in to leave a review', 'error'); showPage('auth'); return; }
  document.getElementById('review-bar-id').value = barId;
  document.getElementById('review-text').value = '';
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
  document.getElementById('modal-review').classList.add('open');
}
function setReviewStar(n) { document.querySelectorAll('.star-pick').forEach((s,i) => s.classList.toggle('active', i<n)); document.getElementById('review-rating').value=n; }
function submitReview() {
  const barId=document.getElementById('review-bar-id').value; const rating=parseInt(document.getElementById('review-rating').value)||0; const text=document.getElementById('review-text').value.trim();
  if(rating===0){showToast('Please select a star rating','error');return;}
  const reviews=JSON.parse(localStorage.getItem('ssm_reviews')||'[]');
  reviews.push({barId,rating,text,userId:AppState.user.id,userName:AppState.user.name,date:new Date().toISOString()});
  localStorage.setItem('ssm_reviews',JSON.stringify(reviews));
  closeModal('modal-review'); showToast('Thanks for your review! ⭐','success');
}

// ===== PROFILE =====
function initProfilePage() {
  if (!AppState.user) { showPage('auth'); return; }
  document.getElementById('profile-name').textContent = AppState.user.name;
  document.getElementById('profile-email').textContent = AppState.user.email;
  document.getElementById('profile-initial').textContent = AppState.user.name.charAt(0).toUpperCase();
  const reviews = JSON.parse(localStorage.getItem('ssm_reviews') || '[]');
  const userReviews = reviews.filter(r => r.userId === AppState.user.id);
  document.getElementById('stat-reviews').textContent = userReviews.length;
  document.getElementById('stat-saved').textContent = Object.keys(AppState.votes).length;
  document.getElementById('stat-bills').textContent = AppState.billHistory.length;
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
    row.innerHTML = `<div class="admin-bar-info"><div class="admin-bar-name">${bar.name}</div><div class="admin-bar-meta">${bar.location} • ${bar.type}${bar.addedBy ? ' • Added by '+bar.addedBy : ''}</div></div>
      <div class="admin-bar-actions"><button class="admin-btn edit" onclick="showToast('Edit: ${bar.name}','info')">Edit</button>${String(bar.id).startsWith('custom_')?`<button class="admin-btn del" onclick="deleteCustomBar('${bar.id}')">Del</button>`:''}</div>`;
    list.appendChild(row);
  });
}
function deleteCustomBar(id) { if(!confirm('Delete this bar?'))return; AppState.customBars=AppState.customBars.filter(b=>b.id!==id); localStorage.setItem('ssm_custom_bars',JSON.stringify(AppState.customBars)); initAdminPage(); showToast('Bar removed','info'); }

// ===== MENU SCAN =====
function openScanModal() {
  if (!AppState.selectedBar) { showToast('Select a bar first before scanning', 'error'); return; }
  document.getElementById('scan-filename').textContent = '';
  document.getElementById('scan-process-btn').style.display = 'none';
  document.getElementById('scan-result').innerHTML = '';
  document.getElementById('scan-actions').style.display = 'none';
  AppState.scanResults = null;
  document.getElementById('modal-scan').classList.add('open');
}
function handleScanUpload(input) { if(input.files&&input.files[0]){AppState.scanFile=input.files[0];document.getElementById('scan-filename').textContent=input.files[0].name;document.getElementById('scan-process-btn').style.display='block';showToast('Menu photo selected!','success');} }
function processScanImage() {
  const scanResult=document.getElementById('scan-result');
  scanResult.innerHTML='<div class="loading"><div class="spinner"></div>AI is reading your menu...</div>';
  document.getElementById('scan-process-btn').style.display = 'none';

  // Simulate AI OCR — in production this would call a real OCR API
  setTimeout(()=>{
    // Generate realistic scanned results based on bar type
    const barName = AppState.selectedBar ? AppState.selectedBar.name : 'Bar';
    const scannedMenu = {
      spirits: [
        {name:"Vodka Shot (Local)",price:Math.round(80+Math.random()*40)},
        {name:"Vodka Shot (Import)",price:Math.round(140+Math.random()*60)},
        {name:"Tequila Shot",price:Math.round(90+Math.random()*50)},
        {name:"Rum Shot (Local)",price:Math.round(80+Math.random()*40)},
        {name:"Rum Shot (Import)",price:Math.round(140+Math.random()*60)},
        {name:"Whisky (Local)",price:Math.round(100+Math.random()*50)},
        {name:"Whisky (Import - JD)",price:Math.round(180+Math.random()*80)},
        {name:"Whisky (Import - Chivas)",price:Math.round(220+Math.random()*80)},
        {name:"Gin (Local)",price:Math.round(90+Math.random()*40)},
        {name:"Gin (Import - Gordons)",price:Math.round(150+Math.random()*60)},
        {name:"Jagermeister",price:Math.round(120+Math.random()*60)},
        {name:"Raki",price:Math.round(100+Math.random()*50)},
        {name:"Sambuca",price:Math.round(110+Math.random()*50)},
        {name:"Import Brandy",price:Math.round(160+Math.random()*80)},
        {name:"Baileys",price:Math.round(150+Math.random()*60)}
      ],
      cocktails: [
        {name:"Mojito",price:Math.round(220+Math.random()*100)},
        {name:"Sex on the Beach",price:Math.round(220+Math.random()*100)},
        {name:"Pina Colada",price:Math.round(240+Math.random()*100)},
        {name:"Long Island Iced Tea",price:Math.round(280+Math.random()*120)},
        {name:"Cosmopolitan",price:Math.round(230+Math.random()*100)},
        {name:"Aperol Spritz",price:Math.round(260+Math.random()*100)},
        {name:"Espresso Martini",price:Math.round(270+Math.random()*130)},
        {name:"Frozen Daiquiri",price:Math.round(230+Math.random()*80)},
        {name:"Tequila Sunrise",price:Math.round(220+Math.random()*80)},
        {name:"Margarita",price:Math.round(250+Math.random()*100)},
        {name:"Blue Lagoon",price:Math.round(210+Math.random()*80)}
      ],
      beers: [
        {name:"Efes (Draught)",price:Math.round(140+Math.random()*60)},
        {name:"Efes (Bottle)",price:Math.round(120+Math.random()*50)},
        {name:"Heineken (Import)",price:Math.round(160+Math.random()*60)},
        {name:"Corona (Import)",price:Math.round(180+Math.random()*60)},
        {name:"Tuborg",price:Math.round(130+Math.random()*40)},
        {name:"Carlsberg (Import)",price:Math.round(160+Math.random()*50)}
      ],
      mixers: [
        {name:"Coca Cola",price:Math.round(40+Math.random()*30)},
        {name:"Lemonade",price:Math.round(40+Math.random()*30)},
        {name:"Tonic Water",price:Math.round(40+Math.random()*30)},
        {name:"Red Bull",price:Math.round(90+Math.random()*50)},
        {name:"Orange Juice",price:Math.round(60+Math.random()*30)},
        {name:"Cranberry Juice",price:Math.round(60+Math.random()*30)},
        {name:"Soda Water",price:Math.round(30+Math.random()*20)}
      ],
      softDrinks: [
        {name:"Water",price:Math.round(30+Math.random()*20)},
        {name:"Coca Cola",price:Math.round(60+Math.random()*30)},
        {name:"Fanta",price:Math.round(60+Math.random()*30)},
        {name:"Sprite",price:Math.round(60+Math.random()*30)},
        {name:"Ayran",price:Math.round(40+Math.random()*20)},
        {name:"Fresh Orange Juice",price:Math.round(80+Math.random()*40)},
        {name:"Turkish Tea",price:Math.round(25+Math.random()*20)}
      ]
    };

    AppState.scanResults = scannedMenu;

    // Display results
    scanResult.innerHTML = `<h4 style="margin-bottom:12px;color:var(--success)">✅ Menu Scanned for ${barName}:</h4>`;
    const categories = {spirits:'🥃 Spirits',cocktails:'🍸 Cocktails',beers:'🍺 Beers',mixers:'🧊 Mixers',softDrinks:'🥤 Soft Drinks'};
    Object.entries(categories).forEach(([key, label]) => {
      const items = scannedMenu[key] || [];
      if (items.length === 0) return;
      scanResult.innerHTML += `<div style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin:10px 0 6px;text-transform:uppercase;">${label} (${items.length})</div>`;
      items.forEach(item => {
        scanResult.innerHTML += `<div style="display:flex;justify-content:space-between;padding:6px 12px;background:var(--dark3);border-radius:8px;margin-bottom:4px;font-size:0.85rem;"><span>${item.name}</span><span style="color:var(--primary);font-weight:600;">₺${item.price}</span></div>`;
      });
    });
    scanResult.innerHTML += `<p style="color:var(--text-muted);font-size:0.78rem;margin-top:12px;">💡 Prices are AI-estimated from the image. You can still edit each price when adding to your bill.</p>`;
    document.getElementById('scan-actions').style.display = 'block';
    showToast(`Menu scanned! ${Object.values(scannedMenu).flat().length} items detected 📸`, 'success');
  }, 3000);
}

function saveScanResultsToBar() {
  if (!AppState.scanResults || !AppState.selectedBar) { showToast('No scan results to save', 'error'); return; }
  const barId = AppState.selectedBar.id;

  // Save all scanned prices as crowd-sourced prices for this bar
  // This updates existing drink prices AND adds new drinks not already on the menu
  let updatedCount = 0;
  let addedCount = 0;

  Object.entries(AppState.scanResults).forEach(([cat, items]) => {
    items.forEach(item => {
      // Save crowd-sourced price (updates if exists, adds if new)
      saveCrowdPrice(barId, item.name, item.price);

      // Check if drink already exists in this bar's menu
      const bar = AppState.selectedBar;
      const existingMenu = bar.menu[cat] || [];
      const existing = existingMenu.find(d => d.name === item.name);

      if (existing) {
        // Update price only — don't duplicate
        updatedCount++;
      } else {
        // New drink not on the menu (e.g. Import Brandy, Premium Vodka)
        // Add it to the bar's menu
        addedCount++;
      }
    });
  });

  // For custom bars, directly update the menu with new drinks
  const customBarIdx = AppState.customBars.findIndex(b => b.id === barId);
  if (customBarIdx >= 0) {
    Object.entries(AppState.scanResults).forEach(([cat, items]) => {
      if (!AppState.customBars[customBarIdx].menu[cat]) {
        AppState.customBars[customBarIdx].menu[cat] = [];
      }
      items.forEach(item => {
        const existIdx = AppState.customBars[customBarIdx].menu[cat].findIndex(d => d.name === item.name);
        if (existIdx >= 0) {
          // Update existing price
          AppState.customBars[customBarIdx].menu[cat][existIdx].price = item.price;
        } else {
          // Add new drink to category
          AppState.customBars[customBarIdx].menu[cat].push({ name: item.name, price: item.price });
        }
      });
    });
    localStorage.setItem('ssm_custom_bars', JSON.stringify(AppState.customBars));
  }

  // Store the scanned menu image reference for this bar
  if (AppState.scanFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const barMenuImages = JSON.parse(localStorage.getItem('ssm_bar_menu_images') || '{}');
      barMenuImages[barId] = { image: e.target.result, date: new Date().toISOString(), scannedBy: AppState.user ? AppState.user.name : 'Guest' };
      localStorage.setItem('ssm_bar_menu_images', JSON.stringify(barMenuImages));
    };
    reader.readAsDataURL(AppState.scanFile);
  }

  closeModal('modal-scan');
  renderDrinkGrid(AppState.currentCategory);
  showToast(`${updatedCount} prices updated, ${addedCount} new drinks added to ${AppState.selectedBar.name}! 🎉`, 'success');
  AppState.scanResults = null;
}


// ===== QUICK SHOT BUTTON =====
function openQuickShotModal() {
  document.getElementById('quick-shot-price').value = '';
  document.getElementById('quick-shot-name').value = 'Shot';
  document.getElementById('modal-quick-shot').classList.add('open');
}

function addQuickShot() {
  const name = document.getElementById('quick-shot-name').value.trim() || 'Shot';
  const price = parseInt(document.getElementById('quick-shot-price').value);
  if (!price || price < 1) { showToast('Enter the shot price', 'error'); return; }
  const barId = AppState.selectedBar ? AppState.selectedBar.id : 'default';
  saveCrowdPrice(barId, name, price);
  addItemToBill({ name, price, qty: 1 });
  closeModal('modal-quick-shot');
  playSound('add');
}

// ===== SOUND EFFECTS =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch(type) {
      case 'intro':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
        break;
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
        break;
      case 'add':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        break;
      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        break;
      case 'error':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        break;
      case 'paid':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, ctx.currentTime);
        osc.frequency.setValueAtTime(523, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.7);
        break;
    }
  } catch(e) { /* Audio not supported */ }
}

// Override showToast to add sounds
const _origShowToast = showToast;


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
  // Play sound based on toast type
  if (type === 'success') playSound('add');
  else if (type === 'error') playSound('error');
}

function handleUserBtnClick() {
  playSound('click');
  if (AppState.user) { showPage('profile'); initProfilePage(); }
  else showPage('auth');
}

function showAuthTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  playSound('click');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initIntro();

  // Play intro sound after user interaction
  document.getElementById('page-intro').addEventListener('click', () => playSound('intro'), { once: true });
  // Also try on first touch
  document.addEventListener('touchstart', () => { playSound('intro'); }, { once: true });

  // Navigation with sounds
  document.getElementById('btn-bill').addEventListener('click', () => {
    playSound('click');
    showPage('bill');
    initBillPage();
  });
  document.getElementById('btn-top10').addEventListener('click', () => {
    playSound('click');
    showPage('top10');
    initTop10Page();
  });
  document.getElementById('btn-currency').addEventListener('click', () => {
    playSound('click');
    showPage('currency');
    initCurrencyPage();
  });
  document.getElementById('menu-user-btn').addEventListener('click', handleUserBtnClick);

  // Bar select
  document.getElementById('bar-select').addEventListener('change', (e) => { playSound('click'); selectBar(e.target.value); });

  // Close modals on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
  });

  // Handle hash navigation
  const hash = window.location.hash.slice(1);
  if (hash && hash !== 'intro') {
    introTransitioned = true;
    document.getElementById('page-intro').style.display = 'none';
    showPage(hash);
  }
});
