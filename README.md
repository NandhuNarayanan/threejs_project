# 📦 3D Log Visualizer

An interactive fullstack project that visualizes log file uploads using **Three.js**, processes them in the background with **BullMQ**, and stores structured data in **Supabase**. Built with **Next.js** on both the frontend and backend.

---

## 🧠 Features

- 🚀 Upload large JSON log files
- ⚙️ Background file processing using **BullMQ** and Redis
- 🧱 3D animation using **Three.js** to represent file activity
- 🗃️ Parsed logs are stored in **Supabase (PostgreSQL)**
- 🔄 Real-time feedback via animation (e.g., cube splitting)
- 🧵 Stream-based file handling for efficient memory usage

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [Three.js](https://threejs.org/)
- **Backend**: Next.js API Routes
- **Queue**: [BullMQ](https://docs.bullmq.io/) + [Redis](https://redis.io/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Streaming**: Busboy for handling large files efficiently

---

## 🧩 Folder Structure

.
upload_logs/
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── log-stats/ # (route for fetching stats)
│ │ │  └── route.ts
│ │ │ └── upload/ # (API route for file uploads)
│ │ │  └── route.ts
│ │ ├── logs/ # (Log-list UI pages
│ │ ├── page.tsx # (Main page)
│ │ ├── layout.tsx
│ │ └── globals.css
│ ├── components/ # (React components)
│ │ ├── FileUpload.tsx
│ │ ├── FileUploader.tsx
│ │ ├── SideBar.tsx
│ │ ├── Three.tsx # (Main 3D scene)
│ │ └── ThreeDLoader.tsx (Loader)
│ ├── lib/ # (Utilities and configs)
│ │ ├── addJob.ts # (Add BullMQ jobs)
│ │ ├── queue.ts # (Queue config)
│ │ ├── redis.ts # (Redis connection)
│ │ └── supabase.ts # (Supabase client setup)
│ └── worker/ # (Background workers)
│ ├── jobHandler.js # (Job logic for processing JSON files)
│ └── worker.js # (BullMQ Worker instance)


---

## 🚚 How It Works

1. **User uploads a JSON file** from the frontend.
2. The file is streamed and saved using Busboy inside a Next.js API route.
3. A **BullMQ job** is added to the queue with the file path.
4. A **worker** reads the file line-by-line, parses JSON, and inserts data into Supabase.
5. As the job starts, a **Three.js cube splits**, representing that processing has begun.

---

## 🧪 Local Setup

### 1. Clone the repo

```
git clone [https://github.com/your-username/3d-log-visualizer.git](https://github.com/NandhuNarayanan/threejs_project.git)
cd upload_logs

2. Install dependencies

npm install
3. Setup environment variables
Create a .env.local file in the root:

env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
4. Start services
Make sure Redis is running:

redis-server
Then start the dev server and worker:

# In one terminal
npm run dev

# In another terminal
node worker/worker.ts
📸 Demo Preview
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/0ac1a965-e60e-431b-a0ac-f73d5c25a7da" />


📌 Future Improvements
Add progress bar for file processing

Support compressed log files (e.g. .gz)

Enable real-time log status updates using Supabase Realtime or WebSockets

🧑‍💻 Author
Nandhu Narayanan
