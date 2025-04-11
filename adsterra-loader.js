class AdsterraLoader {
    static initialized = false;

    static init() {
        if (!this.initialized) {
            this.loadSDK();
            this.initialized = true;
        }
    }

    static loadSDK() {
        const sdkScript = document.createElement('script');
        sdkScript.src = 'https://www.adsterra.com/sdk.js';
        sdkScript.async = true;
        sdkScript.onload = () => console.log('Adsterra SDK loaded');
        sdkScript.onerror = () => console.error('Failed to load Adsterra SDK');
        document.head.appendChild(sdkScript);
    }

    static loadBanners() {
        // Load top banner
        if (document.getElementById('adsterra-top')) {
            window.AdsterraBanner?.load({
                id: 'adsterra-top',
                format: '320x50'
            });
        }

        // Load bottom banner
        if (document.getElementById('adsterra-bottom')) {
            window.AdsterraBanner?.load({
                id: 'adsterra-bottom',
                format: '300x250'
            });
        }
    }

    static showVideoAd() {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('adsterra-video');

            if (!container) {
                console.warn('Video ad container not found.');
                return resolve(); // Skip ad gracefully
            }

            container.style.display = 'block';

            if (window.AdsterraVideo?.load) {
                window.AdsterraVideo.load({
                    container: 'adsterra-video',
                    format: 'rewarded',
                    onCompleted: () => {
                        container.style.display = 'none';
                        resolve();
                    },
                    onError: (err) => {
                        console.error('Ad failed:', err);
                        container.style.display = 'none';
                        reject(err);
                    }
                });
            } else {
                console.warn('AdsterraVideo not available, skipping...');
                container.style.display = 'none';
                resolve(); // Skip ad if SDK not ready
            }
        });
    }
}

// Lazy init after first interaction to boost performance
document.addEventListener('click', () => {
    AdsterraLoader.init();
    AdsterraLoader.loadBanners();
}, { once: true });
