// The Hype Way AR - FINAL COMPLETE VERSION

console.log('🔥 Loading Final AR Script with Enhanced Interactions');

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
        scene.style.zIndex = '5';
    }
    
    // Force canvas full screen
    setTimeout(() => {
        const canvas = document.querySelector('a-scene canvas');
        if (canvas) {
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.minWidth = '100vw';
            canvas.style.minHeight = '100vh';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '5';
            canvas.style.objectFit = 'cover';
            canvas.style.objectPosition = 'center';
        }
    }, 500);
    
    // Force video full screen
    setTimeout(() => {
        const video = document.querySelector('video');
        if (video) {
            console.log('🔧 Forcing video full screen');
            video.style.width = '100vw';
            video.style.height = '100vh';
            video.style.minWidth = '100vw';
            video.style.minHeight = '100vh';
            video.style.objectFit = 'cover';
            video.style.objectPosition = 'center';
            video.style.position = 'fixed';
            video.style.top = '0';
            video.style.left = '0';
            video.style.right = '0';
            video.style.bottom = '0';
            video.style.zIndex = '1';
            video.style.margin = '0';
            video.style.padding = '0';
            video.style.border = 'none';
        }
    }, 1000);
    
    // Force AR content to be visible above camera
    setTimeout(() => {
        console.log('🔧 Forcing AR content z-index');
        
        const arContent = document.querySelector('#ar-content');
        if (arContent) {
            console.log('✅ AR content container found - forcing visibility');
            arContent.style.zIndex = '100';
            arContent.style.position = 'relative';
        }
        
        // Force all AR text elements to be visible
        const arTexts = document.querySelectorAll('a-text');
        arTexts.forEach((element, index) => {
            element.style.zIndex = '100';
            element.style.position = 'relative';
            console.log(`✅ AR text element ${index + 1} z-index forced`);
        });
        
        // Force AR boxes and interactive elements
        const arBoxes = document.querySelectorAll('a-box, .clickable');
        arBoxes.forEach((element, index) => {
            element.style.zIndex = '150';
            element.style.position = 'relative';
            console.log(`✅ AR interactive element ${index + 1} z-index forced`);
        });
        
        // Force AR planes (backgrounds)
        const arPlanes = document.querySelectorAll('a-plane');
        arPlanes.forEach((element, index) => {
            element.style.zIndex = '90';
            element.style.position = 'relative';
            console.log(`✅ AR plane element ${index + 1} z-index forced`);
        });
        
    }, 1500);
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
            
            // Force AR content visibility when marker is found
            forceARContentVisibility();
            
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

function forceARContentVisibility() {
    console.log('🔧 Forcing AR content visibility after marker detection');
    
    // Force visibility for all AR elements
    const arElements = document.querySelectorAll('#ar-content a-text, #ar-content a-box, #ar-content a-plane, #ar-content a-circle');
    arElements.forEach((element, index) => {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.display = 'block';
        element.style.zIndex = '100';
        element.style.position = 'relative';
        console.log(`✅ AR element ${index + 1} forced visible`);
    });
    
    // Specifically target main AR text elements
    const mainElements = [
        '#title-text',
        '#year-designer', 
        '#iconic-fact',
        '#more-info-btn',
        '#brand-credit'
    ];
    
    mainElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.zIndex = '100';
            element.style.position = 'relative';
            console.log(`✅ ${selector} forced visible`);
        }
    });
}

function setupARInteractions() {
    console.log('🔧 Setting up AR interactions');
    
    // More info button - enhanced setup with multiple event types
    setTimeout(() => {
        const moreInfoBtn = document.querySelector('#more-info-btn');
        if (moreInfoBtn && !moreInfoBtn.hasAttribute('data-setup')) {
            moreInfoBtn.setAttribute('data-setup', 'true');
            
            console.log('✅ More info button found, setting up enhanced interactions...');
            
            // Method 1: Click event
            moreInfoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 More info CLICKED');
                toggleDetails();
            });
            
            // Method 2: Touch events for mobile
            moreInfoBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                moreInfoBtn.style.transform = 'scale(0.95)';
                console.log('🔍 More info TOUCH START');
            });
            
            moreInfoBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                moreInfoBtn.style.transform = 'scale(1)';
                console.log('🔍 More info TOUCH END');
                toggleDetails();
            });
            
            // Method 3: Mouse events for desktop/testing
            moreInfoBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 More info MOUSE DOWN');
                toggleDetails();
            });
            
            // Method 4: A-Frame specific events
            if (moreInfoBtn.addEventListener) {
                moreInfoBtn.addEventListener('raycaster-intersected', () => {
                    console.log('🔍 More info RAYCASTER INTERSECTED');
                });
                
                moreInfoBtn.addEventListener('raycaster-intersected-cleared', () => {
                    console.log('🔍 More info RAYCASTER CLEARED');
                });
            }
            
            // Force clickable properties
            moreInfoBtn.style.cursor = 'pointer';
            moreInfoBtn.style.userSelect = 'none';
            moreInfoBtn.style.webkitUserSelect = 'none';
            moreInfoBtn.style.touchAction = 'manipulation';
            moreInfoBtn.style.pointerEvents = 'auto';
            
            console.log('✅ More info button fully enhanced setup complete');
        } else {
            console.log('❌ More info button not found or already setup');
        }
        
        // Close button setup
        const closeBtn = document.querySelector('#close-btn');
        if (closeBtn && !closeBtn.hasAttribute('data-setup')) {
            closeBtn.setAttribute('data-setup', 'true');
            
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close CLICKED');
                hideDetails();
            });
            
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close TOUCHED');
                hideDetails();
            });
            
            closeBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close MOUSE DOWN');
                hideDetails();
            });
            
            // Force clickable properties
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.userSelect = 'none';
            closeBtn.style.webkitUserSelect = 'none';
            closeBtn.style.touchAction = 'manipulation';
            closeBtn.style.pointerEvents = 'auto';
            
            console.log('✅ Close button setup complete');
        }
    }, 500);
    
    // Backup interaction setup - try again after more time
    setTimeout(() => {
        console.log('🔧 Backup AR interactions setup');
        ensureInteractionsWork();
    }, 2000);
}

