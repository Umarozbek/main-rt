'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, login } from './adminData';
import s from './admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (checkAuth()) router.replace('/admin/dashboard');
  }, [router]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      router.replace('/admin/dashboard');
    } else {
      setError('Login yoki parol noto\'g\'ri');
    }
  };

  return (
    <div className={s.loginWrap}>
      <div className={s.loginCard}>
        <div className={s.loginLogo}>
          <img src="/img/rt-logo.png" alt="RT Holdings" />
        </div>
        <h1 className={s.loginTitle}>Admin Panel</h1>
        <p className={s.loginSub}>RT Holdings CMS — Boshqaruv paneli</p>
        <form className={s.loginForm} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label>Login</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className={s.field}>
            <label>Parol</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className={s.loginError}>{error}</p>}
          <button type="submit" className={s.loginBtn}>Kirish</button>
        </form>
      </div>
    </div>
  );
}
