# Database Setup Guide - PostgreSQL & pgvector

This document provides a step-by-step guide to installing Docker Desktop on Windows, running our containerized **pgvector** database, and configuring Prisma to connect to it.

---

## 1. Why Docker for PostgreSQL + pgvector?
Our ecosystem relies on high-dimensional semantic search to query Jungian archetypes and journal vectors. This requires the **pgvector** extension.
- **Natively on Windows:** Compiling and installing `pgvector` for native Windows PostgreSQL requires MSVC tools, C++ compilers, and manual folder mapping, which is highly error-prone.
- **Via Docker:** The official `pgvector/pgvector:pg16` Docker image provides a pre-packaged, highly optimized environment with the extension fully built-in and ready to go.

---

## 2. Docker Desktop Installation (Manual Windows Guide)

### Step A: Verify Hardware Virtualization
1. Open **Task Manager** (`Ctrl + Shift + Esc`).
2. Go to the **Performance** tab and select **CPU**.
3. Look for **Virtualization** in the bottom-right corner. It **must** show **Enabled**.
   *(If disabled, you must reboot your PC, enter the BIOS/UEFI settings, and enable Intel Virtualization Technology (VT-x) or AMD-V/SVM).*

### Step B: Install Docker Desktop
Choose **one** of the following methods to install:
* **Option 1: Graphical Installer (Easiest)**
  1. Download the installer from the official website: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
  2. Run the `.exe` installer.
  3. Ensure the option **"Use WSL 2 instead of Hyper-V (recommended)"** is checked.
  4. Follow the installer and restart your computer when prompted.
* **Option 2: Windows Package Manager (CLI)**
  Open PowerShell as **Administrator** and run:
  ```powershell
  winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
  ```
  *Restart your computer after installation completes.*

### Step C: Verify Installation
Once rebooted, start Docker Desktop from the Start Menu. Open PowerShell and run:
```powershell
docker --version
docker compose version
```

---

## 3. Running the pgvector Database Container

Our project is pre-configured with a compliant `docker-compose.yml` in the project root.

### Step 1: Start the Database Container
Navigate to the project root directory (`C:\Users\Zun`) in your terminal and run:
```powershell
docker compose up -d
```
*This will pull the official pgvector image, create the `arttech_therapy_db` container, mount a persistent volume (`postgres_data`), and run the service in the background.*

### Step 2: Verify the Container Status
To check if the database is running and healthy:
```powershell
docker compose ps
```
To view the real-time startup and connection logs:
```powershell
docker compose logs -f db
```

### Step 3: Stop the Database Container
To stop the database without losing your stored data:
```powershell
docker compose down
```

---

## 4. Configuring Prisma to Connect

### Step A: Initialize the `.env` file
Create a file named `.env` in the project root (`C:\Users\Zun\.env`) and configure the connection string to match the settings in `docker-compose.yml`:

```env
# Database connection URL for Prisma
DATABASE_URL="postgresql://therapy_user:therapy_secure_password_2026@localhost:5432/arttech_therapy?schema=public"
```

### Step B: Enable pgvector Extension (Prisma Migrations)
When configuring Prisma schemas, the `postgresql` provider supports native PostgreSQL vectors.

To ensure the extension is enabled inside the database, include a custom migration or run the following SQL command inside your database client (or via a raw query):
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

With Prisma, you can enable the preview feature in your `schema.prisma`:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}
```

---

## 5. Troubleshooting Common Issues

### Issue 1: Port `5432` is already in use
* **Cause:** You might have an existing native installation of PostgreSQL running on your machine.
* **Solution:** Either stop the local PostgreSQL Windows service (`Stop-Service -Name postgresql-x64-*`) or modify the host port mapping in [docker-compose.yml](file:///C:/Users/Zun/docker-compose.yml) (e.g., change `'5432:5432'` to `'5433:5432'`) and update your `.env` connection string to port `5433`.

### Issue 2: WSL 2 installation is incomplete
* **Cause:** Windows requires the WSL2 Linux kernel update package.
* **Solution:** Open PowerShell as Administrator and run `wsl --update`, or follow the instructions in the prompt to download the update package from Microsoft.
