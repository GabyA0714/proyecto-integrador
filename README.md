# Espacio Senda — Sistema de Gestión de Turnos

Sistema de gestión de turnos para un centro de salud, desarrollado como Proyecto Integrador de 3er año.

## Tecnologías utilizadas

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Control de versiones:** Git & GitHub

  
## Estructura del proyecto
```
/
├── estetica-backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── app.js
│
└── estetica-frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   └── api/
    └── index.html
```

## Requisitos previos

Antes de instalar el proyecto, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [PostgreSQL](https://www.postgresql.org/download/) (v15 o superior)
- [Git](https://git-scm.com/)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/GabyA0714/proyecto-integrador.git
cd proyecto-integrador
```

### 2. Configurar la base de datos

Abrí pgAdmin o psql y creá la base de datos:

```sql
CREATE DATABASE espacio_senda;
```

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Creá el archivo `.env` dentro de la carpeta `backend/`:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/espacio_senda"
PORT=3000
```

Ejecutá las migraciones para crear las tablas:

```bash
npx prisma migrate dev --name init
```

Iniciá el servidor:

```bash
npm start
```

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
npm start
```

## Uso

Una vez iniciados ambos servidores:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## Funcionalidades

- Autenticación con roles (Administrador, Recepcionista, Profesional)
- Gestión de profesionales, pacientes y servicios
- Reserva y gestión de turnos
- Registro de pagos y señas
- Recordatorios automáticos
- Sincronización con Google Calendar

## Notas

Proyecto académico con fines educativos.
