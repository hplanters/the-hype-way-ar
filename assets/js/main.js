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
        });
    }
    
    setupEventListeners() {
        // Start AR button
        const startBtn = document.getElementById('start-ar');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startARExperience();
            });
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
        document.querySelector('a-scene').addEventListener('loaded', () => {
            this.scene = document.querySelector('a-scene');
            this.marker = document.querySelector('#jordan-1-marker');
            
            // Marker events
            this.marker.addEventListener('markerFound', () => {
                console.log('🎯 Marker detectado!');
                this.onMarkerFound();
            });
            
            this.marker.addEventListener('markerLost', () => {
                console.log('😞 Marker perdido');
                this.onMarkerLost();
            });
            
            console.log('✅ AR Scene initialized');
        });
    }
    
    setupARInteractions() {
        // More info button
        const moreInfoBtn = document.querySelector('#more-info-btn');
        if (moreInfoBtn) {
            moreInfoBtn.addEventListener('click', () => {
                this.toggleDetails();
            });
        }
        
        // Close button
        const closeBtn = document.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDetails();
            });
        }
    }
    
    startARExperience() {
        // Hide instructions and loading
        const instructions = document.getElementById('instructions');
        const loadingScreen = document.getElementById('loading-screen');
        
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
        
        console.log('🚀 AR Experience started');
    }
    
    onMarkerFound() {
        this.isARActive = true;
        
        // Show share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.classList.remove('hidden');
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
        
        // Native sharing if available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('✅ Shared successfully'))
                .catch(err => console.log('❌ Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            const textToCopy = `${shareData.text} ${shareData.url}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification('¡Enlace copiado al portapapeles!');
            });
        }
    }
    
    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
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
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the AR experience
const theHypeWayAR = new TheHypeWayAR();

// Add click listeners to A-Frame elements
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const clickableElements = document.querySelectorAll('.clickable');
        clickableElements.forEach(el => {
            el.addEventListener('click', function() {
                console.log('🖱️ Clicked:', this.id);
            });
        });
    }, 4000);
});
