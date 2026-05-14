/* ============================================================
   DataCommander – app.js  (v3)
   ============================================================ */
'use strict';

// ── Static Definitions ────────────────────────────────────────

const STAGES = [
  { id: 'creation',   label: 'Erstellung',   emoji: '✏️',  color: '#6c63ff' },
  { id: 'processing', label: 'Verarbeitung', emoji: '⚙️',  color: '#00d4ff' },
  { id: 'active',     label: 'Aktiv',        emoji: '✅',  color: '#43e97b' },
  { id: 'archiving',  label: 'Archivierung', emoji: '📦',  color: '#f9ca24' },
  { id: 'deletion',   label: 'Löschung',     emoji: '🗑️', color: '#ff6b6b' },
];

// Default stores – saved into state on first run, fully editable after
const DEFAULT_STORES = [
  { id: 'local',    label: 'Lokal (Mac)',      icon: '💻', color: '#6c63ff', type: 'local'  },
  { id: 'icloud',   label: 'iCloud',           icon: '☁️', color: '#00d4ff', type: 'cloud'  },
  { id: 'google',   label: 'Google Drive',     icon: '☁️', color: '#43e97b', type: 'cloud'  },
  { id: 'synology', label: 'Synology Drive',   icon: '☁️', color: '#f9ca24', type: 'cloud'  },
  { id: 'dropbox',  label: 'Dropbox',          icon: '☁️', color: '#0061ff', type: 'cloud'  },
  { id: 'onedrive', label: 'OneDrive',         icon: '☁️', color: '#0078d4', type: 'cloud'  },
  { id: 'nas',      label: 'NAS / Heimnetz',   icon: '🖥️', color: '#ff9f43', type: 'local'  },
  { id: 'usb',      label: 'USB / Extern',     icon: '💿', color: '#a29bfe', type: 'local'  },
  { id: 'encrypted',label: 'Verschlüsselt',    icon: '🔐', color: '#fd79a8', type: 'local'  },
  { id: 'iphone',   label: 'iPhone',           icon: '📱', color: '#74b9ff', type: 'device' },
];

const DEFAULT_CATEGORIES = [
  { id: 'photos',    label: 'Fotos',           icon: '📷', color: '#ff6b9d', priority: 'high',     notes: '' },
  { id: 'videos',    label: 'Videos',          icon: '🎬', color: '#ff9f43', priority: 'high',     notes: '' },
  { id: 'documents', label: 'Dokumente',       icon: '📄', color: '#74b9ff', priority: 'critical', notes: '' },
  { id: 'notes',     label: 'Notizen',         icon: '📝', color: '#a29bfe', priority: 'medium',   notes: '' },
  { id: 'calendar',  label: 'Kalender',        icon: '📅', color: '#00d4ff', priority: 'high',     notes: '' },
  { id: 'contacts',  label: 'Kontakte',        icon: '👤', color: '#43e97b', priority: 'critical', notes: '' },
  { id: 'mails',     label: 'Mails',           icon: '✉️', color: '#6c63ff', priority: 'high',     notes: '' },
  { id: 'passwords', label: 'Passwörter',      icon: '🔑', color: '#fd79a8', priority: 'critical', notes: '' },
  { id: 'browser',   label: 'Browserdaten',    icon: '🌐', color: '#0984e3', priority: 'medium',   notes: '' },
  { id: 'code',      label: 'Code / Projekte', icon: '💻', color: '#00b894', priority: 'critical', notes: '' },
  { id: 'finance',   label: 'Finanzen',        icon: '💰', color: '#f9ca24', priority: 'critical', notes: '' },
  { id: 'health',    label: 'Gesundheit',      icon: '❤️', color: '#ff6b6b', priority: 'high',     notes: '' },
  { id: 'music',     label: 'Musik',           icon: '🎵', color: '#a29bfe', priority: 'low',      notes: '' },
  { id: 'backup',    label: 'Backup-Images',   icon: '💾', color: '#636e72', priority: 'critical', notes: '' },
  { id: 'config',    label: 'Konfiguration',   icon: '⚙️', color: '#b2bec3', priority: 'high',     notes: '' },
  { id: 'legal',     label: 'Rechtliches',     icon: '⚖️', color: '#fdcb6e', priority: 'critical', notes: '' },
  { id: 'media',     label: 'Sonstige Medien', icon: '🎞️', color: '#e17055', priority: 'low',      notes: '' },
  { id: 'social',    label: 'Social Media',    icon: '💬', color: '#00cec9', priority: 'low',      notes: '' },
];

// Emoji options grouped by theme
const STORE_ICON_OPTIONS = [
  // Cloud
  '☁️','🌤️','⛅','🌥️',
  // Devices
  '💻','🖥️','📱','⌚','📺','🖨️',
  // Storage
  '💾','💿','📀','🔌','🗄️',
  // Security
  '🔐','🔒','🛡️','🔑',
  // Network
  '🌐','📡','🏠','🏢',
  // Misc
  '📦','🗃️','📁','🗂️',
];

