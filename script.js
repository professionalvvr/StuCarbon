const gradeStep = document.getElementById('step-grade');
const questionStep = document.getElementById('step-question');
const resultsStep = document.getElementById('results');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const nextBtn = document.getElementById('next-btn');
const breakdownList = document.getElementById('breakdown');
const totalEmissionsEl = document.getElementById('total-emissions');
const treesEl = document.getElementById('trees');
const tipsList = document.getElementById('tips');
const mountainFill = document.getElementById('mountain-fill');

let countryFactor = 0.5;
const countryEmissionFactors = {
  US: 0.4,
  CA: 0.15,
  GB: 0.3,
  IN: 0.7,
  CN: 0.6,
  AU: 0.5,
  DE: 0.25,
  FR: 0.1,
  default: 0.5
};

fetch('https://ipapi.co/json/')
  .then(r => r.json())
  .then(data => {
    const country = data.country;
    if (countryEmissionFactors[country]) {
      countryFactor = countryEmissionFactors[country];
    }
  })
  .catch(() => {});

const questionSets = {
  middle: [
    { text: 'How many km do you travel to school by car each week?', key: 'transport', factor: 0.21, period: 52 },
    { text: 'How many meat-based meals do you eat per week?', key: 'food', factor: 2.0, period: 52 },
    { text: 'How many hours do you play video games per week?', key: 'digital', factor: 0.1, period: 52 },
    { text: 'How many new toys or clothes do you get per month?', key: 'shopping', factor: 10, period: 12 },
    { text: 'How many plastic bottles do you use per week?', key: 'misc', factor: 0.1, period: 52 },
    { text: 'How much electricity does your household use per month (kWh)?', key: 'housing', factor: () => countryFactor, period: 12 }
  ],
  high: [
    { text: 'How many km do you travel to school by car each week?', key: 'transport', factor: 0.21, period: 52 },
    { text: 'How many short flights do you take per year?', key: 'transport', factor: 250, period: 1 },
    { text: 'How many meat-based meals do you eat per week?', key: 'food', factor: 2.0, period: 52 },
    { text: 'How many hours do you stream video per week?', key: 'digital', factor: 0.1, period: 52 },
    { text: 'How many clothing items do you buy per month?', key: 'shopping', factor: 10, period: 12 },
    { text: 'How much electricity does your household use per month (kWh)?', key: 'housing', factor: () => countryFactor, period: 12 }
  ],
  college: [
    { text: 'How many km do you travel by bus/train each week?', key: 'transport', factor: 0.1, period: 52 },
    { text: 'How many flights do you take per year?', key: 'transport', factor: 250, period: 1 },
    { text: 'How many meat-based meals do you eat per week?', key: 'food', factor: 2.0, period: 52 },
    { text: 'How many hours do you stream video per week?', key: 'digital', factor: 0.1, period: 52 },
    { text: 'How many dollars do you spend shopping per month?', key: 'shopping', factor: 0.05, period: 12 },
    { text: 'How much electricity do you use in your dorm/apartment per month (kWh)?', key: 'housing', factor: () => countryFactor, period: 12 },
    { text: 'How many plastic bottles do you use per week?', key: 'misc', factor: 0.1, period: 52 }
  ]
};

let currentSet = [];
let currentIndex = 0;
const answers = { transport: 0, housing: 0, food: 0, digital: 0, shopping: 0, misc: 0 };

document.querySelectorAll('#step-grade button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSet = questionSets[btn.dataset.grade];
    currentIndex = 0;
    gradeStep.classList.add('hidden');
    questionStep.classList.remove('hidden');
    showQuestion();
  });
});

function showQuestion() {
  const q = currentSet[currentIndex];
  questionText.textContent = q.text;
  answerInput.value = '';
  answerInput.focus();
}

nextBtn.addEventListener('click', () => {
  const value = parseFloat(answerInput.value);
  if (isNaN(value)) return;
  const q = currentSet[currentIndex];
  const factor = typeof q.factor === 'function' ? q.factor() : q.factor;
  const kg = value * factor * q.period;
  answers[q.key] += kg;
  playImpactSound();
  updateMountain();
  currentIndex++;
  if (currentIndex < currentSet.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function updateMountain() {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const max = 20000; // kg
  const percent = Math.min(total / max, 1);
  mountainFill.style.height = percent * 100 + '%';
}

function showResults() {
  questionStep.classList.add('hidden');
  resultsStep.classList.remove('hidden');
  const totalKg = Object.values(answers).reduce((a, b) => a + b, 0);
  const totalTons = (totalKg / 1000).toFixed(2);
  totalEmissionsEl.textContent = totalTons + ' tons CO₂/year';
  breakdownList.innerHTML = '';
  Object.entries(answers).forEach(([key, val]) => {
    const li = document.createElement('li');
    li.textContent = key + ': ' + (val / 1000).toFixed(2) + ' t';
    breakdownList.appendChild(li);
  });
  const trees = Math.ceil(totalKg / 21);
  treesEl.textContent = 'You would need about ' + trees + ' trees to offset this.';
  generateTips();
}

function generateTips() {
  tipsList.innerHTML = '';
  if (answers.transport > 3000)
    addTip('Consider walking, biking, or carpooling to reduce transport emissions.');
  if (answers.food > 2000)
    addTip('Try having more plant-based meals each week.');
  if (answers.digital > 500)
    addTip('Reduce screen time or lower video streaming quality.');
  if (answers.shopping > 1000)
    addTip('Buy fewer new items or choose second-hand products.');
  if (answers.housing > 4000)
    addTip('Save electricity by turning off lights and electronics when not in use.');
  if (answers.misc > 300)
    addTip('Use reusable bottles to cut down on plastic waste.');
  if (!tipsList.children.length)
    addTip('Great job! Your footprint is relatively low. Keep it up!');
}

function addTip(text) {
  const li = document.createElement('li');
  li.textContent = text;
  tipsList.appendChild(li);
}

function playImpactSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 600;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}
