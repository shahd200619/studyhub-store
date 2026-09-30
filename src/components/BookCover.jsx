import { useState, useEffect } from 'react';
import { FiBookOpen } from 'react-icons/fi';

// صورة الغلاف مع بديل شيك لو الصورة مش موجودة أو فشلت
const BookCover = ({ src, alt = '', className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`cover-fallback ${className}`}>
        <FiBookOpen size={28} />
        <span>No cover</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`cover-img ${className}`}
    />
  );
};

export default BookCover;
