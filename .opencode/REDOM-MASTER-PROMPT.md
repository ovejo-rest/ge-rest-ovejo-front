# REDOM Master Prompt — Frontend Architecture & Rules

> Este archivo define la arquitectura, patrones y reglas para todo el desarrollo del frontend REDOM.
> Debe ser consultado antes de cualquier implementación.

## Stack
- Angular 19, Angular Material 19.x
- Standalone Components cuando corresponda
- Tailwind CSS, SCSS, TypeScript
- NX monorepo, JWT auth, Guards, Permission-based authorization

## Arquitectura por feature
```
modules/{feature}/
├── {feature}.module.ts
├── {feature}-routing.module.ts
├── {feature}.component.ts/.html
├── pages/{page}/
│   ├── {page}.component.ts/.html  (SMART — orquesta)
│   ├── data-access/               (servicios HTTP)
│   ├── features/                  (DUMB — tabla, modales)
│   └── ui/                        (filtros, skeletons)
```

## Principios clave
1. Smart/Dumb: Pages orquestan, features reciben inputs y emiten outputs
2. Data Access: Todo HTTP en data-access/, nunca en componentes
3. DTOs locales por feature, sin `any`
4. Lazy loading en todos los módulos
5. Permisos controlan rutas, botones, acciones
6. Estados UI: loading, empty, error, success
7. Modales CRUD: CreateModal, UpdateModal, DeleteModal
8. Reactive Forms con validación
9. Tablas con paginación, loading, empty state
10. Reutilizar componentes existentes (Button, ModalCard, Table, etc.)

## Flujo de datos
```
API → Data Access Service → Smart Page → Dumb Component
```

## Orden de implementación
1. Dashboard base
2. Tables
3. Orders
4. Payments
5. POS
6. Printers
7. Preparation stations
8. Kitchen / KDS
9. Sectors
10. Schedules
11. Customers
12. Bookings
13. Inventory
14. CRM
15. Loyalty
16. Analytics
