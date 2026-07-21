# AI-DS Notes Vault 📚

A centralized, premium academic portal for students of the Artificial Intelligence and Data Science (AI-DS) department at BMS College of Engineering. Built with React, Vite, Tailwind CSS, and Supabase.

🌍 **Live Demo:** [https://notes-vault-seven.vercel.app/](https://notes-vault-seven.vercel.app/)

## Features ✨
- **Bento Box UI:** A modern, beautiful, and fully responsive user interface.
- **Dark & Light Mode:** Seamlessly switch between themes.
- **Semester & Unit Organization:** Effortlessly navigate through Semesters 1–8 and their respective units.
- **Notes & PYQs:** Dedicated sections for syllabus notes and Previous Year Question (PYQ) papers.
- **Secure Admin Panel:** Built-in dashboard to upload, manage, and seamlessly queue multiple PDFs directly to Supabase Storage.
- **Real-Time Analytics:** Tracks unique session visitors dynamically.

## Tech Stack 🛠️
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, SWR
- **Backend & Storage:** Supabase (PostgreSQL, Storage, Auth)
- **Deployment:** Vercel

## Running Locally 🚀

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_PATH=your_secret_admin_path
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---
*Developed by Vedant Vishambhari*
