# Contract Explorer 🗂️

A dynamic page-driven Contract Explorer built with Node.js, Express, MongoDB, and React.

## 🧾 Overview

Contract Explorer is a flexible contract dashboard where filters and UI are driven entirely by DB config. Pages can be created from the backend, and the frontend automatically loads contracts based on page configuration — without writing new code for each page.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

### Frontend
- React (Vite)
- Tailwind CSS
- Shadcn UI
- TanStack Query
- React Router DOM
- Axios
- React Context API

---

## 📁 Project Structure

```
contract-explorer/
├── backend/
│   └── src/
│       ├── models/
│       │   ├── Page.js
│       │   └── Contract.js
│       ├── controllers/
│       │   ├── pageController.js
│       │   └── contractController.js
│       ├── routes/
│       │   ├── pageRoutes.js
│       │   └── contractRoutes.js
│       └── index.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── ContractPage.jsx
        │   ├── ContractDetailPage.jsx
        │   └── PageDetailPage.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── CreateContractModal.jsx
        │   ├── EditContractModal.jsx
        │   ├── CreatePageModal.jsx
        │   └── EditPageModal.jsx
        ├── context/
        │   └── PageContext.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend Setup

```bash
# 1. Backend folder mein jao
cd backend

# 2. Dependencies install karo
npm install

# 3. .env file banao
PORT=5000
MONGO_URI=mongodb://localhost:27017/contract-explorer

# 4. Server start karo
npm run dev
```

Server chalega: `http://localhost:5000`

### Frontend Setup

```bash
# 1. Frontend folder mein jao
cd frontend

# 2. Dependencies install karo
npm install

# 3. Dev server start karo
npm run dev
```

Frontend chalega: `http://localhost:5173`

---

## 🔌 API Endpoints

### Pages APIs

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/pages` | Sab pages lao (rank se sort) |
| GET | `/api/pages?url=sow-contracts` | URL se page dhundo |
| GET | `/api/pages/:id` | ID se page lao |
| POST | `/api/pages` | Naya page banao |
| PUT | `/api/pages/:id` | Page update karo |
| DELETE | `/api/pages/:id` | Page delete karo |

### Contracts APIs

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/contracts` | Sab contracts lao |
| GET | `/api/contracts?pageId=123` | Page filters se contracts lao |
| GET | `/api/contracts?contractType=SOW` | Type se filter karo |
| GET | `/api/contracts?status=Processed` | Status se filter karo |
| GET | `/api/contracts/:id` | ID se contract lao |
| POST | `/api/contracts` | Naya contract banao |
| PUT | `/api/contracts/:id` | Contract update karo |
| DELETE | `/api/contracts/:id` | Contract delete karo |

---

## ✨ Features

- ✅ Dynamic sidebar — pages DB se automatically load hote hain
- ✅ Page based contract filtering — har page ka apna filter hai
- ✅ Filter override — UI se bhi filter kar sakte ho
- ✅ Contract Type filter buttons
- ✅ Status filter buttons
- ✅ Amount range filter (Min / Max)
- ✅ Search contracts by name
- ✅ Reset filters
- ✅ Add / Edit / Delete Contracts
- ✅ Add / Edit / Delete Pages
- ✅ Contract Detail Page
- ✅ Page Detail Page

---

## 📸 Screenshots

### All Contracts Page
![All Contracts](frontend/screenshot/All%20Contracts%20page.png)

### SOW Contracts Page
![SOW Contracts](frontend/screenshot/SOW%20Contracts%20page.png)

### SOW Contracts Filter
![SOW Contracts Filter](frontend/screenshot/SOW%20Contracts%20filter%20page.png)

### Add Contract Modal
![Add Contract](frontend/screenshot/Add%20Contract%20modal.png)

### Add Page Modal
![Add Page](frontend/screenshot/Add%20Page%20modal.png)

### Contract Detail Page
![Contract Detail](frontend/screenshot/Contract%20Detail%20page%20.png)

### Page Detail Page
![Page Detail](frontend/screenshot/Page%20Detail%20page.png)

---

## 🧪 Expected Flow

1. Multiple pages create karo DB mein
2. Har page automatically sidebar mein aata hai
3. Page click karo → route load hota hai URL se
4. Contracts table page filter config use karta hai
5. Naya page different filters ke saath add karo → bina code likhe new filtered page ready!
