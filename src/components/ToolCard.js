import React from 'react';

const ToolCard = ({ tool }) => {
  return (
    <div style={{
      background: '#fafafa',
      borderRadius: '12px',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '240px'
    }}>
      {tool.imageUrl && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={tool.imageUrl} 
            alt={tool.name}
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      {!tool.imageUrl && (
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: '#e5e7eb',
          marginBottom: '20px'
        }} />
      )}
      
      <h3 style={{ 
        fontSize: '15px', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        {tool.name || '제목 GPT'}
      </h3>
      
      {tool.description && (
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          marginBottom: '20px',
          textAlign: 'center',
          flex: 1
        }}>
          {tool.description}
        </p>
      )}
      
      <button
        onClick={() => tool.link && window.open(tool.link, '_blank')}
        style={{
          marginTop: 'auto',
          padding: '8px 24px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          fontSize: '13px',
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