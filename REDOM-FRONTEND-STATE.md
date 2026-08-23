# REDOM — AUDITORÍA TÉCNICA DEL FRONTEND

> **Fecha de auditoría:** 10 de agosto de 2026
> **Versión del proyecto:** 0.10.1
> **Nombre interno del proyecto:** `gc-backoffice-front`
> **Display name:** "Ge Rest"

---

# 1. RESUMEN EJECUTIVO

El frontend de REDOM es una aplicación Angular 19 standalone (bootstrapApplication) con arquitectura modular por features, librería de UI con Atomic Design, Tailwind CSS v4, Angular Material y ApexCharts. Está desplegada en Netlify con backend serverless en AWS Lambda (API Gateway).

**Estado general:** La aplicación tiene implementado el core de autenticación, gestión de negocios (restaurantes), administración RBAC (roles, permisos, módulos, usuarios) y perfil de usuario. El dashboard contiene contenido placeholder/demo (NFT). No están implementados: mesas, productos, pedidos, reservas, inventario, recetas, POS, cocina, QR, carta pública, clientes ni split payment.

---

# 2. ESTRUCTURA DEL PROYECTO

```
gc-backoffice-front/
├── .angular/
├── .editorconfig
├── .eslintrc.json
├── .git/
├── .gitignore
├── .postcssrc.json
├── .prettierignore
├── .prettierrc
├── .vscode/
├── angular.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── dist/
├── karma.conf.js
├── LICENSE (MIT)
├── netlify.toml
├── node_modules/
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app-routing.module.ts
│   │   ├── core/                          # Singleton services, guards, interceptors
│   │   │   ├── index.ts
│   │   │   ├── constants/
│   │   │   │   └── menu.ts               # Configuración estática de menú lateral
│   │   │   ├── dtos/
│   │   │   │   ├── index.ts
│   │   │   │   └── card-menu-routes.dto.ts
│   │   │   ├── guards/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.guard.ts          # Guard funcional de autenticación
│   │   │   │   ├── permission.guard.ts    # Guard funcional de permisos
│   │   │   │   └── role.guard.ts          # Guard funcional de roles
│   │   │   ├── interceptor/
│   │   │   │   ├── .gitkeep
│   │   │   │   ├── index.ts
│   │   │   │   └── auth.interceptor.ts    # Interceptor funcional HTTP (JWT + refresh)
│   │   │   ├── models/
│   │   │   │   ├── menu.model.ts          # MenuItem, SubMenuItem interfaces
│   │   │   │   └── theme.model.ts         # Theme interface
│   │   │   ├── services/
│   │   │   │   ├── avatar.service.ts      # Generador de avatares vía ui-avatars.com
│   │   │   │   ├── theme.service.ts       # Gestión de tema (dark/light + 7 colores)
│   │   │   │   ├── theme.service.spec.ts
│   │   │   │   ├── address/              # Servicios de direcciones geográficas
│   │   │   │   │   ├── dtos/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── get-communes.dto.ts
│   │   │   │   │   │   ├── get-provinces.dto.ts
│   │   │   │   │   │   └── get-regions.dto.ts
│   │   │   │   │   ├── get-communes-by-provinces-id.service.ts
│   │   │   │   │   ├── get-provinces-by-region-id.service.ts
│   │   │   │   │   └── get-regions.service.ts
│   │   │   │   └── whoami/
│   │   │   │       ├── dtos/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── whoami.dto.ts
│   │   │   │       └── whoami.service.ts  # Polling periódico de datos de usuario
│   │   │   ├── standarized-response/
│   │   │   │   ├── index.ts
│   │   │   │   └── standardized-pagination/
│   │   │   │       ├── index.ts
│   │   │   │       ├── pagination-meta.dto.ts
│   │   │   │       └── standarized-pagination.interface.ts
│   │   │   └── utils/
│   │   │       └── .gitkeep
│   │   ├── modules/
│   │   │   ├── auth/                      # Módulo de autenticación
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth-routing.module.ts
│   │   │   │   ├── auth.component.ts / .html / .css / .spec.ts
│   │   │   │   └── pages/
│   │   │   │       ├── custom-validators/  # 4 validators (email, password strength/match)
│   │   │   │       ├── data-access/        # AuthService + 5 servicios auxiliares
│   │   │   │       ├── dtos/               # 7 DTOs
│   │   │   │       ├── sign-in/
│   │   │   │       ├── sign-up/
│   │   │   │       ├── two-steps/
│   │   │   │       ├── forgot-password/
│   │   │   │       ├── new-password/
│   │   │   │       └── temporary-password/
│   │   │   ├── dashboard/                 # Dashboard principal
│   │   │   │   ├── dashboard.module.ts
│   │   │   │   ├── dashboard-routing.module.ts
│   │   │   │   ├── dashboard.component.ts / .html / .spec.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── nft.ts             # Interfaz Nft (placeholder NFT)
│   │   │   │   ├── components/
│   │   │   │   │   └── nft/               # 6 componentes NFT (header, cards, chart, table)
│   │   │   │   └── pages/
│   │   │   │       ├── nft/               # Página NFT (placeholder)
│   │   │   │       └── admin/             # Dashboard admin con indicadores
│   │   │   ├── error/                     # Páginas de error
│   │   │   │   ├── error.module.ts
│   │   │   │   ├── error-routing.module.ts
│   │   │   │   ├── error.component.ts / .html / .css / .spec.ts
│   │   │   │   └── pages/
│   │   │   │       ├── error404/
│   │   │   │       └── error500/
│   │   │   ├── layout/                    # Shell de la aplicación
│   │   │   │   ├── layout.module.ts
│   │   │   │   ├── layout-routing.module.ts
│   │   │   │   ├── layout.component.ts / .html / .css / .spec.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── menu.service.ts    # Gestión dinámica de menú con permisos
│   │   │   │   │   └── menu.service.spec.ts
│   │   │   │   └── components/
│   │   │   │       ├── footer/
│   │   │   │       ├── navbar/            # Navbar desktop + mobile + profile menu
│   │   │   │       └── sidebar/           # Sidebar con menú y submenú
│   │   │   ├── profile/                   # Perfil de usuario
│   │   │   │   ├── profile.module.ts
│   │   │   │   ├── profile-routing.module.ts
│   │   │   │   ├── profile.component.ts / .html / .css / .spec.ts
│   │   │   │   ├── components/            # 3 cards de perfil
│   │   │   │   ├── data-access/           # 2 servicios (get, update)
│   │   │   │   ├── features/              # Modal de actualización de contacto
│   │   │   │   └── ui/                    # 3 skeletons
│   │   │   ├── restaurante/               # Gestión de negocios/restaurantes
│   │   │   │   ├── restaurante.module.ts
│   │   │   │   ├── restaurante-routing.module.ts
│   │   │   │   ├── restaurante.component.ts / .html
│   │   │   │   └── pages/
│   │   │   │       └── business/
│   │   │   │           ├── business.component.ts / .html / .css
│   │   │   │           ├── data-access/   # 6 servicios + enum BusinessSetup
│   │   │   │           └── features/      # Tabla, modal crear, wizard setup (5 pasos)
│   │   │   ├── roles-and-permissions/     # Administración RBAC
│   │   │   │   ├── roles-and-permissions.module.ts
│   │   │   │   ├── roles-and-permissions-routing.module.ts
│   │   │   │   └── pages/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── users/             # CRUD + filtros + modal
│   │   │   │       ├── roles/             # CRUD + filtros + modal
│   │   │   │       ├── permissions/       # CRUD + filtros + modal + skeleton
│   │   │   │       ├── modules/           # CRUD + filtros + modal
│   │   │   │       ├── roles-user/        # Asignación roles a usuarios
│   │   │   │       └── roles-permissions/ # Asignación permisos a roles
│   │   │   ├── uikit/                     # UI Kit con tabla reutilizable
│   │   │   │   ├── uikit.module.ts
│   │   │   │   └── pages/table/           # Componente table + subcomponentes
│   │   │   └── uim/                       # UI Module (versión ligera)
│   │   │       ├── uim.module.ts
│   │   │       └── pages/table/
│   │   └── shared/                        # Código compartido
│   │       ├── components/
│   │       │   └── responsive-helper/     # Indicador de breakpoint en dev
│   │       ├── directives/
│   │       │   └── check-permission.directive.ts  # *appCheckPermission
│   │       ├── dummy/
│   │       │   └── user.dummy.ts
│   │       ├── enums/
│   │       │   └── permissions.enum.ts    # Catálogo completo de permisos
│   │       ├── models/
│   │       │   └── chart-options.ts
│   │       ├── pipes/
│   │       │   └── .gitkeep               # VACÍO
│   │       ├── utils/
│   │       │   └── ckassnames.ts          # Utilidad classnames (typo en nombre)
│   │       └── validators/
│   │           └── .gitkeep               # VACÍO
│   ├── assets/
│   │   ├── avatars/
│   │   ├── bg/
│   │   ├── icons/
│   │   ├── illustrations/
│   │   ├── images/
│   │   ├── preview/
│   │   └── styles/
│   │       └── apexchart.css
│   ├── environments/
│   │   ├── environment.ts                 # Default: localhost:3000, production: false
│   │   ├── environment.develop.ts         # Dev AWS endpoint
│   │   ├── environment.local.ts           # Local: localhost:3000, production: true
│   │   ├── environment.prod.ts            # Prod AWS endpoint
│   │   ├── index.ts
│   │   └── enums/
│   │       ├── api-path.enum.ts
│   │       └── index.ts
│   ├── ui/                                # Librería de componentes Atomic Design
│   │   ├── index.ts
│   │   ├── atoms/                         # 6 componentes
│   │   ├── molecules/                     # 9 componentes
│   │   ├── organisms/                     # 1 componente
│   │   ├── templates/                     # 6 componentes
│   │   └── utils/                         # 4 directives + 1 pipe
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   └── test.ts
├── tests-e2e/                             # 3 tests Playwright
│   ├── navbar.e2e.spec.ts
│   ├── sidebar.e2e.spec.ts
│   └── table.e2e.spec.ts
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

---

# 3. ARQUITECTURA

## 3.1 Bootstrap

La aplicación usa **bootstrap standalone** (`bootstrapApplication` en `main.ts`), NO `platformBrowserDynamic`. Provee:

```typescript
providers: [
  importProvidersFrom(BrowserModule, AppRoutingModule),
  provideAnimations(),
  provideHttpClient(withInterceptors([AuthInterceptor])),
]
```

## 3.2 Estructura de módulos

```
AppComponent (standalone)
└── AppRoutingModule (lazy loading raíz)
    ├── path: ''       → LayoutModule (lazy)
    ├── path: 'auth'   → AuthModule (lazy)
    ├── path: 'errors' → ErrorModule (lazy)
    └── path: '**'     → redirect errors/404

