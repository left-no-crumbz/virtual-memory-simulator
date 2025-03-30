const pageFrameRange = document.getElementById("page-frame-range");
const pageFrameCtr = document.getElementById("page-frame-ctr");
const simSpeedRange = document.getElementById("sim-speed-range");
const simSpeedCtr = document.getElementById("sim-speed-ctr");
const pageSeq = document.getElementById("page-seq");
const runButtonContainer = document.querySelector('.run-container');
const resetBtn = document.getElementById("reset-btn");
const toggleButtons = document.querySelectorAll('.toggle-btn');
const description = document.getElementById('description');

window.isSimulationRunning = false;

pageSeq.value = "1,2,3,4,1,2,5,1,2,3,4,5";

// default description since FIFO is first toggled
description.innerHTML = "<strong>First In First Out (FIFO):</strong> The oldest page in memory is replaced when a new page needs to be loaded. This algorithm is simple but may replace frequently used pages.";

function setupRunButton(algorithm) {
  // remove existing run button if it exists
  const existingRunBtn = document.getElementById('run-btn');
  if (existingRunBtn) {
    runButtonContainer.removeChild(existingRunBtn);
  }

  // create new run button
  const newRunBtn = document.createElement('button');
  newRunBtn.id = 'run-btn';
  newRunBtn.className = 'flex items-center';
  
  // create and append play icon
  const playIcon = document.createElement('img');
  playIcon.src = './icons8-play-48.png';
  playIcon.alt = 'Play button icon';
  
  // create and append text
  const runText = document.createTextNode('Run');
  
  // append icon and text to button
  newRunBtn.appendChild(playIcon);
  newRunBtn.appendChild(runText);

  // add click event listener
  newRunBtn.addEventListener("click", () => {
    runPageReplacement(algorithm, pageSeq.value);
  });

  // add button to container
  runButtonContainer.appendChild(newRunBtn);

  return newRunBtn;
}

function setupResetButton() {
  resetBtn.addEventListener("click", resetSimulation);
  
  // add tooltip
  resetBtn.setAttribute('title', 'Reset the simulation');
  
  resetBtn.addEventListener('mouseenter', function() {
    if (window.isSimulationRunning) {
      this.setAttribute('title', 'Cannot reset while simulation is running');
    }
  });
}

function resetSimulation() {

  console.log('Simulation Running:', window.isSimulationRunning);

  // end if simulation is running
  if (window.isSimulationRunning) {
    return;
  }

  // reset memory frames
  const pageFrameValues = document.querySelectorAll(".value");
  pageFrameValues.forEach(frame => {
    frame.textContent = "–";
  });

  // reset border color
  const pageFrames = document.querySelectorAll(".page-frame");
  pageFrames.forEach(frame => {
    frame.style.borderColor = "#dfdddd";
  });

  // reset stats
  const pageHitCtr = document.querySelector(".page-hit-ctr");
  const pageFaultCtr = document.querySelector(".page-fault-ctr");
  const hitRatioCtr = document.querySelector(".hit-ratio-ctr");

  pageHitCtr.textContent = "0";
  pageFaultCtr.textContent = "0";
  hitRatioCtr.textContent = "0%";
}


resetBtn.addEventListener("click", resetSimulation);

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

    
    console.log('Algorithm:', algorithm);

    setupRunButton(algorithm);
  });
});

// default selected algorithm
setupRunButton("fifo");

// initial setup of reset button;
setupResetButton();

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

class PageReplacementStrategy {
  constructor(pageFrames, pageFrameValues, pageHitCtr, pageFaultCtr, hitRatioCtr) {
    this.pageFrames = pageFrames;
    this.pageFrameValues = pageFrameValues;
    this.pageHitCtr = pageHitCtr;
    this.pageFaultCtr = pageFaultCtr;
    this.hitRatioCtr = hitRatioCtr;

    this.pageHitCtrVal = 0;
    this.pageFaultCtrVal = 0;
    this.borderColor = "#dfdddd";
    this.memory = new Map();
  }

  updateStatistics() {
    this.pageHitCtr.textContent = this.pageHitCtrVal;
    this.pageFaultCtr.textContent = this.pageFaultCtrVal;

    const totalAccesses = this.pageHitCtrVal + this.pageFaultCtrVal;
    const hitRatio = totalAccesses > 0 
      ? ((this.pageHitCtrVal / totalAccesses) * 100).toFixed(1)
      : 0;
    
    this.hitRatioCtr.textContent = `${hitRatio}%`
  }

  resetFrameColors() {
    this.pageFrames.forEach(frame => {
      frame.style.borderColor = this.borderColor;
    });
  }

  findEmptyFrameIndex() {
    return this.pageFrameValues.findIndex(
      frame => frame.textContent === "–"
    );
  }

  updateFrameVisual(frameIndex, page, color) {
    console.log(frameIndex);

    if (frameIndex !== -1) {

      console.log(this.pageFrameValues[frameIndex]);

      this.pageFrameValues[frameIndex].textContent = page;
      this.pageFrames[frameIndex].style.borderColor = color;

      setTimeout(() => {
        this.pageFrames[frameIndex].style.borderColor = this.borderColor;
      }, (700 / simSpeedRange.value));
    }
  }

