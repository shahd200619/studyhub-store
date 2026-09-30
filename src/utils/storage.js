// قراءة آمنة من localStorage (لو الداتا بايظة بيرجّع القيمة الافتراضية)
export const loadFromStorage = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* التخزين ممتلئ أو ممنوع - نتجاهل */
  }
};