LayoutModule (shell con sidebar + navbar + footer)
└── LayoutRoutingModule (lazy children)
    ├── /dashboard               → DashboardModule (lazy)
    ├── /components/table        → UimModule (lazy)
    ├── /components              → UikitModule (lazy)
    ├── /roles-and-permissions   → RolesAndPermissionsModule (lazy)
    ├── /business                → RestauranteModule (lazy)
    ├── /profile                 → ProfileModule (lazy)
    └── /                        → redirect dashboard
```

## 3.3 Patrones identificados

| Patrón | Evidencia |
|--------|-----------|
| **Standalone components** | `AppComponent` usa `imports: [...]` en decorador, NO declara en NgModule |
| **NgModule lazy loading** | Todas las rutas usan `loadChildren: () => import(...).then(m => m.XModule)` |
| **Functional guards** | `authGuard`, `permissionGuard`, `roleGuard` son `CanActivateFn` (funciones, no clases) |
| **Functional interceptor** | `AuthInterceptor` es `HttpInterceptorFn` |
| **Service-per-endpoint** | Cada endpoint tiene su propia clase servicio (ej: `create-user.service.ts`, `delete-user.service.ts`) |
| **Barrel exports** | Cada carpeta tiene `index.ts` con re-exports |
| **Feature-based folders** | Cada módulo organiza por `pages/`, `data-access/`, `features/`, `ui/` |
| **Smart/Dumb** | Pages son smart (orquestan), features/ui son dumb (reciben inputs, emiten outputs) |
| **Signals** | Usados en `ThemeService`, `MenuService`, `WhoamiService` para estado reactivo |
| **toSignal()** | Conversión de Observables a Signals (`AuthService.$isLoading`, `WhoamiService.$whoami`) |

## 3.4 Dependencias entre capas

```
modules/ ──► core/ (services, guards, models)
modules/ ──► shared/ (directives, enums)
modules/ ──► ui/ (componentes Atomic Design)
modules/ ──► environments/ (api paths)
core/ ────► environments/
core/ ────► modules/auth/pages/data-access/ (AuthService es usado por guards e interceptor)
```

---

# 4. DESIGN SYSTEM

## 4.1 Theme System

**Framework:** Tailwind CSS v4 (sin archivo `tailwind.config.js`, configuración vía CSS)

**Tipografía:**
- `Poppins` (principal, todos los pesos 100-900)
- `Nunito` (secundaria)
- Google Fonts CDN (`fonts.googleapis.com`)
- Material Icons + Material Symbols (`fonts.googleapis.com/icon`)

**Modos de tema:**
- Light (default `:root`)
- Dark (`.dark` class)

**Paletas de color (7 themes):**

| Theme | Color primario | Selector |
|-------|---------------|----------|
| Base (default) | `#E11D48` (rose) | `[data-theme='base']` (implícito en `:root`) |
| Violet | `#6E56CF` | `[data-theme='violet']` |
| Red | `#CC0033` | `[data-theme='red']` |
| Blue | `#2490FF` | `[data-theme='blue']` |
| Orange | `#EA580C` | `[data-theme='orange']` |
| Yellow | `#FACC15` | `[data-theme='yellow']` |
| Green | `#22C55E` | `[data-theme='green']` |

Cada tema tiene variantes light y dark definidas mediante CSS custom properties.

**ThemeService:**
- Almacena preferencia en `localStorage` key `'theme'`
- Gestiona: `mode` (dark/light), `color` (base/violet/red/blue/orange/yellow/green), `direction` (ltr/rtl)
- Aplica clase `.dark` al `<html>` y atributo `data-theme`
- Reactivo vía Angular `signal` + `effect`

## 4.2 CSS Custom Properties (Tokens)

Definidas en `@theme` de Tailwind v4:

```
--font-poppins
--font-nunito
--color-border
--color-background
--color-foreground
--color-primary
--color-primary-foreground
--color-destructive
--color-destructive-foreground
--color-muted
--color-muted-foreground
--color-card
--color-card-foreground
```

## 4.3 Glassmorphism

Utilidades CSS para efecto vidrio:

```css
.glass, .glass-card, .glass-header, .glass-overlay,
.glass-row, .glass-input, .glass-footer
```

Con variantes `.dark` para cada una. Usadas extensivamente en layout, navbar, sidebar, y componentes de tabla.

## 4.4 Animaciones

Keyframes definidos en `@theme`:
- `wiggle`
- `fade-in-down`, `fade-out-down`
- `fade-in-up`, `fade-out-up`

Dropdown utilities con animaciones.

## 4.5 Angular Material

- Integrado con estilos glass (`.glass-form-field`)
- Form fields, select panels personalizados
- Usado para diálogos modales (`MatDialog`)
- Close button personalizado (`.close-button`)

## 4.6 Atomic Design — Inventario de Componentes (src/ui/)

### Atoms (6 componentes)

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `BadgeComponent` | `atoms/badge/` | Badge con enum `BadgeType` |
| `DividerComponent` | `atoms/divider/` | Divisor visual |
| `IconComponent` | `atoms/icon/` | Icono |
| `ProgressBarComponent` | `atoms/progress-bar/` | Barra de progreso con enum `Mode` |
| `SkeletonComponent` | `atoms/skeleton/` | Skeleton loader con tamaños |
| `ToggleComponent` | `atoms/toggle/` | Toggle switch |

