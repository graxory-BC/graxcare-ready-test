'use strict';

const STORAGE_KEY = 'graxcare_ready_state_v1';
const APP_VERSION = 1;

const situations = [
  {
    id: 'cant-reach', icon: '☎', title: "I can’t reach them", urgent: true,
    intro: 'Use the quickest safe way to confirm their wellbeing.',
    steps: [
      'Call the person again and send a short text message.',
      'Contact the closest trusted family member, neighbor, or caregiver.',
      'Check any agreed routine, appointment, or travel information.',
      'If there may be immediate danger, call 911 and explain why you are concerned.',
      'Record who was contacted and what happened.'
    ]
  },
  {
    id: 'urgent-care', icon: '✚', title: 'We need urgent care', urgent: true,
    intro: 'Focus on safety, essential information, and fast communication.',
    steps: [
      'If the person may be in immediate danger, call 911 now.',
      'Do not delay emergency help to complete this checklist.',
      'Bring the medication list, allergy information, identification, and insurance card if available.',
      'Contact the primary family contact.',
      'Write down the main symptoms, when they began, and any recent medication changes.'
    ]
  },
  {
    id: 'hospital', icon: 'H', title: 'We are going to the hospital', urgent: false,
    intro: 'Bring the right information and keep the family coordinated.',
    steps: [
      'Take the current medication and allergy list.',
      'Bring identification, insurance information, phone, charger, and mobility or communication aids.',
      'Choose one family contact to share updates.',
      'Write down the reason for the visit and important questions.',
      'Confirm transportation and access to the home afterward.'
    ]
  },
  {
    id: 'back-home', icon: '⌂', title: 'Back from the hospital', urgent: false,
    intro: 'Turn discharge instructions into clear next actions.',
    steps: [
      'Review the discharge instructions before the day ends.',
      'Confirm medication changes and remove outdated instructions from the active list.',
      'Schedule required follow-up appointments.',
      'Assign help for transportation, meals, mobility, or home care if needed.',
      'Add warning signs and who to call to the follow-up notes.'
    ]
  },
  {
    id: 'medication-change', icon: 'Rx', title: 'Medication changed', urgent: false,
    intro: 'Update one reliable list and make the change visible to the family.',
    steps: [
      'Record the medication name, dose, schedule, and start or stop date.',
      'Keep the prescribing clinician and pharmacy information with the change.',
      'Remove or clearly mark old instructions to prevent confusion.',
      'Tell the family member or caregiver responsible for medications.',
      'Add questions or side effects to discuss with the clinician or pharmacist.'
    ]
  },
  {
    id: 'family-help', icon: '👥', title: 'I need help from family', urgent: false,
    intro: 'Make one clear request instead of sending a vague group message.',
    steps: [
      'Describe exactly what help is needed.',
      'Choose the date, time, location, and expected duration.',
      'Send the request to the most appropriate person first.',
      'Confirm who accepted the task.',
      'Add the task to Follow Up until it is completed.'
    ]
  },
  {
    id: 'caregiver-unavailable', icon: '↻', title: 'Caregiver unavailable', urgent: false,
    intro: 'Activate the simplest safe backup plan.',
    steps: [
      'Confirm how long the caregiver will be unavailable.',
      'Contact the first backup caregiver or family member.',
      'Share only the information needed for the temporary care period.',
      'Confirm medication, meals, mobility, transportation, and emergency contacts.',
      'Record who is covering and when the regular plan resumes.'
    ]
  },
  {
    id: 'suspicious-message', icon: '!', title: 'Suspicious call or message', urgent: false,
    intro: 'Pause before sharing information, sending money, or clicking a link.',
    steps: [
      'Do not share passwords, codes, banking information, or identification numbers.',
      'Do not click links or install software from the message.',
      'End the call and contact the person or organization using a known number.',
      'Save a screenshot or note the caller information if safe to do so.',
      'Tell a trusted family member and report the incident when appropriate.'
    ]
  },
  {
    id: 'device-problem', icon: '⌁', title: 'Phone or alert device problem', urgent: false,
    intro: 'Restore a reliable way to communicate as quickly as possible.',
    steps: [
      'Check power, charging cable, volume, signal, and internet connection.',
      'Restart the device once.',
      'Test an outgoing call or alert with a trusted contact.',
      'Use the backup phone or contact method if the problem continues.',
      'Arrange repair or replacement and record the temporary contact method.'
    ]
  },
  {
    id: 'travel', icon: '✈', title: 'Travel or away from home', urgent: false,
    intro: 'Carry the essential plan without carrying every document.',
    steps: [
      'Confirm medication supply for the full trip plus a reasonable buffer.',
      'Carry the essential medication, allergy, clinician, insurance, and emergency contact summary.',
      'Share destination and travel dates with a trusted family contact.',
      'Identify the nearest appropriate care option at the destination.',
      'Create an encrypted backup before leaving.'
    ]
  },
  {
    id: 'appointment', icon: '□', title: 'Follow-up appointment', urgent: false,
    intro: 'Arrive with the right questions and leave with clear instructions.',
    steps: [
      'Confirm the date, time, location, transportation, and required documents.',
      'Write the three most important questions before the appointment.',
      'Bring the current medication and allergy list.',
      'Record new instructions, tests, referrals, or medication changes.',
      'Add the next review date and assigned tasks to Follow Up.'
    ]
  },
  {
    id: 'update-info', icon: '✎', title: 'Information needs updating', urgent: false,
    intro: 'Keep the plan useful by updating only what changed.',
    steps: [
      'Open the selected family profile.',
      'Update the changed contact, medication, clinician, pharmacy, insurance, or support need.',
      'Remove outdated information that could cause confusion.',
      'Save the profile and review the summary.',
      'Export a new encrypted backup after important changes.'
    ]
  }
];

