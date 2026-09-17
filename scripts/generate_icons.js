import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const inputLogo = path.resolve('public/web-logo-nobg.png');
  
  if (!fs.existsSync(inputLogo)) {
    console.error('Source logo not found:', inputLogo);
    process.exit(1);
  }

  console.log('Generating favicon & app icon suite from', inputLogo);

  // 1. icon-512.png (512x512)
  await sharp(inputLogo)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icon-512.png');
  console.log('✓ Created public/icon-512.png');

  // 2. icon-192.png (192x192)
  await sharp(inputLogo)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icon-192.png');
  console.log('✓ Created public/icon-192.png');

  // 3. apple-touch-icon.png (180x180) - with sleek dark backdrop for iOS bookmarks
  const appleIconBg = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 }
    }
  }).png().toBuffer();

  const logoForApple = await sharp(inputLogo)
    .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(appleIconBg)
    .composite([{ input: logoForApple, gravity: 'center' }])
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ Created public/apple-touch-icon.png');

  // 4. favicon-32.png and favicon.ico
  const favicon32Buf = await sharp(inputLogo)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const favicon16Buf = await sharp(inputLogo)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(2, 4);

  const dirEntry16 = Buffer.alloc(16);
  dirEntry16.writeUInt8(16, 0);
  dirEntry16.writeUInt8(16, 1);
  dirEntry16.writeUInt8(0, 2);
  dirEntry16.writeUInt8(0, 3);
  dirEntry16.writeUInt16LE(1, 4);
  dirEntry16.writeUInt16LE(32, 6);
  dirEntry16.writeUInt32LE(favicon16Buf.length, 8);
  dirEntry16.writeUInt32LE(6 + 32, 12);

  const dirEntry32 = Buffer.alloc(16);
  dirEntry32.writeUInt8(32, 0);
  dirEntry32.writeUInt8(32, 1);
  dirEntry32.writeUInt8(0, 2);
  dirEntry32.writeUInt8(0, 3);
  dirEntry32.writeUInt16LE(1, 4);
  dirEntry32.writeUInt16LE(32, 6);
  dirEntry32.writeUInt32LE(favicon32Buf.length, 8);
  dirEntry32.writeUInt32LE(6 + 32 + favicon16Buf.length, 12);

  const icoBuffer = Buffer.concat([icoHeader, dirEntry16, dirEntry32, favicon16Buf, favicon32Buf]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('✓ Created public/favicon.ico');

  // 5. og-image.png (1200x630 Social Share Card Banner)
  const logoForOg = await sharp(inputLogo)
    .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const svgBannerOverlay = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0d14" />
          <stop offset="100%" stop-color="#151b28" />
        </linearGradient>
        <radialGradient id="glow" cx="20%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#ffa116" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)" />
      <rect width="1200" height="630" fill="url(#glow)" />
      
      <!-- Card frame -->
      <rect x="40" y="40" width="1120" height="550" rx="24" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 161, 22, 0.25)" stroke-width="2" />
      
      <!-- Text content -->
      <g transform="translate(460, 200)">
        <text x="0" y="0" font-family="'Segoe UI', Inter, sans-serif" font-weight="900" font-size="56" fill="#ffffff">Leet Companies</text>
        <text x="0" y="55" font-family="'Segoe UI', Inter, sans-serif" font-weight="600" font-size="28" fill="#ffa116">470+ Company-Wise LeetCode Prep</text>
        <text x="0" y="115" font-family="'Segoe UI', Inter, sans-serif" font-weight="400" font-size="22" fill="#9ca3af">Google • Meta • Microsoft • Amazon • Bloomberg</text>
        <text x="0" y="155" font-family="'Segoe UI', Inter, sans-serif" font-weight="500" font-size="18" fill="#00b8a3">🔒 100% Client-Side &amp; Private Local Storage Tracker</text>
        
        <!-- Badge -->
        <rect x="0" y="195" width="160" height="34" rx="8" fill="rgba(255, 161, 22, 0.15)" stroke="#ffa116" stroke-width="1.5" />
        <text x="80" y="218" font-family="'Segoe UI', Inter, sans-serif" font-weight="800" font-size="14" fill="#ffa116" text-anchor="middle">BY AZN LABS</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svgBannerOverlay))
    .composite([
      {
        input: logoForOg,
        top: 155,
        left: 90,
      }
    ])
    .png()
    .toFile('public/og-image.png');

  console.log('✓ Created public/og-image.png (1200x630)');
  console.log('All transparent icons generated successfully!');
}

generateIcons().catch(console.error);
