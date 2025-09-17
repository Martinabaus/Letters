/*
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
    audio = new Audio('Monica.mp3');
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
    button.style('color', '#26de06ff');
    button.style('border', '1px solid #fefe02ff');
    button.style('font-family', 'monospace');
    centerButton();

    button.mousePressed(playSound);
  }
}

function draw() {
 
 alreadyVisited = localStorage.getItem('visited') === 'true';

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
    let hueOsc = map(sin(frameCount * 0.08 + i * 0.5), -1, 1, 120, 60); 
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
      button.style('color', '#26de06ff');

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

Dear Monica,

This is a lived letter a way to thank you for being such a lovely pengyou. You're always so thoughtful, so sweet, and I feel lucky for the days we shared walking around, talking, discovering things together. It felt a little like traveling not only through a place, but also through ideas, through each other.

One of the things we spoke about was love, whether it is a choice or maybe a force.
And maybe it's a bit like traveling.

When you set out on a trip, there's intention you book a train, pack your bag, choose a destination. But then, the real journey is often what you didn't plan: the detour, the stranger you meet, the street you turn onto by accident. In the same way, falling in love feels like being swept up into the unknown, a force you can't quite control, like going into a path you didn't expect.
But staying in love i think that's more like the daily part of traveling. Choosing to keep going even when you're tired, even when the weather changes. Choosing to walk one more street, to sit down and listen, to notice the details.
And maybe, just like traveling, love is also about getting to know yourself. You discover parts of yourself reflected in another person, but also in the silences, in the moments of being lost, in the small decisions along the way.

Some people say that we don't love people for their traits, but for something unnamable like the atmosphere of a city you can't explain, but you feel. Others say love is not only a feeling, but an act a way of being with someone, the same way traveling isn't just moving but how you move through the world.
Maybe love is both: A wild force that enters without knocking, and a quiet choice we make every day with another, and with ourselves.
It's like setting out on a journey without a map:
you can choose to move forward, to explore, to stay open to what appears,
and in the process, you discover not just the world around you,
but who you are when you're on the road.

I'm glad we got to travel a little together, not just through streets and days, but through thoughts and moments.And somehow, in the middle of all of that moving, I notice a bit more of who I am. and I hope the journey is doing the same for you.

Big hugs, keep traveling and loving!

Con cariño,
Martina 
`.trim();

  let blob = new Blob([letterText], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  let a = createA(url, 'letter.txt');
  a.attribute('download', 'letter.txt');
  a.hide();
  a.elt.click();
}*/

let audio;
let audioCtx;
let analyser;
let source;
let dataArray;
let button;
let messageShown = false;
let freezeFrame;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100, 1);

  // Strict one-time check
  const alreadyVisited = localStorage.getItem('visited') === 'true';
  const audioStarted = localStorage.getItem('audioStarted') === 'true';

  if (alreadyVisited || audioStarted) {
    background(245);
    fill(0);
    textSize(12);
    text("This was a one-time experience.\nNo turning back.", width / 2, height / 2);
    noLoop();
    return;
  }

  // Setup audio
  audio = new Audio('Monica.mp3');
  audio.crossOrigin = "anonymous";
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  let bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  // Play button
  button = createButton('▸');
  button.style('font-size', '16px');
  button.style('padding', '8px 16px');
  button.style('background', 'transparent');
  button.style('color', '#26de06ff');
  button.style('border', '1px solid #fefe02ff');
  button.style('font-family', 'monospace');
  button.position(width / 2 - 18, height / 2 - 20);

  button.mousePressed(playSound);
}

