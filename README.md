# Important
This is a program to calculate volumes of fluids to be given to neonates for specified rates of GIR. Made for particular setting for my hospital and may not be widely deployable. 

## Assumptions:
1. Complete fluid requirement is to be fulfilled via IV route.
2. Potassium required is 1mEq/kg/day after day 2.
3. Calcium is not added.
4. Sodium correction (N/5) after day 2.
5. Fluid requirements are taken as per the table:

| Day of Life | Term Neonates (mL/kg/day) | Preterm Neonates (mL/kg/day) |
| :---: | :---: | :---: |
| **Day 1** | 60 | 80 |
| **Day 2** | 80 | 100 |
| **Day 3** | 100 | 120 |
| **Day 4** | 120 | 140 |
| **Day 5+** | 150 | 160 |

## Limitations:
1. Doesn't account for oral feeds.
2. Small volumes of KCl (<0.5 ml) are ignored in 60 ml syringe formulation (Multiply manually as necessary from the KCl value in hourly table).
3. Intentionally limits GIR to 4 - 8 mg/kg/min
4. Not applicable to situations where glucose concentration of fluid is <50mg/ml or >250/mg/ml
