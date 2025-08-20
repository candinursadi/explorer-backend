# Explorer Backend  

Backend service for a **File & Folder Explorer** built with [Bun](https://bun.sh/), [Elysia](https://elysiajs.com/), and [Prisma](https://www.prisma.io/).  
This project provides APIs to manage **folders** and **files**, including pagination, tree structure, and relational data.  

---

## 🚀 Tech Stack  
- **Runtime**: [Bun](https://bun.sh/)  
- **Framework**: [Elysia](https://elysiajs.com/)  
- **ORM**: [Prisma](https://www.prisma.io/)  
- **Database**: PostgreSQL (default, can be swapped with MySQL/SQLite)  
- **Validation**: [Zod](https://zod.dev/)  
- **Testing**: [Vitest](https://vitest.dev/) + [Supertest](https://github.com/visionmedia/supertest)  

---

## 📦 Installation  

1. Clone this repository:  
   ```bash
   git clone https://github.com/candinursadi/explorer-backend.git
   cd explorer-backend
   ```

2. Install dependencies:  
   ```bash
   bun install
   ```

3. Setup environment variables:  
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database configuration, e.g.:  
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/explorer"
   ```

---

## 🗄️ Database  

### 1. Initialize Prisma  
```bash
bun run db:init
```

### 2. Generate client  
```bash
bun run db:generate
```

### 3. Push schema to database  
```bash
bun run db:push
```

### 4. Run seeding  
```bash
bun run db:seed
```

### 5. Reset database (optional)  
```bash
bun run db:reset
```

---

## 🔌 API Routes  

Base URL: `/api/v1`  

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| GET    | `/folders`                | List root folders (with paging)   |
| GET    | `/folders/:id`            | List subfolders of a folder       |
| GET    | `/folders/:id/files`      | List files in a folder            |
| GET    | `/folders/:id/contents`   | List both subfolders & files      |

---

## 📡 API Responses  

### 1. Get Root Folders  
**Request:**  
```http
GET /api/v1/folders?limit=2
```

**Response:**  
```json
{
    "status": "success",
    "data": [
        {
            "id": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "name": "Level 1 Folder 1",
            "parentId": null,
            "createdAt": "2025-08-20T18:14:02.274Z",
            "updatedAt": "2025-08-20T18:14:02.274Z"
        },
        {
            "id": "eeb63510-d654-4db3-9ce8-7d4936c3ac11",
            "name": "Level 1 Folder 2",
            "parentId": null,
            "createdAt": "2025-08-20T18:14:02.274Z",
            "updatedAt": "2025-08-20T18:14:02.274Z"
        }
    ],
    "meta": {
        "total": 4,
        "perPage": 2,
        "currentPage": 1,
        "lastPage": 2,
        "firstPage": 1,
        "firstPageUrl": "/api/v1/folders?page=1&limit=2",
        "lastPageUrl": "/api/v1/folders?page=2&limit=2",
        "nextPageUrl": "/api/v1/folders?page=2&limit=2",
        "previousPageUrl": null
    }
}
```

---

### 2. Get Subfolders  
**Request:**  
```http
GET /api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34?limit=2
```

**Response:**  
```json
{
    "status": "success",
    "data": [
        {
            "id": "d8bb0c4e-dbed-4e6b-a674-21108844b7fe",
            "name": "Level 2 Folder 1",
            "parentId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "createdAt": "2025-08-20T18:14:02.297Z",
            "updatedAt": "2025-08-20T18:14:02.297Z"
        },
        {
            "id": "8a79e63d-7b1b-4109-90dc-975ba1dab84c",
            "name": "Level 2 Folder 10",
            "parentId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "createdAt": "2025-08-20T18:14:02.297Z",
            "updatedAt": "2025-08-20T18:14:02.297Z"
        }
    ],
    "meta": {
        "total": 10,
        "perPage": 2,
        "currentPage": 1,
        "lastPage": 5,
        "firstPage": 1,
        "firstPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34?page=1&limit=2",
        "lastPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34?page=5&limit=2",
        "nextPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34?page=2&limit=2",
        "previousPageUrl": null
    }
}
```

---

### 3. Get Files in a Folder  
**Request:**  
```http
GET /api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/files?limit=2
```

**Response:**  
```json
{
    "status": "success",
    "data": [
        {
            "id": "ebc533b8-2d4c-4334-9b6f-2faeeea94743",
            "folderId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "name": "File 1 Level 1 Folder 1",
            "createdAt": "2025-08-20T18:14:02.292Z",
            "updatedAt": "2025-08-20T18:14:02.292Z"
        },
        {
            "id": "dfd286bc-539d-4d49-8cde-5e938c5e374d",
            "folderId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "name": "File 2 Level 1 Folder 1",
            "createdAt": "2025-08-20T18:14:02.292Z",
            "updatedAt": "2025-08-20T18:14:02.292Z"
        }
    ],
    "meta": {
        "total": 5,
        "perPage": 2,
        "currentPage": 1,
        "lastPage": 3,
        "firstPage": 1,
        "firstPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/files?page=1&limit=2",
        "lastPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/files?page=3&limit=2",
        "nextPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/files?page=2&limit=2",
        "previousPageUrl": null
    }
}
```

---

### 4. Get Folder Contents (Subfolders + Files)  
**Request:**  
```http
GET /api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/contents?limit=2
```

**Response:**  
```json
{
    "status": "success",
    "data": [
        {
            "id": "d8bb0c4e-dbed-4e6b-a674-21108844b7fe",
            "name": "Level 2 Folder 1",
            "type": "folder",
            "folderId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "createdAt": "2025-08-20T18:14:02.297Z",
            "updatedAt": "2025-08-20T18:14:02.297Z"
        },
        {
            "id": "8a79e63d-7b1b-4109-90dc-975ba1dab84c",
            "name": "Level 2 Folder 10",
            "type": "folder",
            "folderId": "51ac7284-427b-414a-ad73-df4828e5cb34",
            "createdAt": "2025-08-20T18:14:02.297Z",
            "updatedAt": "2025-08-20T18:14:02.297Z"
        }
    ],
    "meta": {
        "total": 15,
        "perPage": 2,
        "currentPage": 1,
        "lastPage": 8,
        "firstPage": 1,
        "firstPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/contents?page=1&limit=2",
        "lastPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/contents?page=8&limit=2",
        "nextPageUrl": "/api/v1/folders/51ac7284-427b-414a-ad73-df4828e5cb34/contents?page=2&limit=2",
        "previousPageUrl": null
    }
}
```

---

## 🛠 Development  

Run dev server (with hot reload):  
```bash
bun run dev
```

Build:  
```bash
bun run build
```

Start (production):  
```bash
bun start
```

---

## ✅ Testing  

Run all tests:  
```bash
bun run test
```

Unit tests:  
```bash
bun run test:unit
```

Integration tests:  
```bash
bun run test:int
```

End-to-end tests:  
```bash
bun run test:e2e
```

---

## 📖 Contributing  

1. Fork this repository  
2. Create a new feature branch (`git checkout -b feature/your-feature`)  
3. Commit changes (`git commit -m 'add: new feature'`)  
4. Push to branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

---

## 📜 License  

MIT License.  
