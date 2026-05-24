// Simple PWA verification script
console.log('PGA Picking App - PWA Verification');

// Check if service worker is supported
if ('serviceWorker' in navigator) {
  console.log('✓ Service Worker API supported');
} else {
  console.log('✗ Service Worker API NOT supported');
}

// Check if manifest is available
fetch('/manifest.json')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Manifest not found');
  })
  .then(manifest => {
    console.log('✓ Manifest found:', manifest.name);
    console.log('  - Start URL:', manifest.start_url);
    console.log('  - Display:', manifest.display);
    console.log('  - Icons:', manifest.icons.length);
  })
  .catch(error => {
    console.log('✗ Manifest check failed:', error.message);
  });

// Check if icons exist
const iconPaths = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

iconPaths.forEach(path => {
  fetch(path, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log(`✓ Icon found: ${path}`);
      } else {
        console.log(`✗ Icon NOT found: ${path}`);
      }
    })
    .catch(() => {
      console.log(`✗ Icon check failed: ${path}`);
    });
});

// Check if service worker is registered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => {
      if (registrations.length > 0) {
        console.log(`✓ Service Worker registered (${registrations.length} registration(s))`);
        registrations.forEach(reg => {
          console.log(`  - Scope: ${reg.scope}`);
          console.log(`  - Active: ${reg.active ? 'Yes' : 'No'}`);
        });
      } else {
        console.log('✗ No Service Workers registered');
      }
    })
    .catch(error => {
      console.log('✗ Error checking Service Worker registrations:', error);
    });
}