function ensureInteractionsWork() {
    // Backup method to ensure interactions work
    const moreInfoBtn = document.querySelector('#more-info-btn');
    if (moreInfoBtn) {
        // Force click handler one more time
        moreInfoBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 More info BACKUP ONCLICK');
            toggleDetails();
            return false;
        };
        
        console.log('✅ Backup click handler attached to more info button');
    }
    
    const closeBtn = document.querySelector('#close-btn');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Close BACKUP ONCLICK');
            hideDetails();
            return false;
        };
        
        console.log('✅ Backup click handler attached to close button');
    }
}

let detailsVisible = false;

function toggleDetails() {
    console.log('🔄 Toggle details called, current state:', detailsVisible);
    
    if (detailsVisible) {
        hideDetails();
    } else {
        showDetails();
    }
}

function showDetails() {
    console.log('📖 Showing details...');
    
    const detailsPanel = document.querySelector('#details-panel');
    if (detailsPanel) {
        detailsPanel.setAttribute('visible', 'true');
        
        // Force details panel visibility with multiple methods
        detailsPanel.style.opacity = '1';
        detailsPanel.style.visibility = 'visible';
        detailsPanel.style.display = 'block';
        detailsPanel.style.zIndex = '200';
        detailsPanel.style.position = 'relative';
        
        // Add animation
        detailsPanel.setAttribute('animation', 'property: scale; from: 0.1 0.1 0.1; to: 1 1 1; dur: 300; easing: easeOutBack');
        
        detailsVisible = true;
        console.log('✅ Details panel shown and visible state set to true');
        showNotification('📖 Información completa mostrada');
    } else {
        console.log('❌ Details panel not found');
    }
}

function hideDetails() {
    console.log('📖 Hiding details...');
    
    const detailsPanel = document.querySelector('#details-panel');
    if (detailsPanel && detailsVisible) {
        // Add closing animation
        detailsPanel.setAttribute('animation', 'property: scale; from: 1 1 1; to: 0.1 0.1 0.1; dur: 200; easing: easeInQuad');
        
        // Hide after animation
        setTimeout(() => {
            detailsPanel.setAttribute('visible', 'false');
            detailsPanel.style.opacity = '0';
            detailsPanel.style.visibility = 'hidden';
        }, 200);
        
        detailsVisible = false;
        console.log('✅ Details panel hidden and visible state set to false');
    } else {
        console.log('❌ Details panel not found or not visible');
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

// Setup share functionality
function setupShareButton() {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn && !shareBtn.hasAttribute('data-setup')) {
        shareBtn.setAttribute('data-setup', 'true');
        
        shareBtn.addEventListener('click', function() {
            console.log('📱 Share button clicked');
            shareExperience();
        });
        
        console.log('✅ Share button setup');
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
    
    // iOS specific AR content fix
    setTimeout(() => {
        if (isARStarted) {
            const arElements = document.querySelectorAll('a-text, a-box, a-plane');
            arElements.forEach(element => {
                element.style.webkitTransform = 'translateZ(0)';
                element.style.transform = 'translateZ(0)';
            });
            console.log('📱 iOS AR content transform applied');
        }
    }, 3000);
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

// Debug: Check AR content visibility and interactions every 15 seconds when AR is active
setInterval(() => {
    if (isARStarted) {
        const arContent = document.querySelector('#ar-content');
        const titleText = document.querySelector('#title-text');
        const moreInfoBtn = document.querySelector('#more-info-btn');
        const marker = document.querySelector('#jordan-1-marker');
        
        console.log('🔍 AR Debug Check:', {
            arContentExists: !!arContent,
            titleTextExists: !!titleText,
            moreInfoBtnExists: !!moreInfoBtn,
            moreInfoBtnSetup: moreInfoBtn ? moreInfoBtn.hasAttribute('data-setup') : false,
            markerExists: !!marker,
            markerVisible: marker ? marker.object3D.visible : false,
            detailsVisible: detailsVisible
        });
        
        // Ensure more info button is always clickable
        if (moreInfoBtn) {
            moreInfoBtn.style.pointerEvents = 'auto';
            moreInfoBtn.style.cursor = 'pointer';
        }
    }
}, 15000);

console.log('🔥 Final AR script with enhanced interactions loaded');