function draw() {
  const alreadyVisited = localStorage.getItem('visited') === 'true';

  // If experience is already over (after playback + reload)
  if (alreadyVisited) {
    background(245);
    fill(0);
    textSize(12);
    text("This was a one-time experience.\nNo turning back.", width / 2, height / 2);
    noLoop();
    return;
  }

  // If playback ended, freeze last frame and show message
  if (messageShown) {
    if (freezeFrame) image(freezeFrame, 0, 0);
    noStroke();
    fill(0);
    textSize(10);
    text("This voice lived once.\nThank you for listening.", width / 2, height / 1.2);
    return;
  }

  // Live animation with voice
  background(245);
  translate(width / 2, height / 2);
  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    let val = dataArray[i] - 128;
    sum += abs(val);
  }
  let average = sum / dataArray.length;
  let amp = map(average, 0, 64, 5, 35);

  let rings = 20;
  let baseRadius = 40;

  for (let i = 0; i < rings; i++) {
    let hueOsc = map(sin(frameCount * 0.02 + i * 0.5), -1, 1, 0, 60);
    let hueNoise = noise(i * 0.5, frameCount * 0.05) * 10;
    stroke((hueOsc + hueNoise) % 360, 90, 100);
    strokeWeight(1.5);

    let r = baseRadius + i * 8;
    beginShape();
    for (let a = 0; a < TWO_PI + 0.1; a += 0.05) {
      let noiseVal = noise(
        cos(a) * 1.2 + 1,
        sin(a) * 1.2 + 1,
        frameCount * 0.015 + i * 0.25
      );
      let wave = map(noiseVal, 0, 1, -1, 1) * amp;
      let x = cos(a) * (r + wave);
      let y = sin(a) * (r + wave);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function playSound() {
  // Mark audio as started to block refresh
  localStorage.setItem('audioStarted', 'true');

  audioCtx.resume();
  audio.play();

  button.html('playing...');
  button.attribute('disabled', '');
  button.position(width / 2 - 50, height * 0.9);

  audio.onended = () => {
    freezeFrame = get();
    button.html('■');
    button.removeAttribute('disabled');
    button.position(width / 2 - 20, height / 2 - 20);
    button.style('color', '#26de06ff');

    messageShown = true;
    // Mark as fully visited
    localStorage.setItem('visited', 'true');
    localStorage.removeItem('audioStarted');
    showDownloadButton();
  };
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
  let letterText = `Dear Monica,

This is a lived letter a way to thank you for being such a lovely pengyou. You're always so thoughtful, so sweet, and I feel lucky for the days we shared walking around, talking, discovering things together. It felt a little like traveling not only through a place, but also through ideas, through each other.

One of the things we spoke about was love, whether it is a choice or maybe a force.
And maybe it's a bit like traveling.

When you set out on a trip, there's intention you book a train, pack your bag, choose a destination. But then, the real journey is often what you didn't plan: the detour, the stranger you meet, the street you turn onto by accident. In the same way, falling in love feels like being swept up into the unknown, a force you can't quite control, like going into a path you didn't expect.
But staying in love i think that's more like the daily part of traveling. Choosing to keep going even when you're tired, even when the weather changes. Choosing to walk one more street, to sit down and listen, to notice the details.
And maybe, just like traveling, love is also about getting to know yourself. You discover parts of yourself reflected in another person, but also in the silences, in the moments of being lost, in the small decisions along the way.

Some people say that we don't love people for their traits, but for something unnamable like the atmosphere of a city you can't explain, but you feel. Others say love is not only a feeling, but an act a way of being with someone, the same way traveling isn't just moving but how you move through the world.
Maybe love is both: A wild force that enters without knocking, and a quiet choice we make every day with another, and with ourselves.
It's like setting out on a journey without a map:
you can choose to move forward, to explore, to stay open to what appears,
and in the process, you discover not just the world around you,
but who you are when you're on the road.

I'm glad we got to travel a little together, not just through streets and days, but through thoughts and moments.And somehow, in the middle of all of that moving, I notice a bit more of who I am. and I hope the journey is doing the same for you.

Big hugs, keep traveling and loving!

Con cariño,
Martina`; // keep your original text
  let blob = new Blob([letterText], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  let a = createA(url, 'letter.txt');
  a.attribute('download', 'letter.txt');
  a.hide();
  a.elt.click();
}

function centerButton() {
  const btnWidth = 80;
  const btnHeight = 40;
  button.position((windowWidth - btnWidth) / 1.95, (windowHeight - btnHeight) / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!localStorage.getItem('visited') && !localStorage.getItem('audioStarted')) {
    centerButton();
  }
}