  findPageFrameIndex(page) {
    return this.pageFrameValues.findIndex(
      frame => frame.textContent === page
    );
  }

  handlePageHit(page) {
    this.pageHitCtrVal++;
    this.updateStatistics();

    const hitFrameIndex = this.findPageFrameIndex(page);

    if (hitFrameIndex !== -1) {
      this.pageFrames[hitFrameIndex].style.borderColor = "green";

      setTimeout(() => {
        this.pageFrames[hitFrameIndex].style.borderColor = this.borderColor;
      }, (500/simSpeedRange.value));
    }
  }

  // to be abstracted
  async insertPage(page) {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async simulatePageReplacement(pages) {
    this.pageHitCtrVal = 0;
    this.pageFaultCtrVal = 0;

    if (this.memory instanceof Map) {
      this.memory.clear();
    } else if (this.memory instanceof Array) {
      this.memory.length = 0;
    }

    this.updateStatistics();
    this.resetFrameColors();

    for (let idx = 0; idx < pages.length; idx++) {
      await this.insertPage(pages[idx]);
    }
  }
}

class FIFOStrategy extends PageReplacementStrategy {

  constructor(...args) {
    super(...args);
    // use a queue instead of a Map
    this.memory = [];
  }

  async insertPage(page) {
    return new Promise((resolve) => {

      // if there is a page hit, handle it
      if(this.memory.includes(page)) {
        this.handlePageHit(page);
        setTimeout(resolve, (1000/simSpeedRange.value));
        return;
      }

      // else, handle a page fault
      this.pageFaultCtrVal++;
      this.updateStatistics();


      // if memory is full, remove the first/oldest page
      if (this.memory.length >= this.pageFrameValues.length) {
        const oldestPage = this.memory.shift();

        const removedFrameIndex = this.findPageFrameIndex(oldestPage);

        if (removedFrameIndex !== -1) {
          this.pageFrameValues[removedFrameIndex].textContent = "–";
          this.pageFrames[removedFrameIndex].style.borderColor = this.borderColor;
        }
      }

      // add new page to memory
      this.memory.push(page);
      
      console.log(this.memory);

      const emptyFrameIndex = this.findEmptyFrameIndex();
      this.updateFrameVisual(emptyFrameIndex, page, "goldenrod");

      setTimeout(resolve, (1000/simSpeedRange.value));
    });
  }
}

class LRUStrategy extends PageReplacementStrategy {
  async insertPage(page) {
    return new Promise((resolve) => {

      // handle page hits
      if (this.memory.has(page)) {
        this.handlePageHit(page);

        // update page timestamp
        this.memory.delete(page);
        this.memory.set(page, Date.now());

        setTimeout(resolve, (1000/simSpeedRange.value));
        return;
      }

      this.pageFaultCtrVal++;
      this.updateStatistics();

      if (this.memory.size >= this.pageFrameValues.length) {
        // find the oldest page

        const lruPage = Array.from(this.memory.entries()).reduce((oldest, current) =>
          current[1] < oldest[1] ? current : oldest
        )[0];


        this.memory.delete(lruPage);

        const removedFrameIndex = this.findPageFrameIndex(lruPage);
        if (removedFrameIndex !== -1) {
          this.pageFrameValues[removedFrameIndex].textContent = "–";
          this.pageFrames[removedFrameIndex].style.borderColor = this.borderColor;
        }
      }

      // add the new page with current timestamp
      this.memory.set(page, Date.now());

      // find and update the first empty frame
      const emptyFrameIndex = this.findEmptyFrameIndex();
      this.updateFrameVisual(emptyFrameIndex, page, "goldenrod");

      setTimeout(resolve, (1000/simSpeedRange.value));

    });
  }
}

async function runPageReplacement(strategy, pageSequence) {
  setupResetButton();
  resetSimulation();
  // disable reset button during simulation
  window.isSimulationRunning = true;
  resetBtn.disabled = true;
  resetBtn.classList.add('cursor-not-allowed', 'opacity-50');

  console.log(window.isSimulationRunning);


  const pageFrames = Array.from(document.querySelectorAll(".page-frame"));
  const pageFrameValues = Array.from(document.querySelectorAll(".value"));
  const pages = pageSequence.split(",").map((val) => val.trim());

  const pageHitCtr = document.querySelector(".page-hit-ctr");
  const pageFaultCtr = document.querySelector(".page-fault-ctr");
  const hitRatioCtr = document.querySelector(".hit-ratio-ctr");

  // use appropriate strategy
  const pageReplacement = strategy === "fifo" 
    ? new FIFOStrategy(pageFrames, pageFrameValues, pageHitCtr, pageFaultCtr, hitRatioCtr)
    : new LRUStrategy(pageFrames, pageFrameValues, pageHitCtr, pageFaultCtr, hitRatioCtr);

  try {
    await pageReplacement.simulatePageReplacement(pages);
  } finally {
    // re-enable reset button after simulation
    window.isSimulationRunning = false;
    resetBtn.disabled = false;
    resetBtn.classList.remove('cursor-not-allowed', 'opacity-50');
  }
}