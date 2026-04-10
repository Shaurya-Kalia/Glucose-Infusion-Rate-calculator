/**
 * Calculates neonatal GIR and fluid requirements.
 * @param {number} weight - Weight in kg
 * @param {number} ageDays - Day of life (1, 2, 3, 4, 5 for >=5)
 * @param {boolean} isTerm - true if term, false if preterm
 * @param {number} targetGIR - Required GIR in mg/kg/min
 */
function calculateFluids(weight, ageDays, isTerm, targetGIR) {
    // Step 2: Determine daily fluid volume (V) per kg
    let V = 0;
    if (isTerm) {
        const termFluids = { 1: 60, 2: 80, 3: 100, 4: 120 };
        V = ageDays >= 5 ? 150 : termFluids[ageDays];
    } else {
        const pretermFluids = { 1: 80, 2: 100, 3: 120, 4: 140 };
        V = ageDays >= 5 ? 160 : pretermFluids[ageDays];
    }

    // Step 3: Calculate total volume per hour
    const totalHourlyVol = (weight * V) / 24;

    // Steps 4 & 5: Allocate Saline, KCl, and Dextrose components
    let nsHourly = 0;
    let kclHourly = 0;
    let dexHourly = totalHourlyVol; // Default for age <= 2

    if (ageDays > 2) {
        nsHourly = (weight * V) / 120;             // 1/5th of total fluid
        kclHourly = (0.5 * weight) / 24;           // Assuming 2mEq/mL for 1mEq/kg/day
        dexHourly = totalHourlyVol - nsHourly - kclHourly; 
    }

    // Step 6: Determine required dextrose concentration (mg/mL)
    const glucoseMgPerHour = targetGIR * weight * 60;
    const requiredConcentration = glucoseMgPerHour / dexHourly; 

    // Step 7: Pearson Square mixing for D5/D10 or D10/D25
    let d5Hourly = 0, d10Hourly = 0, d25Hourly = 0;
    
    if (requiredConcentration < 100) {
        // Mix D5 (50 mg/mL) and D10 (100 mg/mL)
        d10Hourly = dexHourly * (requiredConcentration - 50) / (100 - 50);
        d5Hourly = dexHourly - d10Hourly;
    } else {
        // Mix D10 (100 mg/mL) and D25 (250 mg/mL)
        d25Hourly = dexHourly * (requiredConcentration - 100) / (250 - 100);
        d10Hourly = dexHourly - d25Hourly;
    }

    // Helper function to round to nearest 0.5
    const roundToHalf = (num) => Math.round(num * 2) / 2;

    // Step 8: Scale volumes for a standard 60 mL syringe
    const scaleFactor = 60 / totalHourlyVol;

    return {
        ratePerHour: roundToHalf(totalHourlyVol),
        hourly: {
            d5: Math.max(0, roundToHalf(d5Hourly)),
            d10: Math.max(0, roundToHalf(d10Hourly)),
            d25: Math.max(0, roundToHalf(d25Hourly)),
            ns: roundToHalf(nsHourly),
            kcl: roundToHalf(kclHourly)
        },
        syringe60: {
            d5: Math.max(0, roundToHalf(d5Hourly * scaleFactor)),
            d10: Math.max(0, roundToHalf(d10Hourly * scaleFactor)),
            d25: Math.max(0, roundToHalf(d25Hourly * scaleFactor)),
            ns: roundToHalf(nsHourly * scaleFactor),
            kcl: roundToHalf(kclHourly * scaleFactor)
        }
    };
}
