document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const fifoDescription = document.getElementById('fifo-description');
    const lruDescription = document.getElementById('lru-description');
    
    if (lruDescription) lruDescription.style.display = 'none';
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        
        this.classList.add('active');
        
        const algorithm = this.getAttribute('data-algorithm');
        if (algorithm === 'fifo') {
          if (fifoDescription) fifoDescription.style.display = 'block';
          if (lruDescription) lruDescription.style.display = 'none';
        } else if (algorithm === 'lru') {
          if (fifoDescription) fifoDescription.style.display = 'none';
          if (lruDescription) lruDescription.style.display = 'block';
        }
      });
    });
});