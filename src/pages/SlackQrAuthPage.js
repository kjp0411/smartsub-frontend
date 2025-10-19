import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const SlackQrAuthPage = () => {
  // Slack 초대 링크 직접 입력
  const slackInviteUrl = 'https://join.slack.com/t/smartsubhq/shared_invite/zt-36nhfr2rm-6raCwfrIB4dkgb_rIWxSAQ';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <img src="/logo.png" alt="SmartSub Logo" className="h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">📩 Slack 가입</h2>
        <p className="text-gray-600 mb-4">
          QR 코드를 스캔하여 Slack 워크스페이스에 가입하세요!
        </p>
        <div className="my-6">
          <QRCodeSVG value={slackInviteUrl} size={200}/>
          <p className="text-sm text-gray-500 mt-2">QR 코드를 스캔하여 가입을 진행하세요</p>
        </div>
        <ul className="text-xs text-left text-gray-500 list-disc list-inside mb-4">
          <li>Slack 앱이 설치되어 있어야 합니다</li>
          <li>가입 후 별도 인증 절차를 진행해야 합니다</li>
        </ul>
        <p className="text-xs text-gray-400">
          문제가 있다면{' '}
          <a href="mailto:support@smartsub.com" className="text-blue-600 underline">
            support@smartsub.com
          </a>{' '}
          으로 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default SlackQrAuthPage;