### Molecules (9 componentes)

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `AlertComponent` | `molecules/alert/` | Alerta con enum `AlertType` |
| `BottomNavbarComponent` | `molecules/bottom-navbar/` | Barra de navegación inferior (mobile) |
| `ButtonComponent` | `molecules/button/` | Botón con enum `ButtonType` |
| `ConfirmModalComponent` | `molecules/confirm-modal/` | Modal de confirmación |
| `FiltersTableComponent` | `molecules/filters-table/` | Filtros de tabla con DTOs |
| `HeaderDashboardComponent` | `molecules/header-dashboard/` | Cabecera de página con título + acciones |
| `InactiveTableSkeletonComponent` | `molecules/inactive-table-skeleton/` | Skeleton para tabla vacía |
| `PaginationTableComponent` | `molecules/pagination-table/` | Paginación de tabla |
| `ToastComponent` | `molecules/toast/` | Toast notifications con `ToastService` |

### Organisms (1 componente)

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `SignUpTermsAndConditionsComponent` | `organisms/terms-and-conditions/sign-up/` | Términos y condiciones en registro |

### Templates (6 componentes)

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `AreaChartComponent` | `templates/charts/area-chart/` | Gráfico de área (ApexCharts) |
| `ExpressTableComponent` | `templates/express-table/` | Tabla express con slots |
| `ModalComponent` | `templates/modal/` | Modal genérico |
| `ModalCardComponent` | `templates/modal-card/` | Card dentro de modal |
| `SingleCardComponent` | `templates/single-card/` | Card simple |
| `TableComponent` | `templates/table/` | Tabla genérica |

### Utils (5 utilidades)

| Utilidad | Archivo | Tipo |
|----------|---------|------|
| `CaseTransformDirective` | `utils/case-transform.directive.ts` | Directiva |
| `ClickOutsideDirective` | `utils/click-outside.directive.ts` | Directiva |
| `RutFormatDirective` | `utils/rut-format.directive.ts` | Directiva |
| `SlotDirective` | `utils/slot.directive.ts` | Directiva |
| `SlotAsRecordPipe` | `utils/slot-as-record.pipe.ts` | Pipe |

### Observaciones Design System

- **NO hay tests** en `src/ui/` (0 archivos `.spec.ts`)
- **NO usa SCSS/SASS** — todo es CSS plano
- La capa **Organisms** está sub-poblada (1 solo componente)
- La capa **Templates** tiene más componentes que Organisms (inversión del patrón Atomic Design estricto)
- Los componentes NO se usan consistentemente en toda la app — algunos módulos usan componentes inline en vez de los del UI kit

---

# 5. ROUTING

## 5.1 Árbol completo de rutas

```
/                                           → LayoutModule (lazy)
├── /dashboard                              → DashboardModule (lazy)
│   ├── /dashboard                          → redirect admin
│   ├── /dashboard/admin                    → AdminComponent (authGuard)
│   └── /dashboard/**                       → redirect errors/404
├── /components/table                       → UimModule (lazy)
│   └── /components/table                   → TablePage
├── /components                             → UikitModule (lazy)
│   ├── /components                         → redirect components
│   └── /components/table                   → TableComponent
├── /roles-and-permissions                  → RolesAndPermissionsModule (lazy)
│   ├── /roles-and-permissions              → DashboardComponent (authGuard)
│   ├── /roles-and-permissions/modules      → ModulesComponent (authGuard)
│   ├── /roles-and-permissions/roles        → RolesComponent (authGuard)
│   ├── /roles-and-permissions/permissions  → PermissionsComponent (authGuard)
│   ├── /roles-and-permissions/roles-permissions → RolesPermissionsComponent (authGuard)
│   ├── /roles-and-permissions/roles-user   → RolesUserComponent (authGuard)
│   └── /roles-and-permissions/users        → UsersComponent (authGuard)
├── /business                               → RestauranteModule (lazy)
│   └── /business                           → BusinessComponent (authGuard)
├── /profile                                → ProfileModule (lazy)
│   └── /profile                            → ProfileComponent (authGuard)
├── /                                       → redirect dashboard
└── /**                                     → redirect error/404

/auth                                       → AuthModule (lazy)
├── /auth                                   → redirect sign-in
├── /auth/sign-in                           → SignInComponent (público)
├── /auth/sign-up                           → SignUpComponent (público)
├── /auth/forgot-password                   → ForgotPasswordComponent (público)
├── /auth/new-password                      → NewPasswordComponent (público)
├── /auth/two-steps                         → TwoStepsComponent (público)
├── /auth/temporary-password                → TemporaryPasswordComponent (público)
└── /auth/**                                → redirect sign-in

/errors                                     → ErrorModule (lazy)
├── /errors                                 → redirect 404
├── /errors/404                             → Error404Component (público)
├── /errors/500                             → Error500Component (público)
└── /errors/**                              → redirect errors/404

/**                                         → redirect errors/404
```

## 5.2 Protección de rutas

| Ruta | Guard | Tipo |
|------|-------|------|
| `/dashboard/admin` | `authGuard` | `canActivate` + `canActivateChild` |
| `/business` | `authGuard` | `canActivate` + `canActivateChild` |
| `/roles-and-permissions/*` | `authGuard` | `canActivate` + `canActivateChild` |
| `/profile` | `authGuard` | `canActivate` + `canActivateChild` |
| `/auth/*` | Ninguno | Público |
| `/errors/*` | Ninguno | Público |

**Nota:** `permissionGuard` y `roleGuard` están definidos pero **NO se usan en ninguna ruta actualmente**. Solo `authGuard` está activo en las rutas.

## 5.3 Lazy Loading

**TODOS los módulos de feature** usan lazy loading vía `loadChildren`. No hay eager loading de features.

## 5.4 Layout

- Rutas dentro de `LayoutModule` usan `LayoutComponent` como shell (sidebar + navbar + footer + router-outlet)
- Rutas de `AuthModule` y `ErrorModule` usan layout mínimo (sin sidebar)
- Layout incluye scroll-to-top en navegación

---

# 6. AUTHENTICATION

## 6.1 Flujo de autenticación

```
1. Usuario accede a /auth/sign-in
2. SignInComponent → AuthService.login(email, password)
3. POST /auth/api/login/authenticate-user
4. Respuesta: { token, refreshToken, userData }
5. AuthService guarda:
   - token → localStorage['token'] + this.token
   - refreshToken → localStorage['refreshToken']
   - userData → localStorage['userData']
   - lastActivity → localStorage['lastActivity'] = Date.now()
6. currentUserLoginOn.next(true)
7. WhoamiService.refetch() → refresca datos de usuario
8. Redirección según navegación
```

## 6.2 AuthService (`modules/auth/pages/data-access/auth.service.ts`)

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `login(LoginInputDto)` | POST login, guarda tokens en localStorage, actualiza BehaviorSubjects |
| `logout()` | POST logout, limpia localStorage, resetea estado |
| `refreshAccessToken()` | POST refresh-token, renueva token y refreshToken |
| `isLogin()` | `boolean` — verifica `this.token !== null` |
| `hasRole(roles[])` | `Observable<boolean>` — consulta WhoamiService |
| `hasPermission(permissions[])` | `Observable<boolean>` — consulta WhoamiService |
| `getToken()` | Retorna token actual |
| `getRefreshToken()` | Retorna refreshToken actual |
| `userData` | `Observable<LoginOutputDto>` |
| `userLoginOn` | `Observable<boolean>` |

**Signals expuestos:**
- `$isLoading` (Signal<boolean>)
- `$error` (Signal<HttpStatusCode | undefined>)
- `$hasError` (Signal<boolean>)

## 6.3 Persistencia de sesión

- **Storage:** `localStorage` (no sessionStorage para auth tokens)
- **Expiración:** Si `lastActivity > 24h`, se borra la sesión automáticamente en `loadSession()`
- **Actualización de actividad:** Cada vez que se refresca el token (`refreshAccessToken()`) o se hace whoami (cada 60s con foco)

