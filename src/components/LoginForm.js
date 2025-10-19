import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Base64URL → Base64 보정 (atob 안전하게)
  const b64urlToB64 = (s) => {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad === 2) s += '==';
    else if (pad === 3) s += '=';
    else if (pad !== 0) s += '===';
    return s;
  };

  const extractRolesFromJwt = (token) => {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return [];
      const json = atob(b64urlToB64(payloadPart));
      const payload = JSON.parse(json);
      return Array.isArray(payload?.roles) ? payload.roles : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });

      // 서버 응답 키 이름 호환: token | accessToken
      const token = res.data.token || res.data.accessToken;
      if (!token) throw new Error('토큰이 없습니다.');

      // 1) 토큰 저장
      localStorage.setItem('token', token);

      // 2) roles 저장 (응답에 있으면 사용, 없으면 JWT에서 추출)
      const roles = Array.isArray(res.data.roles) && res.data.roles.length
        ? res.data.roles
        : extractRolesFromJwt(token);
      localStorage.setItem('roles', JSON.stringify(roles));

      // (선택) 사용자 id도 내려오면 저장
      if (res.data.memberId) localStorage.setItem('memberId', String(res.data.memberId));

      onLogin?.(token); // 부모에 알림
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '로그인 실패';
      setError('로그인 실패: ' + msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">로그인</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
