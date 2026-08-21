window.TMApp = window.TMApp || {};

TMApp.Sort = (function () {
  const modeByList = {};
  const PRIORITY_RANK = { 高: 0, 中: 1, 低: 2 };

  function getMode(listId) {
    return modeByList[listId] || 'manual';
  }

  function setMode(listId, mode) {
    modeByList[listId] = mode;
  }

  function resetMode(listId) {
    delete modeByList[listId];
  }

  function priorityRank(p) {
    return p in PRIORITY_RANK ? PRIORITY_RANK[p] : 3;
  }

  function compareByDueDate(a, b) {
    const aDate = a.due_date;
    const bDate = b.due_date;
    if (aDate === bDate) return 0;
    if (aDate === null || aDate === undefined) return 1;
    if (bDate === null || bDate === undefined) return -1;
    return aDate < bDate ? -1 : 1;
  }

  function compareByPriority(a, b) {
    const rankDiff = priorityRank(a.priority) - priorityRank(b.priority);
    if (rankDiff !== 0) return rankDiff;
    return compareByDueDate(a, b);
  }

  function sortForDisplay(cards, listId) {
    const mode = getMode(listId);
    const ordered = cards.slice();
    if (mode === 'priority') {
      ordered.sort(compareByPriority);
    } else if (mode === 'due_date') {
      ordered.sort(compareByDueDate);
    }
    return ordered;
  }

  return { getMode, setMode, resetMode, sortForDisplay };
})();
