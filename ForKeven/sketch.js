let audio; 
let audioCtx;
let analyser;
let source;
let dataArray;
let hasPlayed = false;
let button;
let messageShown = false;
let freezeFrame;
let alreadyVisited = false;

function setup() {
  alreadyVisited = localStorage.getItem('visited') === 'true';

  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  colorMode(HSB, 360, 100, 100, 1); // HSB for fading colors

  if (!alreadyVisited) {
    // Setup audio
    audio = new Audio('Keven.mp3');
    audio.crossOrigin = "anonymous";
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    let bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    button = createButton('▸');
    button.style('font-size', '16px');
    button.style('padding', '8px 16px');
    button.style('background', 'transparent');
    button.style('color', '#cc0000');
    button.style('border', '1px solid #f6de05ff');
    button.style('font-family', 'monospace');
    centerButton();

    button.mousePressed(playSound);
  }
}

function draw() {
  if (alreadyVisited) {
    background(245);
    fill(0);
    textSize(12);
    text("This was a one-time experience.\nNo turning back.", width / 2, height / 2);
    noLoop();
    return;
  }

  if (messageShown) {
    if (freezeFrame) image(freezeFrame, 0, 0);

    noStroke();
    fill(0);
    textSize(10);
    text("This voice lived once.\nThank you for listening.", width / 2, height / 1.2);
    return;
  }

  background(245);
  translate(width / 2, height / 2);

  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    let val = dataArray[i] - 128;
    sum += abs(val);
  }
  let average = sum / dataArray.length;
  // Amplify a bit for more visible movement
  let amp = map(average, 0, 64, 5, 35);

  let rings = 20;
  let baseRadius = 40;

  for (let i = 0; i < rings; i++) {
    let hueOsc = map(sin(frameCount * 0.08 + i * 0.5), -1, 1, 0, 60); 
    let hueNoise = noise(i * 0.5, frameCount * 0.05) * 10;
    stroke((hueOsc + hueNoise) % 360, 90, 100); 
    strokeWeight(1.5);

    let r = baseRadius + i * 8;
    beginShape();
    for (let a = 0; a < TWO_PI + 0.1; a += 0.05) {
      let noiseVal = noise(cos(a) * 1.2 + 1, sin(a) * 1.2 + 1, frameCount * 0.015 + i * 0.25);
      let wave = map(noiseVal, 0, 1, -amp, amp);
      let x = cos(a) * (r + wave);
      let y = sin(a) * (r + wave);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function centerButton() {
  const btnWidth = 80;
  const btnHeight = 40;
  button.position((windowWidth - btnWidth) / 1.95, (windowHeight - btnHeight) / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!alreadyVisited) {
    centerButton();
  }
}

function playSound() {
  if (!hasPlayed) {
    audioCtx.resume();
    audio.play();
    hasPlayed = true;

    button.html('playing...');
    button.attribute('disabled', '');
    const bottomX = width / 2 - 50;
    const bottomY = height * 0.9;
    button.position(bottomX, bottomY);

    audio.onended = () => {
      freezeFrame = get();

      button.html('■');
      button.removeAttribute('disabled');
      button.position(width / 2 - 20, height / 2 - 20);
      button.style('color', '#f6de05ff');

      messageShown = true;
      showDownloadButton();

      localStorage.setItem('visited', 'true');
    };
  }
}

function showDownloadButton() {
  let dl = createButton('⬇ download letter');
  dl.style('font-size', '14px');
  dl.style('padding', '6px 12px');
  dl.style('background', 'transparent');
  dl.style('color', '#333');
  dl.style('border', '1px solid #333');
  dl.style('font-family', 'monospace');
  dl.position(width / 2 - 70, height / 1.1);
  dl.mousePressed(downloadLetter);
}

function downloadLetter() {
  let letterText = `

Hey Keven,
[... your full letter text ...]
Martina
`.trim();

  let blob = new Blob([letterText], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  let a = createA(url, 'letter.txt');
  a.attribute('download', 'letter.txt');
  a.hide();
  a.elt.click();
}
