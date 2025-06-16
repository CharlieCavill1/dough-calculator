
    let currentPreset = null;
    let currentPresetData = null;

    const presets = {
      newYork: {
        hydration: 63,
        salt: 2.5,
        oil: 2.5,
        sugar: 1.5,
        dsm: 0,
        roomTemp: 21,
        roomFermentation: 12,
        coldTemp: 4,
        coldFermentation: 48,
      },
      sicilian: {
        hydration: 70,
        salt: 2.5,
        oil: 3.5,
        sugar: 0,
        dsm: 0,
        roomTemp: 20,
        roomFermentation: 8,
        coldTemp: 4,
        coldFermentation: 0,

      },
      tavern: {
        hydration: 50,
        salt: 2.5,
        oil: 10,
        sugar: 0,
        dsm: 0,
        roomTemp: 20,
        roomFermentation: 0.5,
        coldTemp: 4,
        coldFermentation: 72,
      },
      neapolitan: {
        hydration: 62,
        salt: 3,
        oil: 0,
        sugar: 0,
        dsm: 0,
        roomTemp: 20,
        roomFermentation: 24,
        coldTemp: 4,
        coldFermentation: 0,
    }, 
    roman: {
        hydration: 70,
        salt: 3,
        oil: 3.5,
        sugar: 0,
        dsm: 0,
        roomTemp: 20,
        roomFermentation: 4,
        coldTemp: 4,
        coldFermentation: 12,
    }, 
  }

  function loadPreset(type) {
  const preset = presets[type];
  currentPreset = type;
  currentPresetData = { ...preset };
  highlightActivePreset(type, false);

  document.getElementById('hydration').value = preset.hydration;
  document.getElementById('salt').value = preset.salt;
  document.getElementById('oil').value = preset.oil.toString();
  document.getElementById('sugar').value = preset.sugar.toString();
  document.getElementById('dsm').value = preset.dsm.toString();
  document.getElementById('roomTemp').value = preset.roomTemp.toString();
  document.getElementById('roomFermentation').value = preset.roomFermentation.toString();
  document.getElementById('coldTemp').value = preset.coldTemp.toString();
  document.getElementById('coldFermentation').value = preset.coldFermentation.toString();
}

function loadCustomPreset(name) {
  const preset = JSON.parse(localStorage.getItem(`customPreset-${name}`));
  if (!preset) return;

  currentPreset = name;
  currentPresetData = { ...preset };
  highlightActivePreset(name, true);

  document.getElementById('hydration').value = preset.hydration;
  document.getElementById('salt').value = preset.salt;
  document.getElementById('oil').value = preset.oil;
  document.getElementById('sugar').value = preset.sugar;
  document.getElementById('dsm').value = preset.dsm;
  document.getElementById('roomTemp').value = preset.roomTemp;
  document.getElementById('roomFermentation').value = preset.roomFermentation;
  document.getElementById('coldTemp').value = preset.coldTemp;
  document.getElementById('coldFermentation').value = preset.coldFermentation;
}

function highlightActivePreset(name, isCustom = false) {
  document.querySelectorAll('.presets button').forEach(btn => {
    btn.classList.remove('active-preset');
  });
  const id = isCustom ? `custom-${name}` : `preset-${name}`;
  const activeBtn = document.getElementById(id);

  if (activeBtn) {
    activeBtn.classList.add('active-preset');
  }
}


    function saveCustomPreset() {
  const name = prompt("Name your custom preset:");
  if (!name) return;

  const preset = {
    hydration: parseFloat(document.getElementById('hydration').value),
    salt: parseFloat(document.getElementById('salt').value),
    oil: parseFloat(document.getElementById('oil').value),
    sugar: parseFloat(document.getElementById('sugar').value),
    dsm: parseFloat(document.getElementById('dsm').value),
    roomTemp: parseFloat(document.getElementById('roomTemp').value),
    roomFermentation: parseFloat(document.getElementById('roomFermentation').value),
    coldTemp: parseFloat(document.getElementById('coldTemp').value),
    coldFermentation: parseFloat(document.getElementById('coldFermentation').value)
  };

  localStorage.setItem(`customPreset-${name}`, JSON.stringify(preset));
  renderCustomPresets();
  renderCustomPresets();
  loadCustomPreset(name); 
  highlightActivePreset(name, true);
}

function renderCustomPresets() {
  const container = document.getElementById('customPresets');
  container.innerHTML = '<strong>Custom Presets:</strong><br>';

  for (let key in localStorage) {
    if (key.startsWith('customPreset-')) {
      const name = key.replace('customPreset-', '');
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '0.5rem';

      const loadBtn = document.createElement('button');
      loadBtn.textContent = name;
      loadBtn.id = `custom-${name}`;
      loadBtn.onclick = () => loadCustomPreset(name);

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit Preset';
      editBtn.style.marginLeft = '5px';
      editBtn.title = 'Edit preset';
      editBtn.onclick = () => editCustomPreset(name);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Preset';
      deleteBtn.style.marginLeft = '5px';
      deleteBtn.title = 'Delete preset';
      deleteBtn.onclick = () => {
        if (confirm(`Delete preset "${name}"?`)) {
          localStorage.removeItem(`customPreset-${name}`);
          renderCustomPresets();
        }
      };

      wrapper.appendChild(loadBtn);
      wrapper.appendChild(editBtn);
      wrapper.appendChild(deleteBtn);
      container.appendChild(wrapper);
    }
  }
}

