/*let audio;
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

  colorMode(HSB, 360, 100, 100, 1);

  if (!alreadyVisited) {
    // Setup audio
    audio = new Audio('Amigas.mp3');
    audio.crossOrigin = "anonymous"; // if loading externally
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
    button.style('border', '1px solid #cc0000');
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
  let amp = map(average, 0, 64, 0, 20);

  stroke('#cc0000');
  strokeWeight(1.2);
  let rings = 20;
  let baseRadius = 40;

  for (let i = 0; i < rings; i++) {
    let hue = (frameCount * 2 + i * 18) % 360; // fading hue
    stroke(hue, 80, 100); 
    strokeWeight(1.2);

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
      // Freeze frame
      freezeFrame = get();

      // Show stop icon again
      button.html('■');
      button.removeAttribute('disabled');
      button.position(width / 2 - 20, height / 2 - 20);
      button.style('color', '#cc0000');

      messageShown = true;
      showDownloadButton();

      // Mark this session as visited
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
Hola amigas, hace tiempo que no les escribo una carta.(Bueno esta no es escrita pero es leída) En estos momentos, estos últimos meses he pensado mucho en ustedes.Tal vez por que no les he visto, tal vez por que no hemos hablado y tanto de su lado como del mio han pasado tantas cosas, todo ha cambiado, ha pasado, ha evolucionado...
Así es la vida, ¿no?

A veces me doy cuenta de que ha pasado mucho tiempo desde la última vez que nos vimos, y se me hace muy loco.
Siempre está esa idea de que podríamos vernos, pero al final, siempre sale algo o bueno en estos dos años eso ha sido...

Quería contarles un poco de mi vida últimamente. Desde China que fue más o menos cuando tuvimos nuestra llamada anual, la última vez que hablamos, han pasado muchas cosas. Y no sé por qué, pero cuando pienso en ustedes, siempre me nace un cariño muy grande.
Eso me parece lindo, porque me llena el corazón de una manera difícil de explicar. Es como si estuvieran presentes sin realmente estarlo. como una ausencia presente… ¿o una presencia que no se ve pero sí se siente? No sé

Desde que volví de China, hay algo que se quedó conmigo. No solo los lugares, sino las personas que conocí allá. Algunas llegaron como si ya las hubiera conocido antes. Como si no fueran nuevas, sino simplemente reencontradas. ¿les ha pasado alguna vez? Tal vez si...
Es esa sensación de que alguien no entra en tu vida, sino que vuelve. Que su presencia no comienza, sino que continúa algo que no sabías que existía, mas o menos.

En esos encuentros empecé a pensar distinto, a mirar distinto también, supongo.
Las cosas pequeñas me hablaban más.
Empecé a pensar más en los objetos, en el tiempo, en las emociones que no tienen nombre. (Esa es una forma poetica de hablar de mi tesis. Estoy contándoles mi tesis ahí)
A veces me preguntaba si todo lo que sentía allá venía solo de mí o si eran las calles, las luces, los ritmos, que pensaban conmigo también.

Tengo algunos planes, pero no están tan fijos todavía.
Más bien son direcciones. Y también, quizás, reencontrarme con ustedes en algún momento, sería chévere... (En esa parte les estoy diciendo que mi vida está un poco borrosa en este momento)

Sobre eso que decía antes la ausencia presente estuve pensando más.
Y tal vez quizás alguien ya escribió sobre eso, tengo que investigarlo.
Y es que siento que están aunque no estén. Como si nuestra relación no necesitara la presencia constante para seguir existiendo. Como familix que no he visto en mucho tiempo 
A veces una memoria o un pensamiento fugaz hace que aparezcan.Y no es nostalgia, es algo más suave. Más lleno. Como Saudade en portuges 
Como si el cariño no se borrara con la distancia, sino que se escondiera en otros gestos, de la memoria.

A veces creo que este cariño tan fuerte que siento por ustedes no viene solo de este tiempo.
Sino de otra vida, o de otra época, de otra forma de existir.
No sé cómo explicarlo, pero hay algo muy profundo que me acompaña.
Y nada este mail es para decirles que en serio hay que llamarse, les quiero mucho y voilà eso... 
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
let hasPlayed = false;
let button;
let messageShown = false;
let freezeFrame;
let alreadyVisited = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100, 1);

  alreadyVisited = localStorage.getItem('visited') === 'true';

  if (alreadyVisited) {
    // Show one-time message immediately
    background(245);
    fill(0);
    textSize(12);
    text("This was a one-time experience.\nNo turning back.", width / 2, height / 2);
    noLoop();
    return;
  }

  // Setup audio if not visited
  audio = new Audio('Amigas.mp3');
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
  button.style('color', '#f80303ff');
  button.style('border', '1px solid #fefe02ff');
  button.style('font-family', 'monospace');
  button.position(width / 2 - 18, height / 2 - 20);

  button.mousePressed(playSound);
}

function draw() {
  if (alreadyVisited) return; // Already handled in setup

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
  let amp = map(average, 0, 64, 5, 35);

  let rings = 20;
  let baseRadius = 40;

  for (let i = 0; i < rings; i++) {

  let hueOsc = (frameCount * 2 + i * 20) % 360;
  let hueNoise = (noise(i * 0.2, frameCount * 0.01) - 0.5) * 60; 
  let hue = (hueOsc + hueNoise + 360) % 360;

  stroke(hue, 90, 100);
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
  if (!alreadyVisited && button) centerButton();
}

function playSound() {
  if (!hasPlayed) {
    audioCtx.resume();
    audio.play();
    hasPlayed = true;

    // Mark as visited immediately
    localStorage.setItem('visited', 'true');

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
      button.style('color', '#de0606ff');

      messageShown = true;
      showDownloadButton();
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
  dl.position(width / 2 - 50, height / 1.1);
  dl.mousePressed(downloadLetter);
}

function downloadLetter() {
  let letterText = `Hola amigas, hace tiempo que no les escribo una carta.(Bueno esta no es escrita pero es leida) En estos momentos, estos ultimos meses he pensado mucho en ustedes.Tal vez por que no les he visto, tal vez por que no hemos hablado y tanto de su lado como del mio han pasado tantas cosas, todo ha cambiado, ha pasado, ha evolucionado...
Asi es la vida, no?

A veces me doy cuenta de que ha pasado mucho tiempo desde la ultima vez que nos vimos, y se me hace muy loco.
Siempre esta esa idea de que podriamos vernos, pero al final, siempre sale algo o bueno en estos dos anos eso ha sido...

Queria contarles un poco de mi vida ultimamente. Desde China que fue mas o menos cuando tuvimos nuestra llamada anual, la ultima vez que hablamos, han pasado muchas cosas. Y no se por que, pero cuando pienso en ustedes, siempre me nace un carino muy grande.
Eso me parece lindo, porque me llena el corazon de una manera dificil de explicar. Es como si estuvieran presentes sin realmente estarlo. como una ausencia presente… o una presencia que no se ve pero si se siente? No se

Desde que volvi de China, hay algo que se quedo conmigo. No solo los lugares, sino las personas que conoci alla. Algunas llegaron como si ya las hubiera conocido antes. Como si no fueran nuevas, sino simplemente reencontradas. Les ha pasado alguna vez? Tal vez si...
Es esa sensacion de que alguien no entra en tu vida, sino que vuelve. Que su presencia no comienza, sino que continua algo que no sabias que existia, mas o menos.

En esos encuentros empece a pensar distinto, a mirar distinto tambien, supongo.
Las cosas pequenas me hablaban mas.
Empece a pensar mas en los objetos, en el tiempo, en las emociones que no tienen nombre. (Esa es una forma poetica de hablar de mi tesis. Estoy contandoles mi tesis ahi)
A veces me preguntaba si todo lo que sentia alla venia solo de mi o si eran las calles, las luces, los ritmos, que pensaban conmigo tambien.

Tengo algunos planes, pero no estan tan fijos todavia.
Mas bien son direcciones. Y tambien, quizas, reencontrarme con ustedes en algun momento, seria chevere... (En esa parte les estoy diciendo que mi vida esta un poco borrosa en este momento)

Sobre eso que decia antes la ausencia presente estuve pensando mas.
Y tal vez quizas alguien ya escribio sobre eso, tengo que investigarlo.
Y es que siento que estan aunque no esten. Como si nuestra relacion no necesitara la presencia constante para seguir existiendo. Como familix que no he visto en mucho tiempo
A veces una memoria o un pensamiento fugaz hace que aparezcan.Y no es nostalgia, es algo mas suave. Mas lleno. Como Saudade en portuges
Como si el carino no se borrara con la distancia, sino que se escondiera en otros gestos, de la memoria.

A veces creo que este carino tan fuerte que siento por ustedes no viene solo de este tiempo.
Sino de otra vida, o de otra epoca, de otra forma de existir.
No se como explicarlo, pero hay algo muy profundo que me acompana.
Y nada este mail es para decirles que en serio hay que llamarse, les quiero mucho y voila eso...
 
`.trim();

  let blob = new Blob([letterText], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  let a = createA(url, 'letter.txt');
  a.attribute('download', 'letter.txt');
  a.hide();
  a.elt.click();
}
