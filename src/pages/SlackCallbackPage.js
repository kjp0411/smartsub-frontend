// src/pages/SlackCallbackPage.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SlackCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (!code) {
      alert('Slack 인증 코드가 없습니다.');
      return;
    }

    axios.get(`http://localhost:8080/oauth/slack/callback?code=${code}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(() => {
        alert('Slack 연동이 완료되었습니다!');
        navigate('/slack-auth');
      })
      .catch(err => {
        console.error('Slack 인증 실패:', err);
        alert('Slack 인증에 실패했습니다.');
      });
  }, [location, navigate]);

  return <p>Slack 인증 처리 중입니다...</p>;
};

export default SlackCallbackPage;