const CAT_ICON_OPTIONS = [
  '📷','🎬','📄','📝','📅','👤','✉️','🔑','🌐','💻','💰','❤️','🎵',
  '💾','⚙️','⚖️','🎞️','💬','📁','🗂️','📊','📈','🔒','🏠','📱','🖥️',
  '☁️','🔌','📦','🗃️','🎮','📚','🧾','🏥','🎨','✈️','🏋️','🧬',
];

const COLOR_OPTIONS = [
  '#ff6b9d','#ff9f43','#74b9ff','#a29bfe','#00d4ff','#43e97b',
  '#6c63ff','#fd79a8','#0984e3','#00b894','#f9ca24','#ff6b6b',
  '#636e72','#fdcb6e','#e17055','#00cec9','#0061ff','#0078d4',
];

const STORE_TYPE_OPTIONS = [
  { value: 'cloud',  label: '☁️ Cloud' },
  { value: 'local',  label: '💻 Lokal' },
  { value: 'device', label: '📱 Gerät' },
  { value: 'other',  label: '📦 Sonstiges' },
];

// ── State ─────────────────────────────────────────────────────

let state = {
  categories:  [],
  stores:      [],   // now mutable
  assignments: {},   // { catId: { stageId: [storeId, ...] } }
  activeView:  'matrix',
  filter:      'all',
  dragItem:    null,
};

function loadState() {
  try {
    const saved = localStorage.getItem('datacommander_v3');
    if (saved) {
      const p = JSON.parse(saved);
      state.categories  = p.categories  || clone(DEFAULT_CATEGORIES);
      state.stores      = p.stores      || clone(DEFAULT_STORES);
      state.assignments = p.assignments || {};
    } else {
      state.categories  = clone(DEFAULT_CATEGORIES);
      state.stores      = clone(DEFAULT_STORES);
      state.assignments = {};
    }
  } catch {
    state.categories  = clone(DEFAULT_CATEGORIES);
    state.stores      = clone(DEFAULT_STORES);
    state.assignments = {};
  }
}

function saveState() {
  localStorage.setItem('datacommander_v3', JSON.stringify({
    categories:  state.categories,
    stores:      state.stores,
    assignments: state.assignments,
  }));
}

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ── Helpers ───────────────────────────────────────────────────

function getAssignment(catId, stageId) {
  return (state.assignments[catId] && state.assignments[catId][stageId]) || [];
}

function addAssignment(catId, stageId, storeId) {
  if (!state.assignments[catId]) state.assignments[catId] = {};
  if (!state.assignments[catId][stageId]) state.assignments[catId][stageId] = [];
  if (!state.assignments[catId][stageId].includes(storeId)) {
    state.assignments[catId][stageId].push(storeId);
    saveState();
    return true;
  }
  return false;
}

function removeAssignment(catId, stageId, storeId) {
  if (state.assignments[catId]?.[stageId]) {
    state.assignments[catId][stageId] = state.assignments[catId][stageId].filter(s => s !== storeId);
    saveState();
  }
}

// Clean up assignments that reference a deleted store
function purgeStoreFromAssignments(storeId) {
  for (const catId in state.assignments) {
    for (const stageId in state.assignments[catId]) {
      state.assignments[catId][stageId] = state.assignments[catId][stageId].filter(s => s !== storeId);
    }
  }
}

function getCategoryById(id) { return state.categories.find(c => c.id === id); }
function getStoreById(id)    { return state.stores.find(s => s.id === id); }
function getStageById(id)    { return STAGES.find(s => s.id === id); }

function getCoveragePercent(catId) {
  let assigned = 0;
  for (const stage of STAGES) {
    if (getAssignment(catId, stage.id).length > 0) assigned++;
  }
  return Math.round((assigned / STAGES.length) * 100);
}

function getTotalAssignments() {
  let total = 0;
  for (const catId in state.assignments)
    for (const stageId in state.assignments[catId])
      total += state.assignments[catId][stageId].length;
  return total;
}

function getFilteredCategories() {
  if (state.filter === 'unassigned') return state.categories.filter(c => getCoveragePercent(c.id) === 0);
  if (state.filter === 'critical')   return state.categories.filter(c => c.priority === 'critical');
  return state.categories;
}

// Count distinct stores used for a category across all stages
function getUniqueStoreCount(catId) {
  const ids = new Set();
  for (const stage of STAGES) {
    for (const sid of getAssignment(catId, stage.id)) ids.add(sid);
  }
  return ids.size;
}

// Count how many cloud-type stores a category uses across all stages
function getCloudStoreCount(catId) {
  const ids = new Set();
  for (const stage of STAGES) {
    for (const sid of getAssignment(catId, stage.id)) {
      const store = getStoreById(sid);
      if (store && store.type === 'cloud') ids.add(sid);
    }
  }
  return ids.size;
}

