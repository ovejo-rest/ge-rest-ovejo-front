# REDOM — Solicitudes al backend

Cambios que el frontend necesita del backend (`ge-rest-ovejo-backend`), detectados al integrar cada módulo.
Cada solicitud indica el endpoint, el problema, lo que se pide y cómo lo resuelve el front mientras tanto.

Estados: 🔴 bloquea una funcionalidad o produce datos erróneos · 🟡 el front usa un workaround · ⚪ por decidir · 🟢 resuelto (mover a la sección final)

---

## Resumen

| Prioridad | Solicitudes |
|---|---|
| 🔴 Bloquean o producen datos erróneos | #1 listado de pedidos · #3 notas por producto · #4 cancelar pedido con pago anulado · #11 "Listo" en cocina marca todas las estaciones |
| 🟡 Hay workaround en el front | #2, #5–#10, #12–#24, #26, #27 |
| ⚪ Por decidir | #25 entrar solo con PIN |

Sugerencia de orden: #4 y #11 (bugs), #3 y #12 (notas en comanda y KDS), #1 y #2 (pedidos y mesas), #15 y #14 (impresión y terminal sin sesión de usuario), #22 (códigos de error).

---

## Pedidos

### 1. 🔴 `GET /orders` — faltan campos y filtros en el listado

**Problema:** el listado solo devuelve `transactionId`, `invoiceNo`, `tableName`, `waiterName`, `orderDate` y `resOrderStatus`, y solo filtra por `serviceStaff`. No se puede saber qué cuentas están abiertas, cuáles faltan por pagar, cuánto suman ni a qué cliente pertenecen.

**Se pide:**
- Campos en cada ítem: `status` (`ORDERED` | `FINAL` | `CANCELLED`), `paymentStatus` (`due` | `partial` | `paid`), `finalTotal`, `customerName` y `contactId`. La vista `AllOrdersView` ya tiene `customerName` y `contactId`.
- Filtros por query: `status`, `paymentStatus`, `dateFrom` / `dateTo` (`YYYY-MM-DD`, en la zona horaria del negocio), `resTableId` y `locationId`.

**Front mientras tanto:** el listado muestra solo los campos disponibles y filtra por mesero. El estado, el pago y el total se ven en el detalle (`GET /orders/:id`).

### 2. 🟡 `GET /tables` — falta el pedido abierto de cada mesa

**Problema:** al tocar una mesa ocupada, el front debería abrir su cuenta, pero `GET /tables` no indica qué pedido tiene abierto, y `GET /orders` no permite filtrar por mesa ni por estado (ver solicitud 1).

**Se pide:** agregar `currentTransactionId: number | null` (el pedido `ORDERED` de la mesa) en cada mesa de `GET /tables`.

**Front mientras tanto:** al tocar una mesa ocupada, busca en los últimos 100 pedidos (`GET /orders`) los que tienen el nombre de la mesa y revisa hasta 5 detalles (`GET /orders/:id`) hasta encontrar uno `ORDERED` con ese `resTableId` (`find-table-open-order.service.ts`). Son varias llamadas y puede fallar si la cuenta es más antigua que los últimos 100 pedidos. Con `currentTransactionId` sería una navegación directa.

### 3. 🔴 `POST /orders` y `POST /orders/:id/lines` — sin nota por producto

**Problema:** `GET /orders/:id` trae `sellLineNote` por línea y la comanda impresa (`GET /print-jobs/pending`) tiene `items[].notes`, pero no hay forma de enviar la nota al crear el pedido o agregar líneas ("completo sin palta", "término medio").

**Se pide:** aceptar `note?: string` en cada elemento de `products[]` y guardarla en `sellLineNote` (así sale en la comanda de su estación y en el KDS).

**Front mientras tanto:** el ticket permite nota por producto, pero se envían todas juntas en `staffNote` del pedido ("1x Completo: sin palta"), que es la que se imprime. Al **agregar** productos a una cuenta abierta la nota se suma con `PATCH /orders/:id` **después** de agregarlos, por lo que la comanda de ese agregado sale **sin la nota**.

### 4. 🔴 `PATCH /orders/:id/cancel` — cuenta pagos ya anulados