## 6.4 AuthInterceptor (`core/interceptor/auth.interceptor.ts`)

- **Funcional:** `HttpInterceptorFn`
- Adjunta header `Authorization: Bearer <token>` a todas las requests
- Si recibe **401** (y no es refresh-token):
  1. Intenta `refreshAccessToken()`
  2. Si éxito: reintenta request original con nuevo token
  3. Si falla: `logout()` + redirección a `/auth/sign-in`
- No adjunta token si no existe

## 6.5 Guards

| Guard | Tipo | Función |
|-------|------|---------|
| `authGuard` | `CanActivateFn` | Verifica `authService.isLogin()`. Si no, redirige a `/auth/sign-in` |
| `permissionGuard` | `CanActivateFn` | Verifica permiso en `route.data['viewPermission']` vía `authService.hasPermission()` |
| `roleGuard` | `CanActivateFn` | Verifica roles en `route.data['roles']` vía `authService.hasRole()` |

## 6.6 WhoamiService (`core/services/whoami/whoami.service.ts`)

- **GET** `${ApiPathEnum.AUTH}/users/whoami`
- Polling automático cada 60 segundos (solo cuando documento tiene foco)
- También refresca en evento `visibilitychange` (debounced 30s)
- Expone:
  - `$whoami` (Signal<WhoamiDto | null>)
  - `roles$` (Observable<Set<string>>)
  - `permissions$` (Observable<Set<string>>)
  - `$permissionsSet` (Signal<Set<string>>)
- Actualiza `lastActivity` en localStorage en cada fetch exitoso
- `refetch()` público para refresco manual

## 6.7 Flujo de refresh token

```
Request → 401 response
  → POST /auth/api/auth/refresh-token { refreshToken }
  → Nuevo { token, refreshToken }
  → Guardar en localStorage
  → Reintentar request original con nuevo token
  → Si falla: logout + redirect sign-in
```

## 6.8 Registro y recuperación de contraseña

**Flujo de registro (`/auth/sign-up`):**
- Formulario con validación (email, password strength, password match)
- Custom validators: `EmailFormatValidator`, `PasswordStrengthValidator`, `PasswordMatchValidator`
- Términos y condiciones (usa `SignUpTermsAndConditionsComponent` de organisms)
- **Endpoint:** No hay un endpoint de registro explícito en los data-access services — `SignUpComponent` probablemente usa `AuthService` directamente o un endpoint aún no documentado

**Recuperación de contraseña:**
- `/auth/forgot-password` → `POST /auth/api/auth/forgot-password`
- `/auth/new-password` → `PUT /auth/api/login/reset-password`
- `/auth/temporary-password` → `POST /auth/api/login/new-password-validate`
- Desactivación externa: `PUT /auth/api/login/external-deactivate-user-for-password`

**PasswordTransferService:** Servicio cliente que usa `sessionStorage` para pasar email/password entre componentes del flujo.

---

# 7. API INTEGRATION

## 7.1 Configuración de endpoints

```typescript
// api-path.enum.ts
ApiPathEnum.AUTH      = `${baseUrl}/auth/api`
ApiPathEnum.RESTAURANT = `${baseUrl}/restaurant/api`

// baseUrl por ambiente:
// localhost:  http://localhost:3000
// develop:    https://zvwuixec9i.execute-api.us-east-1.amazonaws.com/
// production: https://3rns8qoa8g.execute-api.us-east-1.amazonaws.com/
```

## 7.2 Catálogo completo de servicios API

### Authentication

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `AuthService.login()` | POST | `/auth/api/login/authenticate-user` | Iniciar sesión |
| `AuthService.logout()` | POST | `/auth/api/login/logout` | Cerrar sesión |
| `AuthService.refreshAccessToken()` | POST | `/auth/api/auth/refresh-token` | Renovar token |
| `ForgotPasswordService` | POST | `/auth/api/auth/forgot-password` | Solicitar recuperación |
| `ResetPasswordService` | PUT | `/auth/api/login/reset-password` | Restablecer contraseña |
| `TemporaryPasswordService` | POST | `/auth/api/login/new-password-validate` | Validar contraseña temporal |
| `ExternalDeactivateUserForPasswordService` | PUT | `/auth/api/login/external-deactivate-user-for-password` | Desactivar usuario (flujo externo) |

### Usuarios (RBAC)

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `WhoamiService` | GET | `/auth/api/users/whoami` | Datos del usuario autenticado |
| `GetAllUsersService` | GET | `/auth/api/users` | Listar usuarios (paginado + filtros) |
| `CreateUserService` | POST | `/auth/api/internal-user` | Crear usuario |
| `UpdateUserService` | PATCH | `/auth/api/users/${userId}` | Actualizar usuario |
| `DeleteUserService` | DELETE | `/auth/api/users/${userId}` | Eliminar usuario |
| `GetAllUsersWithRolesService` | GET | `/auth/api/users/users-with-roles` | Usuarios con roles asignados |
| `AssignRoleToUserService` | POST | `/auth/api/users/${userId}/roles` | Asignar roles a usuario |

### Roles (RBAC)

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetAllRolesService` | GET | `/auth/api/roles-and-permissions/roles` | Listar roles (paginado + filtros) |
| `CreateRoleService` | POST | `/auth/api/roles-and-permissions/roles` | Crear rol |
| `UpdateRoleService` | PATCH | `/auth/api/roles-and-permissions/roles/${id}` | Actualizar rol |
| `DeleteRoleService` | DELETE | `/auth/api/roles-and-permissions/roles/${id}` | Eliminar rol |

### Permisos (RBAC)

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetAllPermissionsService` | GET | `/auth/api/roles-and-permissions/permissions` | Listar permisos (agrupados por módulo) |
| `CreatePermissionService` | POST | `/auth/api/roles-and-permissions/permissions` | Crear permiso |
| `UpdatePermissionService` | PATCH | `/auth/api/roles-and-permissions/permissions/${id}` | Actualizar permiso |
| `DeletePermissionService` | DELETE | `/auth/api/roles-and-permissions/permissions/${id}` | Eliminar permiso |

### Módulos (RBAC)

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetAllModulesService` | GET | `/auth/api/roles-and-permissions/modules` | Listar módulos (paginado + filtros) |
| `CreateModuleService` | POST | `/auth/api/roles-and-permissions/modules` | Crear módulo |
| `UpdateModuleService` | PUT | `/auth/api/roles-and-permissions/modules/${id}/update` | Actualizar módulo |
| `DeleteModuleService` | PUT | `/auth/api/roles-and-permissions/modules/${id}/delete` | Soft-delete módulo |

### Roles-Permisos

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetRolePermissionsService` | GET | `/auth/api/roles-and-permissions/roles/${roleId}/permissions` | Permisos de un rol |
| `AssignPermissionsService` | POST | `/auth/api/roles-and-permissions/roles/${roleId}/permissions` | Asignar permisos a rol |

