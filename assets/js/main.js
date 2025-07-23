// The Hype Way AR - Main JavaScript (iOS Optimized + UI Fix)

class TheHypeWayAR {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.marker = null;
        this.isARActive = false;
        this.detailsVisible = false;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        this.init();
    }
    
    init() {
        console.log('🔥 Initializing The Hype Way AR...');
        console.log('📱 Device info:', {
            iOS: this.isIOS,
            Safari: this.isSafari,
            userAgent: navigator.userAgent
        });
        
        // Wait for DOM to load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupAR();
            this.handleIOSSpecifics();
            this.forceShowInstructions();
        });
    }
    
    handleIOSSpecifics() {
        if (this.isIOS) {
            console.log('📱 iOS device detected - applying iOS fixes');
            
            // Show iOS warning if not Safari
            if (!this.isSafari) {
                setTimeout(() => {
                    this.showNotification('⚠️ Para mejor compatibilidad, usa Safari en iOS');
                }, 2000);
            }
            
            // Handle iOS camera permissions more gracefully
            this.checkIOSCameraPermissions();
            
            // Fix iOS viewport height
            this.fixIOSViewport();
        }
    }
    
    checkIOSCameraPermissions() {
        // Pre-check camera availability on iOS
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 }
                } 
            }).then(stream => {
                console.log('📹 iOS camera access granted');
                // Stop the stream immediately as AR.js will handle it
                stream.getTracks().forEach(track => track.stop());
            }).catch(err => {
                console.error('❌ iOS camera permission issue:', err);
                // Don't show error immediately, wait for user interaction
            });
        }
    }
    
    fixIOSViewport() {
        // Fix iOS viewport height issues
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
    }
    
    forceShowInstructions() {
        // Force show instructions after 2 seconds to prevent infinite loading
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const instructions = document.getElementById('instructions');
            
            console.log('🔧 Force check - Loading screen:', loadingScreen ? 'found' : 'not found');
            console.log('🔧 Force check - Instructions:', instructions ? 'found' : 'not found');
            
            if (loadingScreen && window.getComputedStyle(loadingScreen).display !== 'none') {
                console.log('🔧 Force hiding loading screen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            if (instructions && window.getComputedStyle(instructions).display === 'none') {
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
            
            // iOS specific touch handling
            if (this.isIOS) {
                startBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    startBtn.style.transform = 'scale(0.95)';
                });
                
                startBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();  
                    startBtn.style.transform = 'scale(1)';
                });
            }
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
                console.log('✅ A-Frame scene loaded');
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
                    
                    console.log('✅ Marker event listeners attached');
                } else {
                    console.log('❌ Marker element not found');
                }
                
                console.log('✅ AR Scene initialized');
            });
            
            // Handle A-Frame loading errors
            scene.addEventListener('error', (error) => {
                console.error('❌ A-Frame error:', error);
                this.showNotification('❌ Error cargando AR. Recarga la página.');
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
            
            // iOS touch feedback
            if (this.isIOS) {
                moreInfoBtn.addEventListener('touchstart', () => {
                    moreInfoBtn.setAttribute('scale', '0.95 0.95 0.95');
                });
                
                moreInfoBtn.addEventListener('touchend', () => {
                    moreInfoBtn.setAttribute('scale', '1 1 1');
                });
            }
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
        console.log('🚀 Starting AR Experience...');
        
        // Add AR active class to body for CSS targeting
        document.body.classList.add('ar-active');
        
        // Hide instructions and loading IMMEDIATELY and COMPLETELY
        const instructions = document.getElementById('instructions');
        const loadingScreen = document.getElementById('loading-screen');
        
        // Force hide instructions completely
        if (instructions) {
            console.log('🔧 Removing instructions overlay completely');
            instructions.style.display = 'none !important';
            instructions.style.visibility = 'hidden';
            instructions.style.opacity = '0';
            instructions.style.zIndex = '-1000';
            instructions.style.pointerEvents = 'none';
            // Remove completely from DOM after animation
            setTimeout(() => {
                if (instructions.parentNode) {
                    instructions.parentNode.removeChild(instructions);
                }
            }, 100);
        }
        
        // Force hide loading screen completely
        if (loadingScreen) {
            console.log('🔧 Removing loading screen completely');
            loadingScreen.style.display = 'none !important';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.zIndex = '-1000';
            loadingScreen.style.pointerEvents = 'none';
            // Remove completely from DOM after animation
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 100);
        }
        
        // Force show A-Frame scene
        const scene = document.querySelector('a-scene');
        if (scene) {
            console.log('🔧 Forcing A-Frame scene to be visible');
            scene.style.display = 'block !important';
            scene.style.visibility = 'visible !important';
            scene.style.opacity = '1 !important';
            scene.style.zIndex = '1 !important';
            scene.style.position = 'fixed !important';
            scene.style.top = '0 !important';
            scene.style.left = '0 !important';
            scene.style.width = '100vw !important';
            scene.style.height = '100vh !important';
        }
        
        // Clear any remaining overlays
        const overlays = document.querySelectorAll('.overlay');
        overlays.forEach(overlay => {
            if (overlay !== instructions) { // Already handled instructions
                overlay.style.display = 'none !important';
                overlay.style.visibility = 'hidden';
                overlay.style.zIndex = '-1000';
            }
        });
        
        // iOS specific camera handling
        if (this.isIOS) {
            this.handleIOSCamera();
        } else {
            // Standard camera request
            this.requestCameraPermission();
        }
        
        // Show success message after a moment
        setTimeout(() => {
            this.showNotification('📹 AR activado! Busca el marker Hiro impreso');
        }, 1000);
        
        console.log('🚀 AR Experience started - UI forcefully removed');
    }
    
    handleIOSCamera() {
        console.log('📱 Handling iOS camera permissions');
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 }
                } 
            }).then(stream => {
                console.log('📹 iOS Camera access granted');
                // Stop the stream immediately as A-Frame will handle it
                stream.getTracks().forEach(track => track.stop());
                
                // Additional notification for iOS
                setTimeout(() => {
                    this.showNotification('🎯 Apunta al marker Hiro para ver el contenido AR');
                }, 2000);
            }).catch(err => {
                console.error('❌ iOS Camera access denied:', err);
                this.showNotification('⚠️ Permite acceso a la cámara en Configuración > Safari');
                
                // Show iOS specific instructions
                setTimeout(() => {
                    const message = 'Para activar la cámara:\n1. Ve a Configuración iOS\n2. Safari > Cámara\n3. Permitir acceso\n4. Recarga esta página';
                    alert(message);
                }, 2000);
            });
        } else {
            console.log('❌ getUserMedia not available');
            this.showNotification('❌ Cámara no disponible en este navegador. Usa Safari.');
        }
    }
    
    requestCameraPermission() {
        // Standard camera permission request
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            }).then(stream => {
                console.log('📹 Camera access granted');
                // Stop the stream immediately as A-Frame will handle it
                stream.getTracks().forEach(track => track.stop());
                
                setTimeout(() => {
                    this.showNotification('🎯 Apunta al marker Hiro para ver el contenido AR');
                }, 1500);
            }).catch(err => {
                console.error('❌ Camera access denied:', err);
                this.showNotification('⚠️ Necesitas permitir acceso a la cámara');
            });
        }
    }
    
    onMarkerFound() {
        this.isARActive = true;
        
        // Show share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.classList.remove('hidden');
        }
        
        // Show success notification
        this.showNotification('🎯 ¡Marker encontrado! Mira el contenido AR');
        
        // iOS haptic feedback if available
        if (this.isIOS && navigator.vibrate) {
            navigator.vibrate(100);
        }
        
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
        
        console.log('😞 AR Content deactivated');
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
            
            // iOS haptic feedback
            if (this.isIOS && navigator.vibrate) {
                navigator.vibrate(50);
            }
            
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
        
        // iOS native sharing
        if (this.isIOS && navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    console.log('✅ iOS native share successful');
                    this.showNotification('✅ ¡Compartido exitosamente!');
                })
                .catch(err => {
                    console.log('❌ iOS native share failed:', err);
                    this.fallbackShare(shareData);
                });
        } else if (navigator.share) {
            // Standard Web Share API
            navigator.share(shareData)
                .then(() => {
                    console.log('✅ Web Share API successful');
                    this.showNotification('✅ ¡Compartido exitosamente!');
                })
                .catch(err => {
                    console.log('❌ Web Share API failed:', err);
                    this.fallbackShare(shareData);
                });
        } else {
            this.fallbackShare(shareData);
        }
    }
    
    fallbackShare(shareData) {
        // Fallback: copy to clipboard
        const textToCopy = `${shareData.text} ${shareData.url}`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification('📋 ¡Enlace copiado al portapapeles!');
            }).catch(() => {
                this.legacyFallbackShare(shareData);
            });
        } else {
            this.legacyFallbackShare(shareData);
        }
    }
    
    legacyFallbackShare(shareData) {
        // Ultimate fallback for older browsers/iOS versions
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text} ${shareData.url}`;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification('📋 ¡Enlace copiado al portapapeles!');
            } else {
                this.showNotification('💡 Comparte manualmente: ' + shareData.url);
            }
        } catch (err) {
            console.log('Legacy copy failed:', err);
            this.showNotification('💡 Comparte: ' + shareData.url);
        }
        
        document.body.removeChild(textArea);
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
            z-index: 10001;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            max-width: 90%;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease;
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
console.log('🔥 Starting The Hype Way AR initialization...');
const theHypeWayAR = new TheHypeWayAR();

// Backup initialization for iOS and edge cases
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM Content Loaded');
    
    // iOS specific backup
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log('📱 iOS backup initialization');
        
        // Force show instructions after 3 seconds on iOS
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const instructions = document.getElementById('instructions');
            
            if (loadingScreen && instructions) {
                console.log('🔧 iOS Backup: Force showing instructions');
                loadingScreen.style.display = 'none';
                instructions.style.display = 'flex';
            }
        }, 3000);
        
        // iOS backup start button with forced UI removal
        setTimeout(() => {
            const startBtn = document.getElementById('start-ar');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    console.log('🔧 iOS backup start button clicked');
                    
                    // Force remove ALL overlays
                    const allOverlays = document.querySelectorAll('#loading-screen, #instructions, .overlay');
                    allOverlays.forEach(element => {
                        if (element) {
                            element.style.display = 'none !important';
                            element.style.visibility = 'hidden';
                            element.style.opacity = '0';
                            element.style.zIndex = '-9999';
                            // Remove from DOM
                            setTimeout(() => {
                                if (element.parentNode) {
                                    element.parentNode.removeChild(element);
                                }
                            }, 100);
                        }
                    });
                    
                    // Force show A-Frame scene
                    const scene = document.querySelector('a-scene');
                    if (scene) {
                        scene.style.display = 'block !important';
                        scene.style.visibility = 'visible !important';
                        scene.style.opacity = '1 !important';
                        scene.style.zIndex = '1 !important';
                    }
                    
                    // Show camera request for iOS
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ 
                            video: { facingMode: 'environment' }
                        }).then(stream => {
                            console.log('📹 iOS backup camera granted');
                            stream.getTracks().forEach(track => track.stop());
                        }).catch(err => {
                            console.error('❌ iOS backup camera denied:', err);
                            alert('Para usar AR, permite acceso a la cámara en Configuración > Safari > Cámara');
                        });
                    }
                });
            }
        }, 4000);
    }
    
    // Standard backup for all devices
    setTimeout(() => {
        const clickableElements = document.querySelectorAll('.clickable');
        clickableElements.forEach(el => {
            el.addEventListener('click', function() {
                console.log('🖱️ Clicked:', this.id);
            });
        });
    }, 5000);
});

// Debug info
console.log('🔍 Debug Info:', {
    userAgent: navigator.userAgent,
    url: window.location.href,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,  
    devicePixelRatio: window.devicePixelRatio,
    iOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    Safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
});
