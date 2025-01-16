# Dockerized Node.js App

This project sets up a **Node.js** application using **Docker**. It includes volume management for persistent `node_modules`, file changes detection, and exposes the app for development at `localhost:8080`.

---

## 🛠️ Features
- **Dockerized Development**: Simplifies the setup and ensures a consistent environment.
- **Hot Reloading**: Enabled via `CHOKIDAR_USEPOLLING=true` for live file updates.
- **Volume Management**: Separates `node_modules` from host files for better performance.
- **Expose for External Access**: Serves the app at `http://localhost:8080`.

---

## 🏗️ Project Structure

- **Dockerfile**: Builds a lightweight Node.js image for the app.
- **docker-compose.yml**: Manages services, volumes, and configurations.
- **Volumes**: Mounts your working directory (`/app`) and `node_modules`.

---

## 📦 Setup Instructions

### Prerequisites
1. Install [Docker](https://www.docker.com/).
2. Install [Docker Compose](https://docs.docker.com/compose/).

---

### 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>

2. Build the docker image
    ```bash
   docker compose up --build
3. Access your app:

    Open your browser and navigate to: http://localhost:8080

4. Stop the container when done:
    ```bash
   docker compose down
