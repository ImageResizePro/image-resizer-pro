class ImageResizer {
    constructor() {
        this.fileInput = document.querySelector('.file-input');
        this.downloadBtn = document.getElementById('download-btn');
        this.currentFile = null;
        this.downloadUrl = null;
        this.modeSections = {
            dimensions: document.getElementById('dimensions-section'),
            // Add future sections here if needed
        };

        this.bindEvents();
    }

    bindEvents() {
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleMode(e));
        });

        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFile(e));

        // Download button
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
    }

    toggleMode(e) {
        const mode = e.target.dataset.mode;

        // Hide all sections
        Object.values(this.modeSections).forEach(section => section.classList.add('hidden'));

        // Show selected section
        if (this.modeSections[mode]) {
            this.modeSections[mode].classList.remove('hidden');
        }
    }

    handleFile(e) {
        const file = e.target.files[0];

        if (!file || !file.type.match(/image\/(jpeg|png)/)) {
            alert('Please upload a valid JPEG or PNG image.');
            return;
        }

        this.currentFile = file;
        this.downloadBtn.disabled = true;

        // You can trigger process here or on button click
        this.processImage();
    }

    async processImage() {
        try {
            this.showLoading(true);

            // Wait for video ad (if enabled)
            if (typeof AdsterraLoader?.showVideoAd === 'function') {
                await AdsterraLoader.showVideoAd();
            }

            const resizedBlob = await this.resizeImage();
            this.prepareDownload(resizedBlob);
        } catch (error) {
            console.error('Image processing failed:', error);
            alert('Image processing failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    resizeImage() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    // Set canvas dimensions (replace with actual logic for resizing)
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;   // Modify for desired size
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject('Failed to create blob');
                    }, 'image/jpeg', 0.85);
                };

                img.onerror = () => reject('Image load error');
                img.src = e.target.result;
            };

            reader.onerror = () => reject('File read error');
            reader.readAsDataURL(this.currentFile);
        });
    }

    prepareDownload(blob) {
        this.downloadUrl = URL.createObjectURL(blob);
        this.downloadBtn.disabled = false;
    }

    handleDownload() {
        const a = document.createElement('a');
        a.href = this.downloadUrl;
        a.download = `resized-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    showLoading(state) {
        // Optional: Add loading spinner or visual indicator
        this.downloadBtn.textContent = state ? 'Processing...' : 'Download Image';
        this.downloadBtn.disabled = state;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new ImageResizer());