function hasOffSiteStore(catId) {
  // "off-site" = cloud or usb/extern (not local/nas/device)
  for (const stage of STAGES) {
    for (const sid of getAssignment(catId, stage.id)) {
      const store = getStoreById(sid);
      if (store && (store.type === 'cloud' || store.id === 'usb')) return true;
    }
  }
  return false;
}

function hasEncryptedStore(catId) {
  for (const stage of STAGES) {
    for (const sid of getAssignment(catId, stage.id)) {
      const store = getStoreById(sid);
      if (store && (store.id === 'encrypted' || store.label.toLowerCase().includes('verschlüss'))) return true;
    }
  }
  return false;
}

// ── Toast ─────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ── Navigation ────────────────────────────────────────────────

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${viewId}`)?.classList.add('active');
  document.querySelector(`[data-view="${viewId}"]`)?.classList.add('active');
  state.activeView = viewId;
  renderCurrentView();
}

function renderCurrentView() {
  switch (state.activeView) {
    case 'matrix':   renderMatrix();   break;
    case 'overview': renderOverview(); break;
    case 'rules':    renderRules();    break;
    case 'stats':    renderStats();    break;
  }
}

// ── Matrix ────────────────────────────────────────────────────

function renderMatrix() {
  renderCategoriesList();
  renderMatrixGrid();
}

function renderCategoriesList() {
  const list = document.getElementById('categoriesList');
  list.innerHTML = '';
  getFilteredCategories().forEach(cat => {
    const chip = document.createElement('div');
    chip.className = 'category-chip';
    chip.draggable = true;
    chip.dataset.catId = cat.id;
    chip.style.borderLeftColor = cat.color;
    chip.style.borderLeftWidth = '3px';
    chip.innerHTML = `
      <span class="chip-icon">${cat.icon}</span>
      <span class="chip-label">${cat.label}</span>
      <span class="chip-priority priority-${cat.priority}"></span>`;
    chip.addEventListener('dragstart', e => {
      state.dragItem = { type: 'category', catId: cat.id };
      chip.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', cat.id);
    });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    chip.addEventListener('click', () => openDetailModal(cat.id));
    list.appendChild(chip);
  });
}

function renderMatrixGrid() {
  const grid = document.getElementById('matrixGrid');
  grid.style.gridTemplateColumns = `150px repeat(${STAGES.length}, 1fr)`;
  grid.innerHTML = '';

  // Corner
  grid.appendChild(Object.assign(document.createElement('div'), { className: 'matrix-corner' }));

  // Stage headers
  STAGES.forEach(stage => {
    const h = document.createElement('div');
    h.className = 'matrix-stage-header';
    h.style.cssText = `border-top: 2px solid ${stage.color}`;
    h.textContent = `${stage.emoji} ${stage.label}`;
    grid.appendChild(h);
  });

  // Store rows – only active (enabled) stores
  state.stores.forEach(store => {
    const label = document.createElement('div');
    label.className = 'matrix-store-label';
    label.innerHTML = `
      <span class="store-icon">${store.icon}</span>
      <span>${store.label}</span>
      <span class="store-type-badge store-type-${store.type}">${store.type}</span>`;
    grid.appendChild(label);

    STAGES.forEach(stage => {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.dataset.storeId = store.id;
      cell.dataset.stageId = stage.id;

      let hasItems = false;
      getFilteredCategories().forEach(cat => {
        if (getAssignment(cat.id, stage.id).includes(store.id)) {
          hasItems = true;
          cell.appendChild(createCellItem(cat, stage, store));
        }
      });
      if (!hasItems) cell.appendChild(makeCellEmpty());

      cell.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        cell.classList.add('drag-over');
        cell.querySelectorAll('.cell-empty').forEach(el => el.remove());
      });
      cell.addEventListener('dragleave', () => {
        cell.classList.remove('drag-over');
        if (!cell.querySelector('.cell-item')) cell.appendChild(makeCellEmpty());
      });
      cell.addEventListener('drop', e => {
        e.preventDefault();
        cell.classList.remove('drag-over');
        if (state.dragItem?.type === 'category') {
          const catId = state.dragItem.catId;
          if (addAssignment(catId, stage.id, store.id)) {
            const cat = getCategoryById(catId);
            cell.querySelectorAll('.cell-empty').forEach(el => el.remove());
            cell.appendChild(createCellItem(cat, stage, store));
            showToast(`${cat.icon} ${cat.label} → ${store.label} (${stage.label})`, 'success');
          } else {
            showToast('Bereits zugeordnet', 'info');
          }
        }
        state.dragItem = null;
      });

      grid.appendChild(cell);
    });
  });
}

function makeCellEmpty() {
  const el = document.createElement('div');
  el.className = 'cell-empty';
  el.textContent = '—';
  return el;
}

function createCellItem(cat, stage, store) {
  const item = document.createElement('div');
  item.className = 'cell-item';
  item.style.background = `${cat.color}22`;
  item.style.borderColor = `${cat.color}44`;
  item.dataset.catId = cat.id;
  item.innerHTML = `
    <span class="item-icon">${cat.icon}</span>
    <span class="item-label">${cat.label}</span>
    <span class="item-remove" title="Entfernen">✕</span>`;
  item.querySelector('.item-remove').addEventListener('click', e => {
    e.stopPropagation();
    removeAssignment(cat.id, stage.id, store.id);
    const cell = item.closest('.matrix-cell');
    item.remove();
    if (cell && !cell.querySelector('.cell-item')) cell.appendChild(makeCellEmpty());
    showToast(`${cat.icon} ${cat.label} entfernt`, 'info');
  });
  item.addEventListener('click', () => openDetailModal(cat.id));
  return item;
}

// ── Overview ──────────────────────────────────────────────────

function renderOverview() {
  const grid = document.getElementById('overviewGrid');
  grid.innerHTML = '';
  state.categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'overview-card glass-panel';
    card.style.cssText = `border-top: 2px solid ${cat.color}`;

    let assignmentsHtml = '';
    let hasAny = false;
    STAGES.forEach(stage => {
      const stores = getAssignment(cat.id, stage.id);
      if (stores.length > 0) {
        hasAny = true;
        const storeTags = stores.map(sid => {
          const s = getStoreById(sid);
          return s ? `<span class="ov-store-tag">${s.icon} ${s.label}</span>` : '';
        }).join('');
        assignmentsHtml += `
          <div class="ov-assignment-row">
            <span class="ov-stage-badge" style="background:${stage.color}22;border-color:${stage.color}44;color:${stage.color}">${stage.emoji} ${stage.label}</span>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${storeTags}</div>
          </div>`;
      }
    });

    const pct = getCoveragePercent(cat.id);
    card.innerHTML = `
      <div class="ov-card-header">
        <div class="ov-icon" style="background:${cat.color}22">${cat.icon}</div>
        <div>
          <div class="ov-card-title">${cat.label}</div>
          <div class="ov-card-sub">Priorität: ${cat.priority} · ${pct}% abgedeckt</div>
        </div>
      </div>
      <div class="ov-assignments">
        ${hasAny ? assignmentsHtml : '<div class="ov-empty">Noch keine Zuordnungen</div>'}
      </div>`;
    card.addEventListener('click', () => openDetailModal(cat.id));
    grid.appendChild(card);
  });
}

// ── Rules ─────────────────────────────────────────────────────

const STATIC_RULES = [
  { icon: '3️⃣', title: '3-2-1 Backup-Regel',    body: 'Mindestens 3 Kopien auf 2 verschiedenen Medientypen, davon 1 extern (off-site). Gilt besonders für kritische Kategorien.' },
  { icon: '🔄', title: 'Rotationsintervalle',     body: 'Täglich: aktive Arbeitsdaten. Wöchentlich: Projekte & Notizen. Monatlich: Vollbackup. Jährlich: Archiv-Snapshot auf externem Medium.' },
  { icon: '🔐', title: 'Verschlüsselung',         body: 'Passwörter, Finanzdaten und Gesundheitsdaten sollten ausschließlich verschlüsselt gespeichert werden (AES-256 oder vergleichbar).' },
  { icon: '🗑️', title: 'Löschstrategie',         body: 'Temporäre Dateien: 30 Tage. Projektdaten: Abschluss + 2 Jahre. Rechtliches: gesetzliche Frist (DE: 10 Jahre).' },
  { icon: '☁️', title: 'Cloud-Redundanz',         body: 'Verlasse dich nicht auf einen einzigen Cloud-Anbieter. Kritische Daten auf ≥ 2 verschiedene Dienste oder Cloud + lokal verteilen.' },
  { icon: '✅', title: 'Backup-Verifikation',     body: 'Teste Backups regelmäßig durch Wiederherstellung. Ein ungetestetes Backup ist kein Backup. Mindestens quartalsweise prüfen.' },
  { icon: '📱', title: 'Gerätesynchronisation',   body: 'Alle Geräte (Mac, iPhone, iPad) in die Backup-Strategie einbeziehen. Besonders Fotos und Kontakte auf mobilen Geräten.' },
  { icon: '🔑', title: 'Passwort-Manager',        body: 'Passwörter gehören ausschließlich in einen dedizierten Passwort-Manager (z.B. 1Password, Bitwarden). Niemals im Klartext speichern.' },
];

// Analyse current assignments and return insight objects
// Insights are suggestions, never accusations – only shown when data exists
function computeInsights() {
  const insights = [];
  const assigned = state.categories.filter(c => getCoveragePercent(c.id) > 0);
  if (assigned.length === 0) return insights; // nothing to say yet

  // 3-2-1: critical categories with only 1 store total
  state.categories
    .filter(c => c.priority === 'critical' && getUniqueStoreCount(c.id) === 1 && getCoveragePercent(c.id) > 0)
    .forEach(c => {
      insights.push({
        level: 'warn',
        icon: '3️⃣',
        text: `<strong>${c.icon} ${c.label}</strong> ist kritisch und hat bisher nur 1 Store. Die 3-2-1-Regel empfiehlt mindestens 3 Kopien.`,
      });
    });

  // No off-site backup for critical categories
  state.categories
    .filter(c => c.priority === 'critical' && getCoveragePercent(c.id) > 0 && !hasOffSiteStore(c.id))
    .forEach(c => {
      insights.push({
        level: 'warn',
        icon: '☁️',
        text: `<strong>${c.icon} ${c.label}</strong> hat noch keinen externen oder Cloud-Store – bei einem lokalen Ausfall wären die Daten gefährdet.`,
      });
    });

  // Sensitive categories without encrypted store
  const sensitiveIds = ['passwords', 'finance', 'health', 'legal'];
  state.categories
    .filter(c => (sensitiveIds.includes(c.id) || c.priority === 'critical') && getCoveragePercent(c.id) > 0 && !hasEncryptedStore(c.id))
    .forEach(c => {
      insights.push({
        level: 'info',
        icon: '🔐',
        text: `<strong>${c.icon} ${c.label}</strong> enthält sensible Daten. Ein verschlüsselter Store wäre eine gute Ergänzung.`,
      });
    });

  // Categories with no deletion stage mapped
  state.categories
    .filter(c => getCoveragePercent(c.id) > 0 && getAssignment(c.id, 'deletion').length === 0)
    .slice(0, 3) // cap to avoid noise
    .forEach(c => {
      insights.push({
        level: 'info',
        icon: '🗑️',
        text: `<strong>${c.icon} ${c.label}</strong> hat noch keine Lösch-Stage definiert. Eine Aufbewahrungsfrist hilft, Datenmüll zu vermeiden.`,
      });
    });

  // Single-cloud dependency for high/critical
  state.categories
    .filter(c => ['high','critical'].includes(c.priority) && getCoveragePercent(c.id) > 0 && getCloudStoreCount(c.id) === 1 && getUniqueStoreCount(c.id) === 1)
    .forEach(c => {
      insights.push({
        level: 'info',
        icon: '⚠️',
        text: `<strong>${c.icon} ${c.label}</strong> liegt nur in einer Cloud. Ein zweiter Store (lokal oder andere Cloud) erhöht die Ausfallsicherheit.`,
      });
    });

  // Positive: categories that look well-covered
  const wellCovered = state.categories.filter(c =>
    getCoveragePercent(c.id) >= 80 && getUniqueStoreCount(c.id) >= 2 && hasOffSiteStore(c.id)
  );
  if (wellCovered.length > 0) {
    insights.push({
      level: 'good',
      icon: '✅',
      text: `${wellCovered.map(c => `${c.icon} ${c.label}`).join(', ')} ${wellCovered.length === 1 ? 'ist' : 'sind'} gut abgedeckt – mehrere Stores, inkl. off-site.`,
    });
  }

  return insights;
}

function renderRules() {
  const container = document.getElementById('rulesContainer');
  container.innerHTML = '';

  // Dynamic insights section
  const insights = computeInsights();
  if (insights.length > 0) {
    const section = document.createElement('div');
    section.className = 'insights-section';
    section.innerHTML = `<div class="insights-title">💡 Beobachtungen zu deiner aktuellen Konfiguration</div>`;
    insights.forEach(ins => {
      const item = document.createElement('div');
      item.className = `insight-item insight-${ins.level}`;
      item.innerHTML = `<span class="insight-icon">${ins.icon}</span><span>${ins.text}</span>`;
      section.appendChild(item);
    });
    container.appendChild(section);
  }

  // Static best-practice cards
  const staticSection = document.createElement('div');
  staticSection.className = 'rules-grid';
  STATIC_RULES.forEach(rule => {
    const card = document.createElement('div');
    card.className = 'rule-card glass-panel';
    card.innerHTML = `
      <div class="rule-header">
        <span class="rule-icon">${rule.icon}</span>
        <span class="rule-title">${rule.title}</span>
      </div>
      <div class="rule-body">${rule.body}</div>`;
    staticSection.appendChild(card);
  });
  container.appendChild(staticSection);
}

// ── Stats ─────────────────────────────────────────────────────

function renderStats() {
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = '';

  const totalCats   = state.categories.length;
  const totalAssign = getTotalAssignments();
  const criticalCats = state.categories.filter(c => c.priority === 'critical').length;
  const coveredCats  = state.categories.filter(c => getCoveragePercent(c.id) === 100).length;
  const assignedCats = state.categories.filter(c => getCoveragePercent(c.id) > 0).length;

  [
    { value: totalCats,         label: 'Kategorien' },
    { value: state.stores.length, label: 'Aktive Stores' },
    { value: totalAssign,       label: 'Zuordnungen' },
    { value: criticalCats,      label: 'Kritisch' },
    { value: assignedCats,      label: 'Mit Zuordnung' },
    { value: coveredCats,       label: 'Vollständig' },
  ].forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card glass-panel';
    card.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
    grid.appendChild(card);
  });

  // Coverage bars
  const coverageSection = document.createElement('div');
  coverageSection.className = 'coverage-section glass-panel';
  coverageSection.style.cssText = 'padding:20px;grid-column:1/-1';

  const barsHtml = state.categories.map(cat => {
    const pct = getCoveragePercent(cat.id);
    const uniqueStores = getUniqueStoreCount(cat.id);
    const offSite = hasOffSiteStore(cat.id);
    const enc = hasEncryptedStore(cat.id);
    const badges = [
      uniqueStores >= 2 ? `<span class="mini-badge good">2+ Stores</span>` : '',
      offSite ? `<span class="mini-badge good">Off-site</span>` : '',
      enc ? `<span class="mini-badge good">🔐</span>` : '',
    ].filter(Boolean).join('');
    return `
      <div class="coverage-row">
        <div class="coverage-label">${cat.icon} ${cat.label}</div>
        <div class="coverage-bar-bg">
          <div class="coverage-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${cat.color},${cat.color}99)"></div>
        </div>
        <div class="coverage-pct">${pct}%</div>
        <div class="coverage-badges">${badges}</div>
      </div>`;
  }).join('');

  coverageSection.innerHTML = `
    <div class="coverage-title">Stage-Abdeckung pro Kategorie</div>
    <div class="coverage-bars">${barsHtml}</div>`;
  grid.appendChild(coverageSection);

  // Store usage chart
  const storeSection = document.createElement('div');
  storeSection.className = 'coverage-section glass-panel';
  storeSection.style.cssText = 'padding:20px;grid-column:1/-1';

  const storeUsage = state.stores.map(store => {
    let count = 0;
    for (const catId in state.assignments)
      for (const stageId in state.assignments[catId])
        if (state.assignments[catId][stageId].includes(store.id)) count++;
    return { store, count };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(1, ...storeUsage.map(s => s.count));
  const storeBarsHtml = storeUsage.map(({ store, count }) => `
    <div class="coverage-row">
      <div class="coverage-label">${store.icon} ${store.label}</div>
      <div class="coverage-bar-bg">
        <div class="coverage-bar-fill" style="width:${Math.round((count/maxCount)*100)}%;background:linear-gradient(90deg,${store.color},${store.color}99)"></div>
      </div>
      <div class="coverage-pct">${count}</div>
      <div class="coverage-badges"><span class="mini-badge ${store.type}">${store.type}</span></div>
    </div>`).join('');

  storeSection.innerHTML = `
    <div class="coverage-title">Store-Nutzung (Anzahl Zuordnungen)</div>
    <div class="coverage-bars">${storeBarsHtml}</div>`;
  grid.appendChild(storeSection);

  // Insights in stats too
  const insights = computeInsights();
  if (insights.length > 0) {
    const insSection = document.createElement('div');
    insSection.className = 'insights-section glass-panel';
    insSection.style.cssText = 'grid-column:1/-1';
    insSection.innerHTML = `<div class="insights-title">💡 Hinweise</div>`;
    insights.forEach(ins => {
      const item = document.createElement('div');
      item.className = `insight-item insight-${ins.level}`;
      item.innerHTML = `<span class="insight-icon">${ins.icon}</span><span>${ins.text}</span>`;
      insSection.appendChild(item);
    });
    grid.appendChild(insSection);
  }
}

// ── Store Management Modal ────────────────────────────────────

function openStoreManager() {
  const overlay = document.getElementById('storeManagerOverlay');
  renderStoreManagerList();
  overlay.classList.add('open');
}

function renderStoreManagerList() {
  const list = document.getElementById('storeManagerList');
  list.innerHTML = '';
  state.stores.forEach(store => {
    const row = document.createElement('div');
    row.className = 'store-manager-row';
    row.innerHTML = `
      <span class="store-mgr-icon">${store.icon}</span>
      <span class="store-mgr-label">${store.label}</span>
      <span class="store-type-badge store-type-${store.type}">${store.type}</span>
      <div class="store-mgr-actions">
        <button class="icon-btn" data-edit="${store.id}" title="Bearbeiten">✎</button>
        <button class="icon-btn danger" data-delete="${store.id}" title="Löschen">✕</button>
      </div>`;
    row.querySelector('[data-edit]').addEventListener('click', () => openStoreEditForm(store.id));
    row.querySelector('[data-delete]').addEventListener('click', () => {
      if (confirm(`Store "${store.label}" löschen? Alle Zuordnungen zu diesem Store werden entfernt.`)) {
        purgeStoreFromAssignments(store.id);
        state.stores = state.stores.filter(s => s.id !== store.id);
        saveState();
        renderStoreManagerList();
        renderCurrentView();
        showToast(`${store.icon} ${store.label} gelöscht`, 'info');
      }
    });
    list.appendChild(row);
  });
}

function openStoreEditForm(storeId) {
  const store = storeId ? getStoreById(storeId) : null;
  const overlay = document.getElementById('storeEditOverlay');
  const title = document.getElementById('storeEditTitle');
  title.textContent = store ? 'Store bearbeiten' : 'Neuer Store';

  // Pre-fill
  document.getElementById('storeEditName').value = store?.label || '';
  document.getElementById('storeEditType').value = store?.type || 'cloud';

  // Icon picker
  const iconPicker = document.getElementById('storeIconPicker');
  iconPicker.innerHTML = '';
  let selectedIcon = store?.icon || '☁️';
  STORE_ICON_OPTIONS.forEach(icon => {
    const opt = document.createElement('div');
    opt.className = 'icon-option' + (icon === selectedIcon ? ' selected' : '');
    opt.textContent = icon;
    opt.addEventListener('click', () => {
      iconPicker.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedIcon = icon;
    });
    iconPicker.appendChild(opt);
  });

  // Color picker
  const colorPicker = document.getElementById('storeColorPicker');
  colorPicker.innerHTML = '';
  let selectedColor = store?.color || '#00d4ff';
  COLOR_OPTIONS.forEach(color => {
    const opt = document.createElement('div');
    opt.className = 'color-option' + (color === selectedColor ? ' selected' : '');
    opt.style.background = color;
    opt.addEventListener('click', () => {
      colorPicker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedColor = color;
    });
    colorPicker.appendChild(opt);
  });

  document.getElementById('saveStoreEditBtn').onclick = () => {
    const name = document.getElementById('storeEditName').value.trim();
    if (!name) { showToast('Bitte einen Namen eingeben', 'error'); return; }
    const type = document.getElementById('storeEditType').value;
    if (store) {
      store.label = name;
      store.icon  = selectedIcon;
      store.color = selectedColor;
      store.type  = type;
    } else {
      state.stores.push({ id: 'store_' + Date.now(), label: name, icon: selectedIcon, color: selectedColor, type });
    }
    saveState();
    overlay.classList.remove('open');
    renderStoreManagerList();
    renderCurrentView();
    showToast(store ? `${selectedIcon} ${name} aktualisiert` : `${selectedIcon} ${name} erstellt`, 'success');
  };

  overlay.classList.add('open');
}

// ── Category Detail Modal ─────────────────────────────────────

function openDetailModal(catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  let assignmentsHtml = '';
  STAGES.forEach(stage => {
    const stores = getAssignment(catId, stage.id);
    if (stores.length > 0) {
      const storeTags = stores.map(sid => {
        const s = getStoreById(sid);
        return s ? `<span class="ov-store-tag">${s.icon} ${s.label}</span>` : '';
      }).join(' ');
      assignmentsHtml += `
        <div class="detail-assignment">
          <span style="color:${stage.color}">${stage.emoji} ${stage.label}</span>
          <span style="flex:1;display:flex;flex-wrap:wrap;gap:4px">${storeTags}</span>
        </div>`;
    }
  });

  const priorityColors = { low: '#43e97b', medium: '#f9ca24', high: '#ff9f43', critical: '#ff6b6b' };
  const pct = getCoveragePercent(catId);

  content.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon" style="background:${cat.color}22">${cat.icon}</div>
      <div>
        <div class="detail-title">${cat.label}</div>
        <div class="detail-priority" style="color:${priorityColors[cat.priority]}">
          ● Priorität: ${cat.priority} · ${pct}% abgedeckt
        </div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">Zuordnungen</div>
      <div class="detail-assignments">
        ${assignmentsHtml || '<div class="ov-empty">Noch keine Zuordnungen – ziehe diese Kategorie in die Matrix</div>'}
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">Notizen</div>
      <div class="form-group">
        <textarea class="detail-notes" id="detailNotes" placeholder="Eigene Notizen zu dieser Kategorie...">${cat.notes || ''}</textarea>
      </div>
    </div>
    <div class="detail-actions">
      <button class="secondary-btn" id="detailSaveNotes">💾 Speichern</button>
      <button class="danger-btn" id="detailDeleteCat">🗑 Löschen</button>
    </div>`;

  document.getElementById('detailSaveNotes').addEventListener('click', () => {
    cat.notes = document.getElementById('detailNotes').value;
    saveState();
    showToast('Notizen gespeichert', 'success');
  });
  document.getElementById('detailDeleteCat').addEventListener('click', () => {
    if (confirm(`Kategorie "${cat.label}" wirklich löschen?`)) {
      state.categories = state.categories.filter(c => c.id !== catId);
      delete state.assignments[catId];
      saveState();
      closeModal();
      renderCurrentView();
      showToast(`${cat.icon} ${cat.label} gelöscht`, 'info');
    }
  });

  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ── Add Category Modal ────────────────────────────────────────

