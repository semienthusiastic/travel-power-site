
const HOME_VOLTAGE = { UK: 230, EU: 230, US: 120 };
const VOLT_TOLERANCE = 15; // volts tolerance band for "same system"

async function loadData(){ const r = await fetch('data.json'); return r.json(); }

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadData();
    const selects = [document.getElementById('countrySelect'), document.getElementById('toCountry')].filter(Boolean);
    selects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value=\"\">-- Select a Country --</option>' + data.map(c => `<option>${c.country}</option>`).join('');
    });
  } catch(e){ console.error('Failed to load data.json', e); }
});

function needsAdapterByShape(country, fromRegion){
  if(!country||!fromRegion) return true;
  const types = country.plugTypes || [];
  if(fromRegion==='UK') return !types.includes('G');
  if(fromRegion==='US') return !(types.includes('A') || types.includes('B'));
  if(fromRegion==='EU') return !(types.includes('C') || types.includes('E') || types.includes('F'));
  return true;
}
function sameVoltageSystem(fromV, toV){ return Math.abs(fromV - toV) <= VOLT_TOLERANCE; }

async function showCountryInfo(){
  const data = await loadData();
  const name = (document.getElementById('countrySelect')||{}).value;
  const country = data.find(c => c.country === name);
  if(!country) return;
  const html = `
    <div class="result">
      <h2>${country.country}</h2>
      <p><strong>Plug Types:</strong> ${country.plugTypes.join(', ')}</p>
      <p><strong>Voltage:</strong> ${country.voltage}V</p>
      <p><strong>Frequency:</strong> ${country.frequency} Hz</p>
      ${country.notes ? `<p><em>${country.notes}</em></p>` : ''}
      <p><a href="https://www.amazon.com/s?k=universal+travel+adapter+type+${country.plugTypes[0]}&tag=YOURTAGHERE" target="_blank" rel="nofollow noopener">Buy Adapter on Amazon</a></p>
    </div>`;
  document.getElementById('countryResult').innerHTML = html;
}

async function checkAppliance(){
  const data = await loadData();
  const fromRegion = document.getElementById('fromCountry').value;
  const toName = document.getElementById('toCountry').value;
  const dual = document.getElementById('dualVoltage').checked;
  const country = data.find(c => c.country === toName);
  if(!country) return;

  const fromV = HOME_VOLTAGE[fromRegion];
  const toV = country.voltage;
  const adapterNeeded = needsAdapterByShape(country, fromRegion);
  const sameV = sameVoltageSystem(fromV, toV);

  let verdict = '';
  let details = [];

  if (dual) {
    verdict = '✅ Your dual-voltage device should work abroad.';
    details.push(sameV ? 'Voltage compatible.' : `Voltage differs (${fromV}V → ${toV}V), but dual-voltage handles it.`);
    if (adapterNeeded) details.push('You will need a plug adapter.');
  } else {
    if (sameV) {
      verdict = '✅ Your single-voltage device should work (same voltage system).';
      if (adapterNeeded) details.push('You will need a plug adapter.');
    } else {
      verdict = '⚠ Your single-voltage device is NOT compatible with the destination voltage.';
      details.push('You will need a voltage converter (and possibly a plug adapter).');
    }
  }
  details.push(`Note: Frequency is ${country.frequency} Hz. Most phone/laptop chargers are fine; some motors/clocks may not be.`);

  const html = `
    <div class="result">
      <h2>${fromRegion} → ${country.country}</h2>
      <p>${verdict}</p>
      <ul>${details.map(d => `<li>${d}</li>`).join('')}</ul>
      <p>
        ${adapterNeeded ? `<a href="https://www.amazon.com/s?k=universal+travel+adapter&tag=YOURTAGHERE" target="_blank" rel="nofollow noopener">Buy Plug Adapter</a> &nbsp;` : ''}
        ${(!dual && !sameV) ? `<a href="https://www.amazon.com/s?k=travel+voltage+converter&tag=YOURTAGHERE" target="_blank" rel="nofollow noopener">Buy Voltage Converter</a>` : ''}
      </p>
      <p><a href="plug-voltage.html">See plug & voltage for ${country.country}</a></p>
    </div>`;
  document.getElementById('applianceResult').innerHTML = html;
}
