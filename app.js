// --- CLINICAL MATH LOGIC ---
function calculateFluids(weight, ageDays, isTerm, targetGIR) {
    let V = 0;
    if (isTerm) {
        const termFluids = { 1: 60, 2: 80, 3: 100, 4: 120 };
        V = ageDays >= 5 ? 150 : termFluids[ageDays];
    } else {
        const pretermFluids = { 1: 80, 2: 100, 3: 120, 4: 140 };
        V = ageDays >= 5 ? 160 : pretermFluids[ageDays];
    }

    const totalHourlyVol = (weight * V) / 24;

    let nsHourly = 0;
    let kclHourly = 0;
    let dexHourly = totalHourlyVol;

    if (ageDays > 2) {
        nsHourly = (weight * V) / 120;             
        kclHourly = (0.5 * weight) / 24;           
        dexHourly = totalHourlyVol - nsHourly - kclHourly; 
    }

    const glucoseMgPerHour = targetGIR * weight * 60;
    const requiredConcentration = glucoseMgPerHour / dexHourly; 

    let d5Hourly = 0, d10Hourly = 0, d25Hourly = 0;
    
    if (requiredConcentration < 100) {
        d10Hourly = dexHourly * (requiredConcentration - 50) / (100 - 50);
        d5Hourly = dexHourly - d10Hourly;
    } else {
        d25Hourly = dexHourly * (requiredConcentration - 100) / (250 - 100);
        d10Hourly = dexHourly - d25Hourly;
    }

    const roundToHalf = (num) => Math.round(num * 2) / 2;
    const formatExact = (num) => Number(num.toFixed(2)); // Keeps 2 decimals for precision

    const scaleFactor = 60 / totalHourlyVol;

    return {
        ratePerHour: formatExact(totalHourlyVol),
        hourly: {
            // Unrounded (exact to 2 decimals) for the hourly drip
            d5: Math.max(0, formatExact(d5Hourly)),
            d10: Math.max(0, formatExact(d10Hourly)),
            d25: Math.max(0, formatExact(d25Hourly)),
            ns: formatExact(nsHourly),
            kcl: formatExact(kclHourly)
        },
        syringe60: {
            // Rounded to nearest 0.5mL for manual syringe drawing
            d5: Math.max(0, roundToHalf(d5Hourly * scaleFactor)),
            d10: Math.max(0, roundToHalf(d10Hourly * scaleFactor)),
            d25: Math.max(0, roundToHalf(d25Hourly * scaleFactor)),
            ns: roundToHalf(nsHourly * scaleFactor),
            kcl: roundToHalf(kclHourly * scaleFactor)
        }
    };
}

// --- DOM INTERACTION LOGIC ---
document.getElementById('calc-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    // 1. Gather inputs
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const isTerm = document.getElementById('gestation').value === 'term';
    const gir = parseFloat(document.getElementById('gir').value);

    // 2. Run the math
    const results = calculateFluids(weight, age, isTerm, gir);

    // 3. Update the UI
    document.getElementById('out-rate').innerText = results.ratePerHour;
    
    // Hourly Table
    document.getElementById('out-h-d5').innerText = results.hourly.d5;
    document.getElementById('out-h-d10').innerText = results.hourly.d10;
    document.getElementById('out-h-d25').innerText = results.hourly.d25;
    document.getElementById('out-h-ns').innerText = results.hourly.ns;
    document.getElementById('out-h-kcl').innerText = results.hourly.kcl;

    // Syringe Table
    document.getElementById('out-s-d5').innerText = results.syringe60.d5;
    document.getElementById('out-s-d10').innerText = results.syringe60.d10;
    document.getElementById('out-s-d25').innerText = results.syringe60.d25;
    document.getElementById('out-s-ns').innerText = results.syringe60.ns;
    document.getElementById('out-s-kcl').innerText = results.syringe60.kcl;

    // 4. Reveal the results section
    document.getElementById('results').classList.remove('hidden');
});
