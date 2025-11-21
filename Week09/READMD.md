# Week09 Signup Demo

---

##  專案結構

```
Week09/
│
├── server/
│   ├── app.js
│   ├── routes/
│   │   └── signup.js
│   └── .env
│
└── client/
    ├── signup_form.html
    └── signup_form.js
```

---

# 如何啟動後端 (Node.js + Express)

### 1 安裝套件

在 `Week09/server/` 目錄下執行：

```bash
npm install
```

### 2 建立 `.env`（可選）

在 `server` 目錄新增：

```
PORT=3001
ALLOWED_ORIGIN=*
```

### 3 啟動後端

```bash
npm run dev
```

成功後會看到：

```
Server ready on http://localhost:3001
```

---


# 📘 API 文件

後端 API base URL：

```
http://localhost:3001/api/signup
```

---

## 📌 **GET /api/signup**

取得目前所有報名者資料。

### Request

```
GET /api/signup
```

### Response

```json
{
  "total": 1,
  "data": [
    {
      "id": "abc12345",
      "name": "小明",
      "email": "test@example.com",
      "phone": "0912345678",
      "interests": ["後端入門"],
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 📌 **POST /api/signup**

新增一名報名者。

### Request Body (JSON)

```json
{
  "name": "小明",
  "email": "test@example.com",
  "phone": "0912345678",
  "password": "demoPass88",
  "confirmPassword": "demoPass88",
  "interests": ["後端入門"]
}
```

### 驗證規則

* `name`、`email`、`phone`、`password`、`interests` 為必填
* 手機需符合：`09xxxxxxxx`（共 10 碼）
* `password` 至少 8 碼
* `password` 與 `confirmPassword` 必須一致
* `interests` 至少一項

### 成功回應

```json
{
  "message": "報名成功",
  "participant": {
    "id": "xYz12345",
    "name": "小明",
    "email": "test@example.com",
    "phone": "0912345678",
    "interests": ["後端入門"],
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## **DELETE /api/signup/:id**

刪除參與者。

### Request

```
DELETE /api/signup/xxxxxx
```

### Response

```json
{
  "message": "已取消報名",
  "participant": {
    "id": "xxxxxx",
    "name": "小明",
    "email": "test@example.com"
  }
}
```

---

# API 測試方式

你可使用任一方式測試：

### ✔ 1. Postman

匯入以下 endpoints，或手動建立：

* GET [http://localhost:3001/api/signup](http://localhost:3001/api/signup)
* POST [http://localhost:3001/api/signup](http://localhost:3001/api/signup)
* DELETE [http://localhost:3001/api/signup/:id](http://localhost:3001/api/signup/:id)

---

### ✔ 2. curl 測試

POST:

```bash
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"小明","email":"test@example.com","phone":"0912345678","password":"demoPass88","confirmPassword":"demoPass88","interests":["後端入門"]}'
```

GET:

```bash
curl http://localhost:3001/api/signup
```

---

# Note

前端 `signup_form.js` 已自動填入固定測試資訊：

```js
payload.password = payload.confirmPassword = 'demoPass88';
payload.interests = ['後端入門'];
payload.terms = true;
```
