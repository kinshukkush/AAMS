import React, { useState, useEffect } from 'react';
import { classAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBook, FiUsers, FiCamera, FiClock } from 'react-icons/fi';

const MySections = () => {
  const [sections, setSections] = useState([]);
  const [ld, setLd] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [students, setStudents] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    classAPI.getByTeacher()
      .then(r => setSections(r.data.classes || []))
      .catch(() => toast.error('Failed to load your sections'))
      .finally(() => setLd(false));
  }, []);

  const toggleStudents = async (secId) => {
    if (expandedId === secId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(secId);
    if (!students[secId]) {
      try {
        const r = await classAPI.getStudents(secId);
        setStudents(prev => ({ ...prev, [secId]: r.data.students || [] }));
      } catch {
        toast.error('Failed to load students');
      }
    }
  };

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
            animation:teachFade .45s ease;
          }

          .spinner{
            width:46px;
            height:46px;
            border:3px solid rgba(203,213,225,.7);
            border-top-color:#2563EB;
            border-radius:50%;
            animation:teachSpin .9s linear infinite;
            box-shadow:0 0 0 8px rgba(37,99,235,.05);
          }

          .loader-full span{
            font-size:13px;
            font-weight:600;
            color:#64748B;
            letter-spacing:.02em;
          }

          @keyframes teachSpin{
            from{transform:rotate(0deg)}
            to{transform:rotate(360deg)}
          }

          @keyframes teachFade{
            from{opacity:0}
            to{opacity:1}
          }
        `}</style>
        <div className="loader-full">
          <div className="spinner" />
          <span>Loading sections...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .sec-page{
          animation:secPageIn .6s cubic-bezier(.22,1,.36,1);
        }

        .sec-page::before{
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

        .sec-header{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
          margin-bottom:24px;
          animation:secSlideUp .55s ease both;
        }

        .sec-header-left{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .sec-header-left h1{
          margin:0;
          font-size:30px;
          font-weight:800;
          letter-spacing:-.04em;
          color:#0F172A;
          display:flex;
          align-items:center;
          gap:12px;
        }

        .sec-header-left p{
          margin:0;
          font-size:14px;
          color:#64748B;
          font-weight:500;
        }

        .sec-header-icon{
          width:42px;
          height:42px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg, #2563EB, #06B6D4);
          box-shadow:0 12px 24px rgba(37,99,235,.22);
          animation:secFloat 4s ease-in-out infinite;
          flex-shrink:0;
        }

        .sec-header-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          padding:12px 20px;
          border-radius:14px;
          border:none;
          outline:none;
          cursor:pointer;
          font-size:14px;
          font-weight:800;
          color:#fff;
          background:linear-gradient(135deg, #2563EB, #3B82F6, #06B6D4);
          box-shadow:
            0 14px 28px rgba(37,99,235,.24),
            inset 0 1px 0 rgba(255,255,255,.18);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            filter .25s ease;
          position:relative;
          overflow:hidden;
        }

        .sec-header-btn::after{
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

        .sec-header-btn:hover{
          transform:translateY(-2px);
          box-shadow:
            0 18px 34px rgba(37,99,235,.30),
            inset 0 1px 0 rgba(255,255,255,.18);
          filter:brightness(1.04);
        }

        .sec-header-btn:hover::after{
          opacity:1;
          animation:secShine .75s ease;
        }

        .sec-header-btn:active{
          transform:translateY(0);
        }

        .sec-empty{
          position:relative;
          z-index:1;
          padding:60px 40px;
          text-align:center;
          border-radius:28px;
          border:2px dashed #CBD5E1;
          background:
            linear-gradient(180deg, rgba(255,255,255,.88), rgba(248,250,252,.86));
          box-shadow:0 12px 28px rgba(15,23,42,.05);
          animation:secFadeIn .6s ease both .1s;
        }

        .sec-empty-icon{
          width:80px;
          height:80px;
          margin:0 auto 18px;
          border-radius:24px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg, #EFF6FF, #DBEAFE);
          color:#2563EB;
          box-shadow:0 12px 28px rgba(37,99,235,.08);
          animation:secBounce 2s ease-in-out infinite;
        }

        .sec-empty h3{
          margin:0 0 8px;
          font-size:20px;
          font-weight:800;
          color:#334155;
        }

        .sec-empty p{
          margin:0;
          font-size:14px;
          color:#64748B;
        }

        .sec-grid{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(360px, 1fr));
          gap:20px;
          animation:secFadeIn .6s ease both .08s;
        }

        .sec-card{
          position:relative;
          overflow:hidden;
          border-radius:24px !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.92));
          border:1px solid rgba(226,232,240,.95) !important;
          box-shadow:
            0 14px 32px rgba(15,23,42,.06),
            0 4px 12px rgba(15,23,42,.04);
          transition:
            transform .35s cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease,
            border-color .35s ease;
          animation:secCardIn .55s ease both;
          isolation:isolate;
        }

        .sec-card:nth-child(1){animation-delay:.04s}
        .sec-card:nth-child(2){animation-delay:.08s}
        .sec-card:nth-child(3){animation-delay:.12s}
        .sec-card:nth-child(4){animation-delay:.16s}
        .sec-card:nth-child(5){animation-delay:.20s}
        .sec-card:nth-child(6){animation-delay:.24s}

        .sec-card::before{
          content:"";
          position:absolute;
          inset:0 auto auto 0;
          width:100%;
          height:4px;
          background:linear-gradient(90deg, #2563EB, #60A5FA, #06B6D4);
          opacity:.95;
        }

        .sec-card::after{
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

        .sec-card:hover{
          transform:translateY(-8px);
          box-shadow:
            0 22px 42px rgba(15,23,42,.10),
            0 8px 20px rgba(37,99,235,.10);
          border-color:rgba(147,197,253,.8) !important;
        }

        .sec-card:hover::after{
          opacity:1;
          animation:secShine .9s ease;
        }

        .sec-glow{
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

        .sec-body{
          padding:24px !important;
          position:relative;
          z-index:1;
        }

        .sec-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:12px;
          margin-bottom:14px;
        }

        .sec-top h3{
          margin:0;
          font-size:18px;
          font-weight:800;
          color:#0F172A;
          line-height:1.2;
          flex:1;
          letter-spacing:-.02em;
        }

        .sec-subject-badge{
          display:inline-flex;
          align-items:center;
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.08em;
          background:linear-gradient(135deg, #DBEAFE, #BFDBFE);
          color:#1D4ED8;
          box-shadow:0 6px 12px rgba(37,99,235,.10);
          flex-shrink:0;
        }

        .sec-info{
          display:flex;
          flex-direction:column;
          gap:8px;
          margin-bottom:14px;
          padding:14px;
          border-radius:18px;
          background:rgba(248,250,252,.92);
          border:1px solid rgba(226,232,240,.8);
        }

        .sec-info p{
          margin:0;
          font-size:13px;
          color:#475569;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:8px;
        }

        .sec-schedule{
          display:flex;
          align-items:center;
          gap:6px;
          color:#1D4ED8;
          font-weight:800;
        }

        .sec-foot{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding-top:14px;
          border-top:1px solid rgba(226,232,240,.85);
          flex-wrap:wrap;
        }

        .sec-student-badge{
          display:inline-flex;
          align-items:center;
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.08em;
          background:linear-gradient(135deg, #CFFAFE, #A5F3FC);
          color:#0891B2;
          box-shadow:0 6px 12px rgba(6,182,212,.10);
        }

        .sec-actions{
          display:flex;
          gap:8px;
        }

        .sec-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:10px 14px;
          border-radius:12px;
          border:none;
          outline:none;
          font-size:13px;
          font-weight:800;
          cursor:pointer;
          transition:all .25s ease;
          font-weight:700;
          text-transform:none;
        }

        .sec-btn-secondary{
          color:#1D4ED8;
          background:rgba(219,234,254,.88);
          border:1px solid rgba(191,219,254,.9);
          box-shadow:0 8px 16px rgba(37,99,235,.06);
        }

        .sec-btn-secondary:hover{
          color:#1E40AF;
          background:#EFF6FF;
          border-color:#93C5FD;
          transform:translateY(-2px);
          box-shadow:0 12px 20px rgba(37,99,235,.10);
        }

        .sec-btn-secondary:active{
          transform:translateY(0);
        }

        .sec-btn-primary{
          color:#fff;
          background:linear-gradient(135deg, #2563EB, #1D4ED8);
          border:none;
          box-shadow:0 10px 20px rgba(37,99,235,.18);
        }

        .sec-btn-primary:hover{
          background:linear-gradient(135deg, #1D4ED8, #1E40AF);
          transform:translateY(-2px);
          box-shadow:0 14px 24px rgba(37,99,235,.22);
        }

        .sec-btn-primary:active{
          transform:translateY(0);
        }

        .sec-expand{
          position:relative;
          z-index:1;
          margin-top:16px;
          padding-top:16px;
          border-top:1px solid rgba(226,232,240,.85);
          max-height:${expandedId ? 'auto' : '0'};
          overflow:hidden;
          transition:max-height .35s ease;
          animation:${expandedId ? 'secExpand' : 'secCollapse'} .35s ease;
        }

        .sec-students-list{
          display:flex;
          flex-direction:column;
          gap:10px;
          max-height:320px;
          overflow-y:auto;
        }

        .sec-students-list::-webkit-scrollbar{
          width:6px;
        }

        .sec-students-list::-webkit-scrollbar-thumb{
          background:rgba(148,163,184,.24);
          border-radius:999px;
        }

        .sec-student-item{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:12px 12px;
          border-radius:14px;
          border:1px solid rgba(226,232,240,.8);
          background:#FFFFFF;
          transition:all .25s ease;
          animation:secStudentIn .35s ease;
        }

        .sec-student-item:hover{
          border-color:#BFDBFE;
          background:#F8FAFC;
          transform:translateX(4px);
          box-shadow:0 8px 16px rgba(37,99,235,.08);
        }

        .sec-student-info{
          flex:1;
          min-width:0;
        }

        .sec-student-name{
          margin:0;
          font-size:13px;
          font-weight:800;
          color:#0F172A;
        }

        .sec-student-meta{
          margin:2px 0 0;
          font-size:11px;
          color:#94A3B8;
          font-weight:600;
        }

        .sec-student-status{
          display:inline-flex;
          align-items:center;
          padding:5px 10px;
          border-radius:999px;
          font-size:10px;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.06em;
          flex-shrink:0;
        }

        .sec-student-status.ok{
          background:#D1FAE5;
          color:#047857;
          border:1px solid rgba(16,185,129,.14);
        }

        .sec-student-status.warn{
          background:#FEF3C7;
          color:#B45309;
          border:1px solid rgba(217,119,6,.14);
        }

        .sec-empty-students{
          text-align:center;
          padding:24px;
          color:#64748B;
          font-size:13px;
          font-weight:600;
        }

        .sec-loading-spinner{
          margin:0 auto;
          width:24px;
          height:24px;
          border:2px solid rgba(203,213,225,.5);
          border-top-color:#2563EB;
          border-radius:50%;
          animation:teachSpin .8s linear infinite;
        }

        @keyframes secPageIn{
          from{opacity:0; transform:translateY(10px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes secSlideUp{
          from{opacity:0; transform:translateY(16px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes secFadeIn{
          from{opacity:0; transform:translateY(12px)}
          to{opacity:1; transform:translateY(0)}
        }

        @keyframes secCardIn{
          from{opacity:0; transform:translateY(18px) scale(.985)}
          to{opacity:1; transform:translateY(0) scale(1)}
        }

        @keyframes secBounce{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-8px)}
        }

        @keyframes secFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }

        @keyframes secShine{
          0%{left:-40%}
          100%{left:130%}
        }

        @keyframes secExpand{
          from{max-height:0; opacity:0}
          to{max-height:500px; opacity:1}
        }

        @keyframes secCollapse{
          from{max-height:500px; opacity:1}
          to{max-height:0; opacity:0}
        }

        @keyframes secStudentIn{
          from{opacity:0; transform:translateX(-8px)}
          to{opacity:1; transform:translateX(0)}
        }

        @media (max-width: 900px){
          .sec-grid{
            grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        @media (max-width: 640px){
          .sec-header{
            flex-direction:column;
          }

          .sec-header-left h1{
            font-size:24px;
          }

          .sec-header-btn{
            width:100%;
            justify-content:center;
          }

          .sec-grid{
            grid-template-columns:1fr;
          }

          .sec-card,
          .sec-empty{
            border-radius:20px;
          }

          .sec-top{
            flex-direction:column;
          }

          .sec-foot{
            flex-direction:column;
          }

          .sec-actions{
            width:100%;
          }

          .sec-btn{
            flex:1;
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

      <div className="fade sec-page">
        <div className="sec-header">
          <div className="sec-header-left">
            <h1>
              <span className="sec-header-icon">
                <FiBook size={20} />
              </span>
              My Sections
            </h1>
            <p>Sections assigned to you - {sections.length} total</p>
          </div>

          <button className="sec-header-btn" onClick={() => nav('/teacher/take-attendance')}>
            <FiCamera size={16} />
            Take Attendance
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="sec-empty">
            <div className="sec-empty-icon">
              <FiBook size={40} />
            </div>
            <h3>No Sections Assigned</h3>
            <p>Contact admin to assign sections to you</p>
          </div>
        ) : (
          <div className="sec-grid">
            {sections.map(sec => (
              <div className="card sec-card" key={sec.id}>
                <div className="sec-glow"></div>

                <div className="sec-body">
                  <div className="sec-top">
                    <h3>{sec.class_name} - {sec.section}</h3>
                    <span className="sec-subject-badge">{sec.subject}</span>
                  </div>

                  <div className="sec-info">
                    <p>{sec.department || 'General'} - Semester {sec.semester || '-'}</p>
                    <p>Room: {sec.room || 'TBD'}</p>
                    {sec.schedule_day && (
                      <p className="sec-schedule">
                        <FiClock size={14} />
                        {sec.schedule_day} {sec.schedule_time_start}-{sec.schedule_time_end}
                      </p>
                    )}
                  </div>

                  <div className="sec-foot">
                    <span className="sec-student-badge">{sec.student_count || 0} students</span>

                    <div className="sec-actions">
                      <button
                        className="sec-btn sec-btn-secondary"
                        onClick={() => toggleStudents(sec.id)}
                      >
                        <FiUsers size={14} />
                        {expandedId === sec.id ? 'Hide' : 'Show'}
                      </button>

                      <button
                        className="sec-btn sec-btn-primary"
                        onClick={() => nav('/teacher/take-attendance', { state: { classId: sec.id } })}
                      >
                        <FiCamera size={14} />
                        Attend
                      </button>
                    </div>
                  </div>

                  {expandedId === sec.id && (
                    <div className="sec-expand">
                      {!students[sec.id] ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <div className="sec-loading-spinner" />
                        </div>
                      ) : students[sec.id].length === 0 ? (
                        <div className="sec-empty-students">No students enrolled</div>
                      ) : (
                        <div className="sec-students-list">
                          {students[sec.id].map((s, i) => (
                            <div key={s.id} className="sec-student-item" style={{ animationDelay: `${i * 30}ms` }}>
                              <div className="sec-student-info">
                                <p className="sec-student-name">{s.full_name}</p>
                                <p className="sec-student-meta">
                                  {s.student_id} - {s.department || 'N/A'}
                                </p>
                              </div>

                              <span className={`sec-student-status ${s.face_registered ? 'ok' : 'warn'}`}>
                                {s.face_registered ? 'Face ready' : 'No face'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MySections;