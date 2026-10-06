# REDOM — Solicitudes al backend

Cambios que el frontend necesita del backend (`redom-chile-backend`), detectados al integrar cada módulo.
Cada solicitud indica el endpoint, el problema, lo que se pide y cómo lo resuelve el front mientras tanto.

Estados: 🔴 bloquea una funcionalidad o produce datos erróneos · 🟡 el front usa un workaround · ⚪ por decidir · 🟢 resuelto (mover a la sección final)

---

## Resumen

| Prioridad | Solicitudes |
|---|---|
| 🟡 Hay workaround en el front | #15 token de dispositivo para impresión · #16 permiso para ver todas las reservas (fase de permisos) · #28 códigos de error faltantes · #29 `QR_BASE_URL` por ambiente · #30 color de marca del restaurante |
| ⚪ Por decidir | #25 entrar solo con PIN |
| 🟢 Resueltas | #1–#14, #17–#24, #26, #27 |

Pendiente del front: la página pública de la carta `app.redom.cl/carta/:qrCode`, que consume `GET /restaurant/api/menu/:qrCode` (ver #7).

---

## Pendientes

### 15. 🟡 Impresión — token de dispositivo para estaciones y agentes

**Problema:** `/print-jobs/pending` y `PATCH /print-jobs/:id` exigen el JWT de un usuario. La Estación de impresión (y un futuro agente local) queda atada a la sesión de una persona: si expira o la persona cierra sesión, se deja de imprimir.

**Se pide:** credenciales de dispositivo de larga duración por local (API key o token de dispositivo) con permiso solo para leer y actualizar trabajos de impresión.

**Front mientras tanto:** la estación usa la sesión del usuario que la abrió.

---

### 16. 🟡 `GET /bookings` — solo el permiso `crud_all_bookings` ve todas las reservas

**Problema:** sin el permiso `crud_all_bookings`, el listado muestra solo las reservas creadas o asignadas al usuario. Ese código no sigue el formato del resto de los permisos (`modulo:accion`, por ejemplo `bookings:get-all`), y un administrador sin él ve una agenda incompleta sin saberlo.

**Se pide:** renombrarlo al formato estándar (por ejemplo `bookings:see-all`) y documentarlo; idealmente, que el rol administrador lo tenga por defecto.

**Front mientras tanto:** la agenda muestra lo que devuelve el backend.

### 25. ⚪ (A definir) Entrar a la terminal solo con PIN

**Problema:** hoy el mesero elige su nombre y luego ingresa el PIN (`POST /pos/check-staff-pin` necesita `userId`). Entrar solo con el PIN no es posible: el PIN está cifrado y no es único.

**Se pide (si el negocio lo decide):** PIN único por restaurante (409 al asignar uno repetido), `POST /pos/login-by-pin { pin }` que devuelva el mesero, y límite de intentos por equipo/restaurante (no por mesero).

**Front mientras tanto:** selección de mesero + PIN.

### 26. 🟡 `GET /roles-and-permissions/roles` sin orden

**Problema:** la consulta no tiene `ORDER BY` y la paginación se hace en memoria (`PaginationInterceptor`), así que el orden es arbitrario. Un rol recién creado puede caer en cualquier página y parece que "no se creó".

**Se pide:** ordenar en la consulta: roles del restaurante primero (`restaurantId IS NULL` al final) y luego `createdAt DESC`.

**Front mientras tanto:** pide 50 por página y ordena en pantalla (propios más nuevos primero, predeterminados al final). Los roles `isGlobal` se muestran como "Predeterminado", sin editar ni eliminar.

### 30. 🟡 Color de marca del restaurante (`theme_color`)

**Problema:** la tabla `restaurant.business` ya tiene la columna `theme_color` (migración inicial), pero la entidad y los DTOs no la exponen. El color que elige el restaurante no se puede guardar ni leer.

**Se pide:** mapear `themeColor` en la entidad del negocio; aceptarlo en `PATCH /business/:id/settings` (valores permitidos: `base`, `red`, `orange`, `yellow`, `green`, `blue`, `violet`; `null` vuelve al predeterminado) y devolverlo en `GET /business/:id/settings` y en `GET /business/my-businesses`.

**Front mientras tanto:** "Mi negocio" permite elegir el color y ya envía `themeColor` en el PATCH (hoy el backend lo descarta en silencio). El color se guarda además en el navegador (`redom.brand-color.<restaurantId>`), así que por ahora solo se ve en el equipo donde se eligió.

---

## Resueltas

Resueltas por el backend en octubre de 2026. Se indica cuando la solución quedó distinta a lo pedido.

| # | Qué se resolvió |
|---|---|
| 1 | `GET /orders` trae `status`, `paymentStatus`, `finalTotal`, `customerName`, `contactId`, `resTableId` y `locationId`, y filtra por `status`, `paymentStatus`, `dateFrom`/`dateTo`, `resTableId` y `locationId`. |
| 2 | `GET /tables` trae `currentTransactionId` y `openTransactionIds`. |
| 3 | `POST /orders` y `POST /orders/:id/lines` aceptan `note` por producto; sale en la comanda y en el KDS. |
| 4 | Cancelar un pedido ya no cuenta los pagos anulados. |
| 5 | **Distinto:** solo se documentó en Swagger que el `:id` de `mark-line-served` es el de la línea; la ruta no cambió. |
| 6 | `PUT /tables/:id`: `occupied` → 409; con pedido abierto → 409; sin pedido → `available`, `reserved` o `blocked`. |
| 7 | `qrUrl = https://app.redom.cl/carta/{qrCode}` y endpoint público `GET /restaurant/api/menu/:qrCode`. **La página de la carta la construye el front.** |
| 8 | DTOs de `/pos/*` documentados; `POST /pos/details` devuelve los meseros reales (antes llegaba vacío). |
| 9 | `GET /auth/api/users` trae `hasPin`; el PIN es de 4 dígitos exactos. |
| 10 | **Distinto:** no hay FK real; el backend valida la sucursal (404). `POST /internal-user` acepta `branchId` y devuelve `{ code }`; `GET /users` trae `branchId`; se limpia la caché del perfil al editar; `GET /pos/service-staff` acepta `?locationId=` y devuelve `branchId`. |
| 11 | `PUT /kitchen/:id/mark-cooked?stationId=` marca solo las líneas de esa estación. |
| 12 | `GET /kitchen` trae `staffNote` y `additionalNotes` por pedido y `sellLineNote` por línea. |
| 13 | **Distinto:** la prueba es `POST /print-jobs/test` `{ printerId }`; `GET /printers` trae `lastSeenAt`. |
| 14 | **Distinto:** el claim es `POST /print-jobs/pending/claim?printerId=&agentId=`; los trabajos no reportados en 2 minutos vuelven a quedar disponibles; se cierran con `PATCH /print-jobs/:id`. |
| 17 | `GET /bookings` trae `customerMobile`, `contactId` y `tableId`; filtro `?status=`; se aplica `?userId=`; crear y editar devuelven `{ id }`. |
| 18 | `DELETE /contacts/:id`; `q` opcional en `GET /customers`; `PUT /contacts/:id` → 409 si el teléfono existe; `GET /customers/:id` trae `summary { visits, totalSpent, avgTicket, lastVisitAt }`. |
| 19 | `GET /dashboard` trae `salesByDay`, `salesByCategory`, `paymentsByMethod` y `tables { total, occupied }`; `sales` y `orders` usan `current`/`previous` (`today`/`yesterday` quedan como alias). |
| 20, 23 | El id se toma solo de la URL en `PUT`/`DELETE /products/:id`, `PATCH /stations/:id`, `PUT /contacts/:id`, `POST`/`DELETE /contacts/:id` y `PUT /tables/:id`. |
| 22 | Todos los errores traen `code` y, cuando aplica, `details` (por ejemplo `CUSTOMER_PHONE_EXISTS`, `SCHEDULE_OVERLAP`, `BOOKING_TABLE_CAPACITY`). |
| 24 | `GET /products` acepta `isActive` y `sellable=true`. |
| 26 | Roles ordenados en la consulta; se corrigió `active=false`. |
| 27 | Contraseña actual incorrecta → 400 `CURRENT_PASSWORD_INVALID`; solo se puede cambiar la propia contraseña. |

Además, sin pedirlo: `GET /auth/api/users` ya no llega vacío desde la página 2.

### 21. ✅ Subida de imágenes (productos, categorías, logo y foto de perfil)

**Resuelto con:** subida en 3 pasos con URL prefirmada de S3: `POST /files/upload-url` → `PUT` directo a S3 → `POST /files/:id/confirm`. El `fileId` se asocia con `imageFileId` (productos y categorías), `logoFileId` (`PATCH /business/:id/settings`) y `PUT /auth/api/profile/image`. Las respuestas traen `imageUrl`, `logoUrl` y `profileImageUrl`, que son URLs firmadas válidas por 1 hora.

**Front:** el campo "Imagen (URL)" se reemplazó por el selector de imagen en todos los formularios. Funciona en local y en develop.
