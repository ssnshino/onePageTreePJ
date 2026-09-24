const stage = document.getElementById('stage');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');

try{
  const isMobile = matchMedia('(max-width: 700px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);

