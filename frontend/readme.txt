1. cd to /frontend file 

2. Install react and typescript via vite
    npm create vite@latest .

3. Install tailwindcss for styling 
    npm install -D tailwindcss @tailwindcss/vite
    
3i. Configure the Vite Plugin "vite.config.js"
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
        plugins: [
            react(),
            tailwindcss(),
        ],
    })

3ii. Add Tailwind to your CSS In your src/index.css, replace everything with:
    @import "tailwindcss";
    import './index.css';  // ← must be here


4. Install the following:
    react-router-dom :- for navigations
    axios:- for api calling
    zustand:- for manageing global state
    
    use this command:
        npm install react-router-dom axios zustand




