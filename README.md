🧩 ATOM Frontend Challenge – Angular 17

Frontend desarrollado como parte del ATOM Fullstack Challenge, utilizando Angular 17 (Standalone Components) y conectado a un backend en Express + Firebase Firestore, desplegado en Render debido a restricciones del plan gratuito de Firebase.

La app implementa autenticación por correo electrónico, manejo completo de tareas y una interfaz moderna, responsiva y escalable.

⚠️ Nota Importante — Backend desplegado en Render

El reto inicialmente solicitaba desplegar el backend en Firebase Cloud Functions, sin embargo:

El proyecto usa el plan Spark (gratuito).

Cloud Functions requiere habilitar Cloud Build, disponible solo en el Plan Blaze (requiere tarjeta).

Por lo tanto, no es posible desplegar Functions sin actualizar el plan.

Para mantener el proyecto 100% funcional y accesible sin costos adicionales, el backend se desplegó en:

✅ Render (gratuito), con Node.js + Express + Firestore

Se conservó la misma estructura, endpoints y comportamiento solicitados.

🚀 Demo Online

Frontend (Firebase Hosting):
👉 URL cuando esté publicado

Backend (Render):
👉 URL del API (por ejemplo: https://todo-api-xxxx.onrender.com/api
)

📌 Tecnologías utilizadas
Frontend

Angular 17 (Standalone Components)

Angular Material

Reactive Forms

HttpClient

RxJS (BehaviorSubject)

Angular Router + Guards

TypeScript

Arquitectura modular Core / Shared / Features

Backend (consumido por este frontend)

Node.js + Express

Firebase Admin SDK

Firestore (DB NoSQL)

Deploy: Render Web Service

📁 Estructura del proyecto
src/app
  core/
    models/            → user.model.ts, task.model.ts
    services/          → auth.service.ts, task.service.ts
    guards/            → auth.guard.ts

  shared/
    components/
      confirm-dialog/
      task-item/

  features/
    auth/
      pages/
        login-page/
    tasks/
      components/
        task-form/
      pages/
        tasks-page/

environments/
  environment.ts
  environment.prod.ts


Arquitectura limpia, escalable y basada en componentes independientes.

🔐 Flujo de Autenticación
✔ 1. Usuario ingresa su email

Con Reactive Forms:

required

email

✔ 2. Verificación de usuario

POST /auth/check

Si existe → iniciar sesión

Si no existe → abrir diálogo confirmando creación

✔ 3. Registro de nuevo usuario

POST /auth/register

Se resuelve en el backend (Firestore)

Se guarda el usuario en:

AuthService (BehaviorSubject)

localStorage

✔ 4. Persistencia de sesión

Se mantiene tras recargar la página

Se recarga automáticamente desde localStorage

🛡 Protección de rutas

La ruta /tasks está protegida por un guard:

authGuard (CanActivateFn)


Si hay sesión → acceso permitido

Si NO hay sesión → redirección a /login

📝 Gestión de tareas

La pantalla principal permite:

✔ Crear tareas

Campos:

Título (obligatorio)

Descripción (opcional)

✔ Listar tareas desde backend

GET /users/:userId/tasks

✔ Separación visual por estado

Secciones:

Pendientes

Completadas

✔ Contadores automáticos

Ejemplo:

3 pendiente(s) • 5 completada(s)


Cada sección también tiene su contador propio.

✔ Editar tareas

PATCH /users/:id/tasks/:taskId

✔ Completar / descompletar

Switch o checkbox

Actualiza: completed: true | false

✔ Eliminar tareas

Incluye confirmación:

DELETE /users/:id/tasks/:taskId

📦 Componentes principales
🔹 LoginPageComponent

Formulario de login

Validaciones

Diálogos de confirmación

Flujo check → create → login

🔹 TasksPageComponent

Orquestador del CRUD

Carga tareas del backend

Separa pendientes/completadas

Contadores

Logout

🔹 TaskFormComponent

Formulario para crear tarea

🔹 TaskItemComponent

Card individual de tarea

Editar

Completar/descompletar

Eliminar

🔹 ConfirmDialogComponent

Reusable

Confirmación de acciones críticas

🔗 Comunicación con el backend

environment.ts:

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};


environment.prod.ts debe apuntar al backend en Render:

export const environment = {
  production: true,
  apiBaseUrl: 'https://todo-api-xxxxx.onrender.com/api'
};

Servicios:

AuthService →
/auth/check, /auth/register

TaskService →
/users/:id/tasks, /tasks/:taskId

🎨 UI / UX

Angular Material

Diseño mobile-first

Separación clara de tareas por estado

Estados vacíos amigables:

“No tienes tareas pendientes. 🎉”

Notificaciones básicas

Indicadores de carga

▶️ Cómo correr el proyecto
1. Instalar dependencias
npm install

2. Configurar environment

src/environments/environment.ts

apiBaseUrl: 'http://localhost:3000/api'

3. Ejecutar en modo dev
ng serve -o


Se abrirá en:
👉 http://localhost:4200

🏗️ Build para producción
ng build --configuration production


Salida:

dist/atom-challenge-fe-template/browser/

☁️ Deploy en Firebase Hosting

Asegurar firebase.json:

{
  "hosting": {
    "public": "dist/atom-challenge-fe-template/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}


Deploy:

firebase deploy --only hosting

🎯 Extras / Mejoras Implementadas

Separación visual de tareas pendientes/completadas

Contadores reactivos por estado

Logout limpio

Arquitectura modular escalable

Guard de autenticación

Persistencia en localStorage

UI moderna con Angular Material

🏁 Estado final del proyecto
Funcionalidad	Estado
Login con email	✅
Registro automático	✅
Persistencia local	✅
Guard de auth	✅
Crear tareas	✅
Listar tareas	✅
Editar tareas	✅
Marcar como completada	✅
Eliminar con confirmación	✅
UI responsiva	✅
Mejoras visuales	✅
👨‍💻 Autor

Desarrollado por José Arriaza
Full Stack Developer – Angular | Next.js | Node.js | Firebase | AWS