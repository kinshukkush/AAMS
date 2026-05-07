import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, healthAPI } from '../../services/api';
import { FiUsers, FiAward, FiBook, FiCamera, FiCheckCircle, FiActivity } from 'react-icons/fi';

const SC = ({ title, value, sub, icon, color }) => {
  const c = {
    mustard: { b: 'var(--m100)', f: 'var(--m600)', g: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)' },
    green: { b: 'var(--ok-l)', f: 'var(--ok)', g: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' },
    blue: { b: 'var(--info-l)', f: 'var(--info)', g: 'linear-gradient(135deg, #CFFAFE, #A5F3FC)' },
    red: { b: 'var(--err-l)', f: 'var(--err)', g: 'linear-gradient(135deg, #FEE2E2, #FECACA)' },
    orange: { b: 'var(--warn-l)', f: 'var(--warn)', g: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }
  }[color] || { b: 'var(--m100)', f: 'var(--m600)', g: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)' };

  return (
    <div className="card dash-stat-card" style={{ cursor: 'default' }}>
      <div className="dash-stat-glow"></div>
      <div className="card-b dash-stat-body">
        <div
          className="dash-stat-icon"
          style={{
            background: c.g,
            color: c.f
          }}
        >
          {icon}
        </div>

        <div className="dash-stat-content">
          <p className="dash-stat-title">{title}</p>
          <h2 className="dash-stat-value">{value}</h2>
          {sub && <p className="dash-stat-sub">{sub}</p>}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [aiStatus, setAiStatus] = useState('checking');
  const [ld, setLd] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [s, h] = await Promise.allSettled([dashboardAPI.getStats(), healthAPI.check()]);
        if (s.status === 'fulfilled') setStats(s.value.data);
        if (h.status === 'fulfilled') {
          const st = h.value.data?.ai_service;
          setAiStatus(st === 'operational' || st === 'online' ? 'online' : 'offline');
        } else {
          setAiStatus('offline');
        }
      } catch { }
      finally {
        setLd(false);
      }
    })();
  }, []);

  if (ld) {
    return (
      <>
        <style>{`
          .loader-full{
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            min-height:100vh;
            gap:16px;
            background:
              radial-gradient(circle at top left, rgba(37,99,235,.06), transparent 24%),
              radial-gradient(circle at bottom right, rgba(6,182,212,.06), transparent 24%),
              linear-gradient(180deg,#F8FAFC 0%,#F1F5F9 100%);
            animation:dashFade .45s ease;
          }

          .spinner{
            width:46px;
            height:46px;
            border:3px solid rgba(203,213,225,.7);
            border-top-color:#2563EB;
            border-radius:50%;
            animation:dashSpin .9s linear infinite;
            box-shadow:0 0 0 8px rgba(37,99,235,.05);
          }

          .loader-full span{
            font-size:13px;
            font-weight:600;
            color:#64748B;
            letter-spacing:.02em;
          }

          @keyframes dashSpin{
            from{transform:rotate(0deg)}
            to{transform:rotate(360deg)}
          }

          @keyframes dashFade{
            from{opacity:0}
            to{opacity:1}
          }
        `}</style>
        <div className="loader-full">
          <div className="spinner" />
          <span>Loading dashboard...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .fade{
          animation:dashPageIn .6s cubic-bezier(.22,1,.36,1);
        }

        .dash-wrap{
          position:relative;
        }

        .dash-wrap::before{
          content:"";
          position:fixed;
          inset:0;
          pointer-events:none;
          background:
            radial-gradient(circle at 15% 18%, rgba(37,99,235,.06), transparent 20%),
            radial-gradient(circle at 85% 14%, rgba(6,182,212,.05), transparent 20%),
            radial-gradient(circle at 50% 100%, rgba(124,58,237,.04), transparent 26%);
          z-index:0;
        }

        .dash-head{
          position:relative;
          overflow:hidden;
          background:
            linear-gradient(135deg, rgba(255,255,255,.88), rgba(255,255,255,.72)),
            linear-gradient(135deg, #EFF6FF, #F8FAFC);
          border:1px solid rgba(226,232,240,.9);
          border-radius:22px;
          padding:24px 24px;
          box-shadow:
            0 16px 38px rgba(15,23,42,.08),
            inset 0 1px 0 rgba(255,255,255,.72);
          backdrop-filter:blur(10px);
          margin-bottom:22px;
          animation:dashSlideUp .55s ease both;
        }

        .dash-head::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,.10), transparent 22%),
            linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,0));
          pointer-events:none;
        }

        .dash-head-top{
          position:relative;
          z-index:1;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          flex-wrap:wrap;
        }

        .dash-title-wrap h1{
          font-size:30px;
          font-weight:800;
          letter-spacing:-.04em;
          color:#0F172A;
          margin:0 0 6px;
          display:flex;
          align-items:center;
          gap:12px;
        }

        .dash-title-wrap p{
          margin:0;
          font-size:14px;
          color:#64748B;
          font-weight:500;
        }

        .dash-title-icon{
          width:42px;
          height:42px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#2563EB,#06B6D4);
          color:white;
          box-shadow:0 12px 24px rgba(37,99,235,.20);
          animation:dashFloat 3.8s ease-in-out infinite;
        }

        .dash-meta{
          display:flex;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
        }

        .dash-pill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:800;
          letter-spacing:.03em;
          border:1px solid rgba(226,232,240,.9);
          background:rgba(255,255,255,.8);
          color:#334155;
          box-shadow:0 8px 18px rgba(15,23,42,.05);
        }

        .dash-pill-dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:#22C55E;
          box-shadow:0 0 0 6px rgba(34,197,94,.12);
          animation:dashPulse 1.8s ease-in-out infinite;
        }

        .dash-pill-dot.off{
          background:#EF4444;
          box-shadow:0 0 0 6px rgba(239,68,68,.12);
        }

        .dash-grid{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:18px;
          margin-bottom:24px;
        }

        .dash-stat-card{
          position:relative;
          overflow:hidden;
          border-radius:20px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.92));
          border:1px solid rgba(226,232,240,.95) !important;
          box-shadow:
            0 12px 26px rgba(15,23,42,.06),
            0 3px 10px rgba(15,23,42,.04);
          transition:
            transform .35s cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease,
            border-color .35s ease;
          animation:dashCardIn .55s ease both;
          isolation:isolate;
        }

        .dash-stat-card:nth-child(1){animation-delay:.04s}
        .dash-stat-card:nth-child(2){animation-delay:.08s}
        .dash-stat-card:nth-child(3){animation-delay:.12s}
        .dash-stat-card:nth-child(4){animation-delay:.16s}
        .dash-stat-card:nth-child(5){animation-delay:.20s}
        .dash-stat-card:nth-child(6){animation-delay:.24s}

        .dash-stat-card::before{
          content:"";
          position:absolute;
          inset:0 auto auto 0;
          width:100%;
          height:4px;
          background:linear-gradient(90deg,#2563EB,#60A5FA,#06B6D4);
          opacity:.95;
        }

        .dash-stat-card::after{
          content:"";
          position:absolute;
          top:0;
          left:-40%;
          width:30%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .dash-stat-card:hover{
          transform:translateY(-8px);
          box-shadow:
            0 22px 42px rgba(15,23,42,.10),
            0 8px 20px rgba(37,99,235,.10);
          border-color:rgba(147,197,253,.8) !important;
        }

        .dash-stat-card:hover::after{
          opacity:1;
          animation:dashShine .9s ease;
        }

        .dash-stat-glow{
          position:absolute;
          right:-40px;
          top:-40px;
          width:120px;
          height:120px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(37,99,235,.10), rgba(37,99,235,0));
          pointer-events:none;
          z-index:0;
        }

        .dash-stat-body{
          display:flex;
          align-items:center;
          gap:16px;
          padding:22px 22px !important;
          position:relative;
          z-index:1;
        }

        .dash-stat-icon{
          width:56px;
          height:56px;
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.45),
            0 10px 22px rgba(15,23,42,.08);
          transition:transform .3s ease, box-shadow .3s ease;
        }

        .dash-stat-card:hover .dash-stat-icon{
          transform:scale(1.07) rotate(-3deg);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.45),
            0 14px 26px rgba(15,23,42,.10);
        }

        .dash-stat-content{
          min-width:0;
        }

        .dash-stat-title{
          font-size:11px;
          color:#64748B;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.08em;
          margin:0 0 4px;
        }

        .dash-stat-value{
          font-size:30px;
          font-weight:800;
          color:#0F172A;
          line-height:1.1;
          margin:0;
          letter-spacing:-.04em;
        }

        .dash-stat-sub{
          font-size:12px;
          color:#94A3B8;
          margin-top:4px;
          font-weight:500;
        }

        .dash-actions-card{
          position:relative;
          overflow:hidden;
          border-radius:22px !important;
          border:1px solid rgba(226,232,240,.95) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.92));
          box-shadow:
            0 14px 30px rgba(15,23,42,.07),
            inset 0 1px 0 rgba(255,255,255,.7);
          animation:dashSlideUp .65s ease both .22s;
        }

        .dash-actions-card::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 22%),
            linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,0));
          pointer-events:none;
        }

        .dash-actions-head{
          position:relative;
          z-index:1;
          padding:18px 22px;
          border-bottom:1px solid rgba(226,232,240,.85);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
          background:linear-gradient(180deg, rgba(248,250,252,.9), rgba(255,255,255,.7));
        }

        .dash-actions-head h3{
          margin:0;
          font-size:18px;
          font-weight:800;
          color:#0F172A;
          letter-spacing:-.02em;
          display:flex;
          align-items:center;
          gap:10px;
        }

        .dash-actions-sub{
          font-size:12px;
          color:#94A3B8;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.08em;
        }

        .dash-actions-body{
          position:relative;
          z-index:1;
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          padding:22px !important;
        }

        .dash-btn{
          position:relative;
          overflow:hidden;
          border:none;
          border-radius:14px;
          padding:12px 18px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            background .25s ease,
            color .25s ease,
            border-color .25s ease;
          box-shadow:0 10px 22px rgba(15,23,42,.08);
        }

        .dash-btn::after{
          content:"";
          position:absolute;
          top:0;
          left:-35%;
          width:26%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .dash-btn:hover{
          transform:translateY(-3px);
        }

        .dash-btn:hover::after{
          opacity:1;
          animation:dashShine .75s ease;
        }

        .dash-btn:active{
          transform:translateY(0);
        }

        .dash-btn-primary{
          color:#fff;
          background:linear-gradient(135deg,#1D4ED8,#2563EB,#0891B2);
          box-shadow:
            0 14px 28px rgba(37,99,235,.24),
            inset 0 1px 0 rgba(255,255,255,.18);
        }

        .dash-btn-primary:hover{
          box-shadow:
            0 20px 34px rgba(37,99,235,.28),
            inset 0 1px 0 rgba(255,255,255,.18);
        }

        .dash-btn-secondary{
          color:#1E40AF;
          background:rgba(255,255,255,.92);
          border:1px solid rgba(191,219,254,.9);
        }

        .dash-btn-secondary:hover{
          background:#EFF6FF;
          color:#1D4ED8;
          border-color:#93C5FD;
          box-shadow:0 16px 30px rgba(37,99,235,.10);
        }

        @keyframes dashPageIn{
          from{opacity:0; transform:translateY(10px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes dashSlideUp{
          from{opacity:0; transform:translateY(16px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes dashCardIn{
          from{opacity:0; transform:translateY(18px) scale(.985)}
          to{opacity:1; transform:translateY(0) scale(1)}
        }

        @keyframes dashPulse{
          0%,100%{transform:scale(1); opacity:1}
          50%{transform:scale(1.12); opacity:.75}
        }

        @keyframes dashFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }

        @keyframes dashShine{
          0%{left:-35%}
          100%{left:130%}
        }

        @media (max-width: 1100px){
          .dash-grid{
            grid-template-columns:repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px){
          .dash-head{
            padding:20px 18px;
            border-radius:18px;
          }

          .dash-title-wrap h1{
            font-size:24px;
          }

          .dash-grid{
            grid-template-columns:1fr;
            gap:14px;
          }

          .dash-stat-value{
            font-size:26px;
          }

          .dash-actions-body{
            padding:18px !important;
          }

          .dash-btn{
            width:100%;
            justify-content:flex-start;
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

      <div className="fade dash-wrap">
        <div className="dash-head">
          <div className="dash-head-top">
            <div className="dash-title-wrap">
              <h1>
                <span className="dash-title-icon">
                  <FiActivity size={20} />
                </span>
                Admin Dashboard
              </h1>
              <p>System overview - {new Date().toLocaleDateString()}</p>
            </div>

            <div className="dash-meta">
              <div className="dash-pill">
                <span className={`dash-pill-dot ${aiStatus === 'online' ? '' : 'off'}`}></span>
                AI Engine {aiStatus === 'online' ? 'Online' : 'Offline'}
              </div>
              <div className="dash-pill">
                Live summary
              </div>
            </div>
          </div>
        </div>

        <div className="dash-grid">
          <SC
            title="Total Students"
            value={stats?.students?.total || 0}
            sub={`${stats?.students?.face_registered || 0} faces registered`}
            icon={<FiUsers size={22} />}
            color="mustard"
          />
          <SC
            title="Total Teachers"
            value={stats?.teachers?.total || 0}
            icon={<FiAward size={22} />}
            color="blue"
          />
          <SC
            title="Total Sections"
            value={stats?.classes?.total || 0}
            icon={<FiBook size={22} />}
            color="green"
          />
          <SC
            title="Today Present"
            value={stats?.today?.present || 0}
            sub={`of ${stats?.today?.total_records || 0} records`}
            icon={<FiCheckCircle size={22} />}
            color="green"
          />
          <SC
            title="Faces Registered"
            value={stats?.students?.face_registered || 0}
            sub={`${stats?.students?.total ? Math.round((stats.students.face_registered / stats.students.total) * 100) : 0}% coverage`}
            icon={<FiCamera size={22} />}
            color="orange"
          />
          <SC
            title="AI Engine"
            value={aiStatus === 'online' ? 'Online' : 'Offline'}
            icon={<FiActivity size={22} />}
            color={aiStatus === 'online' ? 'green' : 'red'}
          />
        </div>

        <div className="card dash-actions-card">
          <div className="dash-actions-head">
            <h3>
              <FiActivity size={18} />
              Quick Actions
            </h3>
            <div className="dash-actions-sub">Admin controls</div>
          </div>

          <div className="card-b dash-actions-body">
            <button className="dash-btn dash-btn-primary" onClick={() => nav('/admin/students')}>
              <FiUsers size={16} />
              Manage Students
            </button>

            <button className="dash-btn dash-btn-secondary" onClick={() => nav('/admin/teachers')}>
              <FiAward size={16} />
              Manage Teachers
            </button>

            <button className="dash-btn dash-btn-secondary" onClick={() => nav('/admin/sections')}>
              <FiBook size={16} />
              Manage Sections
            </button>

            <button className="dash-btn dash-btn-secondary" onClick={() => nav('/admin/register-face')}>
              <FiCamera size={16} />
              Register Faces
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;