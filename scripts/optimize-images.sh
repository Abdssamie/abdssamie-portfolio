#!/bin/bash

# Image Optimization Script for Portfolio
# Converts images to WebP format for better performance

PUBLIC_DIR="./public"
OPTIMIZED_DIR="$PUBLIC_DIR/optimized"

echo "Starting image optimization..."

# Check if sharp-cli is installed
if ! command -v sharp &> /dev/null; then
    echo "Installing sharp for image optimization..."
    npm install -g sharp-cli
fi

# Create optimized directory
mkdir -p "$OPTIMIZED_DIR"

# Convert PNGs to WebP
for img in "$PUBLIC_DIR"/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img" .png)
        echo "Converting $filename.png to WebP..."
        sharp "$img" \
            -resize 640 640 \
            -quality 80 \
            -compression Level 6 \
            -metadata \
            "$OPTIMIZED_DIR/$filename.webp" 2>/dev/null || \
        echo "sharp not available, skipping $filename"
    fi
done

echo "Optimization complete!"
echo "WebP images saved to: $OPTIMIZED_DIR"
echo ""
echo "To use WebP in your code:"
echo "  <img src='/optimized/filename.webp' alt='...' />"