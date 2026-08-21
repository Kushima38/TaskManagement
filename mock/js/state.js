window.TMApp = window.TMApp || {};

TMApp.State = (function () {
  const STORAGE_KEY = 'tm-mock:board';
  let data = null;

  function nowISO() {
    return new Date().toISOString();
  }

  function seedDefault() {
    const ts = nowISO();
    const today = TMApp.Utils.todayISODate();
    const listDefs = [
      {
        title: '未着手',
        cards: [
          { title: '要件定義書のレビュー確認', priority: '低', due_date: null },
          { title: '技術スタックの比較検討', priority: '中', due_date: null },
          { title: 'README構成の下書き', priority: null, due_date: null },
        ],
      },
      {
        title: '進行中',
        cards: [
          { title: 'モックのHTML/CSS/JS実装', priority: '高', due_date: TMApp.Utils.addDays(today, 4) },
          { title: 'ドラッグ&ドロップの動作確認', priority: '中', due_date: null },
          { title: 'レビュー対応', priority: null, due_date: TMApp.Utils.addDays(today, -3) },
        ],
      },
      {
        title: '完了',
        cards: [
          { title: '要件定義書の作成', priority: null, due_date: null },
          { title: '画面ワイヤーフレームの作成', priority: null, due_date: null },
        ],
      },
    ];

    const lists = [];
    const cards = [];
    listDefs.forEach((listDef, listIndex) => {
      const list = {
        id: TMApp.Utils.newId(),
        title: listDef.title,
        order: listIndex,
        created_at: ts,
        updated_at: ts,
      };
      lists.push(list);
      listDef.cards.forEach((cardDef, cardIndex) => {
        cards.push({
          id: TMApp.Utils.newId(),
          list_id: list.id,
          title: cardDef.title,
          description: '',
          due_date: cardDef.due_date,
          priority: cardDef.priority,
          order: cardIndex,
          created_at: ts,
          updated_at: ts,
        });
      });
    });

    return { schemaVersion: 1, lists, cards };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.lists) && Array.isArray(parsed.cards)) {
          data = parsed;
          return;
        }
      }
    } catch (e) {
      // 破損データは無視してデフォルトをシードする
    }
    data = seedDefault();
    save();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function get() {
    return data;
  }

  function getLists() {
    return data.lists.slice().sort((a, b) => a.order - b.order);
  }

  function getCardsByList(listId) {
    return data.cards
      .filter((c) => c.list_id === listId)
      .sort((a, b) => a.order - b.order);
  }

  function reindexLists() {
    getLists().forEach((l, i) => {
      l.order = i;
    });
  }

  function reindexCardsInList(listId) {
    getCardsByList(listId).forEach((c, i) => {
      c.order = i;
    });
  }

  function addList(title) {
    const ts = nowISO();
    const maxOrder = data.lists.reduce((m, l) => Math.max(m, l.order), -1);
    const list = {
      id: TMApp.Utils.newId(),
      title,
      order: maxOrder + 1,
      created_at: ts,
      updated_at: ts,
    };
    data.lists.push(list);
    save();
    return list;
  }

  function renameList(listId, title) {
    const list = data.lists.find((l) => l.id === listId);
    if (!list) return;
    list.title = title;
    list.updated_at = nowISO();
    save();
  }

  function deleteList(listId) {
    data.lists = data.lists.filter((l) => l.id !== listId);
    data.cards = data.cards.filter((c) => c.list_id !== listId);
    reindexLists();
    save();
  }

  function moveList(listId, targetIndex) {
    const list = data.lists.find((l) => l.id === listId);
    if (!list) return;
    const others = getLists().filter((l) => l.id !== listId);
    let idx = targetIndex;
    if (idx < 0) idx = 0;
    if (idx > others.length) idx = others.length;
    others.splice(idx, 0, list);
    others.forEach((l, i) => {
      l.order = i;
    });
    save();
  }

  function addCard(listId, title) {
    const ts = nowISO();
    const existing = getCardsByList(listId);
    const maxOrder = existing.reduce((m, c) => Math.max(m, c.order), -1);
    const card = {
      id: TMApp.Utils.newId(),
      list_id: listId,
      title,
      description: '',
      due_date: null,
      priority: null,
      order: maxOrder + 1,
      created_at: ts,
      updated_at: ts,
    };
    data.cards.push(card);
    save();
    return card;
  }

  function getCard(cardId) {
    return data.cards.find((c) => c.id === cardId) || null;
  }

  function updateCard(cardId, fields) {
    const card = getCard(cardId);
    if (!card) return;
    Object.assign(card, fields, { updated_at: nowISO() });
    save();
  }

  function deleteCard(cardId) {
    const card = getCard(cardId);
    if (!card) return;
    data.cards = data.cards.filter((c) => c.id !== cardId);
    reindexCardsInList(card.list_id);
    save();
  }

  function moveCard(cardId, targetListId, targetIndex) {
    const card = getCard(cardId);
    if (!card) return;
    const sourceListId = card.list_id;
    card.list_id = targetListId;
    card.updated_at = nowISO();

    const targetCards = getCardsByList(targetListId).filter((c) => c.id !== cardId);
    let idx = targetIndex;
    if (idx < 0) idx = 0;
    if (idx > targetCards.length) idx = targetCards.length;
    targetCards.splice(idx, 0, card);
    targetCards.forEach((c, i) => {
      c.order = i;
    });

    if (sourceListId !== targetListId) {
      reindexCardsInList(sourceListId);
    }
    save();
  }

  function commitOrder(listId, orderedCardIds) {
    orderedCardIds.forEach((cardId, i) => {
      const card = getCard(cardId);
      if (card) card.order = i;
    });
    save();
  }

  return {
    load,
    save,
    get,
    getLists,
    getCardsByList,
    addList,
    renameList,
    deleteList,
    moveList,
    addCard,
    getCard,
    updateCard,
    deleteCard,
    moveCard,
    commitOrder,
  };
})();
