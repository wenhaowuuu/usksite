# Image Protection Strategy

## Overview
This portfolio implements multiple layers of image protection to prevent unauthorized use while maintaining a good user experience.

## Protection Layers

### 1. Web-Optimized Images
- **Location**: `images/` directory (public)
- **Resolution**: Max 800px width
- **Quality**: 70% JPEG compression
- **Size**: 47KB - 170KB (vs 1-7MB originals)
- **Built-in Watermarks**: Multiple "© Wenhao Wu • wenhaosketching.com" watermarks

### 2. Original Images (Protected)
- **Location**: `images_original/` directory (gitignored)
- **Status**: Not included in public repository
- **Backup**: Stored locally only

### 3. Frontend Protection
- CSS watermark overlays
- Right-click disabled on images
- Drag & drop disabled
- Image selection disabled
- Developer tools access blocked
- Print protection (images hidden when printing)
- Mobile touch protection

### 4. Repository Protection
- `.gitignore` prevents original images from being committed
- Only web-optimized versions are public

## Updating Images

### Adding New Artwork
1. Place original high-resolution images in `images_original/`
2. Run the optimization script:
   ```bash
   python3 scripts/optimize_images.py images_original images --max-width 800 --quality 70
   ```
3. Update `data/artworks.json` with new artwork information
4. Commit only the web-optimized versions

### Script Usage
```bash
# Basic usage
python3 scripts/optimize_images.py INPUT_DIR OUTPUT_DIR

# With custom settings
python3 scripts/optimize_images.py images_original images --max-width 1000 --quality 80
```

## Security Notes

### What's Protected
- ✅ High-resolution originals (not in public repo)
- ✅ Easy right-click saving (disabled)
- ✅ Casual screenshot attempts (watermarked)
- ✅ Print attempts (images hidden)

### Limitations
- Advanced users can still inspect network traffic
- Browser developer tools can be re-enabled by tech-savvy users
- Screenshots can still capture watermarked versions
- **This is normal** - perfect protection doesn't exist on the web

### Best Practices
- Keep originals private and backed up elsewhere
- Consider external hosting (Cloudinary, ImageKit) for additional protection
- Regularly monitor for unauthorized use
- Consider legal protections (copyright registration)

## External Hosting Option

For maximum protection, consider moving to external image hosting:

### Recommended Services
1. **Cloudinary** - On-the-fly watermarking, access control
2. **ImageKit** - Similar features with transformation URLs
3. **AWS S3 + CloudFront** - Signed URLs for time-limited access

### Implementation
Update image URLs in `js/gallery.js` to point to external service:
```javascript
// Instead of: src="images/${artwork.filename}"
// Use: src="https://your-service.com/transform/w_800,q_70/${artwork.filename}"
```

## Repository Structure
```
usksite/
├── images/              # Web-optimized images (public)
├── images_original/     # Original hi-res images (gitignored)
├── scripts/            # Image processing scripts
├── css/               # Stylesheets with protection
├── js/                # JavaScript with protection
└── .gitignore         # Protects original images
```