**Problema:** `cancel-order-by-id-sql.service.ts` revisa `paymentRepository.exists({ where: { transactionId } })`, que incluye los pagos anulados con `PATCH /payments/:id/cancel`, porque quedan registrados con `cancelledAt`. Un pedido que tuvo un pago y luego lo anuló **nunca** se puede cancelar: siempre responde 409 "The order has payments".

**Se pide:** filtrar solo los pagos vigentes: `where: { transactionId: order.id, cancelledAt: IsNull() }`.

**Front mientras tanto:** deshabilita "Cancelar pedido" cuando `totalPaid > 0` y muestra el mensaje del backend si responde 409.

### 5. 🟡 `PUT /orders/:id/mark-line-served` — el `:id` es el de la línea

**Problema:** la ruta cuelga de `/orders/:id`, pero el `:id` se interpreta como **id de línea** (`lineId`), no como id del pedido. Es confuso y fácil de usar mal.

**Se pide (opcional):** `PUT /orders/:orderId/lines/:lineId/mark-served`, o documentarlo en Swagger.

**Front mientras tanto:** envía el `lineId` en el `:id`.

---

## Mesas

### 6. 🟡 `PUT /tables/:id` — acepta cualquier estado a mano

**Problema:** `status` acepta los 4 valores sin validar. Se puede marcar a mano una mesa como `occupied` sin pedido, o como `available` teniendo una cuenta abierta, y queda desalineada con los pedidos (que la cambian solos).

**Se pide:** a mano permitir solo `reserved` y `blocked` (y volver a `available` si **no** hay pedido abierto); responder 409 en los demás casos.

**Front mientras tanto:** el modal de edición solo ofrece Disponible / Reservada / Bloqueada, y si la mesa está ocupada el estado no se puede cambiar.

### 7. 🟡 `QR_BASE_URL` — sin configurar, no hay QR

**Problema:** si `QR_BASE_URL` no está configurado, `qrUrl` es `null` y el front no puede generar el QR (solo tiene el `qrCode`).

**Se pide:** configurar `QR_BASE_URL` en cada ambiente (por ejemplo `https://menu.redom.cl/t`) y definir qué muestra esa página (la carta de la mesa).

**Front mientras tanto:** el modal de QR avisa que falta la configuración.

---

## POS

### 8. 🟡 Swagger — respuestas de `/pos/*` documentadas vacías

**Problema:** `CheckStaffPinResponseDto` y `GetPosDetailsResponseDto` son clases vacías, aunque la API devuelve `{ valid }` y `{ tables, waiters, … }`. En Swagger aparecen sin campos, así que no sirven para generar tipos.

**Se pide:** completar los DTOs de respuesta con sus propiedades y `@ApiProperty`.

**Front mientras tanto:** tipos escritos a mano según el código del backend (`pos.dto.ts`).

### 9. 🟡 `GET /auth/api/users` — no indica si el usuario tiene PIN

**Problema:** `GET /pos/service-staff` trae `hasPin`, pero el listado de usuarios del backoffice no. El administrador no puede ver a quién le falta asignar el PIN del POS.

**Se pide:** agregar `hasPin: boolean` a cada usuario de `GET /auth/api/users`. Además, el PIN del POS se definió de **4 dígitos exactos**: `PUT /users/:userId/service-pin` hoy acepta 4 a 6 (`/^\d{4,6}$/`); cambiar a `/^\d{4}$/`.

**Front mientras tanto:** el botón "PIN del POS" está en todos los usuarios; el POS marca "Sin PIN" en la selección de mesero.

### 10. 🟡 Usuarios — la sucursal (`branchId`) no es una relación real, no se crea ni se lista

**Problema:**
- `auth.users.branch_id` es un entero sin relación con `restaurant.business_locations` (esquemas distintos): puede apuntar a una sucursal borrada o de otro negocio.
- `POST /internal-user` no acepta `branchId` ni devuelve el código del usuario creado.
- `GET /users` no devuelve `branchId`; solo `GET /profile/:code/user` (con caché en Redis, puede mostrar el valor anterior un rato después de editar).
- `GET /pos/service-staff` no devuelve ni filtra por sucursal: la terminal de salón de una sucursal muestra a los meseros de todas.

