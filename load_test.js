import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // 2分鐘內增加到100個用戶
    { duration: '5m', target: 100 }, // 維持100個用戶5分鐘
    { duration: '2m', target: 200 }, // 2分鐘內增加到200個用戶
    { duration: '5m', target: 200 }, // 維持200個用戶5分鐘
    { duration: '2m', target: 0 },   // 2分鐘內減少到0個用戶
  ],
};

export default function () {
  // 替換為你的目標URL
  const response = http.get('https://httpbin.org/get');
  
  // 檢查回應狀態
  check(response, {
    '狀態碼為200': (r) => r.status === 200,
    '回應時間 < 500ms': (r) => r.timings.duration < 500,
  });
  
  // 模擬用戶思考時間
  sleep(1);
}