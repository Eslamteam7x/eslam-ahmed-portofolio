import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Blog.css';

const initialPosts = [
  {
    id: 1,
    title: { en: 'Getting Started with ESP32 Development', ar: 'بدء تطوير ESP32' },
    excerpt: { en: 'A comprehensive guide to setting up your ESP32 development environment...', ar: 'دليل شامل لإعداد بيئة تطوير ESP32...' },
    date: '2024-12-15',
    category: 'embedded',
    image: 'https://placehold.co/800x400/1a1a2e/00f0ff?text=ESP32',
    author: 'Eslam Ahmed',
  },
  {
    id: 2,
    title: { en: 'PLC Programming Best Practices', ar: 'أفضل ممارسات برمجة PLC' },
    excerpt: { en: 'Learn the essential best practices for professional PLC programming...', ar: 'تعلم أفضل الممارسات الأساسية لبرمجة PLC احترافية...' },
    date: '2024-11-20',
    category: 'automation',
    image: 'https://placehold.co/800x400/1a1a2e/ff00ff?text=PLC',
    author: 'Eslam Ahmed',
  },
  {
    id: 3,
    title: { en: 'Introduction to BACnet Protocol', ar: 'مقدمة في بروتوكول BACnet' },
    excerpt: { en: 'Understanding BACnet protocol for building automation and control systems...', ar: 'فهم بروتوكول BACnet لأنظمة أتمتة المباني والتحكم...' },
    date: '2024-10-05',
    category: 'bms',
    image: 'https://placehold.co/800x400/1a1a2e/ff6600?text=BACnet',
    author: 'Eslam Ahmed',
  },
];

export default function Blog() {
  const { language } = useApp();
  const [posts] = useState(initialPosts);

  return (
    <section id="blog" className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{language === 'en' ? 'Blog' : 'المدونة'}</h2>
          <p className="section-subtitle">
            {language === 'en' ? 'Latest articles and tutorials' : 'أحدث المقالات والدروس'}
          </p>
        </div>

        <div className="blog-grid">
          {posts.map(post => (
            <article key={post.id} className="blog-card glass-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title[language]} loading="lazy" />
              </div>
              <div className="blog-body">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-category">{post.category}</span>
                </div>
                <h3 className="blog-title">{post.title[language]}</h3>
                <p className="blog-excerpt">{post.excerpt[language]}</p>
                <div className="blog-author">
                  <span>{language === 'en' ? 'By' : 'بواسطة'} {post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