### Perfil

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetProfileService` | GET | `/auth/api/profile/${userId}/user` | Obtener perfil |
| `UpdateContactProfileService` | PATCH | `/auth/api/contacts/${id}` | Actualizar contacto |

### Negocios (Restaurante)

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `FindMyBusinessesService` | GET | `/restaurant/api/business/my-businesses` | Mis negocios |
| `CreateBusinessService` | POST | `/restaurant/api/business` | Crear negocio |
| `ActivateBusinessService` | POST | `/restaurant/api/business/${id}/activate` | Activar negocio |
| `CompleteBusinessSetupStepService` | POST | `/restaurant/api/business/${bizId}/setup/steps/${step}` | Completar paso de setup |
| `FindBusinessSetupStepsService` | GET | `/restaurant/api/business/${bizId}/setup/steps` | Pasos de setup |
| `FindAllCurrenciesService` | GET | `/restaurant/api/currencies` | Monedas disponibles |

### Direcciones

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| `GetRegionsService` | GET | `/auth/api/address/regions` | Regiones |
| `GetProvincesByRegionIdService` | GET | `/auth/api/address/provinces/${regionId}` | Provincias por región |
| `GetCommunesByProvincesIdService` | GET | `/auth/api/address/comunes/${communeId}` | Comunas por provincia |

---

# 8. STATE MANAGEMENT

## 8.1 Estrategia

**NO se usa NgRx, Akita, ni ninguna librería externa de state management.**

La aplicación utiliza una combinación de:

| Mecanismo | Uso |
|-----------|-----|
| **Angular Signals** | `ThemeService.theme`, `MenuService._showSidebar`, `WhoamiService.$whoami/$permissionsSet`, `AuthService.$isLoading/$error` |
| **RxJS BehaviorSubject** | `AuthService.currentUserLoginOn`, `AuthService.currentUserData` |
| **toSignal()** | Conversión de Observables a Signals (`$isLoading`, `$whoami`, `$permissionsSet`) |
| **Service-per-endpoint** | Cada endpoint tiene su servicio que maneja su propio estado (loading, error, data) con señales/observables |
| **Local state** | Estado de formularios, filtros, paginación en componentes |

## 8.2 Estado compartido

| Estado | Mecanismo | Alcance |
|--------|-----------|---------|
| Tema (dark/light/color) | `ThemeService` signal | Global (app) |
| Autenticación (token, userData) | `AuthService` BehaviorSubjects | Global (app) |
| Datos de usuario (roles, permisos) | `WhoamiService` signal | Global (app) |
| Visibilidad sidebar/menú móvil | `MenuService` signals | Global (layout) |
| Menú filtrado por permisos | `MenuService` computed signal | Global (layout) |
| Estado de loading/error/data por endpoint | Signals en cada data-access service | Feature module |

## 8.3 Flujo de datos típico

```
Componente
  → inyecta DataAccessService
  → llama service.execute(params)
  → service hace HTTP request
  → service actualiza signals ($data, $isLoading, $error)
  → componente lee signals en template (@let o directamente)
  → skeleton/loading/error/data se renderiza condicionalmente
```

## 8.4 Catálogo de permisos (`shared/enums/permissions.enum.ts`)

```typescript
modules:    see-modules, get-all-modules, update-module, delete-module, create-module
permissions: see-module, get-all-permissions, create-permission, delete-permission, update-permission
roles:       see-module, update-role, create-role, delete-role, get-all-roles
roles-permissions: see-module, assign-permissions
users-roles: see-module, assign-roles
users:      create-user, delete-user, update-user, see-module, get-all-users
```

---

# 9. DASHBOARD

## 9.1 Dashboard Admin (`/dashboard/admin`)

**Componente:** `AdminComponent` en `modules/dashboard/pages/admin/`

### Widgets y contenido

| Elemento | Tipo | Datos |
|----------|------|-------|
| Header | `app-header-dashboard` | Título: "Admin dashboard", subtítulo: "Administración de backoffice" |
| Botón 1 | Deshabilitado permanentemente | Label: "hola mundo" (placeholder) |
| Botón 2 | Activo, redirige a `/auth/sign-up` | Label: "Hola mundo" (placeholder) |
| 4 Indicadores | Cards con número circular | `Indicador 1` (10009), `Indicador 2` (200), `Indicador 3` (300), `Indicador 4` (400) — **DATOS FICTICIOS** |
| Gráfico de área | `app-area-chart` (ApexCharts) | Datos del chart pasado como input (no se inspeccionó el source de datos real en el componente) |
| Tabla de usuarios | `app-users-dashboard-table` | **DATOS FICTICIOS NFT** (5 items de subastas NFT, no datos reales de usuarios) |

### Observaciones críticas

1. **Los indicadores son hardcoded** — no consumen ningún endpoint real
2. **La tabla "Usuarios" muestra datos NFT** (criptomonedas, subastas) — código placeholder copiado de un template
3. **El nombre de columnas es inconsistente** — La columna "Open Price" muestra `item.creator` (un nombre)
4. **Botones con labels placeholder** — "hola mundo", "Hola mundo"
5. **NO hay integración con datos reales del backend**

## 9.2 Dashboard NFT (`/dashboard/nft`)

**Componente:** `NftComponent` — página de demostración con datos ficticios de NFT. Componentes: header, single card, dual card, chart card, auctions table. **Todo placeholder.**

---

# 10. RESTAURANT / BUSINESS

## 10.1 Funcionalidad implementada

Endpoint: `/business` (ruta real)

**BusinessComponent** (`modules/restaurante/pages/business/`):

| Funcionalidad | Estado | Descripción |
|--------------|--------|-------------|
| Listar negocios | IMPLEMENTED | `FindMyBusinessesService` → GET `/restaurant/api/business/my-businesses` |
| Crear negocio | IMPLEMENTED | `CreateBusinessService` → POST `/restaurant/api/business` con modal |
| Activar negocio | IMPLEMENTED | `ActivateBusinessService` → POST `/restaurant/api/business/${id}/activate` via toggle |
| Desactivar negocio | NOT IMPLEMENTED | Muestra toast "La desactivación del negocio está en construcción" |
| Actualizar negocio | NOT IMPLEMENTED | Muestra toast "La modificación del negocio está en construcción" |
| Eliminar negocio | NOT IMPLEMENTED | Muestra toast "La eliminación del negocio está en construcción" |
| Setup wizard | IMPLEMENTED | 5 pasos con sus formularios |
| Monedas | IMPLEMENTED | `FindAllCurrenciesService` → GET `/restaurant/api/currencies` |

### Setup Wizard (5 pasos)

| Paso | Componente | Descripción |
|------|-----------|-------------|
| Step 1 | `Step1BasicInfoFormComponent` | Información básica |
| Step 2 | `Step2TaxFormComponent` | Datos tributarios |
| Step 3 | `Step3AccountingFormComponent` | Contabilidad |
| Step 4 | `Step4InventoryFormComponent` | Inventario |
| Step 5 | `Step5PosFormComponent` | Configuración POS |

### Business Table

| Columna | Fuente |
|---------|--------|
| Nombre | `item.name` |
| Zona horaria | `item.timeZone` |
| Estado | `item.isActive` (toggle) |
| Acciones | Update stub, Delete stub, Setup (si `!isActive && !startDate`) |

---

# 11. TABLES / MESAS

## NOT IMPLEMENTED

No existe ningún componente, servicio, modelo o ruta relacionada con:
- Gestión de mesas
- Vista de mesas (floor plan)
- QR para mesas
- Estados de mesas

---

# 12. PRODUCTS / PRODUCTOS

## NOT IMPLEMENTED

No existe ningún componente, servicio, modelo o ruta relacionada con:
- Productos
- Categorías de productos
- Carta/menú
- CRUD de productos
- Imágenes de productos
- Disponibilidad de productos

---

# 13. ORDERS / PEDIDOS

## NOT IMPLEMENTED

No existe ningún componente, servicio, modelo o ruta relacionada con:
- Pedidos
- Estados de pedidos
- Carrito de compras
- Vista de cocina
- POS (el wizard de setup menciona POS pero no hay funcionalidad)

---

# 14. RESERVATIONS / RESERVAS

## NOT IMPLEMENTED

No existe ningún componente, servicio, modelo o ruta relacionada con:
- Calendario de reservas
- Reservas
- Disponibilidad
- Configuración de reservas

---

# 15. INVENTORY / INVENTARIO

## NOT IMPLEMENTED

No existe ningún componente, servicio, modelo o ruta relacionada con:
- Inventario
- Ingredientes
- Recetas
- Movimientos de stock
- Control de stock

---

# 16. RESPONSIVE

## 16.1 Breakpoints

Tailwind CSS v4 breakpoints estándar: `sm`, `md`, `lg`, `xl`, `2xl`.

## 16.2 Componentes responsive

| Componente | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| **Sidebar** | Visible, colapsable | Oculto, toggle | Oculto, toggle con overlay |
| **Navbar** | Navbar horizontal con menú | Navbar horizontal | NavbarMobile con menú hamburguesa |
| **BottomNavbar** | Oculto | Oculto | Visible (navegación inferior) |
| **Profile menu** | Dropdown | Dropdown | En mobile menu |
| **Dashboard cards** | Grid 4 cols | Grid 2 cols | Grid 1 col |
| **Tablas** | Completas | Completas | Scroll horizontal o stacked |

## 16.3 ResponsiveHelper

Componente de desarrollo (`shared/components/responsive-helper/`) que muestra el breakpoint actual en pantalla durante desarrollo.

## 16.4 Problemas identificados

- Las tablas del dashboard admin usan grid `md:grid-cols-[1fr_3fr]` — en mobile colapsan a stacked, aceptable
- Los modales usan `width: '90%'` fijo (no responsive por breakpoint)
- No se identificaron problemas graves de responsive, pero no se realizó testing exhaustivo

---

# 17. UX

## 17.1 Loading States

| Elemento | Implementación |
|----------|---------------|
| **Skeleton loaders** | `SkeletonComponent` (atoms), skeletons específicos en profile y RBAC |
| **Progress bar** | `ProgressBarComponent` (atoms) usado en tablas durante carga |
| **Spinner inicial** | HTML estático en `index.html` dentro de `<app-root>` |
| **Botones loading** | `AuthService.$isLoading` signal, no se observa spinner en botones |
| **Inactive table skeleton** | `InactiveTableSkeletonComponent` (molecules) |

## 17.2 Empty States

| Elemento | Implementación |
|----------|---------------|
| **Business table** | "No hay data" texto + botón refresh |
| **Otras tablas** | `InactiveTableSkeletonComponent` |
| **Listas vacías** | Usan filtro condicional — no se observa mensaje "no results" en filtros |

## 17.3 Error Handling

| Elemento | Implementación |
|----------|---------------|
| **HTTP errors** | `AuthInterceptor` maneja 401 con refresh/redirect |
| **Errores de servicio** | `catchError` en cada servicio, emiten a `$error` signal |
| **Toast de error** | `ToastComponent` con `ToastType` enum |
| **Páginas de error** | `/errors/404` (SVG ilustración), `/errors/500` (SVG ilustración) |
| **Errores de formulario** | Validación inline en auth forms |

## 17.4 Notificaciones

| Elemento | Implementación |
|----------|---------------|
| **Toast** | `ToastComponent` (molecules) + `ToastService` |
| **Sonner** | `NgxSonnerToaster` importado en `AppComponent` |
| **Alert** | `AlertComponent` (molecules) con `AlertType` enum |

## 17.5 Modales y Diálogos

| Elemento | Implementación |
|----------|---------------|
| **Modal genérico** | `ModalComponent` (templates) |
| **Modal card** | `ModalCardComponent` (templates) |
| **Confirmación** | `ConfirmModalComponent` (molecules) |
| **Angular Material Dialog** | Usado para modales de negocio (create, setup) |
| **Update contact modal** | Modal específico en profile/features/ |

## 17.6 Formularios

| Elemento | Implementación |
|----------|---------------|
| **Validación** | Reactive forms + custom validators (email, password) |
| **Glass form fields** | `.glass-form-field` con Angular Material |
| **RUT format** | `RutFormatDirective` |
| **Case transform** | `CaseTransformDirective` |
| **Form steps** | Setup wizard multi-step (5 pasos con formularios individuales) |

## 17.7 Accesibilidad

- **NO** se observan atributos `aria-*` en la mayoría de componentes
- **NO** hay manejo de focus trap en modales
- **NO** hay skip-to-content link
- Los iconos de Material Icons **NO** tienen `aria-hidden` ni `aria-label`
- El toggle **NO** tiene role="switch"
- La tabla **NO** tiene role="grid" ni atributos de accesibilidad
- **NO** se usa Angular CDK a11y (aunque `@angular/cdk` está instalado)
- La navegación por teclado no está implementada

---

# 18. SECURITY

## 18.1 Autenticación y tokens

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| **Token storage** | ⚠️ localStorage | Los tokens JWT se almacenan en `localStorage` (vulnerable a XSS) |
| **Refresh token** | ✅ Implementado | Rotación de refresh token en cada refresh |
| **Sesión expira** | ✅ Implementado | 24h de inactividad → auto-logout |
| **Self-XSS warning** | ✅ Implementado | Console warning en producción |
| **HTTPS** | ✅ | Backend en AWS API Gateway con HTTPS |

## 18.2 Protección de rutas

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| **authGuard** | ✅ Activo | En dashboard, business, roles-and-permissions, profile |
| **permissionGuard** | ⚠️ Definido pero NO usado | No hay rutas con `data: { viewPermission: '...' }` |
| **roleGuard** | ⚠️ Definido pero NO usado | No hay rutas con `data: { roles: [...] }` |
| **checkPermission directive** | ✅ Implementado | `*appCheckPermission` en templates |

## 18.3 Vulnerabilidades identificadas

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| **XSS vía localStorage** | HIGH | Tokens en localStorage accesibles desde cualquier script |
| **sessionStorage para contraseña** | MEDIUM | `PasswordTransferService` guarda email y password en sessionStorage durante flujo de reset |
| **No Content Security Policy** | MEDIUM | No se observa header CSP |
| **No HttpOnly cookies** | HIGH | Los tokens deberían estar en cookies HttpOnly, no en localStorage |
| **Console.error con datos** | LOW | `console.error('Error al parsear userData...')` en auth.service.ts podría loguear datos sensibles |

## 18.4 Exposición de secretos

- **NO** se encontraron API keys, secrets o credenciales hardcodeadas en el código fuente
- Las URLs de API están en `environments/` (esperado)
- Las URLs externas (ui-avatars.com, googleapis.com) son públicas

---

# 19. ENVIRONMENT

## 19.1 Archivos de entorno

| Archivo | `production` | `baseUrl` |
|---------|-------------|-----------|
| `environment.ts` (default) | `false` | `http://localhost:3000` |
| `environment.develop.ts` | `true` | `https://zvwuixec9i.execute-api.us-east-1.amazonaws.com/` |
| `environment.local.ts` | `true` | `http://localhost:3000` |
| `environment.prod.ts` | `true` | `https://3rns8qoa8g.execute-api.us-east-1.amazonaws.com/` |

