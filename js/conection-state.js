function updateOnlineStatus(event) {
  if (navigator.onLine) {
    M.toast({html: 'You are now online'});
  } else {
    M.toast({html: 'You are now offline'});
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

document.addEventListener('DOMContentLoaded', () => {
  updateOnlineStatus();
});