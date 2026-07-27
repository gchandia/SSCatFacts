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
Crea un archivo .env dentro de la carpeta frontend/:
```
VITE_API_URL="http://localhost:3000/api"
```

## 🐘 Base de Datos (PostgreSQL + Prisma)
Si cuentas con Docker, puedes levantar la base de datos PostgreSQL rápidamente:
```
docker run --name catfacts-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=catfacts_db -p 5432:5432 -d postgres
```
Una vez levantada la base de datos, ejecuta la migración y la generación del cliente de Prisma en la carpeta backend:
```
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

## 💻 Ejecución del Proyecto

### 1. Iniciar el Backend
Desde la carpeta /backend:
```
npm run dev
```
El servidor backend se ejecutará en: http://localhost:3000

### 2. Iniciar el Frontend
En otra terminal, desde la carpeta /frontend:
```
npm install
npm run dev
```
La aplicación web estará disponible en: http://localhost:5173

## 🧪 Ejecución de Tests
El proyecto cuenta con pruebas unitarias e integración en ambos extremos.

### Pruebas del Backend (Jest + Supertest)
```
cd backend
npm test
```

### Pruebas del Frontend (Vitest + React Testing Library)
```
cd frontend
npm test
```

## 📐 Arquitectura del Sistema
El proyecto sigue una Arquitectura en Capas para desacoplar responsabilidades y facilitar el mantenimiento y la escalabilidad del sistema.
```
SSCatFacts/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores HTTP (Manejo de Request/Response)
│   │   ├── services/         # Lógica de Negocio y acceso a APIs externas/BD
│   │   ├── routes/           # Definición de rutas Express
│   │   ├── middlewares/      # Middlewares de Autenticación (JWT) y Validación
│   │   └── lib/              # Instancia compartida de Prisma Client
│   └── prisma/               # Esquema de Base de Datos y Migraciones
└── frontend/
    ├── src/
    │   ├── context/          # Estado global de autenticación (AuthContext)
    │   ├── services/         # Capa de consumo de API (Axios client)
    │   └── __tests__/        # Pruebas unitarias y de integración
```

## 🎯 Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP) - Principio de Responsabilidad Única
- Backend: Los Controllers se encargan únicamente de recibir las peticiones HTTP y retornar respuestas con sus respectivos códigos de estado. La lógica compleja de consulta y agrupación a PostgreSQL reside de manera aislada en FactsService.

- Frontend: La comunicación HTTP con la API está delegada exclusivamente a catfacts.service.ts, manteniendo los componentes de React orientados a la presentación y estado de la interfaz.

### 2. Open/Closed Principle (OCP) - Principio de Abierto/Cerrado
Los servicios de consulta están diseñados para extenderse sin modificar el código core existente. Por ejemplo, FactsService.getPopularFacts(limit) acepta un límite de resultados dinámico, permitiendo reutilizar el servicio para paginaciones o rankings más amplios sin alterar su implementación.

### 3. Liskov Substitution Principle (LSP) - Principio de Sustitución de Liskov
Se utilizaron interfaces estrictas en TypeScript para los contratos de datos (PopularFactResponse, AuthResponse, Fact). Cualquier módulo que implemente estas interfaces puede ser sustituido por un mock durante las pruebas de integración sin romper el comportamiento esperado del sistema.

### 4. Interface Segregation Principle (ISP) - Principio de Segregación de Interfaces
En lugar de manejar un objeto global e inflado para el usuario o los hechos, se crearon tipos e interfaces pequeñas y específicas para cada contexto (ej. UserPayload para JWT, PopularFact para la vista de ranking y Fact para la lista personal).

### 5. Dependency Inversion Principle (DIP) - Principio de Inversión de Dependencias
Los controladores y servicios no crean instancias locales dispersas de la base de datos; consumen un singleton centralizado e inyectable de PrismaClient desde src/lib/prisma.ts, facilitando el mocking durante la ejecución de los tests automáticos sin golpear la base de datos real.

## 🛡️ Características Principales
- Consumo de API Externa: Integración con la API pública de Cat Facts.
- Autenticación Segura: Registro e inicio de sesión con hash de contraseñas (bcrypt) y tokens JWT.
- Persistencia de Likes: Tabla relacional en PostgreSQL mediante Prisma ORM asociando usuarios y hechos.
- Ranking en Tiempo Real: Agrupación y conteo dinámico (groupBy) del Top 5 de la comunidad.
- UI Responsiva y Feedback: Notificaciones, badges de posición y estados de carga en React.

---

## 🔮 Trabajo Futuro (Roadmap)

Con el objetivo de seguir evolucionando la plataforma y mejorar la experiencia de usuario y mantenibilidad del código, se proponen las siguientes mejoras para versiones futuras:

### 🌐 Frontend & Experiencia de Usuario
- **Limpieza de código:** Aplicar separación de componentes para mejor legibilidad del código.
- **Paginación e Infinite Scroll:** Implementar scroll infinito en la sección de datos guardados y explorar más allá del Top 5 de la comunidad.
- **Internacionalización (i18n):** Integrar soporte multi-idioma (Español/Inglés) para traducir automáticamente los datos traídos desde la API externa.
- **Categorización y Búsqueda:** Permitir a los usuarios filtrar hechos por longitud, buscar palabras clave o etiquetar sus favoritos por categorías.

### ⚡ Backend & Arquitectura
- **Rate Limiting / Limite de Peticiones:** Implementar un middleware de limitación de tasa (usando `express-rate-limit` o Redis) para prevenir abuso de la API pública y mitigar ataques DoS.
- **Caché con Redis:** Implementar una capa de almacenamiento en caché para la consulta de `/facts/popular`, reduciendo la carga de consultas de agrupación (`groupBy`) en PostgreSQL.
- **WebSockets / Server-Sent Events (SSE):** Actualizar el Top 5 de la comunidad en tiempo real mediante WebSockets (Socket.io) para que los likes de otros usuarios se reflejen instantáneamente sin recargar la página.

### 🧪 DevOps & CI/CD
- **Pipeline de GitHub Actions:** Configurar un flujo de CI/CD para ejecutar automáticamente la suite de pruebas (`npm test`) y el linter en cada *Pull Request*.
- **Contenerización Completa:** Crear un `docker-compose.yml` multi-stage que levante frontend, backend y PostgreSQL con un solo comando (`docker-compose up`).
