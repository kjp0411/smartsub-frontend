// src/pages/SlackAuthPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SlackAuthPage = () => {
  const [slackLinked, setSlackLinked] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인한 사용자의 Slack 연동 여부 확인
    axios
      .get('http://localhost:8080/api/members/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((response) => {
        setSlackLinked(response.data.slackLinked);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 실패:', error);
        setSlackLinked(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSlackAuth = () => {
    window.location.href = 'http://localhost:8080/oauth/slack/authorize';
  };

  const handleSlackQrPage = () => {
    navigate('/slack/qr-auth');
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>📣 Slack 알림 연동</h2>

      {slackLinked ? (
        <p>✅ Slack 연동이 완료되었습니다.</p>
      ) : (
        <>
          <p>Slack과 연동하여 결제 알림을 실시간으로 받아보세요.</p>
          <div style={{ margin: '1rem 0' }}>
            <button
              onClick={handleSlackAuth}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4A154B',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}
            >
              💻 브라우저에서 인증하기
            </button>
            <br />
            <button
              onClick={handleSlackQrPage}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#36C5F0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📱 모바일로 인증하기 (QR)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SlackAuthPage;