## 19.2 Variables de entorno utilizadas

| Variable | Uso |
|----------|-----|
| `environment.production` | `enableProdMode()`, Self-XSS warning |
| `environment.baseUrl` | Construcción de `ApiPathEnum.AUTH` y `ApiPathEnum.RESTAURANT` |

## 19.3 Reemplazo de archivos

```json
// angular.json
"production": {
  "fileReplacements": [
    { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
  ]
},
"development": {
  "fileReplacements": [
    { "replace": "src/environments/environment.ts", "with": "src/environments/environment.develop.ts" }
  ]
}
```

---

# 20. BUILD / DEPLOY

## 20.1 Build

- **Builder:** `@angular-devkit/build-angular:application` (ESBuild-based)
- **Output:** `dist/main/browser`
- **Default configuration:** `production`
- **Serve default:** `local`

### Scripts

| Script | Comando |
|--------|---------|
| `start` | `ng serve --open` |
| `build` | `ng build` |
| `watch` | `ng build --watch --configuration development` |

## 20.2 Netlify

**Configuración (`netlify.toml`):**

```toml
[build]
command = "npm run build"
publish = "dist/main/browser"

[context.production]
command = "npm run build -- --configuration production"

[context.develop]
command = "npm run build -- --configuration development"

[build.environment]
NODE_VERSION = "22"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[build.processing.html]
pretty_urls = true
```

- **Node:** v22
- **SPA redirect:** `/* → /index.html` (200) — necesario para Angular routing
- **Pretty URLs:** Activado
- **CI/CD:** No se observa configuración de GitHub Actions u otro CI. El build se ejecuta en Netlify directamente.

## 20.3 Dominios

- **Desarrollo:** Netlify auto-generated (deploy context `develop`)
- **Producción:** Netlify auto-generated (deploy context `production`)
- No se encontraron dominios personalizados en la configuración

---

# 21. TESTS

## 21.1 Unit Tests (Karma + Jasmine)

**Total de archivos `.spec.ts`:** 44

### Distribución por módulo

