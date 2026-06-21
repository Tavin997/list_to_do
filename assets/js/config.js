// config.js
// ============================================
// CONFIGURAÇÃO DE AMBIENTE
// ============================================

const config = {
    development: {
        API_URL: 'http://localhost/PROJETOS/list_to_do',
        DEBUG: true
    },
    production: {
        API_URL: 'https://list-to-do-cijf.onrender.com',
        DEBUG: false
    }
};

// Detecta ambiente automaticamente
const environment = window.location.hostname === 'localhost' 
    ? 'development' 
    : 'production';

// Exporta a configuração do ambiente atual
const currentConfig = config[environment];

// Uso no seu código
window.API_URL = currentConfig.API_URL;
window.IS_DEBUG = currentConfig.DEBUG;

console.log(`🌐 Ambiente: ${environment}`);
console.log(`📡 API URL: ${window.API_URL}`);