const defaultState = () => ({
  version: APP_VERSION,
  profiles: [],
  selectedProfileId: null,
  activeSituationId: null,
  actionProgress: {},
  followups: [],
  updatedAt: new Date().toISOString()
});

let state = loadState();
let deferredInstallPrompt = null;

const $ = (selector, root = document) => root.querySelector(selector);
function createId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return validateState(parsed) ? parsed : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function validateState(candidate) {
  const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
  const isText = (value, max = 3000) => typeof value === 'string' && value.length <= max;
  const isId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  if (!isObject(candidate) || candidate.version !== APP_VERSION) return false;
  if (!Array.isArray(candidate.profiles) || candidate.profiles.length > 50) return false;
  if (!Array.isArray(candidate.followups) || candidate.followups.length > 500) return false;
  if (!isObject(candidate.actionProgress) || Object.keys(candidate.actionProgress).length > 600) return false;

  const profileIds = new Set();
  for (const profile of candidate.profiles) {
    if (!isObject(profile) || !isId(profile.id) || profileIds.has(profile.id)) return false;
    profileIds.add(profile.id);
    for (const key of ['name','relationship','age','primaryContact','primaryPhone','doctor','pharmacy','hospital','insurance']) {
      if (!isText(profile[key] ?? '', 180)) return false;
    }
    for (const key of ['allergies','conditions','medications','supportNeeds']) {
      if (!isText(profile[key] ?? '', 3000)) return false;
    }
    const photo = profile.photoDataUrl ?? '';
    if (!isText(photo, 420000) || (photo && !safePhotoDataUrl(photo))) return false;
  }

  if (candidate.selectedProfileId !== null && !profileIds.has(candidate.selectedProfileId)) return false;
  if (candidate.activeSituationId !== null && !situations.some(item => item.id === candidate.activeSituationId)) return false;

  for (const [key, values] of Object.entries(candidate.actionProgress)) {
    const separator = key.lastIndexOf(':');
    if (separator < 1) return false;
    const profileId = key.slice(0, separator);
    const situationId = key.slice(separator + 1);
    const situation = situations.find(item => item.id === situationId);
    if (!profileIds.has(profileId) || !situation || !Array.isArray(values) || values.length > situation.steps.length) return false;
    if (!values.every(value => Number.isInteger(value) && value >= 0 && value < situation.steps.length)) return false;
  }

  const followupIds = new Set();
  for (const item of candidate.followups) {
    if (!isObject(item) || !isId(item.id) || followupIds.has(item.id)) return false;
    followupIds.add(item.id);
    if (!isText(item.title ?? '', 200) || !String(item.title || '').trim()) return false;
    if (!isText(item.notes ?? '', 3000) || !isText(item.category ?? '', 120)) return false;
    if (item.profileId && !profileIds.has(item.profileId)) return false;
    if (!isText(item.dueDate ?? '', 20) || (item.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(item.dueDate))) return false;
    if (typeof item.completed !== 'boolean' || !isText(item.createdAt ?? '', 60)) return false;
  }

  return isText(candidate.updatedAt ?? '', 60);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0,2).map(part => part[0]).join('').toUpperCase() || '?';
}

