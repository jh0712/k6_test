# k6 入門教學手冊

## 什麼是 k6？

k6 是一個現代化的負載測試工具，專為開發人員和 DevOps 工程師設計。它使用 JavaScript 作為測試腳本語言，提供了簡潔的 API 和強大的性能測試功能。

## 安裝 k6

### macOS
```bash
brew install k6
```

### Windows
```bash
winget install k6
```

### Linux
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## 常見使用情境

### 1. API 性能測試
測試 RESTful API 的響應時間和吞吐量。

### 2. 負載測試
模擬大量用戶同時訪問系統，測試系統在高負載下的表現。

### 3. 壓力測試
逐步增加負載，找出系統的極限和瓶頸。

### 4. 端點穩定性測試
長時間運行測試，確保系統在持續負載下保持穩定。

### 5. 回歸測試
在系統更新後，確保性能沒有退化。

## 基本測試腳本範例

### 簡單的 HTTP GET 測試
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // 10 個虛擬用戶
  duration: '30s', // 運行 30 秒
};

export default function () {
  const response = http.get('https://httpbin.org/get');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### POST 請求測試
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  const payload = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post('https://httpbin.org/post', payload, params);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response contains name': (r) => r.json().json.name === 'Test User',
  });
}
```

## 常用指令

### 基本執行
```bash
# 執行測試腳本
k6 run script.js

# 指定虛擬用戶數量
k6 run --vus 50 script.js

# 指定執行時間
k6 run --duration 2m script.js

# 同時指定用戶數和時間
k6 run --vus 100 --duration 5m script.js
```

### 進階選項
```bash
# 使用配置文件
k6 run --config config.json script.js

# 設定環境變數
k6 run --env API_BASE_URL=https://api.example.com script.js

# 輸出結果到檔案
k6 run --out json=results.json script.js

# 安靜模式（減少輸出）
k6 run --quiet script.js

# 詳細模式（增加輸出）
k6 run --verbose script.js
```

### 測試階段配置
```bash
# 使用內建的測試階段
k6 run --stage 5s:10,10s:50,5s:10 script.js
```

### 結果輸出選項
```bash
# 輸出到 InfluxDB
k6 run --out influxdb=http://localhost:8086/mydb script.js

# 輸出到 JSON 檔案
k6 run --out json=results.json script.js

# 輸出到 CSV 檔案
k6 run --out csv=results.csv script.js

# 多種輸出格式
k6 run --out json=results.json --out influxdb=http://localhost:8086/mydb script.js
```

## 負載測試選項配置

### 在腳本中配置選項
```javascript
export const options = {
  // 簡單負載測試
  vus: 100,
  duration: '5m',
  
  // 或使用階段配置
  stages: [
    { duration: '2m', target: 100 }, // 2分鐘內增加到100用戶
    { duration: '5m', target: 100 }, // 維持100用戶5分鐘
    { duration: '2m', target: 200 }, // 2分鐘內增加到200用戶
    { duration: '5m', target: 200 }, // 維持200用戶5分鐘
    { duration: '2m', target: 0 },   // 2分鐘內降到0用戶
  ],
  
  // 性能門檻設定
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% 的請求必須在 500ms 內完成
    http_req_failed: ['rate<0.1'],    // 錯誤率必須低於 10%
  },
  
  // 其他選項
  noConnectionReuse: false,
  userAgent: 'k6-test',
  maxRedirects: 10,
};
```

## k6 執行結果解讀

### 基本指標說明

當 k6 測試完成後，會顯示類似以下的結果：

```
     ✓ status is 200
     ✓ response time < 500ms

     checks.........................: 100.00% ✓ 2000      ✗ 0     
     data_received..................: 580 kB  19 kB/s
     data_sent......................: 160 kB  5.3 kB/s
     http_req_blocked...............: avg=1.25ms   min=0s      med=1ms     max=89ms    p(90)=2ms     p(95)=3ms   
     http_req_connecting............: avg=0.58ms   min=0s      med=0s      max=58ms    p(90)=1ms     p(95)=2ms   
     http_req_duration..............: avg=245.32ms min=201ms   med=240ms   max=502ms   p(90)=288ms   p(95)=321ms 
       { expected_response:true }...: avg=245.32ms min=201ms   med=240ms   max=502ms   p(90)=288ms   p(95)=321ms 
     http_req_failed................: 0.00%   ✓ 0         ✗ 1000  
     http_req_receiving.............: avg=0.32ms   min=0ms     med=0ms     max=5ms     p(90)=1ms     p(95)=1ms   
     http_req_sending...............: avg=0.05ms   min=0ms     med=0ms     max=1ms     p(90)=0ms     p(95)=0ms   
     http_req_tls_handshaking.......: avg=0.64ms   min=0s      med=0s      max=32ms    p(90)=0s      p(95)=0s    
     http_req_waiting...............: avg=244.95ms min=200ms   med=239ms   max=501ms   p(90)=287ms   p(95)=320ms 
     http_reqs......................: 1000    33.3/s
     iteration_duration.............: avg=1.24s    min=1.2s    med=1.24s   max=1.5s    p(90)=1.29s   p(95)=1.32s 
     iterations.....................: 1000    33.3/s
     vus............................: 1       min=1       max=100 
     vus_max........................: 100     min=100     max=100 
