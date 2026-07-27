# 🐱 SSCatFacts - Fullstack Cat Facts & Community Ranking App

Aplicación web fullstack desarrollada con **React (Vite)** en el frontend y **Node.js (Express) + PostgreSQL (Prisma ORM)** en el backend. La plataforma permite a los usuarios explorar datos curiosos sobre gatos, registrarse/autenticarse, guardar sus hechos favoritos y participar en un ranking global en tiempo real de los datos más populares de la comunidad.

---

## 🚀 Requisitos Previos y Entorno

Asegúrate de contar con las siguientes herramientas instaladas antes de ejecutar el proyecto:

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Docker** y **Docker Compose** (opcional, para levantar la base de datos PostgreSQL en contenedor)
- **PostgreSQL**: v14+ (si se ejecuta de manera local sin Docker)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```
git clone https://github.com/gchandia/SSCatFacts/
cd SSCatFacts
```

### 2. Variables de entorno
Crea un archivo .env dentro de la carpeta backend/ con la siguiente estructura:
```
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/catfacts_db?schema=public"
JWT_SECRET="tu_clave_secreta_jwt_muy_segura"
NODE_ENV="development"
```