function safePhotoDataUrl(value) {
  return typeof value === 'string' && /^data:image\/(png|jpeg|webp);base64,/i.test(value) ? value : '';
}

function selectedProfile() {
  return state.profiles.find(profile => profile.id === state.selectedProfileId) || null;
}

function activeSituation() {
  return situations.find(item => item.id === state.activeSituationId) || null;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function routeTo(route) {
  $$('.view').forEach(view => { view.hidden = view.dataset.view !== route; });
  $$('.nav-button').forEach(button => button.classList.toggle('active', button.dataset.route === route));
  if (route === 'home') renderHome();
  if (route === 'action') renderAction();
  if (route === 'followup') renderFollowups();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#main').focus({ preventScroll: true });
}

function renderHome() {
  renderProfiles();
  renderSituations();
}

function renderProfiles() {
  const container = $('#profilesList');
  if (!state.profiles.length) {
    container.innerHTML = `<div class="empty-state"><strong>No family members yet.</strong><br>Add one short profile to start using the action system.</div>`;
    return;
  }
  container.innerHTML = state.profiles.map(profile => `
    <div class="profile-card ${profile.id === state.selectedProfileId ? 'selected' : ''}" data-profile-id="${profile.id}" role="button" tabindex="0" aria-pressed="${profile.id === state.selectedProfileId}">
      <span class="avatar" aria-hidden="true">${safePhotoDataUrl(profile.photoDataUrl) ? `<img src="${escapeHtml(safePhotoDataUrl(profile.photoDataUrl))}" alt="">` : escapeHtml(initials(profile.name))}</span>
      <span><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.relationship || 'Family member')}${profile.age ? ` · Age ${escapeHtml(profile.age)}` : ''}</small></span>
      <span class="profile-actions"><button class="icon-button edit-profile" type="button" data-edit-profile="${profile.id}" aria-label="Edit ${escapeHtml(profile.name)}">✎</button></span>
    </div>
  `).join('');

  $$('[data-profile-id]', container).forEach(card => {
    const select = () => {
      state.selectedProfileId = card.dataset.profileId;
      saveState();
      renderHome();
    };
    card.addEventListener('click', event => { if (!event.target.closest('.edit-profile')) select(); });
    card.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.edit-profile')) { event.preventDefault(); select(); } });
  });
  $$('.edit-profile', container).forEach(button => button.addEventListener('click', () => openProfileModal(button.dataset.editProfile)));
}

function renderSituations() {
  const profile = selectedProfile();
  $('#selectionHint').textContent = profile ? `Selected: ${profile.name}` : 'Select a family member first.';
  $('#situationsGrid').innerHTML = situations.map(item => `
    <button class="situation-card ${item.urgent ? 'urgent' : ''}" type="button" data-situation-id="${item.id}" ${profile ? '' : 'disabled'}>
      <span class="situation-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
      <strong>${escapeHtml(item.title)}</strong>
    </button>
  `).join('');
  $$('[data-situation-id]').forEach(button => button.addEventListener('click', () => {
    state.activeSituationId = button.dataset.situationId;
    saveState();
    routeTo('action');
  }));
}

function renderAction() {
  const profile = selectedProfile();
  const situation = activeSituation();
  if (!profile || !situation) {
    routeTo('home');
    return;
  }
  const progressKey = `${profile.id}:${situation.id}`;
  const progress = state.actionProgress[progressKey] || [];
  const contactPhone = profile.primaryPhone || '';
  const summary = buildShareSummary(profile, situation, progress);

  $('#actionContent').innerHTML = `
    <section class="action-hero">
      <p class="eyebrow">Step 3 of 3 · ${escapeHtml(profile.name)}</p>
      <h1>${escapeHtml(situation.title)}</h1>
      <p>${escapeHtml(situation.intro)}</p>
    </section>
    ${situation.urgent ? `<div class="urgent-banner">If someone may be in immediate danger in the United States, call 911 now. Do not delay help to complete this checklist.</div>` : ''}
    <div class="action-layout">
      <section class="panel">
        <div class="section-heading"><div><p class="step-label">Action checklist</p><h2>What to do next</h2></div><span class="pill">${progress.length}/${situation.steps.length} complete</span></div>
        <div class="checklist">
          ${situation.steps.map((step, index) => `
            <label class="check-item"><input type="checkbox" data-action-check="${index}" ${progress.includes(index) ? 'checked' : ''}><span>${escapeHtml(step)}</span></label>
          `).join('')}
        </div>
      </section>
      <aside>
        <section class="panel">
          <h2>${escapeHtml(profile.name)} — essential information</h2>
          <dl class="profile-summary">
            ${summaryRow('Allergies', profile.allergies)}
            ${summaryRow('Conditions', profile.conditions)}
            ${summaryRow('Medications', profile.medications)}
            ${summaryRow('Doctor / clinic', profile.doctor)}
            ${summaryRow('Pharmacy', profile.pharmacy)}
            ${summaryRow('Hospital', profile.hospital)}
            ${summaryRow('Insurance', profile.insurance)}
            ${summaryRow('Primary contact', [profile.primaryContact, profile.primaryPhone].filter(Boolean).join(' · '))}
            ${summaryRow('Support needs', profile.supportNeeds)}
          </dl>
        </section>
        <section class="panel quick-actions">
          <h2>Quick actions</h2>
          ${contactPhone ? `<a class="button button-primary" href="tel:${escapeHtml(contactPhone)}">Call primary contact</a><a class="button button-secondary" href="sms:${escapeHtml(contactPhone)}?&body=${encodeURIComponent(summary)}">Send message</a>` : `<button class="button button-secondary" type="button" id="editSelectedProfile">Add contact number</button>`}
          <button class="button button-secondary" type="button" id="shareSummaryButton">Share summary</button>
          <button class="button button-secondary" type="button" id="printSummaryButton">Print summary</button>
          <button class="button button-primary" type="button" id="saveFollowupFromAction">Save a follow-up</button>
        </section>
      </aside>
    </div>
  `;

  $$('[data-action-check]').forEach(box => box.addEventListener('change', () => {
    const index = Number(box.dataset.actionCheck);
    const current = new Set(state.actionProgress[progressKey] || []);
    box.checked ? current.add(index) : current.delete(index);
    state.actionProgress[progressKey] = Array.from(current).sort((a,b) => a-b);
    saveState();
    renderAction();
  }));
  $('#editSelectedProfile')?.addEventListener('click', () => openProfileModal(profile.id));
  $('#shareSummaryButton').addEventListener('click', () => shareText(summary));
  $('#printSummaryButton').addEventListener('click', () => window.print());
  $('#saveFollowupFromAction').addEventListener('click', () => openFollowupModal({ profileId: profile.id, title: situation.title }));
}

function summaryRow(label, value) {
  return `<div class="summary-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || 'Not added')}</dd></div>`;
}

function buildShareSummary(profile, situation, progress = []) {
  const completed = progress.length ? `\nChecklist progress: ${progress.length}/${situation.steps.length}` : '';
  return `GraxCare Ready\nPerson: ${profile.name}\nSituation: ${situation.title}${completed}\nAllergies: ${profile.allergies || 'Not added'}\nConditions: ${profile.conditions || 'Not added'}\nMedications: ${profile.medications || 'Not added'}\nDoctor / clinic: ${profile.doctor || 'Not added'}\nUsual hospital: ${profile.hospital || 'Not added'}\nInsurance: ${profile.insurance || 'Not added'}\nPrimary contact: ${[profile.primaryContact, profile.primaryPhone].filter(Boolean).join(' · ') || 'Not added'}\nSupport needs: ${profile.supportNeeds || 'Not added'}\n\nThis summary organizes family information. It is not medical advice or a replacement for emergency services.`;
}

async function shareText(text) {
  try {
    if (navigator.share) await navigator.share({ title: 'GraxCare Ready summary', text });
    else {
      await navigator.clipboard.writeText(text);
      showToast('Summary copied to clipboard.');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') showToast('Sharing was not available on this device.');
  }
}

function renderFollowups() {
  const container = $('#followupList');
  if (!state.followups.length) {
    container.innerHTML = `<div class="empty-state"><strong>No follow-up items.</strong><br>Add appointments, questions, medication changes, or assigned tasks here.</div>`;
    return;
  }
  const sorted = [...state.followups].sort((a,b) => Number(a.completed) - Number(b.completed) || String(a.dueDate).localeCompare(String(b.dueDate)));
  container.innerHTML = sorted.map(item => {
    const profile = state.profiles.find(p => p.id === item.profileId);
    return `<article class="followup-card ${item.completed ? 'completed' : ''}">
      <input type="checkbox" aria-label="Mark ${escapeHtml(item.title)} complete" data-followup-toggle="${item.id}" ${item.completed ? 'checked' : ''}>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.notes || '')}</p><div class="followup-meta">${profile ? `<span class="pill">${escapeHtml(profile.name)}</span>` : ''}${item.category ? `<span class="pill">${escapeHtml(item.category)}</span>` : ''}${item.dueDate ? `<span class="pill">Due ${escapeHtml(formatDate(item.dueDate))}</span>` : ''}</div></div>
      <button class="icon-button" type="button" data-followup-delete="${item.id}" aria-label="Delete ${escapeHtml(item.title)}">×</button>
    </article>`;
  }).join('');
  $$('[data-followup-toggle]').forEach(box => box.addEventListener('change', () => {
    const item = state.followups.find(entry => entry.id === box.dataset.followupToggle);
    if (item) { item.completed = box.checked; saveState(); renderFollowups(); }
  }));
  $$('[data-followup-delete]').forEach(button => button.addEventListener('click', () => {
    confirmDialog('Delete follow-up?', 'This follow-up item will be removed.', 'Delete', () => {
      state.followups = state.followups.filter(item => item.id !== button.dataset.followupDelete);
      saveState(); renderFollowups();
    });
  }));
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function openProfileModal(profileId = null) {
  const profile = state.profiles.find(item => item.id === profileId) || {};
  const editing = Boolean(profileId);
  showModal({
    title: editing ? 'Edit family member' : 'Add family member',
    body: `<form id="profileForm" class="form-grid">
      <div id="profileFormError" class="form-error field full" hidden></div>
      ${field('Name', 'name', profile.name, true)}
      ${field('Relationship', 'relationship', profile.relationship, true, 'Example: Mother, spouse, self')}
      ${field('Age', 'age', profile.age, false, '', 'number')}
      <div class="field full"><label for="photoFile">Optional photo</label><input id="photoFile" name="photoFile" type="file" accept="image/png,image/jpeg,image/webp"><small>The photo stays on this device and is included only in encrypted backups.${safePhotoDataUrl(profile.photoDataUrl) ? ' Choose a new photo to replace the current one.' : ''}</small>${safePhotoDataUrl(profile.photoDataUrl) ? '<label class="inline-check"><input id="removePhoto" name="removePhoto" type="checkbox"> Remove current photo</label>' : ''}</div>
      ${field('Primary contact name', 'primaryContact', profile.primaryContact)}
      ${field('Primary contact phone', 'primaryPhone', profile.primaryPhone, false, '', 'tel')}
      ${field('Doctor or clinic', 'doctor', profile.doctor)}
      ${field('Pharmacy', 'pharmacy', profile.pharmacy)}
      ${field('Usual hospital', 'hospital', profile.hospital)}
      ${field('Insurance plan', 'insurance', profile.insurance, false, 'Provider and plan name only. Do not enter a full member ID.')}
      ${textareaField('Allergies', 'allergies', profile.allergies, 'Only important allergies.')}
      ${textareaField('Important conditions', 'conditions', profile.conditions, 'Keep this short and current.')}
      ${textareaField('Medications, dose, and schedule', 'medications', profile.medications, 'One medication per line is easiest to read.')}
      ${textareaField('Mobility, hearing, vision, or communication needs', 'supportNeeds', profile.supportNeeds, 'Only information needed to help safely.')}
    </form>`,
    primaryText: editing ? 'Save changes' : 'Add family member',
    secondaryText: editing ? 'Delete' : 'Cancel',
    secondaryDanger: editing,
    onPrimary: async () => {
      const form = $('#profileForm');
      const data = Object.fromEntries(new FormData(form));
      if (!String(data.name || '').trim() || !String(data.relationship || '').trim()) {
        const error = $('#profileFormError'); error.textContent = 'Name and relationship are required.'; error.hidden = false; return false;
      }
      let photoDataUrl = safePhotoDataUrl(profile.photoDataUrl);
      if ($('#removePhoto')?.checked) photoDataUrl = '';
      const photoFile = $('#photoFile')?.files?.[0];
      if (photoFile) {
        try { photoDataUrl = await compressProfilePhoto(photoFile); }
        catch (error) {
          const message = $('#profileFormError'); message.textContent = error.message || 'The photo could not be prepared.'; message.hidden = false; return false;
        }
      }
      delete data.photoFile;
      delete data.removePhoto;
      const next = { ...profile, ...data, photoDataUrl, id: profileId || createId() };
      if (editing) state.profiles = state.profiles.map(item => item.id === profileId ? next : item);
      else state.profiles.push(next);
      state.selectedProfileId = next.id;
      saveState(); closeModal(); renderHome(); showToast(editing ? 'Profile updated.' : 'Family member added.');
      return true;
    },
    onSecondary: editing ? () => confirmDialog('Delete this family member?', 'Their profile and related action progress will be removed.', 'Delete', () => {
      state.profiles = state.profiles.filter(item => item.id !== profileId);
      Object.keys(state.actionProgress).filter(key => key.startsWith(`${profileId}:`)).forEach(key => delete state.actionProgress[key]);
      state.followups = state.followups.filter(item => item.profileId !== profileId);
      if (state.selectedProfileId === profileId) state.selectedProfileId = state.profiles[0]?.id || null;
      saveState(); closeModal(); renderHome(); showToast('Family member deleted.');
    }) : closeModal
  });
}

async function compressProfilePhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a PNG, JPEG, or WebP image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Choose a photo smaller than 8 MB.');
  let source;
  let cleanup = () => {};
  try {
    if (typeof createImageBitmap === 'function') source = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {}
  if (!source) {
    const url = URL.createObjectURL(file);
    cleanup = () => URL.revokeObjectURL(url);
    source = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('The selected photo could not be read.'));
      image.src = url;
    });
  }
  const maxSide = 256;
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d', { alpha: false }).drawImage(source, 0, 0, width, height);
  source.close?.(); cleanup();
  let result = canvas.toDataURL('image/jpeg', .82);
  if (result.length > 320000) result = canvas.toDataURL('image/jpeg', .65);
  if (result.length > 420000) throw new Error('Choose a simpler or smaller photo.');
  return result;
}

