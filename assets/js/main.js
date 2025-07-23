// The Hype Way AR - Main JavaScript

class TheHypeWayAR {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.marker = null;
        this.isARActive = false;
        this.detailsVisible = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupAR();
            // Force show instructions after DOM loads
            this.forceShowInstructions();
        });
    }
    
    forceShowInstructions() {
        // Force show instructions after 2 seconds to prevent infinite loading
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const instructions = document.getElementById('instructions');
            
            console.log('🔧 Checking loading screen...', loadingScreen ? 'found' : 'not found');
            
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.log('🔧 Force hiding loading screen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            if (instructions && instructions.style.display === 'none') {
                console.log('🔧 Force showing instructions');
                instructions.style.display = 'flex';
                instructions.style.opacity = '1';
            }
        }, 2000);
        
        // Also try immediately when DOM loads
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const instructions = document.getElementById('instructions');
            
            if (loadingScreen) {
                loadingScreen.style.opacity = '0.5';
            }
            if (instructions) {
                instructions.style.opacity = '1';
            }
        }, 500);
    }
    
    setupEventListeners() {
        // Start AR button
        const startBtn = document.getElementById('start-ar');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🎯 Start AR button clicked');
                this.startARExperience();
            });
        } else {
            console.log('❌ Start button not found');
        }
        
        // Share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareExperience();
            });
        }
        
        // AR interactions (set up after A-Frame loads)
        setTimeout(() => {
            this.setupARInteractions();
        }, 3000);
    }
    
    setupAR() {
        // Wait for A-Frame to initialize
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => {
                this.scene = scene;
                this.marker = document.querySelector('#jordan-1-marker');
                
                if (this.marker) {
                    // Marker events
                    this.marker.addEventListener('markerFound', () => {
                        console.log('🎯 Marker detectado!');
                        this.onMarkerFound();
                    });
                    
                    this.marker.addEventListener('markerLost', () => {
                        console.log('😞 Marker perdido');
                        this.onMarkerLost();
                    });
                }
                
                console.log('✅ AR Scene initialized');
            });
        } else {
            console.log('❌ A-Frame scene not found');
        }
    }
    
    setupARInteractions() {
        // More info button
        const moreInfoBtn = document.querySelector('#more-info-btn');
        if (moreInfoBtn) {
            moreInfoBtn.addEventListener('click', () => {
                console.log('🔍 More info button clicked');
                this.toggleDetails();
            });
        }
        
        // Close button
        const closeBtn = document.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('❌ Close button clicked');
                this.hideDetails();
            });
        }
    }
    
    startARExperience() {
        // Hide instructions and loading
        const instructions = document.getElementById('instructions');
        const loadingScreen = document.getElementById('loading-screen');
        
        console.log('🚀 Starting AR Experience...');
        
        if (instructions) {
            instructions.style.opacity = '0';
            setTimeout(() => {
                instructions.style.display = 'none';
            }, 500);
        }
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // Request camera permissions explicitly
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    console.log('📹 Camera access granted');
                    // Stop the stream immediately as A-Frame will handle it
                    stream.getTracks().forEach(track => track.stop());
                })
                .catch(err => {
                    console.error('❌ Camera access denied:', err);
                    this.showNotification('⚠️ Necesitas permitir acceso a la cámara');
                });
        }
        
        console.log('🚀 AR Experience started');
    }
    
    onMarkerFound() {
        this.isARActive = true;
        
        // Show share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.classList.remove('hidden');
        }
        
        // Show success notification
        this.showNotification('🎯 ¡Marker detectado! Mira el contenido AR');
        
        console.log('✨ AR Content activated');
    }
    
    onMarkerLost() {
        this.isARActive = false;
        this.hideDetails();
        
        // Hide share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.classList.add('hidden');
        }
    }
    
    toggleDetails() {
        if (this.detailsVisible) {
            this.hideDetails();
        } else {
            this.showDetails();
        }
    }
    
    showDetails() {
        const detailsPanel = document.querySelector('#details-panel');
        if (detailsPanel) {
            detailsPanel.setAttribute('visible', 'true');
            detailsPanel.setAttribute('animation', 'property: scale; from: 0.1 0.1 0.1; to: 1 1 1; dur: 300; easing: easeOutBack');
            this.detailsVisible = true;
            console.log('📖 Details opened');
        }
    }
    
    hideDetails() {
        const detailsPanel = document.querySelector('#details-panel');
        if (detailsPanel && this.detailsVisible) {
            detailsPanel.setAttribute('animation', 'property: scale; from: 1 1 1; to: 0.1 0.1 0.1; dur: 200; easing: easeInQuad');
            setTimeout(() => {
                detailsPanel.setAttribute('visible', 'false');
            }, 200);
            this.detailsVisible = false;
        }
    }
    
    shareExperience() {
        const shareData = {
            title: 'The Hype Way AR - Air Jordan 1 Chicago',
            text: '🔥 Acabo de descubrir la historia del Air Jordan 1 Chicago en AR! La cultura sneaker cobra vida con The Hype Way.',
            url: window.location.href
        };
        
        console.log('📱 Attempting to share...');
        
        // Native sharing if available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    console.log('✅ Shared successfully');
                    this.showNotification('✅ ¡Compartido exitosamente!');
                })
                .catch(err => {
                    console.log('❌ Error sharing:', err);
                    this.fallbackShare(shareData);
                });
        } else {
            this.fallbackShare(shareData);
        }
    }
    
    fallbackShare(shareData) {
        // Fallback: copy to clipboard
        const textToCopy = `${shareData.text} ${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification('📋 ¡Enlace copiado al portapapeles!');
            }).catch(() => {
                this.showNotification('❌ No se pudo copiar. Comparte manualmente.');
            });
        } else {
            // Ultimate fallback for older browsers
            this.showNotification('💡 Comparte: ' + shareData.url);
        }
    }
    
    showNotification(message) {
        // Remove any existing notifications first
        const existingNotifications = document.querySelectorAll('.ar-notification');
        existingNotifications.forEach(notif => {
            if (document.body.contains(notif)) {
                document.body.removeChild(notif);
            }
        });
        
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'ar-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #DC143C;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 1001;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the AR experience
console.log('🔥 Initializing The Hype Way AR...');
const theHypeWayAR = new TheHypeWayAR();

// Backup initialization if the class fails
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM Content Loaded');
    
    // Backup force show instructions
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const instructions = document.getElementById('instructions');
        
        if (loadingScreen && instructions) {
            console.log('🔧 Backup: Force showing instructions');
            loadingScreen.style.display = 'none';
            instructions.style.display = 'flex';
        }
    }, 3000);
    
    // Add click listeners to A-Frame elements
    setTimeout(() => {
        const clickableElements = document.querySelectorAll('.clickable');
        clickableElements.forEach(el => {
            el.addEventListener('click', function() {
                console.log('🖱️ Clicked:', this.id);
            });
        });
        
        // Backup start button listener
        const startBtn = document.getElementById('start-ar');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🔧 Backup start button clicked');
                const loadingScreen = document.getElementById('loading-screen');
                const instructions = document.getElementById('instructions');
                
                if (loadingScreen) loadingScreen.style.display = 'none';
                if (instructions) instructions.style.display = 'none';
            });
        }
    }, 4000);
});

// Debug info
console.log('🔍 Debug Info:');
console.log('- User Agent:', navigator.userAgent);
console.log('- URL:', window.location.href);
console.log('- Screen size:', window.screen.width + 'x' + window.screen.height);
