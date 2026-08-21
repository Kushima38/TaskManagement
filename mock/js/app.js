(function () {
  const boardEl = document.getElementById('board');
  const modalEl = document.getElementById('card-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const titleInput = document.getElementById('card-title-input');
  const titleError = document.getElementById('card-title-error');
  const descInput = document.getElementById('card-desc-input');
  const descCount = document.getElementById('card-desc-count');
  const descError = document.getElementById('card-desc-error');
  const dueInput = document.getElementById('card-due-input');
  const dueError = document.getElementById('card-due-error');
  const deleteBtn = document.getElementById('card-delete-btn');
  const saveBtn = document.getElementById('card-save-btn');

  let currentCardId = null;
  let dropdownEl = null;

  function init() {
    TMApp.State.load();
    dueInput.min = TMApp.Utils.todayISODate();
    render();
    bindBoardEvents();
    bindModalEvents();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
    TMApp.DragDrop.init(boardEl, render);
  }

  function render() {
    TMApp.Render.renderBoard();
  }

  // ---- ドロップダウンメニュー(…メニュー / ⇅メニュー共通) ----
  function closeDropdown() {
    if (dropdownEl) {
      dropdownEl.remove();
      dropdownEl = null;
    }
  }

  function openDropdown(anchorEl, items) {
    closeDropdown();
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dropdown-item';
      btn.textContent = item.label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDropdown();
        item.onClick();
      });
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
    const rect = anchorEl.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    dropdownEl = menu;
  }

  function onDocumentClick(e) {
    if (
      dropdownEl &&
      !dropdownEl.contains(e.target) &&
      !e.target.classList.contains('menu-btn') &&
      !e.target.classList.contains('sort-btn')
    ) {
      closeDropdown();
    }
  }

  function onDocumentKeydown(e) {
    if (e.key === 'Escape') {
      closeDropdown();
      if (!modalEl.classList.contains('hidden')) {
        closeModal();
      }
    }
  }

  // ---- ボード内イベント委譲 ----
  function bindBoardEvents() {
    boardEl.addEventListener('click', onBoardClick);
  }

  function onBoardClick(e) {
    const menuBtn = e.target.closest('.menu-btn');
    if (menuBtn) {
      e.stopPropagation();
      handleMenuBtn(menuBtn);
      return;
    }
    const sortBtn = e.target.closest('.sort-btn');
    if (sortBtn) {
      e.stopPropagation();
      handleSortBtn(sortBtn);
      return;
    }
    const addListBtn = e.target.closest('.add-list-btn');
    if (addListBtn) {
      startAddList(addListBtn);
      return;
    }
    const addCardBtn = e.target.closest('.add-card-btn');
    if (addCardBtn) {
      startAddCard(addCardBtn);
      return;
    }
    const listTitle = e.target.closest('.list-title');
    if (listTitle) {
      startEditListTitle(listTitle);
      return;
    }
    const card = e.target.closest('.card');
    if (card) {
      openModal(card.dataset.cardId);
    }
  }

  function handleMenuBtn(menuBtn) {
    const type = menuBtn.dataset.menuType;
    if (type === 'list') {
      const listId = menuBtn.dataset.listId;
      openDropdown(menuBtn, [
        {
          label: '削除',
          onClick: () => {
            if (window.confirm('このリストを削除しますか?含まれるカードも削除されます。')) {
              TMApp.State.deleteList(listId);
              TMApp.Sort.resetMode(listId);
              render();
            }
          },
        },
      ]);
    } else if (type === 'card') {
      const cardId = menuBtn.dataset.cardId;
      openDropdown(menuBtn, [
        {
          label: '削除',
          onClick: () => {
            TMApp.State.deleteCard(cardId);
            render();
          },
        },
      ]);
    }
  }

  function handleSortBtn(sortBtn) {
    const listId = sortBtn.dataset.listId;
    openDropdown(sortBtn, [
      {
        label: 'デフォルト(手動)',
        onClick: () => {
          TMApp.Sort.resetMode(listId);
          render();
        },
      },
      {
        label: '優先度順',
        onClick: () => {
          TMApp.Sort.setMode(listId, 'priority');
          render();
        },
      },
      {
        label: '期限日順',
        onClick: () => {
          TMApp.Sort.setMode(listId, 'due_date');
          render();
        },
      },
    ]);
  }

  // ---- リスト追加(インライン入力) ----
  function startAddList(btn) {
    const wrap = btn.parentElement;
    wrap.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-input';
    input.maxLength = 30;
    input.placeholder = 'リスト名を入力';
    wrap.appendChild(input);
    input.focus();

    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      const result = TMApp.Validation.validateTitle(input.value);
      if (result.valid) {
        TMApp.State.addList(result.value);
      }
      render();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        committed = true;
        render();
      }
    });
    input.addEventListener('blur', commit);
  }

  // ---- カード追加(インライン入力) ----
  function startAddCard(btn) {
    const wrap = btn.parentElement;
    const listId = wrap.dataset.listId;
    wrap.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-input';
    input.maxLength = 30;
    input.placeholder = 'カードのタイトルを入力';
    wrap.appendChild(input);
    input.focus();

    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      const result = TMApp.Validation.validateTitle(input.value);
      if (result.valid) {
        TMApp.State.addCard(listId, result.value);
      }
      render();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        committed = true;
        render();
      }
    });
    input.addEventListener('blur', commit);
  }

  // ---- リストタイトルのインライン編集 ----
  function startEditListTitle(titleEl) {
    const listId = titleEl.dataset.listId;
    const original = titleEl.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-input';
    input.maxLength = 30;
    input.value = original;
    titleEl.replaceWith(input);
    input.focus();
    input.select();

    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      const result = TMApp.Validation.validateTitle(input.value);
      if (result.valid) {
        TMApp.State.renameList(listId, result.value);
      }
      render();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        committed = true;
        render();
      }
    });
    input.addEventListener('blur', commit);
  }

  // ---- カード詳細モーダル ----
  function bindModalEvents() {
    modalCloseBtn.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });
    descInput.addEventListener('input', () => {
      descCount.textContent = `${descInput.value.length}/1000`;
    });
    deleteBtn.addEventListener('click', () => {
      if (currentCardId) {
        TMApp.State.deleteCard(currentCardId);
        closeModal();
        render();
      }
    });
    saveBtn.addEventListener('click', onSaveCard);
  }

  function openModal(cardId) {
    const card = TMApp.State.getCard(cardId);
    if (!card) return;
    currentCardId = cardId;
    titleInput.value = card.title;
    descInput.value = card.description || '';
    descCount.textContent = `${descInput.value.length}/1000`;
    dueInput.value = card.due_date || '';
    const priorityValue = card.priority || '';
    document.querySelectorAll('input[name="priority"]').forEach((radio) => {
      radio.checked = radio.value === priorityValue;
    });
    clearModalErrors();
    modalEl.classList.remove('hidden');
  }

  function closeModal() {
    modalEl.classList.add('hidden');
    currentCardId = null;
  }

  function clearModalErrors() {
    titleError.textContent = '';
    descError.textContent = '';
    dueError.textContent = '';
  }

  function onSaveCard() {
    if (!currentCardId) return;
    clearModalErrors();
    const titleResult = TMApp.Validation.validateTitle(titleInput.value);
    const descResult = TMApp.Validation.validateDescription(descInput.value);
    const dueResult = TMApp.Validation.validateDueDate(dueInput.value);

    let hasError = false;
    if (!titleResult.valid) {
      titleError.textContent = titleResult.message;
      hasError = true;
    }
    if (!descResult.valid) {
      descError.textContent = descResult.message;
      hasError = true;
    }
    if (!dueResult.valid) {
      dueError.textContent = dueResult.message;
      hasError = true;
    }
    if (hasError) return;

    const priorityRadio = document.querySelector('input[name="priority"]:checked');
    const priority = priorityRadio && priorityRadio.value ? priorityRadio.value : null;

    TMApp.State.updateCard(currentCardId, {
      title: titleResult.value,
      description: descResult.value,
      due_date: dueResult.value,
      priority,
    });
    closeModal();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
