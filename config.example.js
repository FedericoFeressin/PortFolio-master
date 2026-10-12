/**
 * CONFIGURACIÓN DE EMAILJS - ARCHIVO DE EJEMPLO
 * 
 * Copia este archivo a config.js y reemplaza los valores con tus credenciales reales.
 * NO subas config.js al repositorio (agrégalo a .gitignore).
 * 
 * Para obtener tus credenciales:
 * 1. Ve a https://www.emailjs.com/
 * 2. Regístrate o inicia sesión
 * 3. Ve a Admin → Account → API Keys
 * 4. Copia tu PUBLIC_KEY
 * 5. Ve a Email Services → Conecta Gmail/tu email
 * 6. Copia el SERVICE_ID
 * 7. Ve a Email Templates → Crea una plantilla
 * 8. Copia el TEMPLATE_ID
 */

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',        // Ej: abc_def_123xyz...
    SERVICE_ID: 'service_TU_SERVICE_ID',     // Ej: service_abc123xyz
    TEMPLATE_ID: 'template_TU_TEMPLATE_ID',  // Ej: template_abc123xyz
    RECEIVER_EMAIL: 'tu-email@ejemplo.com'
};

console.log('⚠️ Estás cargando config.example.js — crea config.js local con tus valores reales.');

export default EMAILJS_CONFIG;