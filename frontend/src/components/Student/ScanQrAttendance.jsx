import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCamera, FiSmartphone, FiCheckCircle, FiInfo, FiArrowRight } from 'react-icons/fi';
import { attendanceAPI } from '../../services/api';

const ScanQrAttendance = function () {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(function () {
    const timer = setInterval(function () {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return function () { clearInterval(timer); };
  }, []);

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!code || code.length < 4) return;

    setBusy(true);
    setMsg(null);
    try {
      const res = await attendanceAPI.scanQr({ code: code.toUpperCase() });
      setMsg({
        type: 'success',
        text: `Attendance marked for ${res.data.class_name}!`,
        details: `Time: ${new Date(res.data.scanned_at).toLocaleTimeString()}`
      });
      setCode('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Invalid or expired code' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{`
        .qr-page{
          position:relative;
          animation:qrFadeIn .65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .qr-page::before{
          content:"";
          position:fixed;
          inset:0;
          pointer-events:none;
          background:
            radial-gradient(circle at 10% 15%, rgba(37,99,235,.05), transparent 18%),
            radial-gradient(circle at 88% 18%, rgba(6,182,212,.05), transparent 18%),
            radial-gradient(circle at 50% 100%, rgba(124,58,237,.04), transparent 26%);
          z-index:0;
        }

        .qr-head{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
          margin-bottom:24px;
          padding:22px 24px;
          border-radius:24px;
          border:1px solid rgba(226,232,240,.92);
          background:
            linear-gradient(180deg, rgba(255,255,255,.92), rgba(248,250,252,.86));
          backdrop-filter:blur(12px);
          box-shadow:
            0 18px 40px rgba(15,23,42,.07),
            inset 0 1px 0 rgba(255,255,255,.75);
          overflow:hidden;
        }

        .qr-head::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 22%),
            linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,0));
          pointer-events:none;
        }

        .qr-head-title{
          position:relative;
          z-index:1;
        }

        .qr-head-title h1{
          margin:0 0 6px;
          font-size:30px;
          font-weight:800;
          letter-spacing:-.04em;
          color:#0F172A;
          display:flex;
          align-items:center;
          gap:12px;
        }

        .qr-head-title p{
          margin:0;
          font-size:14px;
          color:#64748B;
          font-weight:500;
        }

        .qr-head-icon{
          width:42px;
          height:42px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg, #2563EB, #06B6D4);
          box-shadow:0 12px 24px rgba(37,99,235,.22);
          animation:qrFloat 4s ease-in-out infinite;
          flex-shrink:0;
        }

        .qr-time-pill{
          position:relative;
          z-index:1;
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(255,255,255,.88);
          border:1px solid rgba(226,232,240,.92);
          box-shadow:
            0 10px 22px rgba(15,23,42,.05),
            inset 0 1px 0 rgba(255,255,255,.8);
          color:#334155;
          font-size:13px;
          font-weight:800;
          letter-spacing:.02em;
        }

        .qr-time-dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:#22c55e;
          box-shadow:0 0 0 6px rgba(34,197,94,.12);
          animation:qrPulse 1.8s ease-in-out infinite;
        }

        .qr-card-split{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns:1.15fr .85fr;
          gap:24px;
          align-items:stretch;
        }

        .qr-hero-card{
          position:relative;
          overflow:hidden;
          border-radius:28px;
          padding:34px;
          color:white;
          background:
            radial-gradient(circle at 78% 16%, rgba(96,165,250,.16), transparent 20%),
            radial-gradient(circle at 18% 82%, rgba(34,211,238,.10), transparent 18%),
            linear-gradient(135deg, #0B1220 0%, #0F172A 28%, #172554 72%, #1D4ED8 100%);
          box-shadow:
            0 24px 60px rgba(15,23,42,.26),
            inset 0 1px 0 rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.08);
          isolation:isolate;
          animation:qrRise .65s ease both;
        }

        .qr-hero-card::before{
          content:"";
          position:absolute;
          top:-24%;
          right:-10%;
          width:320px;
          height:320px;
          background:radial-gradient(circle, rgba(37,99,235,.25), transparent 70%);
          pointer-events:none;
          animation:qrOrbA 9s ease-in-out infinite;
        }

        .qr-hero-card::after{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,.02) 0px,
              rgba(255,255,255,.02) 1px,
              transparent 1px,
              transparent 40px
            );
          pointer-events:none;
          z-index:0;
        }

        .qr-hero-content{
          position:relative;
          z-index:1;
        }

        .qr-label-row{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:12px;
          animation:qrFadeUp .5s ease both .08s;
        }

        .qr-label-badge{
          width:38px;
          height:38px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(59,130,246,.18);
          border:1px solid rgba(147,197,253,.18);
          box-shadow:0 10px 24px rgba(37,99,235,.14);
          flex-shrink:0;
        }

        .qr-label-text{
          font-size:12px;
          font-weight:800;
          color:#93C5FD;
          text-transform:uppercase;
          letter-spacing:.14em;
        }

        .qr-hero-card h2{
          margin:0 0 12px;
          font-size:30px;
          font-weight:800;
          letter-spacing:-.04em;
          animation:qrFadeUp .55s ease both .14s;
        }

        .qr-hero-card p.qr-hero-copy{
          margin:0;
          color:rgba(255,255,255,.72);
          font-size:14px;
          line-height:1.65;
          max-width:620px;
          animation:qrFadeUp .6s ease both .2s;
        }

        .qr-form{
          margin-top:26px;
          animation:qrFadeUp .65s ease both .24s;
        }

        .qr-input-group{
          position:relative;
          margin-top:0;
        }

        .qr-input-shell{
          position:relative;
        }

        .qr-input{
          width:100%;
          height:68px;
          background:rgba(255,255,255,.06);
          border:2px solid rgba(255,255,255,.12);
          border-radius:18px;
          padding:0 22px;
          font-size:26px;
          font-weight:800;
          color:white;
          letter-spacing:4px;
          text-transform:uppercase;
          transition:
            all 0.3s ease;
          outline:none;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.06),
            0 10px 24px rgba(2,6,23,.12);
        }

        .qr-input:hover{
          border-color:rgba(147,197,253,.28);
          background:rgba(255,255,255,.08);
        }

        .qr-input:focus{
          border-color:#60A5FA;
          background:rgba(255,255,255,.10);
          box-shadow:
            0 0 0 4px rgba(59,130,246,.18),
            0 16px 34px rgba(37,99,235,.18);
          transform:translateY(-2px);
        }

        .qr-input::placeholder{
          letter-spacing:1px;
          font-size:15px;
          font-weight:600;
          color:rgba(255,255,255,.34);
        }

        .qr-input-hint{
          margin-top:10px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }

        .qr-hint-text{
          font-size:12px;
          color:rgba(255,255,255,.54);
          font-weight:600;
        }

        .qr-code-preview{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.08);
          color:#E2E8F0;
          font-size:12px;
          font-weight:800;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .qr-submit{
          margin-top:18px;
          width:100%;
          height:58px;
          border-radius:18px;
          background:linear-gradient(135deg, #2563EB, #3B82F6, #06B6D4);
          color:white;
          font-weight:800;
          font-size:15px;
          border:none;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            filter .3s ease,
            background-position .35s ease;
          box-shadow:
            0 16px 34px rgba(37,99,235,.28),
            inset 0 1px 0 rgba(255,255,255,.16);
          position:relative;
          overflow:hidden;
          background-size:180% 180%;
        }

        .qr-submit::before{
          content:"";
          position:absolute;
          inset:1px;
          border-radius:17px;
          background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0));
          pointer-events:none;
        }

        .qr-submit::after{
          content:"";
          position:absolute;
          top:0;
          left:-30%;
          width:26%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.30), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .qr-submit:hover:not(:disabled){
          transform:translateY(-2px);
          box-shadow:
            0 22px 40px rgba(37,99,235,.34),
            inset 0 1px 0 rgba(255,255,255,.18);
          filter:brightness(1.06);
          background-position:100% 50%;
        }

        .qr-submit:hover:not(:disabled)::after{
          opacity:1;
          animation:qrShine .8s ease;
        }

        .qr-submit:active:not(:disabled){
          transform:translateY(0);
        }

        .qr-submit:disabled{
          opacity:.72;
          cursor:not-allowed;
          animation:qrBusy 1.15s ease-in-out infinite;
        }

        .qr-submit svg{
          transition:transform .25s ease;
        }

        .qr-submit:hover:not(:disabled) svg{
          transform:translateX(2px);
        }

        .qr-msg{
          margin-top:20px;
          padding:16px 16px;
          border-radius:18px;
          display:flex;
          gap:12px;
          align-items:flex-start;
          animation:qrSlideIn .4s ease;
          box-shadow:0 12px 26px rgba(2,6,23,.08);
          backdrop-filter:blur(8px);
        }

        .qr-msg-success{
          background:rgba(34,197,94,.12);
          border:1px solid rgba(34,197,94,.18);
          color:#DCFCE7;
        }

        .qr-msg-error{
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.18);
          color:#FECACA;
        }

        .qr-msg-icon{
          margin-top:2px;
          flex-shrink:0;
        }

        .qr-msg-title{
          font-weight:800;
          font-size:14px;
          line-height:1.4;
        }

        .qr-msg-sub{
          font-size:12px;
          opacity:.88;
          margin-top:3px;
        }

        .app-promo-card{
          position:relative;
          overflow:hidden;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.92));
          border-radius:28px;
          padding:32px;
          border:1px solid rgba(226,232,240,.95);
          box-shadow:
            0 18px 40px rgba(15,23,42,.07),
            inset 0 1px 0 rgba(255,255,255,.78);
          height:100%;
          display:flex;
          flex-direction:column;
          animation:qrRise .7s ease both .08s;
        }

        .app-promo-card::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 22%),
            linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,0));
          pointer-events:none;
        }

        .app-icon-stack{
          width:72px;
          height:72px;
          background:linear-gradient(135deg, #EFF6FF, #DBEAFE);
          color:#2563EB;
          border-radius:22px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:22px;
          box-shadow:
            0 14px 28px rgba(37,99,235,.12),
            inset 0 1px 0 rgba(255,255,255,.78);
          animation:qrFloat 4.2s ease-in-out infinite;
          position:relative;
          z-index:1;
        }

        .app-promo-card h3{
          position:relative;
          z-index:1;
          font-size:24px;
          font-weight:800;
          color:#0F172A;
          margin:0 0 12px;
          letter-spacing:-.03em;
        }

        .app-promo-card p.qr-promo-copy{
          position:relative;
          z-index:1;
          color:#64748B;
          font-size:14px;
          line-height:1.7;
          flex:1;
          margin:0;
        }

        .qr-feature-box{
          position:relative;
          z-index:1;
          margin-top:24px;
          padding:18px;
          background:linear-gradient(180deg, #F8FAFC, #FFFFFF);
          border-radius:18px;
          border:1px dashed #CBD5E1;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.75);
        }

        .qr-feature-head{
          display:flex;
          justify-content:space-between;
          margin-bottom:12px;
        }

        .qr-feature-label{
          font-size:12px;
          font-weight:800;
          color:#94A3B8;
          text-transform:uppercase;
          letter-spacing:.08em;
        }

        .qr-feature-list{
          display:grid;
          gap:10px;
        }

        .qr-feature-item{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:13px;
          color:#475569;
          font-weight:600;
          padding:10px 12px;
          border-radius:14px;
          background:rgba(255,255,255,.72);
          border:1px solid rgba(226,232,240,.8);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .qr-feature-item:hover{
          transform:translateX(4px);
          border-color:#BFDBFE;
          box-shadow:0 10px 20px rgba(37,99,235,.06);
        }

        .qr-feature-item svg{
          flex-shrink:0;
        }

        .qr-mini-note{
          position:relative;
          z-index:1;
          margin-top:18px;
          display:flex;
          align-items:flex-start;
          gap:10px;
          padding:14px 14px;
          border-radius:16px;
          background:rgba(37,99,235,.05);
          border:1px solid rgba(37,99,235,.08);
          color:#334155;
        }

        .qr-mini-note strong{
          display:block;
          font-size:13px;
          font-weight:800;
          color:#0F172A;
        }

        .qr-mini-note span{
          display:block;
          font-size:12px;
          color:#64748B;
          margin-top:2px;
          line-height:1.5;
        }

        @keyframes qrFadeIn{
          from{opacity:0; transform:translateY(10px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes qrRise{
          from{opacity:0; transform:translateY(16px) scale(.985)}
          to{opacity:1; transform:translateY(0) scale(1)}
        }

        @keyframes qrFadeUp{
          from{opacity:0; transform:translateY(12px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes qrSlideIn{
          from{opacity:0; transform:translateX(-10px)}
          to{opacity:1; transform:translateX(0)}
        }

        @keyframes qrPulse{
          0%,100%{transform:scale(1); opacity:1}
          50%{transform:scale(1.12); opacity:.74}
        }

        @keyframes qrFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-5px)}
        }

        @keyframes qrOrbA{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(-12px,16px)}
        }

        @keyframes qrBusy{
          0%,100%{
            box-shadow:
              0 16px 34px rgba(37,99,235,.20),
              inset 0 1px 0 rgba(255,255,255,.16);
          }
          50%{
            box-shadow:
              0 22px 40px rgba(37,99,235,.30),
              inset 0 1px 0 rgba(255,255,255,.16);
          }
        }

        @keyframes qrShine{
          0%{left:-30%}
          100%{left:130%}
        }

        @media (max-width: 900px){
          .qr-card-split{
            grid-template-columns:1fr;
          }

          .qr-head{
            padding:20px 18px;
          }

          .qr-head-title h1{
            font-size:26px;
          }

          .qr-hero-card,
          .app-promo-card{
            padding:24px;
            border-radius:22px;
          }

          .qr-hero-card h2{
            font-size:26px;
          }
        }

        @media (max-width: 640px){
          .qr-head{
            gap:12px;
          }

          .qr-head-title h1{
            font-size:22px;
          }

          .qr-time-pill{
            width:100%;
            justify-content:center;
          }

          .qr-hero-card,
          .app-promo-card{
            padding:20px;
          }

          .qr-input{
            height:60px;
            font-size:20px;
            letter-spacing:3px;
          }

          .qr-submit{
            height:54px;
          }

          .qr-feature-item{
            padding:10px;
          }
        }

        @media (prefers-reduced-motion: reduce){
          *,
          *::before,
          *::after{
            animation:none !important;
            transition:none !important;
          }
        }
      `}</style>

      <div className="qr-page">
        <div className="qr-head">
          <div className="qr-head-title">
            <h1>
              <span className="qr-head-icon">
                <FiCamera size={20} />
              </span>
              QR Attendance
            </h1>
            <p>Mark your presence using a code or the mobile app</p>
          </div>

          <div className="qr-time-pill">
            <span className="qr-time-dot"></span>
            {time}
          </div>
        </div>

        <div className="qr-card-split">
          <div className="qr-hero-card">
            <div className="qr-hero-content">
              <div className="qr-label-row">
                <div className="qr-label-badge">
                  <FiInfo size={18} color="#60A5FA" />
                </div>
                <span className="qr-label-text">Manual Entry</span>
              </div>

              <h2>Enter Display Code</h2>

              <p className="qr-hero-copy">
                If you don't have the mobile app, enter the 8-character code shown on the teacher's screen to mark your attendance.
              </p>

              <form onSubmit={handleManualScan} className="qr-form">
                <div className="qr-input-group">
                  <div className="qr-input-shell">
                    <input
                      type="text"
                      className="qr-input"
                      placeholder="EX: ABC123XY"
                      maxLength={12}
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      disabled={busy}
                    />
                  </div>

                  <div className="qr-input-hint">
                    <span className="qr-hint-text">Use the code exactly as displayed on the teacher screen</span>
                    <span className="qr-code-preview">{code ? code.toUpperCase() : 'Waiting...'}</span>
                  </div>
                </div>

                <button type="submit" className="qr-submit" disabled={busy || !code}>
                  {busy ? 'Processing...' : (
                    <>
                      Mark Attendance <FiArrowRight />
                    </>
                  )}
                </button>
              </form>

              {msg && (
                <div className={`qr-msg qr-msg-${msg.type}`}>
                  <div className="qr-msg-icon">
                    {msg.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertTriangle size={20} />}
                  </div>
                  <div>
                    <div className="qr-msg-title">{msg.text}</div>
                    {msg.details && <div className="qr-msg-sub">{msg.details}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="app-promo-card">
            <div className="app-icon-stack">
              <FiSmartphone size={34} />
            </div>

            <h3>Faster with Mobile</h3>

            <p className="qr-promo-copy">
              The React Native app provides a seamless experience. Just scan the QR code directly and your attendance is logged instantly.
            </p>

            <div className="qr-feature-box">
              <div className="qr-feature-head">
                <span className="qr-feature-label">Mobile Features</span>
              </div>

              <div className="qr-feature-list">
                <div className="qr-feature-item">
                  <FiCheckCircle color="#22C55E" size={16} />
                  1-Tap QR Scanning
                </div>

                <div className="qr-feature-item">
                  <FiCheckCircle color="#22C55E" size={16} />
                  Push Notifications
                </div>

                <div className="qr-feature-item">
                  <FiCheckCircle color="#22C55E" size={16} />
                  Secure Face Auth
                </div>
              </div>
            </div>

            <div className="qr-mini-note">
              <FiInfo size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Tip</strong>
                <span>For the fastest check-in experience, use the mobile app whenever a live classroom QR is available.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScanQrAttendance;