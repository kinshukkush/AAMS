import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiUsers, FiAward, FiBook, FiUserPlus, FiCamera,
  FiClipboard, FiBell, FiShield, FiChevronLeft
} from 'react-icons/fi';

const adminMenu = [
  { to: '/admin/dashboard', lb: 'Dashboard', ic: FiGrid },
  { to: '/admin/students', lb: 'Manage Students', ic: FiUsers },
  { to: '/admin/teachers', lb: 'Manage Teachers', ic: FiAward },
  { to: '/admin/sections', lb: 'Manage Sections', ic: FiBook },
  { to: '/admin/register-face', lb: 'Register Faces', ic: FiUserPlus },
];

const teacherMenu = [
  { to: '/teacher/sections', lb: 'My Sections', ic: FiBook },
  { to: '/teacher/take-attendance', lb: 'Take Attendance', ic: FiCamera },
];

const studentMenu = [
  { to: '/student/attendance', lb: 'My Attendance', ic: FiClipboard },
  { to: '/student/scan-qr', lb: 'Scan QR', ic: FiCamera },
  { to: '/student/notifications', lb: 'Notifications', ic: FiBell },
];

const Sidebar = ({ collapsed, toggle }) => {
  const loc = useLocation();
  const { user } = useAuth();

  const menu = user?.role === 'admin'
    ? adminMenu
    : user?.role === 'teacher'
      ? teacherMenu
      : studentMenu;

  const roleLabel = user?.role === 'admin'
    ? 'Admin Panel'
    : user?.role === 'teacher'
      ? 'Teacher Panel'
      : 'Student Portal';

  return (
    <>
      <style>{`
        .sb{
          position:fixed;
          top:0;
          left:0;
          bottom:0;
          width:270px;
          display:flex;
          flex-direction:column;
          overflow:hidden;
          z-index:200;
          background:
            radial-gradient(circle at 18% 14%, rgba(96,165,250,.18), transparent 18%),
            radial-gradient(circle at 88% 22%, rgba(34,211,238,.10), transparent 18%),
            linear-gradient(180deg, #081120 0%, #0B1220 26%, #0F172A 65%, #111827 100%);
          box-shadow:
            22px 0 50px rgba(2,6,23,.20),
            inset -1px 0 0 rgba(255,255,255,.05);
          transition:
            width .34s cubic-bezier(.4,0,.2,1),
            box-shadow .34s ease;
          isolation:isolate;
        }

        .sb::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,.016) 0px,
              rgba(255,255,255,.016) 1px,
              transparent 1px,
              transparent 40px
            );
          pointer-events:none;
          z-index:0;
        }

        .sb::after{
          content:"";
          position:absolute;
          top:0;
          right:0;
          bottom:0;
          width:1px;
          background:linear-gradient(180deg, transparent, rgba(255,255,255,.12), transparent);
          pointer-events:none;
          z-index:0;
        }

        .sb.sb-col{
          width:78px;
        }

        .sb-top{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          gap:14px;
          padding:20px 18px;
          min-height:78px;
          border-bottom:1px solid rgba(255,255,255,.07);
          background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0));
        }

        .sb-logo{
          width:44px;
          height:44px;
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          flex-shrink:0;
          position:relative;
          overflow:hidden;
          background:linear-gradient(135deg, #2563EB, #60A5FA, #06B6D4);
          box-shadow:
            0 14px 30px rgba(37,99,235,.28),
            inset 0 1px 0 rgba(255,255,255,.22);
          animation:sbFloat 4s ease-in-out infinite;
        }

        .sb-logo::before{
          content:"";
          position:absolute;
          inset:-35%;
          background:conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,.26), rgba(255,255,255,0));
          animation:sbSpin 7s linear infinite;
        }

        .sb-logo svg{
          position:relative;
          z-index:1;
          filter:drop-shadow(0 4px 12px rgba(0,0,0,.18));
        }

        .sb-brand{
          min-width:0;
          animation:sbFadeIn .35s ease;
        }

        .sb-brand h2{
          margin:0;
          font-size:18px;
          line-height:1.1;
          font-weight:800;
          letter-spacing:-.03em;
          color:#fff;
        }

        .sb-brand span{
          display:block;
          margin-top:3px;
          font-size:10px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:#93C5FD;
        }

        .sb-toggle{
          position:absolute;
          right:-12px;
          top:50%;
          transform:translateY(-50%);
          width:28px;
          height:28px;
          border:none;
          outline:none;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          color:#fff;
          background:linear-gradient(135deg, #2563EB, #1D4ED8);
          border:3px solid #F8FAFC;
          box-shadow:
            0 10px 24px rgba(37,99,235,.24),
            0 2px 8px rgba(15,23,42,.14);
          transition:
            transform .28s ease,
            box-shadow .28s ease,
            background .28s ease;
          z-index:5;
        }

        .sb-toggle:hover{
          transform:translateY(-50%) scale(1.08);
          background:linear-gradient(135deg, #1D4ED8, #1E40AF);
          box-shadow:
            0 14px 28px rgba(37,99,235,.30),
            0 4px 12px rgba(15,23,42,.16);
        }

        .sb-toggle:active{
          transform:translateY(-50%) scale(.96);
        }

        .sb.sb-col .sb-toggle{
          transform:translateY(-50%) rotate(180deg);
        }

        .sb.sb-col .sb-toggle:hover{
          transform:translateY(-50%) rotate(180deg) scale(1.08);
        }

        .sb-nav{
          position:relative;
          z-index:1;
          flex:1;
          padding:16px 10px 14px;
          overflow-y:auto;
          overflow-x:hidden;
        }

        .sb-nav::-webkit-scrollbar{
          width:6px;
        }

        .sb-nav::-webkit-scrollbar-thumb{
          background:rgba(148,163,184,.24);
          border-radius:999px;
        }

        .sb-title{
          display:block;
          padding:8px 12px 12px;
          font-size:10px;
          font-weight:800;
          color:#64748B;
          text-transform:uppercase;
          letter-spacing:.14em;
          animation:sbFadeIn .35s ease;
        }

        .sb-list{
          list-style:none;
          margin:0;
          padding:0;
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .sb-link{
          position:relative;
          display:flex;
          align-items:center;
          gap:12px;
          min-height:48px;
          padding:12px 14px;
          border-radius:16px;
          color:#94A3B8;
          text-decoration:none;
          font-size:14px;
          font-weight:700;
          letter-spacing:.01em;
          overflow:hidden;
          transition:
            transform .24s ease,
            color .24s ease,
            background .24s ease,
            box-shadow .24s ease,
            border-color .24s ease;
          border:1px solid transparent;
          animation:sbMenuIn .35s ease both;
        }

        .sb-link::before{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.015));
          opacity:0;
          transition:opacity .24s ease;
        }

        .sb-link::after{
          content:"";
          position:absolute;
          top:0;
          left:-35%;
          width:24%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
          transform:skewX(-18deg);
          opacity:0;
        }

        .sb-link svg,
        .sb-link span{
          position:relative;
          z-index:1;
        }

        .sb-link svg{
          flex-shrink:0;
          transition:transform .24s ease, color .24s ease;
        }

        .sb-link:hover{
          color:#FFFFFF;
          background:rgba(255,255,255,.06);
          border-color:rgba(255,255,255,.05);
          transform:translateX(4px);
          box-shadow:0 10px 24px rgba(2,6,23,.14);
        }

        .sb-link:hover::before{
          opacity:1;
        }

        .sb-link:hover::after{
          opacity:1;
          animation:sbShine .75s ease;
        }

        .sb-link:hover svg{
          transform:scale(1.08);
          color:#BFDBFE;
        }

        .sb-link.active{
          color:#DBEAFE;
          background:linear-gradient(90deg, rgba(37,99,235,.22), rgba(96,165,250,.12));
          border-color:rgba(147,197,253,.14);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.04),
            0 14px 28px rgba(37,99,235,.10);
        }

        .sb-link.active svg{
          color:#FFFFFF;
          transform:scale(1.04);
        }

        .sb-dot{
          position:absolute;
          right:0;
          top:50%;
          transform:translateY(-50%);
          width:4px;
          height:24px;
          border-radius:999px 0 0 999px;
          background:linear-gradient(180deg, #93C5FD, #2563EB);
          box-shadow:
            0 0 12px rgba(96,165,250,.45),
            0 0 20px rgba(37,99,235,.26);
          animation:sbPulseDot 1.8s ease-in-out infinite;
        }

        .sb-foot{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          gap:12px;
          padding:16px 16px 18px;
          border-top:1px solid rgba(255,255,255,.07);
          background:linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.025));
          animation:sbFadeIn .35s ease;
        }

        .sb-av{
          width:40px;
          height:40px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:14px;
          font-weight:800;
          color:#fff;
          flex-shrink:0;
          position:relative;
          overflow:hidden;
          background:linear-gradient(135deg, #2563EB, #60A5FA, #7C3AED);
          box-shadow:
            0 12px 24px rgba(37,99,235,.20),
            inset 0 1px 0 rgba(255,255,255,.18);
        }

        .sb-av::before{
          content:"";
          position:absolute;
          inset:-35%;
          background:conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0));
          animation:sbSpin 7.5s linear infinite;
        }

        .sb-av > *{
          position:relative;
          z-index:1;
        }

        .sb-fn{
          margin:0;
          font-size:13px;
          font-weight:800;
          color:#FFFFFF;
          line-height:1.2;
          max-width:150px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .sb-fr{
          margin:3px 0 0;
          font-size:11px;
          font-weight:700;
          text-transform:capitalize;
          color:#64748B;
        }

        .sb.sb-col .sb-brand,
        .sb.sb-col .sb-title,
        .sb.sb-col .sb-foot{
          display:none;
        }

        .sb.sb-col .sb-top{
          justify-content:center;
          padding:18px 14px;
        }

        .sb.sb-col .sb-nav{
          padding:16px 8px;
        }

        .sb.sb-col .sb-link{
          justify-content:center;
          padding:12px;
          border-radius:16px;
          min-height:50px;
        }

        .sb.sb-col .sb-link:hover{
          transform:translateY(-2px);
        }

        .sb.sb-col .sb-link span,
        .sb.sb-col .sb-dot{
          display:none;
        }

        @keyframes sbFadeIn{
          from{opacity:0; transform:translateY(6px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes sbMenuIn{
          from{opacity:0; transform:translateX(-8px)}
          to{opacity:1; transform:translateX(0)}
        }

        @keyframes sbFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }

        @keyframes sbSpin{
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }

        @keyframes sbShine{
          0%{left:-35%}
          100%{left:130%}
        }

        @keyframes sbPulseDot{
          0%,100%{opacity:1; transform:translateY(-50%) scaleY(1)}
          50%{opacity:.7; transform:translateY(-50%) scaleY(1.08)}
        }

        @media (max-width: 768px){
          .sb{
            transform:translateX(${collapsed ? '-100%' : '0'});
            width:270px;
            transition:
              transform .32s cubic-bezier(.4,0,.2,1),
              width .32s cubic-bezier(.4,0,.2,1);
          }

          .sb.sb-col{
            width:270px;
          }

          .sb.sb-col .sb-brand,
          .sb.sb-col .sb-title,
          .sb.sb-col .sb-foot{
            display:block;
          }

          .sb.sb-col .sb-top{
            justify-content:flex-start;
            padding:20px 18px;
          }

          .sb.sb-col .sb-nav{
            padding:16px 10px 14px;
          }

          .sb.sb-col .sb-link{
            justify-content:flex-start;
            padding:12px 14px;
          }

          .sb.sb-col .sb-link span{
            display:inline;
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

      <aside className={`sb ${collapsed ? 'sb-col' : ''}`}>
        <div className="sb-top">
          <div className="sb-logo">
            <FiShield size={22} />
          </div>

          {!collapsed && (
            <div className="sb-brand">
              <h2>FaceAttend</h2>
              <span>{roleLabel}</span>
            </div>
          )}

          <button className="sb-toggle" onClick={toggle} aria-label="Toggle sidebar">
            <FiChevronLeft size={16} />
          </button>
        </div>

        <nav className="sb-nav">
          {!collapsed && <span className="sb-title">{user?.role} Menu</span>}

          <ul className="sb-list">
            {menu.map((m, i) => (
              <li key={m.to} style={{ animationDelay: `${i * 40}ms` }}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? m.lb : ''}
                >
                  <m.ic size={20} />
                  {!collapsed && <span>{m.lb}</span>}
                  {!collapsed && loc.pathname === m.to && <div className="sb-dot" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {!collapsed && (
          <div className="sb-foot">
            <div className="sb-av">{user?.full_name?.charAt(0) || 'U'}</div>
            <div>
              <p className="sb-fn">{user?.full_name || 'User'}</p>
              <p className="sb-fr">{user?.role}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;