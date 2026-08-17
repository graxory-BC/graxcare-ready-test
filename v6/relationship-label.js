(() => {
  'use strict';

  const RELATIONSHIP_OPTIONS = [
    'Mother', 'Father', 'Parent', 'Spouse', 'Partner', 'Child', 'Sibling',
    'Grandparent', 'Grandchild', 'Relative', 'Friend', 'Neighbor',
    'Caregiver', 'Guardian', 'Other'
  ];

  function updateInclusiveCopy() {
    const addButton = document.getElementById('addProfileButton');
    if (addButton) addButton.textContent = 'Add person';

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle?.textContent === 'Add family member') modalTitle.textContent = 'Add person';
    if (modalTitle?.textContent === 'Edit family member') modalTitle.textContent = 'Edit person';

    const empty = document.querySelector('#profilesList .empty-state');
    if (empty?.textContent.includes('No family members yet.')) {
      empty.innerHTML = '<strong>No people added yet.</strong><br>Add one short profile to start using the action system.';
    }
  }

  function enhanceRelationshipField() {
    updateInclusiveCopy();

    const input = document.getElementById('relationship');
    if (!input || input.dataset.graxRelationshipReady === 'true') return;

    input.dataset.graxRelationshipReady = 'true';
    input.setAttribute('list', 'relationshipOptions');
    input.setAttribute('placeholder', 'Choose a label or type your own');

    const label = document.querySelector('label[for="relationship"]');
    if (label) label.textContent = 'Relationship / label *';

    let list = document.getElementById('relationshipOptions');
    if (!list) {
      list = document.createElement('datalist');
      list.id = 'relationshipOptions';
      list.innerHTML = RELATIONSHIP_OPTIONS.map(option => `<option value="${option}"></option>`).join('');
      input.insertAdjacentElement('afterend', list);
    }

    const field = input.closest('.field');
    const hint = field?.querySelector('small');
    if (hint) hint.textContent = 'Choose a suggested label or type your own.';
  }

  const root = document.getElementById('modalRoot');
  if (root) {
    new MutationObserver(enhanceRelationshipField).observe(root, { childList: true, subtree: true });
  }

  updateInclusiveCopy();
  document.addEventListener('click', () => setTimeout(enhanceRelationshipField, 0));
})();