function openAddCategoryModal() {
  const overlay = document.getElementById('addCategoryOverlay');
  document.getElementById('newCatName').value = '';

  const iconPicker = document.getElementById('iconPicker');
  iconPicker.innerHTML = '';
  let selectedIcon = CAT_ICON_OPTIONS[0];
  CAT_ICON_OPTIONS.forEach(icon => {
    const opt = document.createElement('div');
    opt.className = 'icon-option' + (icon === selectedIcon ? ' selected' : '');
    opt.textContent = icon;
    opt.addEventListener('click', () => {
      iconPicker.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedIcon = icon;
    });
    iconPicker.appendChild(opt);
  });

  const colorPicker = document.getElementById('colorPicker');
  colorPicker.innerHTML = '';
  let selectedColor = COLOR_OPTIONS[0];
  COLOR_OPTIONS.forEach(color => {
    const opt = document.createElement('div');
    opt.className = 'color-option' + (color === selectedColor ? ' selected' : '');
    opt.style.background = color;
    opt.addEventListener('click', () => {
      colorPicker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedColor = color;
    });
    colorPicker.appendChild(opt);
  });

  document.getElementById('saveCategoryBtn').onclick = () => {
    const name = document.getElementById('newCatName').value.trim();
    if (!name) { showToast('Bitte einen Namen eingeben', 'error'); return; }
    const priority = document.getElementById('newCatPriority').value;
    state.categories.push({ id: 'cat_' + Date.now(), label: name, icon: selectedIcon, color: selectedColor, priority, notes: '' });
    saveState();
    overlay.classList.remove('open');
    renderCurrentView();
    showToast(`${selectedIcon} ${name} erstellt`, 'success');
  };

  overlay.classList.add('open');
}

