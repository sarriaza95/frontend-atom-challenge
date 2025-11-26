📝 ATOM Frontend Challenge – Angular 17

Frontend desarrollado para el challenge técnico ATOM – Fullstack, utilizando Angular 17 (Standalone) y conectado al backend construido en Express + Firebase Firestore.

Este proyecto implementa autenticación por correo electrónico y un sistema completo de gestión de tareas con diseño responsivo y manejo de estados.

🚀 Tecnologías utilizadas

Angular 17 (Standalone Components)

Angular Material

Reactive Forms

HttpClient

RXJS

Angular Router + Guards

TypeScript

Arquitectura modular: Core / Shared / Features

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

🔐 Flujo de Autenticación

Login basado únicamente en correo electrónico.

✔ 1. Usuario ingresa su email

Validación con Reactive Forms (required, email).

✔ 2. Verificación del usuario

POST /auth/check

Si existe → iniciar sesión

Si no existe → mostrar diálogo confirmando creación

✔ 3. Creación de nuevo usuario

POST /auth/register

Se guarda en AuthService y localStorage

Redirección a /tasks

✔ 4. Persistencia

El estado de sesión se guarda en:

BehaviorSubject (estado reactivo)

localStorage para sobrevivir refresh

🛡 Protección de rutas

La ruta /tasks está protegida por:

authGuard (CanActivateFn)

Si hay sesión → se permite el acceso

Si NO hay sesión → redirección automática a /login

📝 Gestión de Tareas

La pantalla principal permite:

✔ Crear tareas

Formulario con:

Título obligatorio

Descripción opcional

✔ Listar tareas del backend

GET /users/:userId/tasks

✔ Separación visual por estado

Dos secciones:

Pendientes

Completadas

✔ Contadores automáticos

Ejemplo:

3 pendiente(s) • 5 completada(s)


Cada sección también muestra su propio contador.

✔ Editar tareas

Modo edición dentro del mismo card.
PATCH /users/:id/tasks/:taskId

✔ Completar / descompletar tareas

Checkbox para alternar:
completed: true | false

✔ Eliminar tareas

Incluye confirmación (ConfirmDialogComponent):
DELETE /users/:id/tasks/:taskId

📦 Componentes principales
🔹 LoginPageComponent

Formulario de login

Flujo de check → registro → login

Validaciones

Manejo de diálogos

🔹 TasksPageComponent

Orquestador del CRUD

Carga tareas del usuario

Separación pendientes/completadas

Contadores

Logout

🔹 TaskFormComponent

Form para crear tareas

🔹 TaskItemComponent

Vista individual de una tarea

Editar

Completar / descompletar

Eliminar

🔹 ConfirmDialogComponent

Diálogo reusable para confirmar acciones

🔗 Comunicación con el backend

Basado en environment.ts:

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};


Servicios:

AuthService → /auth/check, /auth/register

TaskService → /users/:id/tasks

Registrado en app.config.ts:

providers: [
  provideHttpClient()
]

🎨 UI / UX

Angular Material como base visual

Diseño responsivo (mobile + desktop)

Separación visual de tareas por estado

Estados vacíos amigables:

“No tienes tareas pendientes. 🎉”

Indicadores de carga y error

▶️ Cómo correr el proyecto
1. Instalar dependencias
npm install

2. Verificar environment

src/environments/environment.ts:

apiBaseUrl: 'http://localhost:3000/api'

3. Levantar la app
ng serve -o


Abrirá automáticamente en:

👉 http://localhost:4200

🎯 Extras / Mejoras implementadas

Separación visual en Pendientes y Completadas

Contadores dinámicos por estado

Componente genérico de confirmación

Arquitectura escalable y limpia

Persistencia de sesión en localStorage

Diseño Material moderno

🏁 Estado del proyecto
Funcionalidad	Estado
Login por correo	✅
Registro	✅
Persistencia local	✅
Guard de autenticación	✅
Crear tareas	✅
Listar tareas	✅
Editar tareas	✅
Marcar completada	✅
Eliminar con confirmación	✅
UI responsiva	✅
Mejora visual (pendientes/completadas)	✅