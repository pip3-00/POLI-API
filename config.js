/**
 * CONFIGURACIÓN CENTRALIZADA - Politécnico Ann y Ted Kheel
 * URL base del API - Configuración para GitHub Pages
 */

// ⚙️ CONFIGURACIÓN DE RED - URL del API en producción
// NOTA: Para GitHub Pages, el API debe estar en un servidor externo
// Si el backend no está disponible, los features que dependen de él no funcionarán

const API_URL = "https://tu-servidor-api-production.com";

// Configuración global del aplicativo
const CONFIG = {
    API_URL: API_URL,
    APP_NAME: "Politécnico Ann y Ted Kheel",
    VERSION: "1.0.0"
};

// Asignar al objeto window para acceso global
window.API_URL = API_URL;
window.APP_CONFIG = CONFIG;

console.log('✅ Configuración cargada:', CONFIG.APP_NAME, 'v' + CONFIG.VERSION);
console.log('📡 API URL:', API_URL);