**Se pide:** validar `branchId` contra las sucursales del negocio (404 si no), aceptarlo en `POST /internal-user` y devolver `{ code }` al crear, incluir `branchId` en `GET /users` y en `whoami`, invalidar la caché del perfil al editar, y en `GET /pos/service-staff` devolver `branchId` y aceptar `?locationId=` (meseros de esa sucursal + los que no tienen sucursal).

**Front mientras tanto:** crear/editar usuario tienen un selector "Sucursal"; al crear se asigna en un segundo paso (buscando el usuario por email y con `PATCH /users/:code`). El Dashboard y los selectores de sucursal usan `whoami.user.branchId` por defecto si corresponde a una sucursal existente. La terminal muestra todos los meseros del restaurante.

---

## Cocina (KDS)

### 11. 🔴 `PUT /kitchen/:id/mark-cooked` — marca listas las líneas de todas las estaciones

**Problema:** marca como `cooked` todas las líneas `received` del pedido, sin considerar la estación. Si la Cocina termina su parte, los productos del Bar del mismo pedido también quedan "listos" y desaparecen de la pantalla del Bar sin haberse preparado.

**Se pide (una de dos):**
- aceptar `stationId` opcional (`PUT /kitchen/:id/mark-cooked?stationId=`) y marcar solo las líneas de productos de esa estación; o
- un endpoint por línea: `PUT /kitchen/lines/:lineId/mark-cooked`.

**Front mientras tanto:** con una estación seleccionada, el botón avisa que marcará listo todo el pedido.

### 12. 🟡 `GET /kitchen` — faltan las notas

**Problema:** la comanda no trae `additionalNotes` del pedido ni `sellLineNote` de cada línea ("sin cebolla"). La cocina no las ve.

**Se pide:** agregar `additionalNotes` al pedido y `sellLineNote` a cada elemento de `lineOrders`.

**Front mientras tanto:** la pantalla de cocina no muestra notas.

### 13. 🟡 Impresoras — sin impresión de prueba ni estado de conexión

**Problema:** al configurar una impresora no hay forma de saber si la IP y el puerto son correctos hasta que llega una comanda real. `POST /print-jobs` exige un `transactionId`.

**Se pide:** `POST /printers/:id/test` que encole un ticket de prueba y, si el agente de impresión lo reporta, un `lastSeenAt` o estado de conexión en `GET /printers`.

**Front mientras tanto:** no hay botón "Imprimir prueba".

### 14. 🟡 `GET /print-jobs/pending` — no reserva los trabajos

**Problema:** leer los pendientes no los marca como "tomados". Si dos equipos atienden la misma impresora (o una pestaña queda abierta dos veces), la comanda se imprime dos veces.

**Se pide:** un "claim" atómico, por ejemplo `POST /print-jobs/claim?printerId=` que pase los trabajos a `printing` con un `claimedBy` y un tiempo de expiración, o `SELECT … FOR UPDATE SKIP LOCKED` en el endpoint actual.

**Front mientras tanto:** la Estación de impresión advierte "un solo equipo por impresora".

### 15. 🟡 Impresión — token de dispositivo para estaciones y agentes

**Problema:** `/print-jobs/pending` y `PATCH /print-jobs/:id` exigen el JWT de un usuario. La Estación de impresión (y un futuro agente local) queda atada a la sesión de una persona: si expira o la persona cierra sesión, se deja de imprimir.

**Se pide:** credenciales de dispositivo de larga duración por local (API key o token de dispositivo) con permiso solo para leer y actualizar trabajos de impresión.

**Front mientras tanto:** la estación usa la sesión del usuario que la abrió.

---

## Reservas

### 16. 🟡 `GET /bookings` — solo el permiso `crud_all_bookings` ve todas las reservas

**Problema:** sin el permiso `crud_all_bookings`, el listado muestra solo las reservas creadas o asignadas al usuario. Ese código no sigue el formato del resto de los permisos (`modulo:accion`, por ejemplo `bookings:get-all`), y un administrador sin él ve una agenda incompleta sin saberlo.

