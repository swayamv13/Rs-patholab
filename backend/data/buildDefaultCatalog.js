/**
 * Default pathology + imaging catalog (typical Indian lab menu).
 * Admin can edit prices; use POST /api/admin/tests/seed-defaults to insert.
 */

const defDetails = ['As per doctor advice', 'Fasting rules may apply', 'Report time varies by test'];

function row(name, categorySlug, categoryLabel, kind, basePrice, extraDetails = []) {
    const originalPrice = Math.round(basePrice);
    const discountedPrice = Math.max(0, Math.round(originalPrice * 0.82));
    const discount = originalPrice ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0;
    return {
        name,
        categorySlug,
        categoryLabel: categoryLabel || categorySlug,
        kind,
        originalPrice,
        discountedPrice,
        discount,
        details: [...defDetails.slice(0, 2), ...(extraDetails.length ? extraDetails : [defDetails[2]])],
        description: `${name} — available at RS Path Lab. Confirm preparation when booking.`,
        active: true
    };
}

const CAT = {
    blood: ['blood-tests', 'Blood Tests', 'pathology'],
    urine: ['urine-stool', 'Urine & Stool', 'pathology'],
    thyroid: ['thyroid-diabetes', 'Thyroid & Diabetes', 'pathology'],
    liver: ['liver-kidney', 'Liver & Kidney', 'pathology'],
    infection: ['infection', 'Infection & Dengue', 'pathology'],
    heart: ['heart', 'Heart', 'pathology'],
    vitd: ['vitamin-d', 'Vitamin-D', 'pathology'],
    fever: ['high-fever', 'High Fever', 'pathology'],
    xray: ['x-ray', 'X-ray Services', 'imaging'],
    usg: ['ultrasound', 'Ultrasound', 'imaging'],
    mri: ['mri-ct', 'MRI & CT Scan', 'imaging'],
    womens: ['womens-health', "Women's Health", 'pathology'],
    mens: ['mens-health', "Men's Health", 'pathology'],
    preventive: ['preventive-packages', 'Preventive Packages', 'package']
};

