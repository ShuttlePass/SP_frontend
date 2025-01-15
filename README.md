### **초기 프로젝트 생성**

1. **Vite 프로젝트 생성**

   ```
   yarn create vite my-project --template react-ts
   cd my-project
   ```

2. **필요한 패키지 설치**

   ```
   yarn add tailwindcss postcss autoprefixer
   yarn add zustand @tanstack/react-query
   yarn add react-query-devtools
   ```

3. **TailwindCSS 설정**

   - Tailwind 설정 파일 생성

     ```
     npx tailwindcss init -p
     ```

   - `tailwind.config.cjs` 수정

     ```javascript
     module.exports = {
       content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
       theme: {
         extend: {},
       },
       plugins: [],
     };
     ```

   - `src/index.css` 수정

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **React Query 설정 (TanStack Query)**

   - `src/main.tsx` 수정

     ```typescript
     import React from "react";
     import ReactDOM from "react-dom/client";
     import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
     import App from "./App";
     import "./index.css";

     const queryClient = new QueryClient();

     ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
       <React.StrictMode>
         <QueryClientProvider client={queryClient}>
           <App />
         </QueryClientProvider>
       </React.StrictMode>
     );
     ```

5. **Zustand 상태 관리 초기 설정**

   - `src/store/store.ts` 생성

     ```typescript
     import { create } from "zustand";

     interface AppState {
       count: number;
       increase: () => void;
       decrease: () => void;
     }

     export const useAppStore = create<AppState>((set) => ({
       count: 0,
       increase: () => set((state) => ({ count: state.count + 1 })),
       decrease: () => set((state) => ({ count: state.count - 1 })),
     }));
     ```

6. **Vite 서버 실행**

   ```
   yarn dev
   ```