| Módulo | Specs | Archivos |
|--------|-------|----------|
| **Layout** | 11 | navbar, navbar-menu, navbar-submenu, profile-menu, navbar-mobile, navbar-mobile-menu, navbar-mobile-submenu, sidebar, sidebar-menu, sidebar-submenu, footer, layout |
| **Dashboard** | 7 | dashboard, nft, nft-header, nft-single-card, nft-dual-card, nft-chart-card, nft-auctions-table, nft-auctions-table-item |
| **Auth** | 5 | auth, sign-in, sign-up, forgot-password, new-password, two-steps |
| **Uikit** | 5 | uikit, table, table-action, table-footer, table-header, table-row |
| **Error** | 3 | error, error404, error500 |
| **Core** | 1 | theme.service |
| **Shared** | 1 | responsive-helper |
| **Profile** | 1 | profile |
| **Roles & Permissions** | 1 | permissions |

### Áreas sin cobertura de tests

| Área | Archivos sin spec |
|------|-------------------|
| **Todos los data-access services** (~30+) | Ninguno tiene spec |
| **Guards** | auth.guard, permission.guard, role.guard |
| **Interceptors** | auth.interceptor |
| **AuthService** | Sin spec |
| **WhoamiService** | Sin spec |
| **MenuService** | Sin spec (solo hay spec del menu.service, no del menu lógico) |
| **Restaurante module** | 0 specs |
| **Roles-and-permissions** (excepto permissions) | 0 specs para dashboard, users, roles, modules, roles-user, roles-permissions |
| **UIM module** | 0 specs |
| **All UI library (src/ui/)** | 0 specs (97 archivos sin tests) |
| **Directives** | 0 specs (check-permission, rut-format, case-transform, click-outside, slot) |
| **Pipes** | 0 specs |
| **Utils** | 0 specs |
| **Custom validators** | 0 specs |

## 21.2 E2E Tests (Playwright)

**Total:** 3 tests

| Test | Archivo | Alcance |
|------|---------|---------|
| Navbar | `tests-e2e/navbar.e2e.spec.ts` | Navegación del navbar |
| Sidebar | `tests-e2e/sidebar.e2e.spec.ts` | Interacción del sidebar |
| Table | `tests-e2e/table.e2e.spec.ts` | Funcionalidad de tabla |

**Configuración Playwright:**
- Browsers: Chromium, Firefox, WebKit
- BaseURL: `http://localhost:4200`
- Mobile viewports: Comentados (no activos)
- No hay tests de flujos completos (auth, CRUD, business setup)

---

# 22. DEPENDENCIES

## 22.1 Dependencias principales

| Dependencia | Versión | Uso |
|------------|---------|-----|
| `@angular/core` | ^19.1.4 | Framework |
| `@angular/material` | ^19.1.4 | UI components (dialog, form fields) |
| `@angular/cdk` | ^19.1.4 | Component Dev Kit |
| `tailwindcss` | ^4.0.5 | CSS framework |
| `@tailwindcss/forms` | ^0.5.10 | Form reset plugin |
| `@tailwindcss/typography` | ^0.5.16 | Typography plugin |
| `@tailwindcss/aspect-ratio` | ^0.4.2 | Aspect ratio plugin |
| `tailwind-scrollbar` | ^4.0.0 | Scrollbar styling |
| `apexcharts` | ^4.0.0 | Charts |
| `ng-apexcharts` | ^1.7.1 | Angular wrapper para ApexCharts |
| `ngx-sonner` | ^2.0.1 | Toast notifications |
| `angular-svg-icon` | ^13.0.0 | SVG icon component |
| `rxjs` | ~7.4.0 | Reactive programming |

## 22.2 DevDependencies

| Dependencia | Versión | Uso |
|------------|---------|-----|
| `@angular/cli` | ^19.1.5 | CLI |
| `@playwright/test` | ^1.50.1 | E2E testing |
| `karma` / `jasmine` | ~6.3 / ~3.10 | Unit testing |
| `prettier` | ^2.7.1 | Code formatting |
| `typescript` | ~5.7.3 | TypeScript |
| `autoprefixer` | ^10.4.7 | CSS vendor prefixes |
| `postcss` | ^8.5.1 | CSS processing |

## 22.3 Observaciones

- **RxJS ~7.4.0** — versión antigua para Angular 19 (que espera ~7.8). Posible riesgo de compatibilidad.
- **Tailwind CSS v4** — usa configuración CSS nativa (sin `tailwind.config.js`)
- **`@tailwindcss/postcss`** instalado pero no se usa en `styles.css` — posible remanente
- **`cz-conventional-changelog`** — commitizen configurado pero sin husky/lint-staged

---

# 23. REDOM FUNCTIONALITY MATRIX

| Funcionalidad | Estado | Evidencia |
| ------------- | ------ | --------- |
| Login | IMPLEMENTED | `/auth/sign-in`, `AuthService.login()`, POST `/auth/api/login/authenticate-user` |
| Register | IMPLEMENTED | `/auth/sign-up`, `SignUpComponent`, validators |
| Dashboard | PARTIAL | Indicadores hardcoded, tabla NFT placeholder, sin datos reales |
| Restaurant | PARTIAL | CRUD parcial: crear, listar, activar. Update/delete stub. Setup wizard implementado |
| Users | IMPLEMENTED | CRUD completo en `/roles-and-permissions/users` |
| Roles | IMPLEMENTED | CRUD completo en `/roles-and-permissions/roles` |
| Permissions | IMPLEMENTED | CRUD completo en `/roles-and-permissions/permissions` |
| Features (Módulos) | IMPLEMENTED | CRUD completo en `/roles-and-permissions/modules` |
| Products | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Categories | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Public Menu | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Tables | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| QR | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Orders | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Kitchen | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Reservations | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Inventory | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios (el setup wizard menciona inventario pero sin funcionalidad real) |
| Recipes | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| POS | NOT IMPLEMENTED | El setup wizard tiene step 5 "POS" (solo configuración, sin funcionalidad real) |
| Accounts | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Split Payment | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Customers | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Audit | NOT IMPLEMENTED | Sin código, sin rutas, sin servicios |
| Profile | IMPLEMENTED | Vista de perfil con 3 cards + update contact modal |
| Theme Switching | IMPLEMENTED | 7 colores + dark/light mode |
| Responsive Design | IMPLEMENTED | Layout responsivo con sidebar colapsable, navbar mobile, bottom navbar |
| Error Pages | IMPLEMENTED | `/errors/404` + `/errors/500` con ilustraciones SVG |
| RBAC (User-Role assignment) | IMPLEMENTED | `/roles-and-permissions/roles-user` |
| RBAC (Role-Permission assignment) | IMPLEMENTED | `/roles-and-permissions/roles-permissions` |
| Permission-based menu | IMPLEMENTED | `MenuService.#filteredPagesMenu` (computed signal) |
| Password Recovery | IMPLEMENTED | forgot-password, reset-password, temporary-password flows |
| 2-Step Verification | UNKNOWN | Ruta `/auth/two-steps` existe con componente pero no se verificó funcionalidad backend |

---

# 24. UX / PRODUCT DEBT

## CRITICAL

| Issue | Descripción | Ubicación |
|-------|-------------|-----------|
| **Tokens en localStorage** | Vulnerabilidad XSS. Tokens JWT accesibles desde cualquier script | `AuthService` |
| **Dashboard con datos placeholder** | Indicadores hardcoded, tabla muestra datos NFT en vez de usuarios | `AdminComponent`, `UsersDashboardTableComponent` |
| **Sin permissionGuard activo** | Guards de permisos y roles definidos pero no usados en rutas — solo `authGuard` | `app-routing.module.ts`, `*-routing.module.ts` |
| **0 tests en UI library** | 97 archivos en `src/ui/` sin cobertura de tests | `src/ui/**` |
| **0 tests en data-access services** | ~30+ servicios sin tests unitarios | `modules/**/data-access/` |
| **A11y ausente** | Sin atributos ARIA, sin focus trap, sin skip-to-content | Toda la app |

## HIGH