function field(label, name, value = '', required = false, hint = '', type = 'text') {
  const limits = { age: 3, primaryPhone: 40 };
  const maxLength = limits[name] || 180;
  const numberLimits = type === 'number' ? ' min="0" max="130" inputmode="numeric"' : '';
  return `<div class="field"><label for="${name}">${escapeHtml(label)}${required ? ' *' : ''}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value || '')}" maxlength="${maxLength}"${numberLimits} ${required ? 'required' : ''} autocomplete="off">${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</div>`;
}
function textareaField(label, name, value = '', hint = '') {
  return `<div class="field full"><label for="${name}">${escapeHtml(label)}</label><textarea id="${name}" name="${name}" maxlength="3000" autocomplete="off">${escapeHtml(value || '')}</textarea>${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</div>`;
}

function openFollowupModal(seed = {}) {
  const minDate = new Date().toISOString().slice(0,10);
  showModal({
    title: 'Add follow-up',
    body: `<form id="followupForm" class="form-grid">
      ${field('Title', 'title', seed.title || '', true).replace('maxlength="180"', 'maxlength="200"')}
      <div class="field"><label for="category">Category</label><select id="category" name="category"><option>Appointment</option><option>Medication change</option><option>Question for clinician</option><option>Assigned task</option><option>Home need</option><option>Information update</option></select></div>
      <div class="field"><label for="profileId">Family member</label><select id="profileId" name="profileId"><option value="">General</option>${state.profiles.map(profile => `<option value="${profile.id}" ${seed.profileId === profile.id ? 'selected' : ''}>${escapeHtml(profile.name)}</option>`).join('')}</select></div>
      <div class="field"><label for="dueDate">Due date</label><input id="dueDate" name="dueDate" type="date" min="${minDate}"></div>
      ${textareaField('Notes', 'notes', '', 'Keep the next action clear and specific.')}
    </form>`,
    primaryText: 'Save follow-up',
    secondaryText: 'Cancel',
    onPrimary: () => {
      const data = Object.fromEntries(new FormData($('#followupForm')));
      if (!data.title.trim()) return false;
      state.followups.push({ ...data, id: createId(), completed: false, createdAt: new Date().toISOString() });
      saveState(); closeModal(); renderFollowups(); routeTo('followup'); showToast('Follow-up saved.'); return true;
    },
    onSecondary: closeModal
  });
}

