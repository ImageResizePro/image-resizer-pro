class AdsterraLoader {
    static initialized = false;

    static init() {
        if (!this.initialized) {
            this.loadSDK();
            this.initialized = true;
        }
    }

    static loadSDK() {
        const script = document.createElement('script');
        script.src = 'https://www.adsterra.com/sdk.js';
        script.async = true;
        document.head.appendChild(script);
    }

    static loadBanners() {
        window.AdsterraBanner?.load({
            id: 'adsterra-top',
            format: '320x50'
        });
        
        window.AdsterraBanner?.load({
            id: 'adsterra-bottom',
            format: '300x250'
        });
    }

    static showVideoAd() {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('adsterra-video');
            container.style.display = 'block';
            
            window.AdsterraVideo?.load({
                container: 'adsterra-video',
                format: 'rewarded',
                onCompleted: () => {
                    container.style.display = 'none';
                    resolve();
                },
                onError: (err) => {
                    container.style.display = 'none';
                    reject(err);
                }
            });
        });
    }
}

// Initialize ads after first user interaction
document.addEventListener('click', () => {
    AdsterraLoader.init();
    AdsterraLoader.loadBanners();
}, { once: true });
