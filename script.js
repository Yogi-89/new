const hideButton = document.getElementById('hideButton');
const hiddenButton = document.getElementById('hiddenButton');

hideButton.addEventListener('click', () => {
  hiddenButton.classList.toggle('hidden');
});
