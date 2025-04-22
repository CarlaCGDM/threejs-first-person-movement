// ProfilerOverlay.js
import { useState } from 'react';

export function ProfilerOverlay({ stats }) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    render: true,
    memory: true,
    programs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatValue = (value) => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  // Return early if no stats available yet
  if (!stats) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        Loading performance stats...
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        cursor: 'pointer'
      }} onClick={() => setIsOpen(!isOpen)}>
        <h3 style={{ margin: 0 }}>Three.js Profiler</h3>
        <span>{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div>
          {/* Render Stats */}
          <div style={{ marginBottom: '8px' }}>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => toggleSection('render')}
            >
              <strong>Render Stats</strong>
              <span>{expandedSections.render ? '▼' : '▶'}</span>
            </div>
            {expandedSections.render && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(stats.render || {}).map(([key, value]) => (
                    <tr key={`render-${key}`}>
                      <td style={{ padding: '4px', borderBottom: '1px solid #444' }}>{key}</td>
                      <td style={{ padding: '4px', borderBottom: '1px solid #444', textAlign: 'right' }}>
                        {formatValue(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Memory Stats */}
          <div style={{ marginBottom: '8px' }}>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => toggleSection('memory')}
            >
              <strong>Memory Stats</strong>
              <span>{expandedSections.memory ? '▼' : '▶'}</span>
            </div>
            {expandedSections.memory && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(stats.memory || {}).map(([key, value]) => (
                    <tr key={`memory-${key}`}>
                      <td style={{ padding: '4px', borderBottom: '1px solid #444' }}>{key}</td>
                      <td style={{ padding: '4px', borderBottom: '1px solid #444', textAlign: 'right' }}>
                        {formatValue(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Programs Stats */}
          {stats.programs && (
            <div style={{ marginBottom: '8px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '4px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => toggleSection('programs')}
              >
                <strong>Shader Programs ({stats.programs.length})</strong>
                <span>{expandedSections.programs ? '▼' : '▶'}</span>
              </div>
              {expandedSections.programs && (
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '4px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '4px', textAlign: 'left' }}>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.programs || []).map((program, index) => (
                        <tr key={`program-${index}`}>
                          <td style={{ padding: '4px', borderBottom: '1px solid #444' }}>{index}</td>
                          <td style={{ padding: '4px', borderBottom: '1px solid #444' }}>
                            {program?.name || 'Unnamed'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}