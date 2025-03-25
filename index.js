// Change algorithm description on toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const description = document.getElementById('description');

    // Default description since FIFO is first toggled
    description.innerHTML = "<strong>First In First Out (FIFO):</strong> The oldest page in memory is replaced when a new page needs to be loaded. This algorithm is simple but may replace frequently used pages.";

    
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        toggleButtons.forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');
        
        const algorithm = this.getAttribute('data-algorithm');
        if (algorithm === 'fifo') {
          description.innerHTML = "<strong>First In First Out (FIFO):</strong> The oldest page in memory is replaced when a new page needs to be loaded. This algorithm is simple but may replace frequently used pages.";
        } else if (algorithm === 'lru') {
          description.innerHTML = "<strong>Least Recently Used (LRU):</strong> The page that hasn't been used for the longest time is replaced. This algorithm performs better than FIFO but requires tracking when each page was last accessed."
        }
      });
    });
});

const pageFrameRange = document.getElementById("page-frame-range");
const pageFrameCtr = document.getElementById("page-frame-ctr");
const simSpeedRange = document.getElementById("sim-speed-range");
const simSpeedCtr = document.getElementById("sim-speed-ctr");
const pageSeq = document.getElementById("page-seq");


function updateSliderFill(slider) {
  const percentage = ((slider.value - slider.min) / (slider.max - slider.mid)) * 100;
  slider.style.setProperty("--slider-percentage", percentage + "%");

}

updateSliderFill(pageFrameRange);
updateSliderFill(simSpeedRange);
createPageFrame(pageFrameRange.value);

pageFrameRange.addEventListener("input", function () {
  updateSliderFill(pageFrameRange);
  pageFrameCtr.textContent = this.value;
  createPageFrame(pageFrameRange.value)
});

simSpeedRange.addEventListener("input", function () {
  updateSliderFill(simSpeedRange);
  simSpeedCtr.textContent = this.value + "x";
});

function createPageFrame(value) {
  const memoryFrame = document.querySelector(".memory-frame");

  // wipe content
  while (memoryFrame.firstChild) {
    memoryFrame.removeChild(memoryFrame.firstChild);
  }

  for (let index = 0; index < value; index++) {
    let pageFrame = document.createElement("div");
    let number = document.createElement("div");
    

    number.textContent = index + 1;

    pageFrame.classList.add("page-frame", "flex", "items-center");
    

    number.classList.add("number", "flex", "justify-center", "items-center");

    memoryFrame.appendChild(pageFrame);
    pageFrame.appendChild(number);
  }
}

function runFIFO(arrValues) {
  

}