```

### 關鍵指標解釋

#### 1. Checks（檢查項目）
- `✓` 表示通過的檢查
- `✗` 表示失敗的檢查
- 顯示通過率百分比

#### 2. HTTP 相關指標

**http_req_duration（HTTP 請求總時間）**
- `avg`: 平均響應時間
- `min`: 最短響應時間
- `max`: 最長響應時間
- `med`: 中位數響應時間
- `p(90)`: 90% 的請求在此時間內完成
- `p(95)`: 95% 的請求在此時間內完成

**http_req_blocked（請求被阻塞時間）**
- 請求在發送前被阻塞的時間（通常是連線池等待）

**http_req_connecting（連線建立時間）**
- TCP 連線建立所需時間

**http_req_sending（請求發送時間）**
- 發送請求數據所需時間

**http_req_waiting（等待響應時間）**
- 等待伺服器響應的時間（TTFB - Time To First Byte）

**http_req_receiving（接收響應時間）**
- 接收響應數據所需時間

**http_req_failed（請求失敗率）**
- 失敗請求的百分比

#### 3. 數據傳輸指標

**data_sent（發送數據量）**
- 測試期間發送的總數據量和速率

**data_received（接收數據量）**
- 測試期間接收的總數據量和速率

#### 4. 虛擬用戶指標

**vus（當前虛擬用戶數）**
- 當前活躍的虛擬用戶數量

**vus_max（最大虛擬用戶數）**
- 測試期間的最大虛擬用戶數

#### 5. 迭代指標

**iterations（迭代次數）**
- 完成的測試迭代總數和每秒迭代數

**iteration_duration（迭代持續時間）**
- 每次完整測試迭代的時間

### 性能評估建議

#### 良好的性能指標通常包括：
- **響應時間**: p(95) < 500ms（95% 的請求在 500ms 內完成）
- **錯誤率**: http_req_failed < 1%（錯誤率低於 1%）
- **吞吐量**: 符合業務需求的 RPS（每秒請求數）

#### 需要關注的警告信號：
- p(95) 響應時間過高
- 錯誤率超過可接受範圍
- 響應時間變異性過大（max 和 min 差距過大）
- 連線建立時間過長

## 詳細教學資源

### 官方文檔
- [k6 官方網站](https://k6.io/)
- [k6 文檔](https://k6.io/docs/)
- [JavaScript API 參考](https://k6.io/docs/javascript-api/)

### 進階教學
- [k6 最佳實踐指南](https://k6.io/docs/testing-guides/)
- [性能測試策略](https://k6.io/docs/testing-guides/test-types/)
- [CI/CD 整合教學](https://k6.io/docs/integrations/)

### 社群資源
- [k6 GitHub Repository](https://github.com/grafana/k6)
- [k6 Community Forum](https://community.k6.io/)
- [k6 Examples](https://github.com/grafana/k6/tree/master/samples)

### 擴展和整合
- [k6 Extensions](https://k6.io/docs/extensions/)
- [Cloud 服務整合](https://k6.io/cloud/)
- [監控和可視化](https://k6.io/docs/results-output/)

## 結語

k6 是一個功能強大且易於使用的性能測試工具。通過理解執行結果中的各項指標，您可以有效地評估系統性能，識別瓶頸，並做出相應的優化決策。建議從簡單的測試開始，逐步增加複雜性，並結合業務需求設定合理的性能目標。