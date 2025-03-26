# **3D First-Person Movement Prototype**

Welcome to the **3D First-Person Movement Prototype**! This project is a demonstration of first-person movement and camera controls in a 3D environment using **React Three Fiber**, **Rapier Physics**, and **Three.js**. It includes features like walking, looking around, interacting with objects, and teleporting to specific locations.

---

## **Features**

- **Interactive Props**: Click on objects to interact with them and view descriptions.
- **Teleportation**: Teleport to specific locations near props or return to the starting position.
- **Dynamic Settings**: Adjust camera rotation speed and player walk speed in real-time.

---

## **Demo**
Check out the live demo of the project [here](https://cova-bonica-test.netlify.app/).

## **Features**

- ### **First-Person Movement and Camera**
Move around the environment using `WASD` or arrow keys.

Look around by holding the right mouse button.

![progress_walking-ezgif com-resize](https://github.com/user-attachments/assets/63cc4e26-b97a-4c41-9c41-4f531125b718) ![progress_camera-ezgif com-resize](https://github.com/user-attachments/assets/1d8d8399-be62-4c1c-a3e2-45b222dd4786)

- ### **Interactive Props**
Teleport between and click on 3D objects to interact with them.

![progress_teleport-ezgif com-optimize](https://github.com/user-attachments/assets/2a631220-7b8b-42b0-b33b-d79889e1b5e3) ![progress_props-ezgif com-optimize](https://github.com/user-attachments/assets/630b4578-e513-465e-ac87-78be8c335633) 

- ### **Interactive Landmarks**
Click on points of interest in the environment to view additional information.

![progress_pointsofinterest-ezgif com-optimize](https://github.com/user-attachments/assets/a5d3e6f9-30c7-46c7-8b39-02cf69a302c0)

- ### **NPCs Pathfinding**
Watch NPCs roam around the virtual tour and make comments on what they see.

![progress_pathfinding-ezgif com-optimize](https://github.com/user-attachments/assets/6c0cea66-bbaf-4cfa-ac66-a9e77970ead6)


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

## **Contact**
If you have any questions or feedback, feel free to reach out:
- **Your Name** - [nadinaccg@gmail.com](mailto:nadinaccg@gmail.com)
- **GitHub**: [CarlaCGDM](https://github.com/CarlaCGDM)

---

Enjoy exploring the 3D world! 🚀
