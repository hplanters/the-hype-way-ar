// The Hype Way AR - MINIMAL VERSION WITH TRACKING FIX

console.log('🔥 Loading Minimal AR Script with Tracking Fix');

// Global variables
let isARStarted = false;
let markerFound = false;

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM loaded');
    
    // Force show instructions after loading
    setTimeout(showInstructions, 2000);
    
    // Setup button click - SINGLE EVENT LISTENER
    setupStartButton();
    
    // Setup AR scene
    setupAR();
});

function showInstructions() {
    const loading = document.getElementById('loading-screen');
    const instructions = document.getElementById('instructions');
    
    console.log('🔧 Showing instructions');
    
    if (loading) {
        loading.style.display = 'none';
    }
    
    if (instructions) {
        instructions.style.display = 'flex';
        instructions.style.opacity = '1';
    }
}

function setupStartButton() {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        const button = document.getElementById('start-ar');
        
        if (button) {
            console.log('✅ Button found, setting up click handler');
            
            // Remove any existing listeners
            button.onclick = null;
            
            // Add single click handler
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 BUTTON CLICKED - Starting AR');
                startAR();
                
                return false;
            }, { once: false });
            
        } else {
            console.log('❌ Button not found, retrying...');
            setTimeout(setupStartButton, 1000);
        }
    }, 500);
}

function startAR() {
    if (isARStarted) {
        console.log('⚠️ AR already started');
        return;
    }
    
    console.log('🚀 Starting AR...');
    isARStarted = true;
    
    // Step 1: Hide all overlays IMMEDIATELY
    hideAllOverlays();
    
    // Step 2: Add AR class to body
    document.body.classList.add('ar-active');
    document.body.classList.remove('loading');
    
    // Step 3: Force scene visibility
    forceSceneVisible();
    
    // Step 4: Request camera
    requestCamera();
    
    // Step 5: Setup marker tracking
    setTimeout(() => {
        setupMarkerTracking();
    }, 2000);
    
    // Step 6: Show notification
    setTimeout(() => {
        showNotification('📹 AR activado! Busca el marker Hiro impreso');
    }, 1000);
}

function hideAllOverlays() {
    console.log('🔧 Hiding all overlays');
    
    const selectors = [
        '#loading-screen',
        '#instructions', 
        '.overlay',
        '.instruction-content'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.zIndex = '-9999';
            el.style.pointerEvents = 'none';
        });
    });
    
    // Remove from DOM completely
    setTimeout(() => {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
    }, 100);
}

function forceSceneVisible() {
    console.log('🔧 Forcing scene visible');
    
    const scene = document.querySelector('a-scene');
    if (scene) {
        scene.style.display = 'block';
        scene.style.visibility = 'visible';
        scene.style.opacity = '1';
        scene.style.position = 'fixed';
        scene.style.top = '0';
        scene.style.left = '0';
        scene.style.width = '100vw';
        scene.style.height = '100vh';
        scene.style.zIndex = '1';
    }
    
    // Force canvas full screen
    setTimeout(() => {
        const canvas = document.querySelector('a-scene canvas');
        if (canvas) {
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            console.log('🔧 Canvas forced to full screen');
        }
    }, 500);
    
    // Force video full screen
    setTimeout(() => {
        const video = document.querySelector('video');
        if (video) {
            console.log('🔧 Forcing video full screen');
            video.style.width = '100vw';
            video.style.height = '100vh';
            video.style.objectFit = 'cover';
            video.style.position = 'fixed';
            video.style.top = '0';
            video.style.left = '0';
            video.style.zIndex = '1';
        }
    }, 1000);
}

function requestCamera() {
    console.log('📹 Requesting camera');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        }).then(stream => {
            console.log('✅ Camera granted');
            // Stop stream - A-Frame will handle it
            stream.getTracks().forEach(track => track.stop());
        }).catch(err => {
            console.error('❌ Camera denied:', err);
            showNotification('⚠️ Permite acceso a la cámara');
        });
    }
}

function setupAR() {
    // Wait for A-Frame to load
    const checkAFrame = () => {
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => {
                console.log('✅ A-Frame loaded');
                // Don't setup marker events here - wait for AR to start
            });
        } else {
            setTimeout(checkAFrame, 500);
        }
    };
    
    setTimeout(checkAFrame, 1000);
}

function setupMarkerTracking() {
    console.log('🎯 Setting up marker tracking...');
    
    const marker = document.querySelector('#jordan-1-marker');
    if (marker) {
        console.log('✅ Marker element found');
        
        // Enhanced marker found event
        marker.addEventListener('markerFound', () => {
            console.log('🎯 MARKER FOUND! AR content should be visible');
            markerFound = true;
            
            // Show success notification
            showNotification('🎯 ¡Marker encontrado! Mira el contenido AR');
            
            // Show share button
            const shareBtn = document.getElementById('share-btn');
            if (shareBtn) {
                shareBtn.classList.remove('hidden');
                console.log('📱 Share button shown');
            }
            
            // Setup AR interactions
            setupARInteractions();
        });
        
        marker.addEventListener('markerLost', () => {
            console.log('😞 Marker lost');
            markerFound = false;
            
            // Hide share button
            const shareBtn = document.getElementById('share-btn');
            if (shareBtn) {
                shareBtn.classList.add('hidden');
            }
        });
        
        // Debug: Check marker status every 3 seconds
        setInterval(() => {
            if (isARStarted) {
                const isVisible = marker.object3D && marker.object3D.visible;
                console.log('🔍 Marker status check - Visible:', isVisible, 'Found:', markerFound);
                
                if (!markerFound) {
                    console.log('💡 Tip: Asegúrate de tener buena iluminación y el marker Hiro impreso claramente');
                }
            }
        }, 5000);
        
        console.log('✅ Marker events setup complete');
    } else {
        console.log('❌ Marker element NOT found - retrying...');
        setTimeout(setupMarkerTracking, 1000);
    }
}

