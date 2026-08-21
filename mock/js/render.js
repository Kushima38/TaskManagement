window.TMApp = window.TMApp || {};

TMApp.Render = (function () {
  const boardEl = document.getElementById('board');

  function renderBoard() {
    boardEl.innerHTML = '';
    TMApp.State.getLists().forEach((list) => {
      boardEl.appendChild(renderList(list));
    });
    boardEl.appendChild(renderAddList());
  }

  function renderList(list) {
    const el = document.createElement('div');
    el.className = 'list';
    el.dataset.listId = list.id;

    const header = document.createElement('div');
    header.className = 'list-header';
    header.draggable = true;
    header.dataset.listId = list.id;

    const titleEl = document.createElement('span');
    titleEl.className = 'list-title';
    titleEl.textContent = list.title;
    titleEl.dataset.listId = list.id;

    const countEl = document.createElement('span');
    countEl.className = 'list-count';
    countEl.textContent = String(TMApp.State.getCardsByList(list.id).length);

    const actions = document.createElement('div');
    actions.className = 'list-header-actions';

    const sortBtn = document.createElement('button');
    sortBtn.type = 'button';
    sortBtn.className = 'icon-btn sort-btn';
    sortBtn.textContent = '⇅';
    sortBtn.title = '並び替え';
    sortBtn.dataset.listId = list.id;

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'icon-btn menu-btn';
    menuBtn.textContent = '…';
    menuBtn.dataset.menuType = 'list';
    menuBtn.dataset.listId = list.id;

    actions.appendChild(sortBtn);
    actions.appendChild(menuBtn);
    header.appendChild(titleEl);
    header.appendChild(countEl);
    header.appendChild(actions);

    const sortMode = TMApp.Sort.getMode(list.id);
    if (sortMode !== 'manual') {
      const badge = document.createElement('span');
      badge.className = 'sort-badge';
      badge.textContent = sortMode === 'priority' ? '優先度順' : '期限日順';
      header.appendChild(badge);
    }

    const cardList = document.createElement('div');
    cardList.className = 'card-list';
    cardList.dataset.listId = list.id;

    const cards = TMApp.Sort.sortForDisplay(TMApp.State.getCardsByList(list.id), list.id);
    cards.forEach((card) => {
      cardList.appendChild(renderCard(card));
    });

    el.appendChild(header);
    el.appendChild(cardList);
    el.appendChild(renderAddCard(list.id));
    return el;
  }

  function renderCard(card) {
    const el = document.createElement('div');
    el.className = 'card';
    if (TMApp.Utils.isOverdue(card)) {
      el.classList.add('card--overdue');
    }
    el.draggable = true;
    el.dataset.cardId = card.id;
    el.dataset.listId = card.list_id;

    const top = document.createElement('div');
    top.className = 'card-top';

    const titleEl = document.createElement('span');
    titleEl.className = 'card-title';
    titleEl.textContent = card.title;

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'icon-btn menu-btn';
    menuBtn.textContent = '…';
    menuBtn.dataset.menuType = 'card';
    menuBtn.dataset.cardId = card.id;

    top.appendChild(titleEl);
    top.appendChild(menuBtn);
    el.appendChild(top);

    if (card.priority || card.due_date) {
      const badges = document.createElement('div');
      badges.className = 'card-badges';

      if (card.priority) {
        const b = document.createElement('span');
        b.className = `badge badge-priority badge-priority--${priorityModifier(card.priority)}`;
        b.textContent = card.priority;
        badges.appendChild(b);
      }
      if (card.due_date) {
        const b = document.createElement('span');
        b.className = 'badge badge-due';
        b.textContent = TMApp.Utils.formatDateForDisplay(card.due_date);
        badges.appendChild(b);
      }
      el.appendChild(badges);
    }

    return el;
  }

  function priorityModifier(priority) {
    if (priority === '高') return 'high';
    if (priority === '中') return 'mid';
    if (priority === '低') return 'low';
    return '';
  }

  function renderAddCard(listId) {
    const wrap = document.createElement('div');
    wrap.className = 'add-card';
    wrap.dataset.listId = listId;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'add-card-btn';
    btn.textContent = '+ カードを追加';
    btn.dataset.listId = listId;

    wrap.appendChild(btn);
    return wrap;
  }

  function renderAddList() {
    const wrap = document.createElement('div');
    wrap.className = 'add-list';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'add-list-btn';
    btn.textContent = '+ 新しいリスト';

    wrap.appendChild(btn);
    return wrap;
  }

  return { renderBoard };
})();