**Se pide:** renombrarlo al formato estándar (por ejemplo `bookings:see-all`) y documentarlo; idealmente, que el rol administrador lo tenga por defecto.

**Front mientras tanto:** la agenda muestra lo que devuelve el backend.

### 17. 🟡 Reservas — faltan datos en el listado y respuestas vacías

**Problema:**
- el listado no trae el teléfono del cliente (para llamar si se atrasa) ni `tableId`/`contactId`, así que editar requiere un `GET /bookings/:id` extra;
- `POST /bookings` y `PUT /bookings/:id` responden vacío (el DTO de respuesta tiene un `placeholder`); crear debería devolver al menos el `id`;
- no hay filtro por `status`.

**Se pide:** agregar `customerMobile`, `tableId` y `contactId` a cada ítem de `GET /bookings`, devolver `{ id }` al crear y aceptar `?status=`.

**Front mientras tanto:** carga el detalle antes de editar y filtra las canceladas en pantalla.

---

## Clientes

### 18. 🟡 Clientes — eliminar con POST y datos del listado

**Problema:**
- eliminar un contacto es `POST /contacts/:id` con el id en el body, en vez de `DELETE /contacts/:id`;
- `GET /customers` exige `q` (no sirve para listar todos); el front usa `GET /contacts?type=customer` sin búsqueda y `GET /customers?q=` con búsqueda, con formatos distintos;
- `PUT /contacts/:id` no valida el teléfono duplicado (al crear sí);
- `GET /customers/:id` trae solo los últimos 20 pedidos: visitas, total gastado y ticket promedio se calculan sobre esos 20.

**Se pide:** `DELETE /contacts/:id`; `q` opcional en `GET /customers`; validar teléfono duplicado al editar (409 con el cliente existente); y agregar a `GET /customers/:id` un resumen histórico (`visits`, `totalSpent`, `avgTicket`, `lastVisitAt`).

**Front mientras tanto:** usa los dos listados según haya búsqueda, elimina con POST y aclara que los indicadores son de los últimos 20 pedidos.

---

## Dashboard

### 19. 🟡 `GET /dashboard` — faltan series y desgloses para gráficos

**Problema:** el dashboard entrega totales del período, pero no la evolución ni los desgloses que pide el producto ("Ventas por día", "Ventas por categoría", "Métodos de pago"). Tampoco entrega mesas ocupadas: el front las calcula con `GET /tables` solo cuando hay una sucursal elegida.

**Se pide:** agregar a la respuesta:
- `salesByDay: { date, sales, orders }[]` del período;
- `salesByCategory: { categoryId, categoryName, revenue }[]`;
- `paymentsByMethod: { method, amount, count }[]` (pagos no anulados);
- `tables: { total, occupied }` (de la sucursal o del negocio);
- nombres claros en `sales` (`current`/`previous` en vez de `today`/`yesterday`, que hoy significan "período" y "período anterior").

**Front mientras tanto:** muestra KPIs, variación contra el período anterior, top productos y pedidos recientes; sin gráficos.

---

## Productos

### 20. 🟡 `DELETE /products/:id` — el id se lee del body

**Problema:** el controlador lee el `id` desde el body (`@Body() DeleteProductRequestDto`) en lugar de la URL. Algunos clientes y proxies descartan el body en un `DELETE`.

**Se pide:** leer el id con `@Param('id', ParseIntPipe)`, igual que `DELETE /categories/:id`.

**Front mientras tanto:** envía el id en la URL y también en el body.

### 21. 🟡 Subida de imágenes de productos

**Problema:** `image` es un string y no existe un endpoint para subir archivos.

**Se pide:** un endpoint de subida (por ejemplo, una URL prefirmada de S3) que devuelva la URL pública.

**Front mientras tanto:** el formulario pide la URL de la imagen.

---

## Transversales

### 22. 🟡 Errores sin código legible por máquina

**Problema:** las reglas de negocio responden solo con un texto en inglés (`message`). El front tiene que buscar frases para traducirlas y, en algunos casos, sacar datos del texto:
- horarios: "It overlaps another range (day 5, 19:00-23:00)";
- reservas: "The table seats 4 people and the booking is for 6", "outside the opening hours"…;
- clientes: el id del cliente existente viene dentro del texto "A customer with this phone already exists (id 12, Juan)".

