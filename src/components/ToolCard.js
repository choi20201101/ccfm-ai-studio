import React, { useState } from 'react';

const ToolCard = ({ tool, isLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} 복사됨!`);
  };

  return (
    <div style={{
      background: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '320px'
    }}>
      {/* 이미지 */}
      {tool.imageUrl && (
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <img 
            src={tool.imageUrl} 
            alt={tool.name}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      {/* 도구 이름 */}
      <h3 style={{ 
        fontSize: '16px', 
        marginBottom: '8px',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        {tool.name || '도구 이름'}
      </h3>

      {/* 설명 */}
      {tool.description && (
        <p style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          marginBottom: '15px',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          {tool.description}
        </p>
      )}

      <div style={{ 
        borderTop: '1px solid #e5e7eb',
        paddingTop: '15px',
        marginBottom: '15px'
      }}>
        {/* 아이디 */}
        {tool.credentials?.username && (
          <div style={{ 
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}>
            <span style={{ fontWeight: '600', minWidth: '30px' }}>ID:</span>
            <span style={{ 
              flex: 1, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {tool.credentials.username}
            </span>
            {isLoggedIn && (
              <button
                onClick={() => copyToClipboard(tool.credentials.username, '아이디')}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                📋
              </button>
            )}
          </div>
        )}

        {/* 비밀번호 */}
        {tool.credentials?.password && (
          <div style={{ 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}>
            <span style={{ fontWeight: '600', minWidth: '30px' }}>PW:</span>
            <span style={{ flex: 1 }}>
              {isLoggedIn && showPassword 
                ? tool.credentials.password 
                : '••••••••'}
            </span>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
                <button
                  onClick={() => copyToClipboard(tool.credentials.password, '비밀번호')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  📋
                </button>
              </>
            )}
          </div>
        )}

        {/* 2차 인증 안내 */}
        {tool.credentials?.twoFactorInfo && (
          <>
            <div style={{ 
              borderTop: '1px solid #e5e7eb',
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.6',
                background: '#fef3c7',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #fbbf24'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#92400e' }}>
                  📱 2차 인증 안내
                </div>
                <div style={{ color: '#78350f', whiteSpace: 'pre-line' }}>
                  {tool.credentials.twoFactorInfo}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* 실행 버튼 */}
      <button
        onClick={() => tool.link && window.open(tool.link, '_blank')}
        style={{
          marginTop: 'auto',
          padding: '10px 24px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f9fafb';
          e.target.style.borderColor = '#9ca3af';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.borderColor = '#d1d5db';
        }}
      >
        바로 실행하기
      </button>
    </div>
  );
};

export default ToolCard;