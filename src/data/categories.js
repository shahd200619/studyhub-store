import { FiCode, FiGlobe, FiCpu, FiDatabase, FiBarChart2, FiHash } from 'react-icons/fi';

// مصدر واحد للأقسام - بتتستخدم في Home و Books و الـ API
export const CATEGORIES = [
  { key: 'programming', name: 'Programming', icon: FiCode, query: 'programming' },
  { key: 'webDevelopment', name: 'Web Dev', icon: FiGlobe, query: 'web+development' },
  { key: 'ai', name: 'AI & ML', icon: FiCpu, query: 'artificial+intelligence+machine+learning' },
  { key: 'database', name: 'Databases', icon: FiDatabase, query: 'database+SQL' },
  { key: 'dataScience', name: 'Data Science', icon: FiBarChart2, query: 'data+science' },
  { key: 'mathematics', name: 'Mathematics', icon: FiHash, query: 'mathematics' },
];
