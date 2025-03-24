#!/bin/bash

# Create a temporary directory
mkdir -p temp_zip

# Copy all files except the excluded ones
cp -r ./* temp_zip/

# Remove excluded files and directories
cd temp_zip
rm -rf LICENSE README.md privacy.png dark.png light.png PRIVACY.md .git .github temp_zip create-release-zip.sh
cd ..

# Create the zip file
cd temp_zip
zip -r ../extension.zip ./*
cd ..

# Clean up
rm -rf temp_zip 