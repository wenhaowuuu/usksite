#!/usr/bin/env python3
"""
Image optimization script for web display
- Resizes images to max 800px width
- Adds watermarks
- Reduces file size for web display
- Creates web-optimized versions
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import argparse

def add_watermark(image, watermark_text="© Wenhao Wu", opacity=0.3):
    """Add a diagonal watermark to the image"""
    # Create a copy to work with
    watermarked = image.copy()

    # Create a transparent overlay
    overlay = Image.new('RGBA', watermarked.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to use a system font
    try:
        font_size = max(30, min(watermarked.width, watermarked.height) // 15)
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Get text size
    bbox = draw.textbbox((0, 0), watermark_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Position watermark in center
    x = (watermarked.width - text_width) // 2
    y = (watermarked.height - text_height) // 2

    # Create watermark with opacity
    alpha = int(255 * opacity)

    # Add multiple watermarks for better protection
    positions = [
        (x, y),  # Center
        (50, 50),  # Top left
        (watermarked.width - text_width - 50, watermarked.height - text_height - 50),  # Bottom right
        (50, watermarked.height - text_height - 50),  # Bottom left
        (watermarked.width - text_width - 50, 50),  # Top right
    ]

    for pos_x, pos_y in positions:
        # White text with shadow
        draw.text((pos_x + 2, pos_y + 2), watermark_text, font=font, fill=(0, 0, 0, alpha//2))
        draw.text((pos_x, pos_y), watermark_text, font=font, fill=(255, 255, 255, alpha))

    # Composite the overlay onto the original image
    watermarked = Image.alpha_composite(watermarked.convert('RGBA'), overlay)
    return watermarked.convert('RGB')

def optimize_image(input_path, output_path, max_width=800, quality=75):
    """Optimize image for web display"""
    with Image.open(input_path) as img:
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')

        # Calculate new dimensions
        width, height = img.size
        if width > max_width:
            new_width = max_width
            new_height = int((height * max_width) / width)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Add watermark
        img = add_watermark(img, "© Wenhao Wu • wenhaosketching.com", opacity=0.4)

        # Save with optimization
        img.save(output_path, 'JPEG', quality=quality, optimize=True)

        # Get file sizes
        original_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)

        print(f"Optimized {os.path.basename(input_path)}: {original_size/1024/1024:.1f}MB → {new_size/1024/1024:.1f}MB")

def main():
    parser = argparse.ArgumentParser(description='Optimize images for web display with watermarks')
    parser.add_argument('input_dir', help='Input directory containing images')
    parser.add_argument('output_dir', help='Output directory for optimized images')
    parser.add_argument('--max-width', type=int, default=800, help='Maximum width in pixels (default: 800)')
    parser.add_argument('--quality', type=int, default=75, help='JPEG quality 1-100 (default: 75)')

    args = parser.parse_args()

    # Create output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)

    # Process all images in input directory
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')

    for filename in os.listdir(args.input_dir):
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(args.input_dir, filename)
            # Change extension to .jpg for output
            base_name = os.path.splitext(filename)[0]
            output_filename = f"{base_name}.jpg"
            output_path = os.path.join(args.output_dir, output_filename)

            try:
                optimize_image(input_path, output_path, args.max_width, args.quality)
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    main()