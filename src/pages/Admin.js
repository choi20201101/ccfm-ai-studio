import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  orderBy,
  query 
} from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, googleProvider, storage } from '../firebase/config';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showToolForm, setShowToolForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [categoryName, setCategoryName] = useState('');
  const [toolForm, setToolForm] = useState({
    name: '',
    description: '',
    link: '',
    imageFile: null
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('로그아웃 실패: ' + error.message);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert('카테고리 이름을 입력하세요');
      return;
    }

    try {
      await addDoc(collection(db, 'categories'), {
        name: categoryName,
        order: categories.length,
        tools: [],
        createdAt: new Date()
      });
      setCategoryName('');
      setShowCategoryForm(false);
      alert('카테고리 추가 완료!');
    } catch (error) {
      alert('추가 실패: ' + error.message);
    }
  };

  const handleAddTool = async () => {
    if (!toolForm.name || !toolForm.link) {
      alert('이름과 링크는 필수입니다');
      return;
    }

    try {
      let imageUrl = '';
      
      if (toolForm.imageFile) {
        const imageRef = ref(storage, `tools/${Date.now()}_${toolForm.imageFile.name}`);
        await uploadBytes(imageRef, toolForm.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const category = categories.find(c => c.id === selectedCategory);
      const newTool = {
        id: Date.now().toString(),
        name: toolForm.name,
        description: toolForm.description,
        link: toolForm.link,
        imageUrl: imageUrl
      };

      await updateDoc(doc(db, 'categories', selectedCategory), {
        tools: [...(category.tools || []), newTool]
      });

      setToolForm({ name: '', description: '', link: '', imageFile: null });
      setShowToolForm(false);
      alert('도구 추가 완료!');
    } catch (error) {
      alert('추가 실패: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      alert('삭제 완료!');
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    }
  };

  const handleDeleteTool = async (categoryId, toolId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const category = categories.find(c => c.id === categoryId);
      const updatedTools = category.tools.filter(t => t.id !== toolId);
      
      await updateDoc(doc(db, 'categories', categoryId), {
        tools: updatedTools
      });
      alert('삭제 완료!');
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <h1 style={{ marginBottom: '30px' }}>CCFM AI STUDIO 관리자</h1>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Google로 로그인
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
            CCFM AI STUDIO 관리자
          </h1>
          <p style={{ color: '#6b7280' }}>{user.email}</p>
        </div>
        <div>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            사이트 보기
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowCategoryForm(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
        + 새 카테고리 추가
      </button>

      {showCategoryForm && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>새 카테고리</h3>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="카테고리 이름 (예: AI 에이전트)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '10px'
            }}
          />
          <div>
            <button
              onClick={handleAddCategory}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              추가
            </button>
            <button
              onClick={() => setShowCategoryForm(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {categories.map(category => (
        <div key={category.id} style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '20px' }}>{category.name}</h2>
            <div>
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowToolForm(true);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '14px'
                }}
              >
                + 도구 추가
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                카테고리 삭제
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {category.tools?.map(tool => (
              <div key={tool.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '15px'
              }}>
                {tool.imageUrl && (
                  <img 
                    src={tool.imageUrl} 
                    alt={tool.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '10px'
                    }}
                  />
                )}
                <h4 style={{ marginBottom: '5px' }}>{tool.name}</h4>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  marginBottom: '10px'
                }}>
                  {tool.description || '설명 없음'}
                </p>
                <button
                  onClick={() => handleDeleteTool(category.id, tool.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          {showToolForm && selectedCategory === category.id && (
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>새 도구 추가</h3>
              
              <input
                type="text"
                value={toolForm.name}
                onChange={(e) => setToolForm({...toolForm, name: e.target.value})}
                placeholder="도구 이름 (예: ChatGPT)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              />

              <textarea
                value={toolForm.description}
                onChange={(e) => setToolForm({...toolForm, description: e.target.value})}
                placeholder="설명 (선택)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  minHeight: '80px'
                }}
              />

              <input
                type="text"
                value={toolForm.link}
                onChange={(e) => setToolForm({...toolForm, link: e.target.value})}
                placeholder="링크 (예: https://chat.openai.com)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setToolForm({...toolForm, imageFile: e.target.files[0]})}
                style={{
                  marginBottom: '15px'
                }}
              />

              <div>
                <button
                  onClick={handleAddTool}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setShowToolForm(false);
                    setToolForm({ name: '', description: '', link: '', imageFile: null });
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Admin;