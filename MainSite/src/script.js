function navigateTo(option) {
  const selectedOption = document.getElementById(`${option}-website`);

  // Set dimensions based on current size
  selectedOption.style.width = `${selectedOption.offsetWidth}px`;
  selectedOption.style.height = `${selectedOption.offsetHeight}px`;

  // Trigger a reflow to apply the dimensions
  selectedOption.offsetHeight; 

  // Set absolute positioning to overlay other option during expansion
  selectedOption.style.position = 'absolute';
  selectedOption.style.top = '0';
  selectedOption.style.left = '0';

  // Apply expanding class
  selectedOption.classList.add('expanding');

  // Set final size to cover viewport
  selectedOption.style.width = '100vw';
  selectedOption.style.height = '100vh';

  // Delay navigation until after animation completes
  setTimeout(() => {
    if (option === 'info') {
      window.location.href = './info/info.html';
    } else if (option === 'game') {
      window.location.href = 'game.html';
    }
  }, 800); // Adjust to match the transition duration
}
