// The Hype Way AR - WORKING VERSION + SIMPLE TRACKING FIX

console.log('🔥 Loading Working AR Script');

// Global variables
let isARStarted = false;

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
    
    // Step 5: Show notification
    setTimeout(() => {
        showNotification('📹 AR activado! Busca el marker Hiro');
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
                setupMarkerEvents();
            });
        } else {
            setTimeout(checkAFrame, 500);
        }
    };
    
    setTimeout(checkAFrame, 1000);
}

function setupMarkerEvents() {
    const marker = document.querySelector('#jordan-1-marker');
    if (marker) {
        marker.addEventListener('markerFound', () => {
            console.log('🎯 Marker found!');
            showNotification('✨ ¡Marker detectado! Contenido AR visible');
            
            // Show share button
            const shareBtn = document.getElementById('share-btn');
            if (shareBtn) {
                shareBtn.classList.remove('hidden');
            }
            
            // Setup AR interactions now that marker is found
            setupARInteractions();
        });
        
        marker.addEventListener('markerLost', () => {
            console.log('😞 Marker lost');
            
            // Hide share button
            const shareBtn = document.getElementById('share-btn');
            if (shareBtn) {
                shareBtn.classList.add('hidden');
            }
        });
        
        console.log('✅ Marker events setup');
    } else {
        console.log('❌ Marker not found, retrying...');
        setTimeout(setupMarkerEvents, 1000);
    }
}

function setupARInteractions() {
    // More info button - only set up once
    const moreInfoBtn = document.querySelector('#more-info-btn');
    if (moreInfoBtn && !moreInfoBtn.hasAttribute('data-setup')) {
        moreInfoBtn.setAttribute('data-setup', 'true');
        
        moreInfoBtn.addEventListener('click', () => {
            console.log('🔍 More info clicked');
            toggleDetails();
        });
        
        console.log('✅ More info button setup');
    }
    
    // Close button
    const closeBtn = document.querySelector('#close-btn');
    if (closeBtn && !closeBtn.hasAttribute('data-setup')) {
        closeBtn.setAttribute('data-setup', 'true');
        
        closeBtn.addEventListener('click', () => {
            console.log('❌ Close clicked');
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
        detailsVisible = true;
        console.log('📖 Details shown');
        showNotification('📖 Información ampliada');
    }
}

function hideDetails() {
    const detailsPanel = document.querySelector('#details-panel');
    if (detailsPanel && detailsVisible) {
        detailsPanel.setAttribute('visible', 'false');
        detailsVisible = false;
        console.log('📖 Details hidden');
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
}

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

console.log('🔥 Working AR script loaded');
