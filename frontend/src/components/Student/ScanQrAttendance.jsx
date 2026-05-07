import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCamera, FiSmartphone } from 'react-icons/fi';

const ScanQrAttendance = function() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(function() {
    const timer = setInterval(function() {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return function() { clearInterval(timer); };
  }, []);

  return (
    <div className="fade">
      <div className="ph">
        <div>
          <h1><FiCamera style={{ marginRight: 10, color: 'var(--m500)' }} /> QR Attendance</h1>
          <p>Web QR scanning has moved to the mobile app</p>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: 28,
          background: 'linear-gradient(135deg, rgba(37,99,235,.08), rgba(8,145,178,.08))',
          borderBottom: '1px solid var(--g200)'
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--m500), var(--info))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 16px 32px rgba(37,99,235,.25)'
          }}>
            <FiSmartphone size={32} />
          </div>
          <h2 style={{ margin: 0, fontSize: 24, color: 'var(--g900)' }}>Use the React Native scanner</h2>
          <p style={{ marginTop: 8, color: 'var(--g600)', maxWidth: 720 }}>
            The browser QR scanner has been removed so attendance is handled from the mobile app only.
            Students scan the teacher's rotating QR code from the app and attendance is sent directly to the backend.
          </p>
        </div>

        <div style={{ padding: 28, display: 'grid', gap: 16 }}>
          <div className="cam-off" style={{ margin: 0, background: 'var(--w)' }}>
            <div className="cam-off-ic"><FiAlertTriangle size={38} /></div>
            <h3>QR Scanner disabled on web</h3>
            <p>Open the new mobile app to scan the QR code and mark attendance.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div className="sel-info">
              <div className="sel-row"><span>Current time</span><strong>{time}</strong></div>
              <div className="sel-row"><span>Status</span><strong>Mobile only</strong></div>
              <div className="sel-row"><span>Platform</span><strong>React Native</strong></div>
            </div>
            <div className="sel-info">
              <div className="sel-row"><span>Flow</span><strong>Login → Scan QR → Present</strong></div>
              <div className="sel-row"><span>Backend</span><strong>/attendance/qr/scan</strong></div>
              <div className="sel-row"><span>Payload</span><strong>QR token/code</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQrAttendance;
