import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import CategorySection from '../components/CategorySection';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '0 40px' 
    }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 0',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '18px', 
          fontWeight: '700',
          letterSpacing: '0.5px',
          margin: 0
        }}>
          CCFM AI STUDIO
        </h1>
        <button
          onClick={() => window.location.href = '/admin'}
          style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          관리자
        </button>
      </div>

      {/* 공지사항 */}
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '16px 24px',
        borderRadius: '8px',
        marginBottom: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>• NEWS</span>
        <span style={{ color: '#4b5563', fontSize: '14px', flex: 1 }}>
          CCFM AI 스튜디오 입니다. 업데이트는 많이 될 예정이니 기대해주세요.
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            width: '4px',
            height: '4px',
            background: '#6b7280',
            borderRadius: '50%'
          }} />
          <div style={{
            width: '4px',
            height: '4px',
            background: '#d1d5db',
            borderRadius: '50%'
          }} />
          <div style={{
            width: '4px',
            height: '4px',
            background: '#d1d5db',
            borderRadius: '50%'
          }} />
        </div>
      </div>

      {/* 카테고리 목록 */}
      {categories.map(category => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
};

export default Home;