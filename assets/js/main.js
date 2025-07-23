console.log('🔥 ULTRA SIMPLE AR SCRIPT');

// Variables globales
let isARStarted = false;

// Mostrar instrucciones al cargar
setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    const instructions = document.getElementById('instructions');
    
    if (loading) loading.style.display = 'none';
    if (instructions) instructions.style.display = 'flex';
}, 2000);

// Botón empezar AR
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-ar');
    if (startBtn) {
        startBtn.onclick = () => {
            console.log('🚀 Starting AR');
            
            // Ocultar overlays
            document.querySelectorAll('#loading-screen, #instructions, .overlay').forEach(el => {
                el.style.display = 'none';
                el.remove();
            });
            
            // Activar AR
            document.body.className = 'ar-active';
            
            // Notificación
            setTimeout(() => {
                showNotification('📹 AR activado! Busca el marker Hiro');
            }, 500);
        };
    }
});

// Función para mostrar info (llamada desde HTML)
window.showInfo = function() {
    console.log('🔍 Show info clicked!');
    showNotification('🎯 ¡Jordan 1 Chicago - El sneaker que cambió todo!');
};

// Función simple de notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF0000;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 10001;
        font-size: 16px;
        font-weight: bold;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

console.log('🔥 Simple script loaded');
