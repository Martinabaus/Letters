let sound;
let amplitude;
let hasPlayed = false;
let button;
let messageShown = false;
let freezeFrame;

function preload() {
  sound = loadSound('letter.mp3'); // your audio
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  amplitude = new p5.Amplitude();

  button = createButton('▸');
  button.style('font-size', '16px');
  button.style('padding', '8px 16px');
  button.style('background', 'transparent');
  button.style('color', '#cc0000');
  button.style('border', '1px solid #cc0000');
  button.style('font-family', 'monospace');
  let btnX = width * 0.05;   // 5% from left
  let btnY = height * 0.08;  // 8% from top
  button.position(btnX, btnY);

  button.mousePressed(playSound);
}

function draw() {
  if (messageShown) {
    // Freeze the last visual frame
    if (freezeFrame) {
      image(freezeFrame, 0, 0);
    }

    // Show message
    noStroke();
    fill(0);
    textSize(10);
    text("This voice lived once.\nThank you for listening.", width / 2, height / 2);

    return; // stop drawing animation
  }

  // Live animation before sound ends
  background(245);
  translate(width / 2, height / 2);

  let level = amplitude.getLevel();
  let amp = map(level, 0, 0.3, 0, 20);

  stroke('#cc0000');
  strokeWeight(1.2);

  let rings = 30;
  let baseRadius = 60;

  for (let i = 0; i < rings; i++) {
    let r = baseRadius + i * 8;
    beginShape();
    for (let a = 0; a < TWO_PI + 0.1; a += 0.05) {
      let noiseVal = noise(cos(a) + 1, sin(a) + 1, frameCount * 0.01 + i * 0.2);
      let wave = map(noiseVal, 0, 1, -amp, amp);
      let x = cos(a) * (r + wave);
      let y = sin(a) * (r + wave);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function playSound() {
  userStartAudio();
  if (!hasPlayed) {
    sound.play();
    hasPlayed = true;
    button.html('playing...');
    button.attribute('disabled', '');
      sound.onended(() => {
  isPlaying = false;
  button.html('■');
  button.attribute('disabled', '');
        
      freezeFrame = get(); // capture the final frame
      messageShown = true;
      showDownloadButton(); // optional
    });
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
  dl.position(width / 1.3, height / 1.1);
  dl.mousePressed(downloadLetter); // Correctly assign function
}

function downloadLetter() {
  let letterText = `
Dear friend,

This letter was once spoken,
carried by breath and time.
Now it lingers in your hands —
not just heard, but held.

With warmth,  
M.
  `.trim();

  let blob = new Blob([letterText], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  let a = createA(url, 'letter.txt');
  a.attribute('download', 'letter.txt');
  a.hide();
  a.elt.click();
}
