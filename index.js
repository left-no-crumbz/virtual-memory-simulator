// Change algorithm description on toggle
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

const pageFrameRange = document.getElementById("page-frame-range")
const pageFrameCtr = document.getElementById("page-frame-ctr")
const simSpeedRange = document.getElementById("sim-speed-range")
const simSpeedCtr = document.getElementById("sim-speed-ctr")



function updateSliderFill(slider) {
  const percentage = ((slider.value - slider.min) / (slider.max - slider.mid)) * 100;
  slider.style.setProperty("--slider-percentage", percentage + "%");

}

updateSliderFill(pageFrameRange);
updateSliderFill(simSpeedRange);

pageFrameRange.addEventListener("input", function () {
  updateSliderFill(pageFrameRange);
  pageFrameCtr.textContent = this.value;
});

simSpeedRange.addEventListener("input", function () {
  updateSliderFill(simSpeedRange);
  simSpeedCtr.textContent = this.value + "x";
});