function editCustomPreset(name) {
  const preset = {
    hydration: parseFloat(document.getElementById('hydration').value),
    salt: parseFloat(document.getElementById('salt').value),
    oil: parseFloat(document.getElementById('oil').value),
    sugar: parseFloat(document.getElementById('sugar').value),
    dsm: parseFloat(document.getElementById('dsm').value),
    roomTemp: parseFloat(document.getElementById('roomTemp').value),
    roomFermentation: parseFloat(document.getElementById('roomFermentation').value),
    coldTemp: parseFloat(document.getElementById('coldTemp').value),
    coldFermentation: parseFloat(document.getElementById('coldFermentation').value)
  };

  localStorage.setItem(`customPreset-${name}`, JSON.stringify(preset));
  alert(`Preset "${name}" updated.`);
}

    function calculateYeastPercent(roomTemp, roomHours, coldTemp, coldHours) {
      function yeastFactor(temp, hours) {
        if (!temp || !hours || hours <= 0) return 0;
        let tempFactor = 1;
        if (temp <= 5) tempFactor = 0.2;
        else if (temp <= 10) tempFactor = 0.4;
        else if (temp <= 15) tempFactor = 0.6;
        else if (temp <= 20) tempFactor = 0.8;
        else if (temp <= 25) tempFactor = 1;
        else tempFactor = 1.2;
        return (1.5 / hours) * tempFactor;
      }

      const roomYeast = yeastFactor(roomTemp, roomHours);
      const coldYeast = yeastFactor(coldTemp, coldHours);

      return roomYeast + coldYeast;
    }

    document.getElementById('doughForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const totalWeight = parseFloat(document.getElementById('totalWeight').value);
      const numDoughballs = parseInt(document.getElementById('numDoughballs').value);
      const doughballWeight = totalWeight * numDoughballs;
    
      const hydration = parseFloat(document.getElementById('hydration').value) / 100;
      const salt = parseFloat(document.getElementById('salt').value) / 100;
      const oil = parseFloat(document.getElementById('oil').value) / 100;
      const sugar = parseFloat(document.getElementById('sugar').value) / 100;
      const dsm = parseFloat(document.getElementById('dsm').value) / 100;
      const roomTemp = parseFloat(document.getElementById('roomTemp').value);
      const roomFermentation = parseFloat(document.getElementById('roomFermentation').value);
      const coldTemp = parseFloat(document.getElementById('coldTemp').value);
      const coldFermentation = parseFloat(document.getElementById('coldFermentation').value);

      const yeastPercent = calculateYeastPercent(roomTemp, roomFermentation, coldTemp, coldFermentation);
      const yeast = yeastPercent / 100;

      const totalPercent = 1 + hydration + salt + yeast + oil;
      const flour = totalWeight / totalPercent;
      const water = flour * hydration;
      const saltGrams = flour * salt;
      const yeastGrams = flour * yeast;
      const oilGrams = flour * oil;
      const sugarGrams = flour * sugar;
      const dsmGrams = flour * dsm

      const resultHTML = `
        <h2>Ingredients:</h2>
        <ul>
          <li>Flour: ${(flour * numDoughballs).toFixed(1)}g</li>
          <li>Water: ${(water * numDoughballs).toFixed(1)}g</li>
          <li>Salt: ${(saltGrams * numDoughballs).toFixed(1)}g</li>
          <li>Yeast: ${(yeastGrams * numDoughballs).toFixed(1)}g</li>
          <li>Oil: ${(oilGrams * numDoughballs).toFixed(1)}g</li>
          <li>Sugar: ${(sugarGrams * numDoughballs).toFixed(1)}g</li>
          <li>Diastatic Malt Powder: ${(dsmGrams * numDoughballs).toFixed(1)}g</li>
          <li><strong>Total Dough Weight: ${(totalWeight * numDoughballs).toFixed(1)}g</strong></li>
        </ul>
      `;

      document.getElementById('results').innerHTML = resultHTML;
    });
    window.onload = renderCustomPresets; 

    function clearActivePresetIfModified() {
  if (!currentPresetData) return;

  const fields = ['hydration', 'salt', 'oil', 'sugar', 'dsm', 'roomTemp', 'roomFermentation', 'coldTemp', 'coldFermentation'];
  for (let field of fields) {
    const inputVal = parseFloat(document.getElementById(field).value);
    if (inputVal !== currentPresetData[field]) {
      document.querySelectorAll('.presets button').forEach(btn => {
  btn.classList.remove('active-preset');
});

      currentPreset = null;
      currentPresetData = null;
      break;
    }
  }
}

// Attach event listeners to all inputs
const allInputs = document.querySelectorAll('#doughForm input');
allInputs.forEach(input => {
  input.addEventListener('input', clearActivePresetIfModified);
});