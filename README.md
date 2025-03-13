# **3D First-Person Movement Prototype**

Welcome to the **3D First-Person Movement Prototype**! This project is a demonstration of first-person movement and camera controls in a 3D environment using **React Three Fiber**, **Rapier Physics**, and **Three.js**. It includes features like walking, looking around, and interacting with objects in the scene.

---

## **Features**
- **First-Person Movement**: Move around the environment using `WASD` or arrow keys.
- **Camera Controls**: Look around by holding the right mouse button.
- **Physics-Based Collisions**: Realistic collisions with walls, slopes, and other objects.
- **Interactive Props**: Click on objects to interact with them.

---

## **Demo**
Check out the live demo of the project [here](https://threejs-first-person-movement.netlify.app/).

### **Video Demo**
![fpm_01](https://github.com/user-attachments/assets/e24b0678-8104-46e1-8d7d-6975e91db65e)
![fpm_02-ezgif com-optimize (1)](https://github.com/user-attachments/assets/3e952ef4-0183-43ea-8e68-ae589752fce8)


---


## **Technologies Used**
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)**: A React renderer for Three.js.
- **[Rapier Physics](https://rapier.rs/)**: A fast and deterministic physics engine.
- **[Three.js](https://threejs.org/)**: A 3D library for rendering and animation.
- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.

---

## **Technical Challenges**
This project presented several interesting technical challenges, which were overcome with creative solutions:

### **1. Camera Jittering**
- **Problem**: When moving and rotating the camera simultaneously, the screen would jitter due to unsynchronized updates between the physics engine and rendering loop.
- **Solution**: The camera was attached to the player as a child object, ensuring that its position and rotation updates were synchronized. Additionally, the physics engine was stepped manually in the `useFrame` loop to ensure consistent updates.

### **2. Roll in Camera Rotation**
- **Problem**: Accumulating rotations directly using quaternions introduced unintended roll (twisting around the view axis), causing the horizon to skew.
- **Solution**: Instead of accumulating rotations directly, pitch and yaw angles were stored separately and converted into quaternions only when applying the rotation to the camera. This eliminated roll and ensured smooth, stable rotations.

### **3. RigidBody Sleeping**
- **Problem**: The player's `RigidBody` would go to sleep after inactivity, causing movement to stop unexpectedly.
- **Solution**: The `RigidBody` was explicitly woken up in the `useFrame` loop whenever movement or rotation was detected, ensuring it remained active and responsive.

### **4. Continuous Camera Rotation**
- **Problem**: The camera would stop rotating when the mouse stopped moving, even if the right mouse button was still held down.
- **Solution**: The rotation logic was updated to accumulate rotation based on the mouse position relative to the screen center, allowing continuous rotation while the mouse button was held down.

### **5. Focus Management**
- **Problem**: Keyboard input would stop working after interacting with the canvas using the mouse, as the canvas would lose focus.
- **Solution**: The canvas was explicitly focused on mouse interactions using the `onPointerDown` event, ensuring it retained focus and continued to capture keyboard events.

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

## **Project Structure**
Here’s an overview of the project structure:
```
src/
├── components/        # React components (e.g., Player, Ground, Props)
├── context/           # Context providers and hooks (e.g., SettingsContext)
├── hooks/             # Custom hooks (e.g., useCustomKeyboardControls)
├── setup/             # Setup files for props, levels, etc.
├── utils/             # Utility functions and helpers
├── App.js             # Main application component
└── main.js            # Entry point for the app
```

---

## **Customization**
You can customize the following settings in real time using the overlay:
- **Camera Rotation Speed**: Adjust how fast the camera rotates when looking around.
- **Player Walk Speed**: Adjust how fast the player moves.

---

## **Contributing**
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

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
- **Your Name** - [your.email@example.com](mailto:your.email@example.com)
- **GitHub**: [your-username](https://github.com/your-username)

---

Enjoy exploring the 3D world! 🚀
