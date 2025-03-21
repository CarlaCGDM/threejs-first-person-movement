# **3D First-Person Movement Prototype**

Welcome to the **3D First-Person Movement Prototype**! This project is a demonstration of first-person movement and camera controls in a 3D environment using **React Three Fiber**, **Rapier Physics**, and **Three.js**. It includes features like walking, looking around, interacting with objects, and teleporting to specific locations.

---

## **Features**
- **First-Person Movement**: Move around the environment using `WASD` or arrow keys.
- **Camera Controls**: Look around by holding the right mouse button.
- **Physics-Based Collisions**: Realistic collisions with walls, slopes, and other objects.
- **Interactive Props**: Click on objects to interact with them and view descriptions.
- **Teleportation**: Teleport to specific locations near props or return to the starting position.
- **Dynamic Settings**: Adjust camera rotation speed and player walk speed in real-time.

---

## **Demo**
Check out the live demo of the project [here](https://cova-bonica-test.netlify.app/).

### **Video Demo**

![image](https://github.com/user-attachments/assets/0f6974e1-0aea-4eca-88c0-904b106a0c5f)
![image](https://github.com/user-attachments/assets/844465d5-348f-47f1-87aa-c591c5f37577)



---

# Application Workflow

```mermaid
graph TD
    A[Scene] --> B[Canvas]
    A --> C[Physics]
    A --> D[Overlay]

    B --> E[Player]
    B --> F[Cave]
    B --> G[Props]

    C --> E
    C --> F
    C --> G

    D --> H[Settings Panel]
    D --> I[Props Sidebar]
    D --> J[Instructions Panel]

    I --> K[Prop Button]
    I --> L[Return to Start Button]

    K --> M[useTeleportPlayer Hook]
    L --> M
````
---

## **Technologies Used**
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)**: A React renderer for Three.js.
- **[Rapier Physics](https://rapier.rs/)**: A fast and deterministic physics engine.
- **[Three.js](https://threejs.org/)**: A 3D library for rendering and animation.
- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Drei](https://github.com/pmndrs/drei)**: A collection of useful helpers for React Three Fiber.

---

## **Technically Challenging Features**

This project includes several advanced features that required creative problem-solving and deep integration of React, Three.js, and physics engines. Here are the most challenging aspects:

---

### **1. Custom First-Person Camera Controls**
- Implemented smooth, responsive camera rotation using mouse movement deltas.
- Added pitch and yaw clamping to prevent camera flipping.
- Integrated with the `pointerlock` API for a seamless first-person experience.
- Applied damping and smoothing to eliminate jitter during rotation.

---

### **2. Physics-Based Player Movement**
- Integrated `@react-three/rapier` for realistic physics-based movement.
- Implemented custom keyboard controls for player movement (WASD) and jumping.
- Added collision detection and grounded checks to prevent double jumps.
- Synchronized physics updates with the rendering loop for smooth gameplay.

---

### **3. Dynamic Prop System**
- Created a reusable `Prop` component for interactive 3D objects.
- Added hover and click interactions with material highlighting.
- Implemented teleportation logic to move the player to specific prop locations.
- Used `useGLTF` and `Suspense` for efficient model loading and rendering.

---

### **4. Environment Optimization**
- Added a toggle for switching between high-resolution and standard-resolution environments.
- Memoized environment models to prevent unnecessary re-renders.
- Preloaded models to reduce delays when toggling between resolutions.

---

### **5. Performance Optimization**
- Used `useMemo` and `React.memo` to optimize rendering performance.
- Implemented lazy loading for large 3D models to reduce initial load times.
- Added a performance monitor using the `Stats` component from `@react-three/drei`.

---

### **6. Settings and UI Integration**
- Created a centralized `SettingsContext` for managing global settings (e.g., player speed, camera sensitivity).
- Built a dynamic settings panel with sliders and toggles for real-time adjustments.
- Integrated the UI overlay with the 3D scene using `Html` from `@react-three/drei`.

---

### **7. Debugging and Profiling**
- Used the browser’s **Performance** tab to identify and resolve bottlenecks.
- Added debug logs and visual aids (e.g., wireframes, collider visualizations) to troubleshoot issues.
- Tested and optimized the project across multiple devices and browsers.

---

## **Getting Started**
Follow these steps to run the project locally.

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/3d-first-person-movement.git
   ```
2. Navigate to the project directory:
   ```bash
   cd 3d-first-person-movement
   ```
3. Install dependencies:
  ```bash
   npm install
   ```
   or
  ```bash
   yarn install
   ```

### **Running the Project**
Start the development server:
```bash
npm run dev
```
or
```bash
yarn dev
```
Open your browser and navigate to `http://localhost:3000` to view the project.

---

## **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**
- **[React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)**
- **[Rapier Physics Documentation](https://rapier.rs/docs/)**
- **[Three.js Documentation](https://threejs.org/docs/)**

---

## **Contact**
If you have any questions or feedback, feel free to reach out:
- **Your Name** - [nadinaccg@gmail.com](mailto:nadinaccg@gmail.com)
- **GitHub**: [CarlaCGDM](https://github.com/CarlaCGDM)

---

Enjoy exploring the 3D world! 🚀
