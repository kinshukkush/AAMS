import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const go = async (e) => {
    e.preventDefault();
    if (!email || !pw) { toast.error('Fill all fields'); return; }
    setBusy(true);
    const r = await login(email, pw);
    setBusy(false);
    if (r.success) {
      toast.success('Welcome!');
      if (r.role === 'admin') nav('/admin/dashboard');
      else if (r.role === 'teacher') nav('/teacher/sections');
      else if (r.role === 'student') nav('/student/attendance');
      else nav('/');
    } else {
      toast.error(r.message);
    }
  };

  return (
    <>
      <style>{`
        :root{
          --bg-1:#06111f;
          --bg-2:#0b1f3a;
          --bg-3:#143d81;
          --bg-4:#0ea5e9;
          --panel:#ffffff;
          --panel-2:rgba(255,255,255,0.74);
          --line:rgba(255,255,255,0.22);
          --text:#0f172a;
          --muted:#64748b;
          --muted-2:#94a3b8;
          --primary:#2563eb;
          --primary-2:#1d4ed8;
          --primary-3:#60a5fa;
          --cyan:#06b6d4;
          --violet:#7c3aed;
          --shadow-xl:0 30px 80px rgba(2,6,23,.28);
          --shadow-lg:0 20px 50px rgba(15,23,42,.18);
          --shadow-md:0 12px 30px rgba(37,99,235,.12);
          --ring:0 0 0 4px rgba(37,99,235,.12);
          --radius-xl:28px;
          --radius-lg:20px;
          --radius-md:16px;
          --radius-sm:12px;
        }

        *{box-sizing:border-box}

        .auth.auth-login{
          min-height:100vh;
          display:grid;
          grid-template-columns:1.05fr .95fr;
          background:
            radial-gradient(circle at 15% 20%, rgba(96,165,250,.10), transparent 20%),
            radial-gradient(circle at 85% 18%, rgba(34,211,238,.08), transparent 22%),
            linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
          overflow:hidden;
          position:relative;
          font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        }

        .auth.auth-login::before{
          content:"";
          position:absolute;
          inset:auto auto -120px -120px;
          width:320px;
          height:320px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(37,99,235,.10), rgba(37,99,235,0));
          filter:blur(10px);
          pointer-events:none;
          animation:blobFloatA 12s ease-in-out infinite;
        }

        .auth.auth-login::after{
          content:"";
          position:absolute;
          top:-100px;
          right:-100px;
          width:340px;
          height:340px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(6,182,212,.12), rgba(6,182,212,0));
          filter:blur(10px);
          pointer-events:none;
          animation:blobFloatB 14s ease-in-out infinite;
        }

        .auth-l{
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          padding:48px;
          background:
            radial-gradient(circle at 18% 20%, rgba(255,255,255,.14), transparent 20%),
            radial-gradient(circle at 82% 30%, rgba(255,255,255,.08), transparent 24%),
            radial-gradient(circle at 60% 80%, rgba(255,255,255,.08), transparent 18%),
            linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 28%, var(--bg-3) 70%, var(--bg-4) 100%);
          isolation:isolate;
        }

        .auth-l::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,.028) 0px,
              rgba(255,255,255,.028) 1px,
              transparent 1px,
              transparent 46px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,.022) 0px,
              rgba(255,255,255,.022) 1px,
              transparent 1px,
              transparent 46px
            );
          mask-image:linear-gradient(180deg, rgba(0,0,0,.92), rgba(0,0,0,.55));
          pointer-events:none;
          z-index:0;
        }

        .auth-l::after{
          content:"";
          position:absolute;
          inset:auto -120px -120px auto;
          width:340px;
          height:340px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(255,255,255,.10), rgba(255,255,255,0));
          filter:blur(12px);
          pointer-events:none;
          z-index:0;
          animation:haloPulse 7s ease-in-out infinite;
        }

        .auth-orb{
          position:absolute;
          border-radius:50%;
          filter:blur(8px);
          pointer-events:none;
          z-index:1;
          opacity:.9;
        }

        .auth-orb-1{
          width:180px;
          height:180px;
          top:8%;
          right:12%;
          background:radial-gradient(circle, rgba(255,255,255,.20), rgba(255,255,255,0));
          animation:orbFloat1 10s ease-in-out infinite;
        }

        .auth-orb-2{
          width:240px;
          height:240px;
          bottom:6%;
          left:6%;
          background:radial-gradient(circle, rgba(96,165,250,.26), rgba(96,165,250,0));
          animation:orbFloat2 13s ease-in-out infinite;
        }

        .auth-orb-3{
          width:140px;
          height:140px;
          bottom:28%;
          right:22%;
          background:radial-gradient(circle, rgba(34,211,238,.20), rgba(34,211,238,0));
          animation:orbFloat3 9s ease-in-out infinite;
        }

        .auth-hero{
          position:relative;
          z-index:2;
          text-align:center;
          animation:fadeUp .9s cubic-bezier(.22,1,.36,1) both;
        }

        .auth-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 14px;
          border-radius:999px;
          margin-bottom:18px;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          color:rgba(255,255,255,.92);
          font-size:12px;
          font-weight:700;
          letter-spacing:.06em;
          text-transform:uppercase;
          backdrop-filter:blur(10px);
          box-shadow:0 10px 30px rgba(0,0,0,.10);
        }

        .auth-badge-dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:#86efac;
          box-shadow:0 0 0 6px rgba(134,239,172,.14);
          animation:pulseDot 1.8s ease-in-out infinite;
        }

        .auth-logo{
          position:relative;
          width:86px;
          height:86px;
          margin:0 auto 18px;
          border-radius:26px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.10));
          border:1px solid rgba(255,255,255,.24);
          backdrop-filter:blur(14px);
          box-shadow:
            0 20px 50px rgba(0,0,0,.16),
            inset 0 1px 0 rgba(255,255,255,.25);
          animation:logoFloat 4s ease-in-out infinite;
          overflow:hidden;
        }

        .auth-logo::before{
          content:"";
          position:absolute;
          inset:-30%;
          background:conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0));
          animation:spinSlow 7s linear infinite;
        }

        .auth-logo::after{
          content:"";
          position:absolute;
          inset:1px;
          border-radius:25px;
          background:linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
        }

        .auth-logo svg{
          position:relative;
          z-index:1;
          filter:drop-shadow(0 6px 18px rgba(0,0,0,.18));
        }

        .auth-hero h1{
          margin:0;
          font-size:42px;
          font-weight:800;
          letter-spacing:-.04em;
          color:#fff;
          text-shadow:0 10px 30px rgba(0,0,0,.20);
        }

        .auth-hero p{
          margin-top:8px;
          font-size:15px;
          color:rgba(255,255,255,.82);
        }

        .auth-stats{
          position:relative;
          z-index:2;
          display:grid;
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:14px;
          width:100%;
          max-width:520px;
          margin-top:26px;
          animation:fadeUp .95s cubic-bezier(.22,1,.36,1) both .08s;
        }

        .auth-stat{
          padding:14px 14px;
          border-radius:18px;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.10);
          backdrop-filter:blur(8px);
          box-shadow:0 12px 28px rgba(0,0,0,.10);
          transition:transform .3s ease, background .3s ease, border-color .3s ease;
        }

        .auth-stat:hover{
          transform:translateY(-4px);
          background:rgba(255,255,255,.11);
          border-color:rgba(255,255,255,.18);
        }

        .auth-stat strong{
          display:block;
          font-size:18px;
          font-weight:800;
          color:#fff;
          line-height:1.1;
        }

        .auth-stat span{
          display:block;
          margin-top:4px;
          font-size:11px;
          color:rgba(255,255,255,.76);
          text-transform:uppercase;
          letter-spacing:.08em;
          font-weight:700;
        }

        .auth-feat{
          position:relative;
          z-index:2;
          width:100%;
          max-width:520px;
          margin-top:28px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        .auth-feat div{
          position:relative;
          min-height:72px;
          display:flex;
          align-items:center;
          padding:16px 16px 16px 46px;
          color:rgba(255,255,255,.94);
          font-size:14px;
          font-weight:700;
          border-radius:18px;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.10);
          backdrop-filter:blur(10px);
          box-shadow:0 14px 34px rgba(0,0,0,.12);
          transition:transform .35s ease, background .35s ease, border-color .35s ease, box-shadow .35s ease;
          animation:fadeRight .7s ease both;
          overflow:hidden;
        }

        .auth-feat div:nth-child(1){animation-delay:.15s}
        .auth-feat div:nth-child(2){animation-delay:.25s}
        .auth-feat div:nth-child(3){animation-delay:.35s}
        .auth-feat div:nth-child(4){animation-delay:.45s}

        .auth-feat div::before{
          content:"";
          position:absolute;
          left:16px;
          top:50%;
          transform:translateY(-50%);
          width:12px;
          height:12px;
          border-radius:50%;
          background:linear-gradient(135deg, #ffffff, #93c5fd);
          box-shadow:0 0 0 7px rgba(255,255,255,.08);
        }

        .auth-feat div::after{
          content:"";
          position:absolute;
          top:0;
          left:-50%;
          width:40%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
          transform:skewX(-20deg);
          opacity:0;
        }

        .auth-feat div:hover{
          transform:translateY(-5px) translateX(2px);
          background:rgba(255,255,255,.12);
          border-color:rgba(255,255,255,.18);
          box-shadow:0 18px 40px rgba(0,0,0,.16);
        }

        .auth-feat div:hover::after{
          opacity:1;
          animation:shineSweep .9s ease;
        }

        .auth-r{
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:42px;
          background:
            radial-gradient(circle at 85% 15%, rgba(37,99,235,.06), transparent 20%),
            radial-gradient(circle at 15% 85%, rgba(6,182,212,.05), transparent 22%),
            linear-gradient(180deg, rgba(255,255,255,.86), rgba(248,250,252,.98));
        }

        .auth-r::before{
          content:"";
          position:absolute;
          width:540px;
          height:540px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(37,99,235,.05), rgba(37,99,235,0));
          filter:blur(10px);
          pointer-events:none;
          animation:haloDrift 14s ease-in-out infinite;
        }

        .auth-box.auth-login-box{
          position:relative;
          width:100%;
          max-width:470px;
          padding:34px 30px 28px;
          border-radius:var(--radius-xl);
          background:
            linear-gradient(180deg, rgba(255,255,255,.88), rgba(255,255,255,.72));
          border:1px solid rgba(255,255,255,.72);
          backdrop-filter:blur(18px) saturate(180%);
          -webkit-backdrop-filter:blur(18px) saturate(180%);
          box-shadow:
            var(--shadow-xl),
            0 8px 24px rgba(37,99,235,.10),
            inset 0 1px 0 rgba(255,255,255,.75);
          overflow:hidden;
          animation:cardIn .75s cubic-bezier(.22,1,.36,1) both;
        }

        .auth-box.auth-login-box::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(135deg, rgba(255,255,255,.30), rgba(255,255,255,0) 35%),
            radial-gradient(circle at top right, rgba(96,165,250,.12), transparent 24%);
          pointer-events:none;
        }

        .auth-box.auth-login-box::after{
          content:"";
          position:absolute;
          inset:0 auto auto 0;
          width:100%;
          height:4px;
          background:linear-gradient(90deg, var(--primary), var(--cyan), var(--violet));
          opacity:.95;
        }

        .auth-panel-top{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          margin-bottom:20px;
        }

        .auth-mini-brand{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .auth-mini-icon{
          width:46px;
          height:46px;
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg, var(--primary), var(--cyan));
          box-shadow:0 12px 28px rgba(37,99,235,.22);
          flex-shrink:0;
        }

        .auth-mini-brand span{
          display:block;
          font-size:11px;
          font-weight:800;
          letter-spacing:.10em;
          color:var(--muted);
          text-transform:uppercase;
        }

        .auth-mini-brand strong{
          display:block;
          font-size:15px;
          color:var(--text);
          letter-spacing:-.02em;
        }

        .auth-status-pill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(37,99,235,.08);
          color:var(--primary-2);
          font-size:12px;
          font-weight:800;
          border:1px solid rgba(37,99,235,.10);
          box-shadow:0 8px 18px rgba(37,99,235,.08);
        }

        .auth-status-pill::before{
          content:"";
          width:8px;
          height:8px;
          border-radius:50%;
          background:#22c55e;
          box-shadow:0 0 0 6px rgba(34,197,94,.12);
          animation:pulseDot 1.8s ease-in-out infinite;
        }

        .auth-box h2{
          position:relative;
          z-index:1;
          margin:6px 0 4px;
          font-size:32px;
          font-weight:800;
          letter-spacing:-.04em;
          color:var(--text);
        }

        .auth-box > p{
          position:relative;
          z-index:1;
          margin:0 0 24px;
          font-size:14px;
          color:var(--muted);
        }

        .auth-form{
          position:relative;
          z-index:1;
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .fg{
          margin:0;
          animation:fadeUp .55s ease both;
        }

        .fg:nth-child(1){animation-delay:.12s}
        .fg:nth-child(2){animation-delay:.2s}

        .fl{
          display:block;
          margin-bottom:8px;
          font-size:12px;
          font-weight:800;
          color:#475569;
          text-transform:uppercase;
          letter-spacing:.09em;
        }

        .iw{
          position:relative;
        }

        .iw .iw-ic{
          position:absolute;
          left:14px;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
          pointer-events:none;
          transition:color .25s ease, transform .25s ease;
        }

        .iw:focus-within .iw-ic{
          color:var(--primary);
          transform:translateY(-50%) scale(1.08);
        }

        .fi{
          width:100%;
          height:54px;
          padding:0 48px 0 44px;
          border-radius:16px;
          border:1px solid rgba(203,213,225,.92);
          background:rgba(255,255,255,.88);
          color:var(--text);
          font-size:14px;
          font-weight:500;
          outline:none;
          box-shadow:
            inset 0 1px 2px rgba(15,23,42,.03),
            0 1px 0 rgba(255,255,255,.60);
          transition:
            border-color .25s ease,
            box-shadow .25s ease,
            transform .25s ease,
            background .25s ease;
        }

        .fi::placeholder{
          color:var(--muted-2);
        }

        .fi:hover{
          border-color:rgba(96,165,250,.55);
          background:#fff;
          box-shadow:
            inset 0 1px 2px rgba(15,23,42,.03),
            0 8px 20px rgba(37,99,235,.05);
        }

        .fi:focus{
          border-color:var(--primary-3);
          background:#fff;
          transform:translateY(-1px);
          box-shadow:
            var(--ring),
            0 14px 28px rgba(37,99,235,.10),
            inset 0 1px 2px rgba(15,23,42,.03);
        }

        .iw-tog{
          position:absolute;
          right:10px;
          top:50%;
          transform:translateY(-50%);
          width:36px;
          height:36px;
          border:none;
          outline:none;
          background:transparent;
          color:#94a3b8;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:background .25s ease, color .25s ease, transform .25s ease;
        }

        .iw-tog:hover{
          background:rgba(37,99,235,.08);
          color:var(--primary);
          transform:translateY(-50%) scale(1.06);
        }

        .iw-tog:active{
          transform:translateY(-50%) scale(.96);
        }

        .auth-options{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-top:-2px;
          animation:fadeUp .6s ease both .24s;
        }

        .auth-check{
          display:flex;
          align-items:center;
          gap:10px;
          color:var(--muted);
          font-size:13px;
          font-weight:600;
          cursor:pointer;
          user-select:none;
        }

        .auth-check input{
          appearance:none;
          -webkit-appearance:none;
          width:18px;
          height:18px;
          border-radius:6px;
          border:1.5px solid #cbd5e1;
          background:#fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          transition:all .25s ease;
          box-shadow:inset 0 1px 2px rgba(15,23,42,.03);
        }

        .auth-check input:checked{
          background:linear-gradient(135deg, var(--primary), var(--primary-2));
          border-color:var(--primary);
          box-shadow:0 6px 14px rgba(37,99,235,.22);
        }

        .auth-check input:checked::after{
          content:"";
          width:8px;
          height:8px;
          border-radius:2px;
          background:#fff;
        }

        .auth-link{
          color:var(--primary-2);
          font-size:13px;
          font-weight:800;
          text-decoration:none;
          position:relative;
          transition:color .25s ease;
        }

        .auth-link::after{
          content:"";
          position:absolute;
          left:0;
          bottom:-2px;
          width:100%;
          height:2px;
          background:linear-gradient(90deg, var(--primary), var(--cyan));
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .25s ease;
          border-radius:999px;
        }

        .auth-link:hover{
          color:var(--primary);
        }

        .auth-link:hover::after{
          transform:scaleX(1);
        }

        .auth-submit{
          position:relative;
          width:100%;
          height:56px;
          margin-top:2px;
          border:none;
          border-radius:16px;
          color:#fff;
          font-size:15px;
          font-weight:800;
          letter-spacing:.01em;
          cursor:pointer;
          overflow:hidden;
          background:linear-gradient(135deg, var(--primary-2), var(--primary), var(--cyan));
          background-size:200% 200%;
          box-shadow:
            0 18px 36px rgba(37,99,235,.22),
            inset 0 1px 0 rgba(255,255,255,.18);
          transition:transform .25s ease, box-shadow .25s ease, background-position .45s ease, filter .25s ease;
          animation:fadeUp .65s ease both .3s;
        }

        .auth-submit::before{
          content:"";
          position:absolute;
          inset:1px;
          border-radius:15px;
          background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0));
          pointer-events:none;
        }

        .auth-submit::after{
          content:"";
          position:absolute;
          top:0;
          left:-30%;
          width:28%;
          height:100%;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.30), transparent);
          transform:skewX(-20deg);
          opacity:0;
        }

        .auth-submit:hover:not(:disabled){
          transform:translateY(-2px);
          background-position:100% 50%;
          box-shadow:
            0 22px 40px rgba(37,99,235,.28),
            inset 0 1px 0 rgba(255,255,255,.18);
          filter:saturate(1.05);
        }

        .auth-submit:hover:not(:disabled)::after{
          opacity:1;
          animation:shineSweep .85s ease;
        }

        .auth-submit:active:not(:disabled){
          transform:translateY(0);
        }

        .auth-submit:disabled{
          cursor:not-allowed;
          opacity:.82;
          animation:busyGlow 1.2s ease-in-out infinite;
        }

        .auth-footnote{
          margin-top:18px;
          text-align:center;
          font-size:12px;
          color:var(--muted);
          animation:fadeUp .65s ease both .36s;
        }

        .auth-footnote strong{
          color:var(--text);
        }

        @keyframes cardIn{
          0%{
            opacity:0;
            transform:translateY(24px) scale(.97);
          }
          100%{
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }

        @keyframes fadeUp{
          0%{
            opacity:0;
            transform:translateY(16px);
          }
          100%{
            opacity:1;
            transform:translateY(0);
          }
        }

        @keyframes fadeRight{
          0%{
            opacity:0;
            transform:translateX(18px);
          }
          100%{
            opacity:1;
            transform:translateX(0);
          }
        }

        @keyframes logoFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-6px)}
        }

        @keyframes pulseDot{
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.12);opacity:.72}
        }

        @keyframes spinSlow{
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }

        @keyframes shineSweep{
          0%{left:-30%}
          100%{left:130%}
        }

        @keyframes orbFloat1{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(-12px,18px)}
        }

        @keyframes orbFloat2{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(16px,-14px)}
        }

        @keyframes orbFloat3{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(-10px,-10px)}
        }

        @keyframes haloPulse{
          0%,100%{transform:scale(1);opacity:.8}
          50%{transform:scale(1.08);opacity:1}
        }

        @keyframes haloDrift{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(18px,-16px)}
        }

        @keyframes blobFloatA{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(18px,-12px)}
        }

        @keyframes blobFloatB{
          0%,100%{transform:translate(0,0)}
          50%{transform:translate(-16px,18px)}
        }

        @keyframes busyGlow{
          0%,100%{
            box-shadow:
              0 18px 36px rgba(37,99,235,.18),
              inset 0 1px 0 rgba(255,255,255,.18);
          }
          50%{
            box-shadow:
              0 20px 40px rgba(37,99,235,.28),
              inset 0 1px 0 rgba(255,255,255,.18);
          }
        }

        @media (max-width: 1080px){
          .auth.auth-login{
            grid-template-columns:1fr;
          }

          .auth-l{
            min-height:46vh;
            padding:36px 24px;
          }

          .auth-r{
            padding:28px 18px 34px;
          }

          .auth-hero h1{
            font-size:34px;
          }

          .auth-feat,
          .auth-stats{
            max-width:680px;
          }
        }

        @media (max-width: 768px){
          .auth-l{
            display:none;
          }

          .auth-r{
            min-height:100vh;
            padding:18px;
          }

          .auth-box.auth-login-box{
            max-width:100%;
            padding:26px 18px 22px;
            border-radius:22px;
          }

          .auth-panel-top{
            align-items:flex-start;
            flex-direction:column;
          }

          .auth-box h2{
            font-size:28px;
          }

          .fi{
            height:52px;
          }

          .auth-submit{
            height:54px;
          }

          .auth-options{
            flex-direction:column;
            align-items:flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce){
          *,
          *::before,
          *::after{
            animation:none !important;
            transition:none !important;
            scroll-behavior:auto !important;
          }
        }
      `}</style>

      <div className="auth auth-login">
        <div className="auth-l">
          <div className="auth-orb auth-orb-1"></div>
          <div className="auth-orb auth-orb-2"></div>
          <div className="auth-orb auth-orb-3"></div>

          <div className="auth-hero">
            <div className="auth-badge">
              <span className="auth-badge-dot"></span>
              Smart identity verification
            </div>

            <div className="auth-logo">
              <FiShield size={34} />
            </div>

            <h1>Face Attendance</h1>
            <p>AI-Powered Recognition System</p>
          </div>

          <div className="auth-stats">
            <div className="auth-stat">
              <strong>99.9%</strong>
              <span>Secure Access</span>
            </div>
            <div className="auth-stat">
              <strong>Live</strong>
              <span>Recognition</span>
            </div>
            <div className="auth-stat">
              <strong>Roles</strong>
              <span>Protected</span>
            </div>
          </div>

          <div className="auth-feat">
            <div>Live recognition</div>
            <div>Roster attendance</div>
            <div>Manual review</div>
            <div>Role-based access</div>
          </div>
        </div>

        <div className="auth-r">
          <div className="auth-box auth-login-box">
            <div className="auth-panel-top">
              <div className="auth-mini-brand">
                <div className="auth-mini-icon">
                  <FiShield size={20} />
                </div>
                <div>
                  <span>Secure portal</span>
                  <strong>Face Attendance</strong>
                </div>
              </div>
              <div className="auth-status-pill">System Active</div>
            </div>

            <h2>Welcome Back</h2>
            <p>Sign in with your credentials to continue</p>

            <form onSubmit={go} className="auth-form">
              <div className="fg">
                <label className="fl">Email</label>
                <div className="iw">
                  <FiMail className="iw-ic" />
                  <input
                    type="email"
                    className="fi"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Password</label>
                <div className="iw">
                  <FiLock className="iw-ic" />
                  <input
                    type={show ? 'text' : 'password'}
                    className="fi"
                    placeholder="Enter password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                  />
                  <button
                    type="button"
                    className="iw-tog"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-check">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/" className="auth-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="btn btn-p btn-lg auth-submit"
                disabled={busy}
              >
                {busy ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footnote">
              Protected by <strong>role-based authentication</strong> and secure access controls.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;