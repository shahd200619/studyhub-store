import { CATEGORIES } from '../data/categories';

const BASE_URL = 'https://openlibrary.org/search.json';
const FIELDS = 'key,title,author_name,cover_i,first_publish_year';

// نخزّن الـ promise نفسه عشان نفس القسم ما يتحملش مرتين
const cache = {};

const priceFor = (n) => Number((15 + (n % 35) + 0.99).toFixed(2));
const ratingFor = (n) => Number(Math.min(5, 3.8 + (n % 12) * 0.1).toFixed(1));

export const fetchBooksByCategory = (categoryKey) => {
  const category = CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return Promise.resolve([]);
  if (cache[categoryKey]) return cache[categoryKey];

  cache[categoryKey] = fetch(`${BASE_URL}?q=${category.query}&limit=100&fields=${FIELDS}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load books');
      return res.json();
    })
    .then((data) =>
      data.docs.map((book, index) => ({
        id: `${categoryKey}-${index + 1}`,
        title: book.title,
        author: book.author_name?.[0] ?? 'Unknown Author',
        category: category.name,
        categoryKey,
        year: book.first_publish_year ?? null,
        coverId: book.cover_i ?? null,
        image: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        largeImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
        price: priceFor(index + 1),
        rating: ratingFor(index + 1),
        key: book.key,
      }))
    )
    .catch((err) => {
      delete cache[categoryKey]; // لو فشل نسمح بإعادة المحاولة
      throw err;
    });

  return cache[categoryKey];
};

// الـ id شكله "ai-12" فنعرف القسم منه ونجيب الكتاب (يشتغل حتى بعد عمل Refresh)
export const fetchBookById = async (id) => {
  const categoryKey = id.split('-')[0];
  const books = await fetchBooksByCategory(categoryKey);
  return books.find((b) => b.id === id) ?? null;
};
