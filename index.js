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
const runBtn = document.getElementById("run-btn");

pageSeq.value = "1, 2, 3, 4, 5";

function updateSliderFill(slider) {
  const percentage = ((slider.value - slider.min) / (slider.max - slider.mid)) * 100;
  slider.style.setProperty("--slider-percentage", percentage + "%");

}

updateSliderFill(pageFrameRange);
updateSliderFill(simSpeedRange);
createPageFrame(pageFrameRange.value);


runBtn.addEventListener("click", (event) => {
  runFIFO(pageSeq.value);
});

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
    const pageFrame = document.createElement("div");
    const number = document.createElement("div");
    const value = document.createElement("div");

    value.textContent = "–";

    // add classes to each element
    pageFrame.classList.add("page-frame", "flex", "items-center");
    number.classList.add("number", "flex", "justify-center", "items-center");
    value.classList.add("value");
    
    // Add an index to each value
    value.setAttribute("index", index+1);
    number.textContent = index + 1;

    // append the child elements to the parent
    memoryFrame.appendChild(pageFrame);
    pageFrame.appendChild(number);
    pageFrame.appendChild(value);
  }
}

function runFIFO(pageSequence) {
  const pageFrameValues = Array.from(document.querySelectorAll(".value"));
  const pages = pageSequence.split(",").map((val) => val.trim());
  const pageFrameCount = pageFrameValues.length;

  console.log(pages);

  // implement a queue to keep track of pages
  const memoryQueue = [];

  async function insertPage(page, index) {
    return new Promise((resolve) => {
      console.log(pages);
      
      // if page is already in memory, end early
      if (memoryQueue.includes(page)) {
        resolve();
        return;
      }

      // if memory is full, remove the oldest/first page
      if (memoryQueue.length >= pageFrameCount) {
        const removedPage = memoryQueue.shift();
        
        // clear the text content of the removed page
        const removedFrameIndex = pageFrameValues.findIndex(
          frame => frame.textContent === removedPage
        );

        if (removedFrameIndex !== -1) {
          pageFrameValues[removedFrameIndex].textContent = "–";
        }
      }

      // add the page in the queue
      memoryQueue.push(page);

      // find the first matching or empty frame
      const emptyFrameIndex = pageFrameValues.findIndex(
        frame => frame.textContent === "–" || frame.textContent === page
      );

      // update the frame
      if (emptyFrameIndex !== -1) {
        pageFrameValues[emptyFrameIndex].textContent = page;
      }

      setTimeout(resolve, (1000)/simSpeedRange.value);
    });
  }

  // simulate page replacement
  async function simulatePageReplacement() {
    for (let i = 0; i < pages.length; i++) {
      await insertPage(pages[i], i);
    }
  }

  // call the simulation
  simulatePageReplacement();
}