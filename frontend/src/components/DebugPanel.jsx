import { useState } from 'react';
import { Bug, ChevronDown, ChevronUp, RefreshCw, Copy, Check } from 'lucide-react';
import { useConvert } from '../context/ConvertContext';
import './DebugPanel.css';

function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { visitorId, sdkStatus, features, experiences, resetVisitor } = useConvert();

  const handleReset = async () => {
    await resetVisitor();
    window.location.reload();
  };

  const handleCopyVisitorId = () => {
    navigator.clipboard.writeText(visitorId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`debug-panel ${isOpen ? 'open' : ''}`}>
      <button 
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle debug panel"
      >
        <Bug size={18} />
        <span>Convert Debug</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {isOpen && (
        <div className="debug-content">
          <div className="debug-section">
            <h4>SDK Status</h4>
            <div className="debug-row">
              <span>Mode</span>
              <span className={`status-badge ${sdkStatus?.mode}`}>
                {sdkStatus?.mode || 'unknown'}
              </span>
            </div>
            <div className="debug-row">
              <span>Ready</span>
              <span className={`status-badge ${sdkStatus?.isReady ? 'ready' : 'not-ready'}`}>
                {sdkStatus?.isReady ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="debug-section">
            <h4>Visitor</h4>
            <div className="debug-row visitor-row">
              <code className="visitor-id">{visitorId?.slice(0, 20)}...</code>
              <button 
                className="copy-btn"
                onClick={handleCopyVisitorId}
                title="Copy full ID"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button className="reset-btn" onClick={handleReset}>
              <RefreshCw size={14} />
              Reset Visitor (New Bucketing)
            </button>
          </div>

          <div className="debug-section">
            <h4>Active Features</h4>
            {Object.entries(features).length === 0 ? (
              <p className="debug-empty">No features loaded yet</p>
            ) : (
              Object.entries(features).map(([location, featureList]) => (
                <div key={location} className="debug-location">
                  <span className="location-label">{location}</span>
                  {featureList.map(f => (
                    <div key={f.key} className="feature-item">
                      <span className="feature-key">{f.key}</span>
                      <span className={`feature-status ${f.status}`}>{f.status}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="debug-section">
            <h4>Active Experiences</h4>
            {Object.entries(experiences).length === 0 ? (
              <p className="debug-empty">No experiences loaded yet</p>
            ) : (
              Object.entries(experiences).map(([location, expList]) => (
                <div key={location} className="debug-location">
                  <span className="location-label">{location}</span>
                  {expList.map(e => (
                    <div key={e.experienceKey} className="experience-item">
                      <span className="exp-key">{e.experienceKey}</span>
                      <span className="var-key">{e.variationKey}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="debug-footer">
            <p>
              💡 Reset visitor to see different variations based on bucketing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
