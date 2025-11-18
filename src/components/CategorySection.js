import React from 'react';
import ToolCard from './ToolCard';

const CategorySection = ({ category, isLoggedIn }) => {
  return (
    <div style={{ marginBottom: '60px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600',
          margin: 0
        }}>
          {category.name}
        </h2>
        <div style={{ 
          width: '1px',
          height: '20px',
          background: '#e5e7eb'
        }} />
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        maxWidth: '100%'
      }}>
        {category.tools?.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;