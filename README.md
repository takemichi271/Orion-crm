# 🔵 OrionCRM - Sistema de Gestión de Empleados

## 📋 Descripción General

**OrionCRM** es una aplicación web moderna desarrollada con Angular 19 que permite gestionar empleados y sus direcciones de forma eficiente. El sistema está diseñado con **Firebase Realtime Database** como backend, proporcionando una solución escalable y en tiempo real para la administración de recursos humanos.

### Características Principales

✅ **Gestión de Empleados**

- Crear, leer, actualizar y eliminar empleados
- Seguimiento del estado de empleados (Activo, Pendiente, Inactivo)
- Asignación de empleados a usuarios
- Información de contacto (email, teléfono)

✅ **Gestión de Direcciones**

- Agregar múltiples direcciones por empleado
- Modificar información de direcciones
- Organización estructurada de datos de ubicación

✅ **Control y Seguridad**

- Validación de datos en tiempo real
- Manejo robusto de errores
- Confirmación de acciones críticas
- Notificaciones visuales con SweetAlert2

✅ **Interfaz Responsiva**

- Diseño moderno con Tailwind CSS
- Dashboard intuitivo
- Experiencia de usuario mejorada

---

## 🏗️ Arquitectura y Estructura del Proyecto

```
OrionCRM/
├── src/
│   ├── app/
│   │   ├── app.module.ts                 # Módulo principal con Firebase
│   │   ├── app-routing.module.ts         # Rutas principales
│   │   ├── app.component.*               # Componente inicio
│   │   ├── Model/                        # Modelos de datos
│   │   │   └── employee.model.ts         # Interfaz y clase Employee
│   │   ├── manage/                       # Módulo de gestión
│   │   │   ├── manage.component.*        # Dashboard principal
│   │   │   ├── services/
│   │   │   │   ├── database.service.ts   # Operaciones base de datos Firebase
│   │   │   │   └── alert.service.ts      # Gestión de notificaciones
│   │   │   ├── employee/                 # Listado de empleados
│   │   │   ├── employee-control/         # Control de empleados
│   │   │   ├── new-employee/             # Crear nuevos empleados
│   │   │   └── new-address/              # Agregar direcciones
│   │   └── utils/
│   │       ├── constants.ts              # Constantes de la app
│   │       └── id-generator.ts           # Generador de IDs
│   ├── assets/                           # Recursos estáticos
│   └── main.ts                           # Punto de entrada

├── package.json                          # Dependencias
├── angular.json                          # Configuración Angular
├── tsconfig.json                         # Configuración TypeScript
└── firebase.json                         # Configuración Firebase
```

---

## 💎 Principios de Clean Code Implementados

### 1. **Código Limpio y Legible**