// ── Export / Import / Reset ───────────────────────────────────

function exportData() {
  const data = JSON.stringify({ categories: state.categories, stores: state.stores, assignments: state.assignments }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `datacommander_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export erfolgreich', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.categories && p.assignments) {
          state.categories  = p.categories;
          state.stores      = p.stores || clone(DEFAULT_STORES);
          state.assignments = p.assignments;
          saveState();
          renderCurrentView();
          showToast('Import erfolgreich', 'success');
        } else {
          showToast('Ungültiges Format', 'error');
        }
      } catch { showToast('Fehler beim Importieren', 'error'); }
    };
    reader.readAsText(file);
  });
  input.click();
}

function resetData() {
  if (confirm('Alle Daten zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) {
    state.categories  = clone(DEFAULT_CATEGORIES);
    state.stores      = clone(DEFAULT_STORES);
    state.assignments = {};
    saveState();
    renderCurrentView();
    showToast('Zurückgesetzt', 'info');
  }
}

// ── Filter ────────────────────────────────────────────────────

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  renderMatrix();
}

// ── Init ──────────────────────────────────────────────────────

function init() {
  loadState();

  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => switchView(btn.dataset.view)));

  document.querySelectorAll('.pill-btn').forEach(btn =>
    btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', importData);
  document.getElementById('resetBtn').addEventListener('click', resetData);

  // Category
  document.getElementById('addCategoryBtn').addEventListener('click', openAddCategoryModal);
  document.getElementById('addCategoryClose').addEventListener('click', () =>
    document.getElementById('addCategoryOverlay').classList.remove('open'));
  document.getElementById('addCategoryOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('addCategoryOverlay'))
      document.getElementById('addCategoryOverlay').classList.remove('open');
  });

  // Category detail modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Store manager
  document.getElementById('manageStoresBtn').addEventListener('click', openStoreManager);
  document.getElementById('storeManagerClose').addEventListener('click', () =>
    document.getElementById('storeManagerOverlay').classList.remove('open'));
  document.getElementById('storeManagerOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('storeManagerOverlay'))
      document.getElementById('storeManagerOverlay').classList.remove('open');
  });
  document.getElementById('addStoreBtn').addEventListener('click', () => openStoreEditForm(null));

  // Store edit modal
  document.getElementById('storeEditClose').addEventListener('click', () =>
    document.getElementById('storeEditOverlay').classList.remove('open'));
  document.getElementById('storeEditOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('storeEditOverlay'))
      document.getElementById('storeEditOverlay').classList.remove('open');
  });

  renderMatrix();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', init);
