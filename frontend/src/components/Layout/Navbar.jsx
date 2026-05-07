import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { healthAPI } from '../../services/api';
import { FiMenu, FiLogOut, FiActivity } from 'react-icons/fi';

const Navbar = ({ toggle, collapsed }) => {
  const { user, logout } = useAuth();
  const [ai, setAi] = useState('chk');

  useEffect(() => {
    ck();
    const iv = setInterval(ck, 30000);
    return () => clearInterval(iv);
  }, []);

  const ck = async () => {
    try {
      const r = await healthAPI.check();
      const s = r.data?.ai_service;
      setAi(s === 'operational' || s === 'online' ? 'on' : 'off');
    } catch {
      setAi('off');
    }
  };

  return (
    <>
      <style>{`
        .nb{
          position:fixed;
          top:0;
          right:0;
          left:260px;
          height:72px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 22px;
          z-index:100;
          background:
            linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,.70));
          backdrop-filter:blur(16px) saturate(180%);
          -webkit-backdrop-filter:blur(16px) saturate(180%);
          border-bottom:1px solid rgba(226,232,240,.85);
          box-shadow:
            0 10px 30px rgba(15,23,42,.05),
            inset 0 1px 0 rgba(255,255,255,.65);
          transition:
            left .32s cubic-bezier(.4,0,.2,1),
            background .32s ease,
            box-shadow .32s ease;
          overflow:hidden;
        }

        .nb::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at top left, rgba(37,99,235,.08), transparent 22%),
            radial-gradient(circle at top right, rgba(6,182,212,.06), transparent 20%),
            linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,0));
          pointer-events:none;
        }

        .nb::after{
          content:"";
          position:absolute;
          left:0;
          right:0;
          bottom:0;
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(148,163,184,.4), transparent);
          pointer-events:none;
        }

        .nb.nb-col{
          left:70px;
        }

        .nb-left,
        .nb-right{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
        }

        .nb-right{
          gap:14px;
        }

        .nb-btn{
          width:42px;
          height:42px;
          border:none;
          outline:none;
          border-radius:14px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          color:#475569;
          background:rgba(255,255,255,.68);
          border:1px solid rgba(226,232,240,.9);
          box-shadow:
            0 10px 22px rgba(15,23,42,.05),
            inset 0 1px 0 rgba(255,255,255,.72);
          transition:
            transform .25s ease,
            background .25s ease,
            color .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
          position:relative;
          overflow:hidden;
        }

        .nb-btn::after{
          content:"";
          position:absolute;
          top:0;
          left:-35%;
          width:26%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .nb-btn:hover{
          transform:translateY(-2px);
          color:#1D4ED8;
          background:#EFF6FF;
          border-color:#BFDBFE;
          box-shadow:
            0 14px 28px rgba(37,99,235,.10),
            inset 0 1px 0 rgba(255,255,255,.8);
        }

        .nb-btn:hover::after{
          opacity:1;
          animation:nbShine .7s ease;
        }

        .nb-btn:active{
          transform:translateY(0) scale(.97);
        }

        .ai-pill{
          position:relative;
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:9px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:800;
          letter-spacing:.02em;
          border:1px solid transparent;
          overflow:hidden;
          box-shadow:
            0 10px 22px rgba(15,23,42,.05),
            inset 0 1px 0 rgba(255,255,255,.35);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            background .25s ease,
            color .25s ease;
          animation:nbFadeIn .45s ease;
        }

        .ai-pill::before{
          content:"";
          position:absolute;
          left:10px;
          top:50%;
          width:8px;
          height:8px;
          border-radius:50%;
          transform:translateY(-50%);
          z-index:0;
        }

        .ai-pill svg,
        .ai-pill span{
          position:relative;
          z-index:1;
        }

        .ai-pill svg{
          margin-left:10px;
        }

        .ai-pill:hover{
          transform:translateY(-2px);
        }

        .ai-pill.on{
          background:linear-gradient(135deg, #D1FAE5, #ECFDF5);
          color:#047857;
          border-color:rgba(16,185,129,.18);
          box-shadow:
            0 12px 24px rgba(5,150,105,.10),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .ai-pill.on::before{
          background:#10B981;
          box-shadow:0 0 0 6px rgba(16,185,129,.14);
          animation:nbPulseGreen 1.8s ease-in-out infinite;
        }

        .ai-pill.off{
          background:linear-gradient(135deg, #FEE2E2, #FEF2F2);
          color:#DC2626;
          border-color:rgba(220,38,38,.16);
          box-shadow:
            0 12px 24px rgba(220,38,38,.08),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .ai-pill.off::before{
          background:#EF4444;
          box-shadow:0 0 0 6px rgba(239,68,68,.12);
          animation:nbPulseRed 1.8s ease-in-out infinite;
        }

        .ai-pill.chk{
          background:linear-gradient(135deg, #FEF3C7, #FFFBEB);
          color:#B45309;
          border-color:rgba(217,119,6,.16);
          box-shadow:
            0 12px 24px rgba(217,119,6,.08),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .ai-pill.chk::before{
          background:#F59E0B;
          box-shadow:0 0 0 6px rgba(245,158,11,.12);
          animation:nbPulseAmber 1.4s ease-in-out infinite;
        }

        .nb-user{
          position:relative;
          display:flex;
          align-items:center;
          gap:10px;
          padding:8px 12px 8px 8px;
          border-radius:18px;
          background:rgba(255,255,255,.62);
          border:1px solid rgba(226,232,240,.9);
          box-shadow:
            0 10px 22px rgba(15,23,42,.05),
            inset 0 1px 0 rgba(255,255,255,.72);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            background .25s ease;
          overflow:hidden;
        }

        .nb-user::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,0));
          pointer-events:none;
        }

        .nb-user:hover{
          transform:translateY(-2px);
          background:rgba(255,255,255,.78);
          border-color:#BFDBFE;
          box-shadow:
            0 14px 28px rgba(37,99,235,.08),
            inset 0 1px 0 rgba(255,255,255,.82);
        }

        .nb-av{
          width:38px;
          height:38px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:800;
          font-size:14px;
          color:white;
          background:linear-gradient(135deg, #2563EB, #60A5FA, #06B6D4);
          box-shadow:
            0 12px 24px rgba(37,99,235,.22),
            inset 0 1px 0 rgba(255,255,255,.22);
          flex-shrink:0;
          position:relative;
          overflow:hidden;
        }

        .nb-av::before{
          content:"";
          position:absolute;
          inset:-30%;
          background:conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,.26), rgba(255,255,255,0));
          animation:nbSpin 6s linear infinite;
        }

        .nb-av > *{
          position:relative;
          z-index:1;
        }

        .nb-nm{
          font-size:13px;
          font-weight:800;
          color:#1E293B;
          line-height:1.2;
          max-width:160px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .nb-rl{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:4px 10px;
          border-radius:999px;
          font-size:11px;
          font-weight:800;
          text-transform:capitalize;
          color:#1D4ED8;
          background:#EFF6FF;
          border:1px solid #DBEAFE;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.72);
        }

        .nb-logout{
          width:42px;
          height:42px;
          border:none;
          outline:none;
          border-radius:14px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          color:#DC2626;
          background:rgba(254,242,242,.88);
          border:1px solid rgba(254,202,202,.9);
          box-shadow:
            0 10px 22px rgba(220,38,38,.06),
            inset 0 1px 0 rgba(255,255,255,.78);
          transition:
            transform .25s ease,
            background .25s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            color .25s ease;
          position:relative;
          overflow:hidden;
        }

        .nb-logout::after{
          content:"";
          position:absolute;
          top:0;
          left:-35%;
          width:26%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.30), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .nb-logout:hover{
          transform:translateY(-2px);
          color:#B91C1C;
          background:#FEE2E2;
          border-color:#FCA5A5;
          box-shadow:
            0 16px 28px rgba(220,38,38,.10),
            inset 0 1px 0 rgba(255,255,255,.82);
        }

        .nb-logout:hover::after{
          opacity:1;
          animation:nbShine .7s ease;
        }

        .nb-logout:active{
          transform:translateY(0) scale(.97);
        }

        @keyframes nbPulseGreen{
          0%,100%{transform:translateY(-50%) scale(1); opacity:1}
          50%{transform:translateY(-50%) scale(1.14); opacity:.78}
        }

        @keyframes nbPulseRed{
          0%,100%{transform:translateY(-50%) scale(1); opacity:1}
          50%{transform:translateY(-50%) scale(1.12); opacity:.78}
        }

        @keyframes nbPulseAmber{
          0%,100%{transform:translateY(-50%) scale(1); opacity:1}
          50%{transform:translateY(-50%) scale(1.12); opacity:.76}
        }

        @keyframes nbSpin{
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }

        @keyframes nbShine{
          0%{left:-35%}
          100%{left:130%}
        }

        @keyframes nbFadeIn{
          from{opacity:0; transform:translateY(-6px)}
          to{opacity:1; transform:translateY(0)}
        }

        @media (max-width: 900px){
          .nb{
            padding:0 16px;
          }

          .nb-right{
            gap:10px;
          }

          .nb-user{
            padding:8px;
          }

          .nb-nm{
            max-width:110px;
          }
        }

        @media (max-width: 768px){
          .nb{
            left:0 !important;
            height:66px;
            padding:0 12px;
          }

          .nb-right{
            gap:8px;
          }

          .nb-nm,
          .nb-rl{
            display:none;
          }

          .ai-pill span{
            display:none;
          }

          .ai-pill{
            width:42px;
            height:42px;
            padding:0;
            justify-content:center;
            border-radius:14px;
          }

          .ai-pill svg{
            margin-left:10px;
          }

          .nb-user{
            padding:6px;
            border-radius:14px;
          }

          .nb-av{
            width:34px;
            height:34px;
            border-radius:12px;
            font-size:13px;
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

      <nav className={`nb ${collapsed ? 'nb-col' : ''}`}>
        <div className="nb-left">
          <button className="nb-btn" onClick={toggle} aria-label="Toggle sidebar">
            <FiMenu size={20} />
          </button>
        </div>

        <div className="nb-right">
          <div className={`ai-pill ${ai}`}>
            <FiActivity size={14} />
            <span>AI: {ai === 'on' ? 'Online' : ai === 'off' ? 'Offline' : '...'}</span>
          </div>

          <div className="nb-user">
            <div className="nb-av">{user?.full_name?.charAt(0) || 'U'}</div>
            <span className="nb-nm">{user?.full_name}</span>
            <span className="nb-rl">{user?.role}</span>
          </div>

          <button className="nb-logout" onClick={logout} title="Logout" aria-label="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;