export function buildDefaultCatalogItems() {
    const out = [];

    const bloodNames = [
        ['Complete Blood Count (CBC)', 380],
        ['Erythrocyte Sedimentation Rate (ESR)', 120],
        ['C-Reactive Protein (CRP)', 450],
        ['Procalcitonin', 2200],
        ['D-Dimer', 1200],
        ['Blood Grouping & RH Typing', 200],
        ['Peripheral Smear Examination', 350],
        ['Reticulocyte Count', 400],
        ['Hb Electrophoresis', 1200],
        ['G6PD Qualitative', 800],
        ['Blood Sugar (Fasting)', 180],
        ['Blood Sugar (Random)', 180],
        ['Blood Sugar (Post Prandial)', 180],
        ['HbA1c (Glycosylated Hemoglobin)', 500],
        ['Glucose Tolerance Test (GTT)', 600],
        ['Insulin (Fasting)', 900],
        ['C-Peptide', 1200],
        ['Lipid Profile', 550],
        ['Apo A1 / Apo B', 1400],
        ['Lipoprotein (a)', 1800],
        ['Homocysteine', 1400],
        ['Liver Function Test (LFT)', 650],
        ['Gamma GT', 450],
        ['Kidney Function Test (KFT / RFT)', 600],
        ['Serum Electrolytes (Na, K, Cl)', 450],
        ['Serum Calcium', 250],
        ['Serum Phosphorus', 250],
        ['Serum Uric Acid', 250],
        ['Serum Iron', 450],
        ['TIBC', 500],
        ['Ferritin', 750],
        ['Vitamin B12', 900],
        ['Folate (Serum)', 700],
        ['Thyroid Profile (T3, T4, TSH)', 550],
        ['Free T3', 450],
        ['Free T4', 450],
        ['Anti-TPO Antibody', 900],
        ['Vitamin D (25-OH)', 1200],
        ['PSA (Total)', 800],
        ['Testosterone Total', 900],
        ['LH / FSH', 1100],
        ['Prolactin', 650],
        ['Cortisol (AM)', 900],
        ['RA Factor', 400],
        ['ANA (IF)', 900],
        ['Anti-CCP', 1400],
        ['Serum Amylase', 500],
        ['Serum Lipase', 700],
        ['CPK-MB', 900],
        ['Troponin I', 1200],
        ['BNP / NT-proBNP', 1800]
    ];
    bloodNames.forEach(([n, p]) => out.push(row(n, CAT.blood[0], CAT.blood[1], CAT.blood[2], p)));

    const urine = [
        ['Urine Routine & Microscopy', 180],
        ['Urine Culture & Sensitivity', 650],
        ['24-hour Urine Protein', 400],
        ['Microalbuminuria', 650],
        ['Stool Routine', 200],
        ['Stool Occult Blood', 350],
        ['Stool Culture', 750]
    ];
    urine.forEach(([n, p]) => out.push(row(n, CAT.urine[0], CAT.urine[1], CAT.urine[2], p)));

    const thy = [
        ['OGTT (Oral GTT)', 750],
        ['Fructosamine', 700],
        ['HbA1c + Average Glucose', 550]
    ];
    thy.forEach(([n, p]) => out.push(row(n, CAT.thyroid[0], CAT.thyroid[1], CAT.thyroid[2], p)));

    const lk = [
        ['Serum Creatinine', 250],
        ['Blood Urea Nitrogen (BUN)', 250],
        ['eGFR', 0],
        ['Urine ACR', 750],
        ['Serum Albumin', 300],
        ['Protein Total', 300]
    ];
    lk.forEach(([n, p]) => {
        if (p === 0) return;
        out.push(row(n, CAT.liver[0], CAT.liver[1], CAT.liver[2], p));
    });

    const inf = [
        ['Dengue NS1 Antigen', 750],
        ['Dengue IgM', 850],
        ['Chikungunya IgM', 1200],
        ['Typhoid (Widal)', 400],
        ['Typhi Dot / Salmonella IgM', 440],
        ['Malaria Parasite (MP)', 200],
        ['Widal Slide Agglutination', 350],
        ['HIV Combo (Ag/Ab)', 900],
        ['HBsAg', 450],
        ['Anti-HCV', 650],
        ['Blood Culture', 1200],
        ['Covid-19 RT-PCR', 800]
    ];
    inf.forEach(([n, p]) => out.push(row(n, CAT.infection[0], CAT.infection[1], CAT.infection[2], p)));

    const hrt = [
        ['CK-MB / CK Total', 700],
        ['LDH', 400],
        ['High-Sensitivity CRP', 900]
    ];
    hrt.forEach(([n, p]) => out.push(row(n, CAT.heart[0], CAT.heart[1], CAT.heart[2], p)));

    const imagingX = [
        ['X-Ray Chest PA View', 400],
        ['X-Ray Chest PA & LAT', 650],
        ['X-Ray PNS (Water View)', 450],
        ['X-Ray KUB', 450],
        ['X-Ray Lumbar Spine AP/LAT', 750],
        ['X-Ray Cervical Spine', 750],
        ['X-Ray Pelvis', 500],
        ['X-Ray Knee (AP/LAT)', 650],
        ['X-Ray Ankle', 500],
        ['X-Ray Hand', 500],
        ['Barium Study (as prescribed)', 2500],
        ['IVP', 3500]
    ];
    imagingX.forEach(([n, p]) => out.push(row(n, CAT.xray[0], CAT.xray[1], CAT.xray[2], p)));

    const usg = [
        ['USG Whole Abdomen', 900],
        ['USG Upper Abdomen', 750],
        ['USG Pelvis / TVS', 850],
        ['USG Obstetric (NT / Anomaly - basic)', 1200],
        ['USG Neck / Thyroid', 800],
        ['USG KUB', 750],
        ['USG Breast', 900],
        ['USG Scrotum', 850],
        ['Follicular Study (single visit)', 500]
    ];
    usg.forEach(([n, p]) => out.push(row(n, CAT.usg[0], CAT.usg[1], CAT.usg[2], p)));

    const mri = [
        ['CT Brain Plain', 3500],
        ['CT Brain Contrast', 5500],
        ['CT Chest / HRCT', 4500],
        ['CT KUB', 4000],
        ['CT PNS', 3500],
        ['CT Spine (1 region)', 4500],
        ['MRI Brain Plain', 6500],
        ['MRI Brain With Contrast', 9500],
        ['MRI Spine (Cervical)', 7500],
        ['MRI Spine (Lumbar)', 7500],
        ['MRI Knee (One side)', 6800],
        ['MRI Shoulder', 6800],
        ['MRCP', 9000],
        ['CECT Abdomen', 7800]
    ];
    mri.forEach(([n, p]) => out.push(row(n, CAT.mri[0], CAT.mri[1], CAT.mri[2], p)));

    const womens = [
        ['Beta HCG (Quantitative)', 600],
        ['PAP Smear', 450],
        ['HPV DNA High Risk', 2800]
    ];
    womens.forEach(([n, p]) => out.push(row(n, CAT.womens[0], CAT.womens[1], CAT.womens[2], p)));

    const mens = [['Semen Analysis', 600]];
    mens.forEach(([n, p]) => out.push(row(n, CAT.mens[0], CAT.mens[1], CAT.mens[2], p)));

    const packages = [
        ['Basic Health Package (CBC, ESR, FBS, Urine R/M)', 1200],
        ['Executive Health Checkup', 4500],
        ['Senior Citizen Panel', 3500],
        ['Fever Panel (CBC, Dengue, Typhoid)', 2200],
        ['Whole Body Checkup (lab + consult)', 8999],
        ['Diabetes Care Pack (FBS, PPBS, HbA1c, Lipid)', 1400]
    ];
    packages.forEach(([n, p]) => out.push(row(n, CAT.preventive[0], CAT.preventive[1], CAT.preventive[2], p)));

    const feverTests = [
        ['Typhoid Profile', 900],
        ['Complete Malarial Antigen', 600]
    ];
    feverTests.forEach(([n, p]) => out.push(row(n, CAT.fever[0], CAT.fever[1], CAT.fever[2], p)));

    const vit = [['Vitamin D + B12', 1800]];
    vit.forEach(([n, p]) => out.push(row(n, CAT.vitd[0], CAT.vitd[1], CAT.vitd[2], p)));

    return out;
}
