window.TMApp = window.TMApp || {};

TMApp.Validation = (function () {
  function validateTitle(title) {
    const trimmed = (title || '').trim();
    if (trimmed.length === 0) {
      return { valid: false, message: 'タイトルを入力してください' };
    }
    if (trimmed.length > 30) {
      return { valid: false, message: '30文字以内で入力してください' };
    }
    return { valid: true, value: trimmed };
  }

  function validateDescription(desc) {
    const value = desc || '';
    if (value.length > 1000) {
      return { valid: false, message: '1000文字以内で入力してください' };
    }
    return { valid: true, value };
  }

  function validateDueDate(dateStr) {
    if (!dateStr) {
      return { valid: true, value: null };
    }
    const today = TMApp.Utils.todayISODate();
    if (dateStr < today) {
      return { valid: false, message: '過去の日付は設定できません' };
    }
    return { valid: true, value: dateStr };
  }

  return { validateTitle, validateDescription, validateDueDate };
})();