- Nombres descriptivos y significativos para variables, funciones y clases
- Funciones pequeñas con responsabilidad única
- Evitar código duplicado (DRY - Don't Repeat Yourself)
- Comentarios apropiados donde es necesario

### 2. **SOLID Principles**

- **Single Responsibility:** Cada servicio/componente tiene una única responsabilidad
  - `DbService`: Maneja todas las operaciones de base de datos
  - `AlertService`: Gestiona todas las notificaciones
  - Componentes específicos para cada funcionalidad
- **Open/Closed:** Código abierto a extensión, cerrado a modificación
- **Dependency Injection:** Uso extensivo de inyección de dependencias de Angular

### 3. **Manejo de Errores Robusto**

```typescript
// Validación de parámetros
if (!path) {
  return throwError(() => new Error('Path is required'));
}

// Captura y manejo de excepciones
.pipe(catchError((err) => this.handleError(err)))
```

### 4. **Tipado Fuerte con TypeScript**

- Interfaces bien definidas (`IEmployee`)
- Clases tipadas (`Employee`)
- Tipos genéricos en servicios (`<T>`)
- Tipos de parámetros explícitos

### 5. **Patrones de Diseño**

- **Singleton:** Servicios inyectables a nivel raíz
- **Observable Pattern:** Manejo reactivo de datos con RxJS
- **Modular Architecture:** Separación en módulos feature

### 6. **Modularidad**

- Cada funcionalidad en su propio módulo
- Lazy loading de módulos según necesidad
- Reutilización de código mediante servicios compartidos

### 7. **Testing Ready**

- Código preparado para pruebas unitarias
- Inyección de dependencias para mockeo
- Archivos `.spec.ts` para cada componente

---

## 🛠️ Tecnologías Utilizadas

| Tecnología        | Versión  | Propósito                    |
| ----------------- | -------- | ---------------------------- |
| **Angular**       | 19.2.0   | Framework principal          |
| **TypeScript**    | 5.7.2    | Lenguaje de programación     |
| **Firebase**      | -        | Base de datos en tiempo real |
| **Tailwind CSS**  | 4.1.18   | Estilos y diseño responsivo  |
| **RxJS**          | 7.8.0    | Programación reactiva        |
| **SweetAlert2**   | 11.26.18 | Alertas y confirmaciones     |
| **Karma/Jasmine** | -        | Testing                      |

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta Firebase configurada

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd orion-crm
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar Firebase**

- Las credenciales están configuradas en `app.module.ts`
- Base de datos: `https://test-tecnico-orion-default-rtdb.firebaseio.com`

---

## 📦 Comandos Disponibles

### Desarrollo

```bash
npm start
# o
ng serve
```

Inicia el servidor de desarrollo en `http://localhost:4200/`

### Producción

```bash
npm run build
# o
ng build
```

Compila el proyecto para producción en `dist/`

### Testing

```bash
npm test
# o
ng test
```

Ejecuta pruebas unitarias con Karma

### Watch Mode

```bash
npm run watch
# o
ng build --watch --configuration development
```

Recompila automáticamente en cambios

---

## 📋 Servicios Principales

### Database Service (`DbService`)

Servicio centralizado para todas las operaciones con Firebase:

- `list<T>(path)` - Obtener lista de elementos
- `object<T>(path)` - Obtener un objeto
- `getListByEqualTo<T>(path, field, value)` - Filtrar por valor
- `set(path, data)` - Crear/reemplazar datos
- `push(path, data)` - Agregar nuevo elemento
- `update(path, data)` - Actualizar datos
- `remove(path)` - Eliminar datos
- `on(path, callback)` - Escuchar cambios en tiempo real
- `once(path, callback)` - Obtener datos una sola vez

### Alert Service (`AlertService`)

Gestión de notificaciones visuales:

- `success(message)` - Notificación de éxito
- `error(message)` - Notificación de error
- `info(message)` - Notificación informativa
- `confirm(title, message)` - Confirmación con diálogo
- `successBack(message)` - Éxito y navegar atrás

---

## 🎯 Modelo de Datos

### Employee

```typescript
interface IEmployee {
  id: string; // ID único
  employeeName: string; // Nombre completo
  role: string; // Rol/puesto
  initials: string; // Iniciales
  status: "Active" | "Pending" | "Inactive"; // Estado
  email: string; // Email
  phone: string; // Teléfono
  assignedTo: string; // Asignado a usuario
  addresses: any; // Dirección(es)
  mode: string; // Modo
}
```

---

## ✨ Características de Calidad

✅ Validación de entrada en servicios
✅ Manejo centralizado de errores
✅ Tipos TypeScript estrictos
✅ Componentes reutilizables
✅ Inyección de dependencias
✅ Observables para operaciones asincrónicas
✅ Código documentado y comentado
✅ Estructura modular y escalable

---

## 📄 Licencia

Este proyecto fue desarrollado con estándares profesionales de desarrollo de software.

---

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas. Los cambios deben seguir los principios de Clean Code establecidos en el proyecto.