function showModal({ title, body, primaryText, secondaryText, onPrimary, onSecondary, secondaryDanger = false }) {
  const root = $('#modalRoot');
  root.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><h2 id="modalTitle">${escapeHtml(title)}</h2><button class="icon-button" type="button" id="modalClose" aria-label="Close">×</button></div><div class="modal-body">${body}</div><div class="modal-footer"><button class="button ${secondaryDanger ? 'button-danger' : 'button-secondary'}" type="button" id="modalSecondary">${escapeHtml(secondaryText)}</button><button class="button button-primary" type="button" id="modalPrimary">${escapeHtml(primaryText)}</button></div></div>`;
  root.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalSecondary').addEventListener('click', onSecondary);
  $('#modalPrimary').addEventListener('click', async () => {
    const button = $('#modalPrimary');
    button.disabled = true;
    try {
      const result = await onPrimary();
      if (result === false && document.body.contains(button)) button.disabled = false;
    } catch {
      if (document.body.contains(button)) button.disabled = false;
      showToast('That action could not be completed.');
    }
  });
  root.addEventListener('click', event => { if (event.target === root) closeModal(); }, { once: true });
  setTimeout(() => $('#modalPrimary').focus(), 0);
}

function closeModal() {
  const root = $('#modalRoot');
  root.hidden = true;
  root.innerHTML = '';
  document.body.style.overflow = '';
}

function confirmDialog(title, message, confirmText, onConfirm) {
  showModal({
    title,
    body: `<p>${escapeHtml(message)}</p>`,
    primaryText: confirmText,
    secondaryText: 'Cancel',
    onPrimary: () => { closeModal(); onConfirm(); },
    onSecondary: closeModal
  });
}

async function exportBackup() {
  promptPassword('Create backup password', 'Use at least 8 characters. You will need this password to restore the backup.', async password => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const plain = new TextEncoder().encode(JSON.stringify(state));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
    const payload = { format: 'graxcare-ready-backup', version: APP_VERSION, kdf: 'PBKDF2-SHA256', iterations: 250000, cipher: 'AES-GCM', salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)), exportedAt: new Date().toISOString() };
    downloadBlob(new Blob([JSON.stringify(payload)], { type: 'application/json' }), `GraxCare-Ready-Backup-${new Date().toISOString().slice(0,10)}.graxcare`);
    showToast('Encrypted backup exported.');
  });
}

async function restoreBackup(file) {
  let payload;
  try { payload = JSON.parse(await file.text()); }
  catch { showToast('This file is not a valid GraxCare Ready backup.'); return; }
  if (payload?.format !== 'graxcare-ready-backup' || !payload.salt || !payload.iv || !payload.data) { showToast('This file is not a valid GraxCare Ready backup.'); return; }
  promptPassword('Restore backup', 'Enter the password used when this backup was created.', async password => {
    try {
      const salt = base64ToBytes(payload.salt);
      const iv = base64ToBytes(payload.iv);
      const encrypted = base64ToBytes(payload.data);
      const key = await deriveKey(password, salt, payload.iterations || 250000);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
      const candidate = JSON.parse(new TextDecoder().decode(decrypted));
      if (!validateState(candidate)) throw new Error('Invalid state');
      confirmDialog('Replace information on this device?', 'The current local information will be replaced by the selected backup.', 'Restore', () => {
        state = candidate; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderHome(); routeTo('home'); showToast('Backup restored and verified.');
      });
    } catch { showToast('Restore failed. The password may be wrong or the file may be damaged.'); }
  });
}

function promptPassword(title, message, onSubmit) {
  showModal({
    title,
    body: `<form id="passwordForm" class="form-grid"><p class="field full">${escapeHtml(message)}</p><div id="passwordError" class="form-error field full" hidden></div><div class="field full"><label for="backupPassword">Password</label><input id="backupPassword" type="password" name="password" minlength="8" autocomplete="new-password"></div></form>`,
    primaryText: 'Continue',
    secondaryText: 'Cancel',
    onPrimary: async () => {
      const password = $('#backupPassword').value;
      if (password.length < 8) { const error = $('#passwordError'); error.textContent = 'Use at least 8 characters.'; error.hidden = false; return false; }
      closeModal(); await onSubmit(password); return true;
    },
    onSecondary: closeModal
  });
}

async function deriveKey(password, salt, iterations = 250000) {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt','decrypt']);
}

function bytesToBase64(bytes) {
  let binary = ''; bytes.forEach(byte => { binary += String.fromCharCode(byte); }); return btoa(binary);
}
function base64ToBytes(value) {
  const binary = atob(value); return Uint8Array.from(binary, char => char.charCodeAt(0));
}
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = fileName; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function updateConnectionStatus() {
  const status = $('#connectionStatus');
  const online = navigator.onLine;
  status.textContent = online ? 'Online' : 'Offline ready';
  status.classList.toggle('offline', !online);
}

function registerServiceWorker() {
  if (navigator.serviceWorker?.register) navigator.serviceWorker.register('./service-worker.js').catch(() => showToast('Offline installation was not available in this browser.'));
}

function bindEvents() {
  $$('[data-route]').forEach(button => button.addEventListener('click', () => routeTo(button.dataset.route)));
  $('#addProfileButton').addEventListener('click', () => openProfileModal());
  $('#addFollowupButton').addEventListener('click', () => openFollowupModal());
  $('#exportBackupButton').addEventListener('click', exportBackup);
  $('#restoreFileInput').addEventListener('change', event => { const file = event.target.files?.[0]; if (file) restoreBackup(file); event.target.value = ''; });
  $('#resetDataButton').addEventListener('click', () => confirmDialog('Delete all local data?', 'This action cannot be undone unless you have a valid encrypted backup.', 'Delete everything', () => {
    state = defaultState(); saveState(); renderHome(); routeTo('home'); showToast('All local data deleted.');
  }));
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstallPrompt = event; $('#installButton').hidden = false; });
  $('#installButton').addEventListener('click', async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; $('#installButton').hidden = true; });
}

function init() {
  bindEvents();
  updateConnectionStatus();
  renderHome();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);