Si cambia una coma del mensaje, el front deja de traducirlo.

**Se pide:** agregar al formato de error un `code` estable y datos estructurados, por ejemplo `{ statusCode: 409, code: "CUSTOMER_PHONE_EXISTS", message, details: { customerId: 12, name: "Juan" } }`, y lo mismo para `SCHEDULE_OVERLAP`, `BOOKING_TABLE_CAPACITY`, `BOOKING_OUTSIDE_HOURS`, `ORDER_HAS_PAYMENTS`, `TABLE_BLOCKED`, etc.

**Front mientras tanto:** traduce por texto (`*-error-message.ts`) y extrae datos con expresiones regulares.

### 23. 🟡 Endpoints que piden el id en la URL y también en el body

**Problema:** `PUT /products/:id`, `DELETE /products/:id`, `PATCH /stations/:id`, `PUT /contacts/:id` y `POST /contacts/:id` (eliminar) exigen el `id` en el body además de la URL. Es propenso a errores (ids distintos) y no es consistente con el resto (`PATCH /orders/:id`, `PUT /bookings/:id`).

**Se pide:** tomar el id solo de la URL (`@Param('id', ParseIntPipe)`), como en pedidos y reservas.

**Front mientras tanto:** envía el id en ambos lados.

### 24. 🟡 Catálogo — cambiar categoría padre y filtrar productos vendibles

**Problema:**
- `PUT /categories/:id` no acepta `parentId`: una subcategoría no se puede mover a otra categoría ni convertir en principal.
- `GET /products` no filtra por activos ni por "con precio": el POS pide 100 productos (máximo por página) y filtra en pantalla, así que con cartas grandes no aparecen todos.

**Se pide:** aceptar `parentId` en `PUT /categories/:id` (validando los 2 niveles) y en `GET /products` los filtros `isActive=true` y `sellable=true`, o subir el máximo por página para ese caso.

**Front mientras tanto:** el padre solo se elige al crear; el POS muestra hasta 100 productos por categoría o búsqueda.

### 25. ⚪ (A definir) Entrar a la terminal solo con PIN

**Problema:** hoy el mesero elige su nombre y luego ingresa el PIN (`POST /pos/check-staff-pin` necesita `userId`). Entrar solo con el PIN no es posible: el PIN está cifrado y no es único.

**Se pide (si el negocio lo decide):** PIN único por restaurante (409 al asignar uno repetido), `POST /pos/login-by-pin { pin }` que devuelva el mesero, y límite de intentos por equipo/restaurante (no por mesero).

**Front mientras tanto:** selección de mesero + PIN.

### 26. 🟡 `GET /roles-and-permissions/roles` sin orden

**Problema:** la consulta no tiene `ORDER BY` y la paginación se hace en memoria (`PaginationInterceptor`), así que el orden es arbitrario. Un rol recién creado puede caer en cualquier página y parece que "no se creó".

**Se pide:** ordenar en la consulta: roles del restaurante primero (`restaurantId IS NULL` al final) y luego `createdAt DESC`.

**Front mientras tanto:** pide 50 por página y ordena en pantalla (propios más nuevos primero, predeterminados al final). Los roles `isGlobal` se muestran como "Predeterminado", sin editar ni eliminar.

### 27. 🟡 `PATCH /auth/change-password/:code` responde 401 cuando la contraseña actual es incorrecta

**Problema:** 401 es el código de "token vencido". El front, ante un 401, refresca el token y reintenta. En este endpoint no se puede distinguir "contraseña actual incorrecta" de "sesión vencida".

**Se pide:** responder 400 (o 422) con un mensaje claro cuando la contraseña actual no coincide, y dejar el 401 solo para el token.

**Front mientras tanto:** este endpoint no refresca la sesión ante un 401 y muestra "La contraseña actual no es correcta". Si justo el token venció, el usuario ve ese mensaje y al reintentar funciona, porque whoami refresca la sesión cada minuto.

---

## Resueltas

_(ninguna todavía)_
