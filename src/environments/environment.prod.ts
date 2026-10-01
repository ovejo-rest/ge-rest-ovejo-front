export const environment = {
  production: true,
  baseUrl: 'https://3rns8qoa8g.execute-api.us-east-1.amazonaws.com/',
  // Bases de las APIs (en producción cambian por ambiente).
  authApiUrl: 'https://3rns8qoa8g.execute-api.us-east-1.amazonaws.com/auth/api',
  restaurantApiUrl: 'https://3rns8qoa8g.execute-api.us-east-1.amazonaws.com/restaurant/api',
  // Client ID de Google Identity Services (mismo valor que GOOGLE_CLIENT_ID del backend). Vacío = botón deshabilitado.
  googleClientId: '329763575292-ba92a8perje6ctuq4va1a7k7vk8ud7hi.apps.googleusercontent.com',
  // Permisos en el front (ocultar menús, botones y rutas). Apagado hasta la etapa de permisos; el backend valida igual.
  enforcePermissions: false,
};
