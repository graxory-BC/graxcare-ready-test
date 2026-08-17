(() => {
  'use strict';

  const RELATIONSHIP_OPTIONS = [
    'Mother', 'Father', 'Parent', 'Spouse', 'Partner', 'Child', 'Sibling',
    'Grandparent', 'Grandchild', 'Relative', 'Friend', 'Neighbor',
    'Caregiver', 'Guardian', 'Other'
  ];

  function enhanceRelationshipField() {
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
  document.addEventListener('click', () => setTimeout(enhanceRelationshipField, 0));
})();