| Issue | Descripción | Ubicación |
|-------|-------------|-----------|
| **Funcionalidades stub** | Update/delete de negocios muestran toast "en construcción" | `BusinessTableComponent` |
| **Nombres placeholder en UI** | "hola mundo", "Hola mundo", indicadores genéricos | `AdminComponent` |
| **Datos incorrectos en tabla** | Columna "Open Price" muestra `item.creator` | `UsersDashboardTableComponent` |
| **Modelo NFT irrelevante** | Interfaz `Nft` y componentes NFT para una app de restaurantes | `DashboardModule` |
| **Sin tests E2E de flujos** | Solo 3 tests (navbar, sidebar, table) — sin tests de auth, CRUD, business | `tests-e2e/` |
| **Sin cobertura de tests en guards/interceptors** | 0 tests para auth.guard, permission.guard, role.guard, auth.interceptor | `core/` |
| **Sin Content Security Policy** | Headers de seguridad no configurados | `netlify.toml`, `index.html` |
| **Password en sessionStorage** | `PasswordTransferService` almacena credenciales temporales | `auth/pages/data-access/` |

## MEDIUM

| Issue | Descripción | Ubicación |
|-------|-------------|-----------|
| **Organisms sub-poblada** | 1 solo componente en organisms vs 6 en templates | `src/ui/` |
| **Tipos de letra sin fallback** | `font-poppins` sin `font-sans` como fallback | `index.html` |
| **Tailwind plugin redundante** | `@tailwindcss/postcss` instalado pero no usado | `package.json` |
| **Names inconsistentes** | `restaurante` (español), `roles-and-permissions` (inglés), `uikit`/`uim` (abreviaturas) | Módulos |
| **No HttpOnly cookies** | Deuda de seguridad para producción | `AuthService`, interceptor |
| **RxJS versión antigua** | ~7.4.0 vs ~7.8 esperado para Angular 19 | `package.json` |
| **Archivo con typo** | `ckassnames.ts` (debería ser `classnames.ts`) | `shared/utils/` |
| **Archivo con typo** | `navbar-mobilecomponent.ts` (falta `.` entre mobile y component) | `layout/components/navbar/navbar-mobile/` |

## LOW

| Issue | Descripción | Ubicación |
|-------|-------------|-----------|
| **Dependencias de demo** | `angular-svg-icon`, componentes NFT — no se usan en features reales | `package.json`, `DashboardModule` |
| **Pipes placeholder** | `.gitkeep` en `shared/pipes/` — carpeta vacía | `shared/pipes/` |
| **Validators placeholder** | `.gitkeep` en `shared/validators/` — carpeta vacía | `shared/validators/` |
| **Utils placeholder** | `.gitkeep` en `core/utils/` — carpeta vacía | `core/utils/` |
| **Interceptor placeholder** | `.gitkeep` en `core/interceptor/` — innecesario (ya existe auth.interceptor.ts) | `core/interceptor/` |
| **Modales con width fijo** | `width: '90%'` en modales — mejor usar breakpoints | `BusinessComponent` |
| **Sin lazy loading de imágenes** | Imágenes de assets sin `loading="lazy"` | Templates varios |
| **Dead code en dashboard** | Página NFT (`/nft`) con componentes específicos que no son del dominio | `DashboardModule` |
| **Mobile viewports no testeado** | Playwright mobile viewports comentados | `playwright.config.ts` |

---

# 25. RECOMENDACIONES

## 25.1 Recommended Next Steps

Basado en la arquitectura existente (Angular 19 standalone, Atomic Design, service-per-endpoint, Signals, Tailwind v4):

### Fase 1: Estabilización y Seguridad

1. **Activar `permissionGuard` y `roleGuard` en rutas** — ya están definidos, solo falta agregar `data` a las rutas:
   ```typescript
   { path: 'users', component: UsersComponent, data: { viewPermission: 'users:see-module' } }
   ```

2. **Migrar tokens a cookies HttpOnly** o evaluar BFF (Backend For Frontend) para manejo de sesión

3. **Agregar Content Security Policy** en `netlify.toml` headers o `index.html` meta tags

4. **Eliminar `PasswordTransferService`** o reemplazar sessionStorage por estado en memoria con RxJS Subject

5. **Corregir tipografía fallback:** `font-poppins` → agregar `sans-serif` como fallback

### Fase 2: Dashboard Real

6. **Reemplazar indicadores hardcoded** por datos reales del backend (crear endpoints de métricas)

7. **Eliminar tabla NFT** y reemplazar con tabla real de usuarios/negocios con datos del backend

8. **Eliminar página NFT** completa (`/nft`, `NftComponent`, modelos Nft, componentes NFT)

9. **Crear servicios de dashboard** siguiendo el patrón `data-access/` existente

### Fase 3: Completar Features Core

10. **Implementar update/delete de negocios** — ya tienen modal stubs, solo falta conectar endpoints

11. **Completar setup wizard** con validación real y guardado de datos

12. **Agregar tests unitarios** a servicios data-access siguiendo el patrón de `theme.service.spec.ts`

### Fase 4: Nuevas Features (siguiendo arquitectura existente)

13. **Products y Categories** — crear `modules/products/` con estructura `pages/`, `data-access/`, `features/`, `ui/`

14. **Tables/Mesas** — crear `modules/tables/` con vista de floor plan y gestión

15. **Orders** — crear `modules/orders/` con vista de pedidos y estados

16. **Reservations** — crear `modules/reservations/` con calendario

17. Cada feature nueva debe seguir el patrón: módulo NgModule + routing module con lazy loading + service-per-endpoint en data-access

### Fase 5: Calidad

18. **Agregar tests a `src/ui/`** — al menos tests de renderizado para atoms y molecules

19. **Agregar tests E2E** para flujos críticos: login → dashboard → crear negocio → setup wizard

20. **Corregir nombres de archivo** (`ckassnames.ts` → `classnames.ts`, `navbar-mobilecomponent.ts` → `navbar-mobile.component.ts`)

21. **Limpiar `.gitkeep`** de carpetas vacías o poblarlas

22. **Auditar accesibilidad** — agregar atributos ARIA a componentes interactivos (usar Angular CDK a11y ya instalado)

23. **Habilitar mobile viewports en Playwright** para testing responsive

### Fase 6: DevOps

24. **Agregar CI/CD pipeline** (GitHub Actions) con lint, test, build, e2e

25. **Configurar dominios personalizados** en Netlify

26. **Agregar `lint-staged` + `husky`** para pre-commit hooks

---

# 26. ARQUITECTURA ACTUAL — DIAGRAMA CONCEPTUAL

```
┌─────────────────────────────────────────────────┐
│                   AppComponent                   │
│              (standalone, bootstrap)             │
│  ┌───────────────────────────────────────────┐  │
│  │         AppRoutingModule (lazy)            │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │ Layout  │ │  Auth    │ │  Error    │  │  │
│  │  │ Module  │ │  Module  │ │  Module   │  │  │
│  │  └────┬────┘ └──────────┘ └───────────┘  │  │
│  │       │ (shell: sidebar+navbar+footer)     │  │
│  │       │                                    │  │
│  │  ┌────┴──────────────────────────────┐    │  │
│  │  │  Layout Children (lazy)           │    │  │
│  │  │  • Dashboard (admin + nft)        │    │  │
│  │  │  • Business/Restaurante           │    │  │
│  │  │  • Roles & Permissions (7 pages)  │    │  │
│  │  │  • Profile                        │    │  │
│  │  │  • Uikit / UIM (components)       │    │  │
│  │  └───────────────────────────────────┘    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Core (singletons)                        │  │
│  │  AuthService • WhoamiService              │  │
│  │  ThemeService • MenuService               │  │
│  │  Guards (3) • Interceptor (1)             │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  UI Library (Atomic Design)               │  │
│  │  Atoms (6) • Molecules (9)                │  │
│  │  Organisms (1) • Templates (6)            │  │
│  │  Utils (5 directives/pipes)               │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Shared                                    │  │
│  │  Permissions enum • check-permission dir   │  │
│  │  Responsive helper • Dummy data            │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

**Fin de la auditoría.**
