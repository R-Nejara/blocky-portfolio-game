# Blocky 3D Portfolio

Welcome to my interactive 3D portfolio!  
This project is a web-based 3D world built with [Three.js](https://threejs.org/), featuring a controllable character, interactive objects, and smooth day/night transitions.  
All 3D models were created in Blender and brought to life in the browser.

---

## 🌐 Preview

[**Live Demo → lovely-pika-f51d55.netlify.app**](https://lovely-pika-f51d55.netlify.app)

> **How to move:**  
> Use `W`, `A`, `S`, `D` or the arrow keys to walk around.  
> Click on interactive objects to learn more about each project!

---

## 🚀 Features

- **3D Character Movement:**  
  Move around the world using `WASD` or arrow keys.  
  Physics and movement are framerate-independent for a consistent experience everywhere.

- **Interactive Portfolio Objects:**  
  Click on highlighted objects to open modals with project and design info.

- **Day/Night Toggle:**  
  Switch between day and night with a smooth animated sun color transition.

- **Responsive Design:**  
  Works on desktop and adapts to different screen sizes.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/R-Nejara/blocky-portfolio.git
   cd blocky-portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The output will be in the `dist/` folder.

---

## 📦 Deployment

- **Static Hosting:**  
  Upload the contents of the `dist/` folder to Netlify, Vercel, GitHub Pages, or any static web host.
- **Important:**  
  Place your 3D assets (e.g. `Portfolio.glb`) in the `public/glbFile/` folder so they are available at `/glbFile/Portfolio.glb` after deployment.

---

## 🎮 Controls

- **Move:** `W`, `A`, `S`, `D` or Arrow Keys
- **Interact:** Click on interactive objects
- **Toggle Day/Night:** Click the sun/moon button
- **Respawn:** Press `0`

---

## 🖼️ Credits

- **3D Models:** Created in Blender by [Rayan]
- **Development:** [Rayan]
- **Libraries:**
  - [Three.js](https://threejs.org/)
  - [GSAP](https://greensock.com/gsap/)
  - [Vite](https://vitejs.dev/) (for development/build)

---

## 📄 License

This project is for personal portfolio and demonstration purposes.  
Feel free to explore and get inspired!

---

**Enjoy exploring my world!**
