window.TMApp = window.TMApp || {};

TMApp.Utils = (function () {
  function newId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function todayISODate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function isOverdue(card) {
    return !!card.due_date && card.due_date < todayISODate();
  }

  function addDays(dateStr, days) {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    return `${m}/${d}`;
  }

  return { newId, todayISODate, isOverdue, formatDateForDisplay, addDays };
})();