function setupARInteractions() {
    console.log('🔧 Setting up AR interactions');
    
    // More info button
    const moreInfoBtn = document.querySelector('#more-info-btn');
    if (moreInfoBtn) {
        moreInfoBtn.addEventListener('click', function() {
            console.log('🔍 More info button clicked');
            toggleDetails();
        });
        
        // Add visual feedback for touch
        moreInfoBtn.addEventListener('touchstart', function() {
            this.setAttribute('scale', '0.9 0.9 0.9');
        });
        
        moreInfoBtn.addEventListener('touchend', function() {
            this.setAttribute('scale', '1 1 1');
        });
        
        console.log('✅ More info button setup');
    }
    
    // Close button
    const closeBtn = document.querySelector('#close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('❌ Close button clicked');
            hideDetails();
        });
        console.log('✅ Close button setup');
    }
}

let detailsVisible = false;

function toggleDetails() {
    if (detailsVisible) {
        hideDetails();
    } else {
        showDetails();
    }
}

function showDetails() {
    const detailsPanel = document.querySelector('#details-panel');
    if (detailsPanel) {
        detailsPanel.setAttribute('visible', 'true');
        detailsPanel.setAttribute('animation', 'property: scale; from: 0.1 0.1 0.1; to: 1 1 1; dur: 300; easing: easeOutBack');
        detailsVisible = true;
        console.log('📖 Details panel opened');
        showNotification('📖 Información completa mostrada');
    }
}

function hideDetails() {
    const detailsPanel = document.querySelector('#details-panel');
    if (detailsPanel && detailsVisible) {
        detailsPanel.setAttribute('animation', 'property: scale; from: 1 1 1; to: 0.1 0.1 0.1; dur: 200; easing: easeInQuad');
        setTimeout(() => {
            detailsPanel.setAttribute('visible', 'false');
        }, 200);
        detailsVisible = false;
        console.log('📖 Details panel closed');
    }
}

function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.ar-notification');
    existing.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'ar-notification';
    notification.textContent = message;
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
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Show
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Share functionality
function setupShareButton() {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            console.log('📱 Share button clicked');
            shareExperience();
        });
    }
}

function shareExperience() {
    const shareData = {
        title: 'The Hype Way AR - Air Jordan 1 Chicago',
        text: '🔥 Acabo de descubrir la historia del Air Jordan 1 Chicago en AR! La cultura sneaker cobra vida con The Hype Way.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                console.log('✅ Share successful');
                showNotification('✅ ¡Compartido exitosamente!');
            })
            .catch(err => {
                console.log('❌ Share failed:', err);
                fallbackShare(shareData);
            });
    } else {
        fallbackShare(shareData);
    }
}

function fallbackShare(shareData) {
    const textToCopy = `${shareData.text} ${shareData.url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('📋 ¡Enlace copiado al portapapeles!');
        }).catch(() => {
            showNotification('💡 Comparte: ' + shareData.url);
        });
    } else {
        showNotification('💡 Comparte: ' + shareData.url);
    }
}

// iOS specific fixes
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    console.log('📱 iOS device detected');
    
    // Viewport height fix
    const setVH = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Prevent zoom
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // iOS specific camera handling
    document.addEventListener('touchend', function(e) {
        if (e.target.id === 'start-ar') {
            // Extra camera permission request for iOS
            setTimeout(() => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' }
                    }).then(stream => {
                        console.log('📹 iOS camera access confirmed');
                        stream.getTracks().forEach(track => track.stop());
                    }).catch(err => {
                        console.error('❌ iOS camera issue:', err);
                        showNotification('⚠️ Configuración > Safari > Cámara > Permitir');
                    });
                }
            }, 500);
        }
    });
}

// Setup share button when DOM is ready
setTimeout(setupShareButton, 3000);

// Emergency backup - if nothing works, this will
setTimeout(() => {
    if (!isARStarted) {
        console.log('🚨 Emergency backup: Force showing instructions');
        showInstructions();
        
        // Emergency button setup
        const btn = document.getElementById('start-ar');
        if (btn && !btn.onclick) {
            btn.onclick = () => {
                console.log('🚨 Emergency button click');
                startAR();
            };
        }
    }
}, 5000);

// Debug info
console.log('🔍 Debug Info:', {
    userAgent: navigator.userAgent,
    url: window.location.href,
    screen: `${window.screen.width}x${window.screen.height}`,
    iOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    timestamp: new Date().toISOString()
});

console.log('🔥 Minimal AR script with tracking fix loaded');

// Helper function to check AR.js status
function checkARStatus() {
    setTimeout(() => {
        if (window.AFRAME && window.AFRAME.components) {
            console.log('✅ A-Frame components loaded');
            if (window.AFRAME.components['arjs']) {
                console.log('✅ AR.js component loaded');
            } else {
                console.log('❌ AR.js component not found');
            }
        } else {
            console.log('❌ A-Frame not fully loaded');
        }
    }, 4000);
}

checkARStatus();
