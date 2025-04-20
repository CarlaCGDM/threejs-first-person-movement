
export function GraphicsWarning() {

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#e0e0e0',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      userSelect: 'text', // Enable text selection
      WebkitUserSelect: 'text' // For Safari
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '2rem',
        border: '1px solid #2a82da',
        borderRadius: '8px',
        backgroundColor: 'rgba(10,30,50,0.9)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#2a82da',
          userSelect: 'none' // The emoji doesn't need to be selectable
        }}>⚠️</div>
        
        <h1 style={{ 
          color: '#4fc3f7', 
          margin: '0 0 1rem 0',
          fontSize: '1.5rem',
          fontWeight: '500'
        }}>
          Graphics Performance Notice
        </h1>
        
        <div style={{
          lineHeight: '1.6',
          fontSize: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p>Your browser's hardware acceleration appears to be disabled, which may cause performance issues.</p>
        </div>
  
        <div style={{
          textAlign: 'left',
          background: 'rgba(0,40,80,0.3)',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}>
          <p style={{ margin: '0.7rem 0' }}>
            <strong>Microsoft Edge:</strong><br />
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: '#4fc3f7',
              display: 'inline-block',
              marginTop: '4px'
            }}>edge://settings/system</span> → Enable "Use hardware acceleration"
          </p>
          
          <p style={{ margin: '0.7rem 0' }}>
            <strong>Google Chrome:</strong><br />
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: '#4fc3f7',
              display: 'inline-block',
              marginTop: '4px'
            }}>chrome://settings/system</span> → Enable "Use hardware acceleration"
          </p>
          
          <p style={{ margin: '0.7rem 0' }}>
            <strong>Mozilla Firefox:</strong><br />
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: '#4fc3f7',
              display: 'inline-block',
              marginTop: '4px'
            }}>about:config</span> → Search for "layers.acceleration.force-enabled"
          </p>
        </div>
        
        <div style={{ 
          fontSize: '0.85rem',
          color: '#a0a0a0',
          borderTop: '1px solid rgba(100,100,100,0.3)',
          paddingTop: '1rem'
        }}>
          <p style={{ margin: '0.3rem 0' }}>Copy and paste these addresses into your browser's address bar.</p>
          <p style={{ margin: '0.3rem 0' }}>After changing settings, restart your browser.</p>
        </div>
      </div>
    </div>
  );
}