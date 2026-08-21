window.TMApp = window.TMApp || {};

TMApp.DragDrop = (function () {
  let boardEl = null;
  let onChange = null;
  let dragType = null; // 'card' | 'list'
  let dragId = null;
  let dragSourceListId = null;

  function init(board, changeCallback) {
    boardEl = board;
    onChange = changeCallback;
    boardEl.addEventListener('dragstart', onDragStart);
    boardEl.addEventListener('dragover', onDragOver);
    boardEl.addEventListener('drop', onDrop);
    boardEl.addEventListener('dragend', onDragEnd);
  }

  function onDragStart(e) {
    const cardEl = e.target.closest('.card');
    const listHeaderEl = e.target.closest('.list-header');
    if (cardEl) {
      dragType = 'card';
      dragId = cardEl.dataset.cardId;
      dragSourceListId = cardEl.dataset.listId;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
      cardEl.classList.add('dragging');
    } else if (listHeaderEl) {
      dragType = 'list';
      dragId = listHeaderEl.dataset.listId;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
      listHeaderEl.closest('.list').classList.add('dragging');
    }
  }

  function findCardListEl(target) {
    let cardListEl = target.closest('.card-list');
    if (!cardListEl) {
      const listEl = target.closest('.list');
      if (listEl) cardListEl = listEl.querySelector('.card-list');
    }
    return cardListEl;
  }

  function cardAfterPoint(cardListEl, y) {
    const cards = Array.from(cardListEl.querySelectorAll('.card:not(.dragging)'));
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (y < midpoint) {
        return card;
      }
    }
    return null;
  }

  function clearDropIndicators() {
    boardEl.querySelectorAll('.drop-before').forEach((el) => el.classList.remove('drop-before'));
    boardEl.querySelectorAll('.drop-at-end').forEach((el) => el.classList.remove('drop-at-end'));
    boardEl.querySelectorAll('.drop-before-list').forEach((el) => el.classList.remove('drop-before-list'));
    boardEl.querySelectorAll('.drop-after-list').forEach((el) => el.classList.remove('drop-after-list'));
  }

  function onDragOver(e) {
    if (!dragType) return;
    e.preventDefault();
    clearDropIndicators();

    if (dragType === 'card') {
      const cardListEl = findCardListEl(e.target);
      if (!cardListEl) return;
      const afterEl = cardAfterPoint(cardListEl, e.clientY);
      if (afterEl) {
        afterEl.classList.add('drop-before');
      } else {
        cardListEl.classList.add('drop-at-end');
      }
    } else if (dragType === 'list') {
      const listEl = e.target.closest('.list');
      if (!listEl || listEl.dataset.listId === dragId) return;
      const rect = listEl.getBoundingClientRect();
      const before = e.clientX < rect.left + rect.width / 2;
      listEl.classList.add(before ? 'drop-before-list' : 'drop-after-list');
    }
  }

  function commitIfSorted(listId) {
    if (TMApp.Sort.getMode(listId) !== 'manual') {
      const displayed = TMApp.Sort.sortForDisplay(TMApp.State.getCardsByList(listId), listId);
      TMApp.State.commitOrder(listId, displayed.map((c) => c.id));
      TMApp.Sort.resetMode(listId);
    }
  }

  function onDrop(e) {
    if (!dragType) return;
    e.preventDefault();
    clearDropIndicators();

    if (dragType === 'card') {
      const cardListEl = findCardListEl(e.target);
      if (cardListEl) {
        const targetListId = cardListEl.dataset.listId;
        const afterEl = cardAfterPoint(cardListEl, e.clientY);
        const siblingCards = Array.from(cardListEl.querySelectorAll('.card:not(.dragging)'));
        const targetIndex = afterEl ? siblingCards.indexOf(afterEl) : siblingCards.length;

        commitIfSorted(dragSourceListId);
        if (targetListId !== dragSourceListId) {
          commitIfSorted(targetListId);
        }
        TMApp.State.moveCard(dragId, targetListId, targetIndex);
      }
    } else if (dragType === 'list') {
      const listEl = e.target.closest('.list');
      if (listEl && listEl.dataset.listId !== dragId) {
        const lists = Array.from(boardEl.querySelectorAll('.list')).filter((l) => l.dataset.listId !== dragId);
        const rect = listEl.getBoundingClientRect();
        const before = e.clientX < rect.left + rect.width / 2;
        let targetIndex = lists.indexOf(listEl);
        if (!before) targetIndex += 1;
        TMApp.State.moveList(dragId, targetIndex);
      }
    }

    if (onChange) onChange();
  }

  function onDragEnd() {
    clearDropIndicators();
    boardEl.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));
    dragType = null;
    dragId = null;
    dragSourceListId = null;
  }

  return { init };
})();
