import type {
  AppliancePreset,
  CalculatorAppliance,
  CalculatorInputs,
  SizingResult,
} from '#shared/types'

/** Session-storage key used to hand a calculator estimate to the quote wizard. */
export const CALCULATOR_BRIEF_STORAGE_KEY = 'sungrid-calculator-brief-v1'

export const appliancePresets: AppliancePreset[] = [
  { id: 'led-bulb', name: 'LED bulb', watts: 10, defaultHours: 6, wave: 'electronic', icon: 'i-lucide-lightbulb' },
  { id: 'ceiling-fan', name: 'Ceiling fan', watts: 70, defaultHours: 8, wave: 'inductive', icon: 'i-lucide-fan' },
  { id: 'standing-fan', name: 'Standing fan', watts: 60, defaultHours: 8, wave: 'inductive', icon: 'i-lucide-fan' },
  { id: 'led-tv', name: 'LED television', watts: 90, defaultHours: 5, wave: 'electronic', icon: 'i-lucide-tv' },
  { id: 'decoder', name: 'TV decoder', watts: 30, defaultHours: 5, wave: 'electronic', icon: 'i-lucide-monitor-play' },
  { id: 'fridge', name: 'Refrigerator (standard)', watts: 150, defaultHours: 10, wave: 'inductive', icon: 'i-lucide-refrigerator' },
  { id: 'freezer', name: 'Deep freezer', watts: 200, defaultHours: 10, wave: 'inductive', icon: 'i-lucide-refrigerator' },
  { id: 'ac-1hp', name: 'Air conditioner (1 HP)', watts: 850, defaultHours: 6, wave: 'inductive', icon: 'i-lucide-air-vent' },
  { id: 'ac-1-5hp', name: 'Air conditioner (1.5 HP)', watts: 1200, defaultHours: 6, wave: 'inductive', icon: 'i-lucide-air-vent' },
  { id: 'laptop', name: 'Laptop', watts: 65, defaultHours: 6, wave: 'electronic', icon: 'i-lucide-laptop' },
  { id: 'desktop', name: 'Desktop computer + monitor', watts: 200, defaultHours: 6, wave: 'electronic', icon: 'i-lucide-monitor' },
  { id: 'router', name: 'Router / ONT', watts: 15, defaultHours: 24, wave: 'electronic', icon: 'i-lucide-wifi' },
  { id: 'water-pump', name: 'Water pump (0.75 HP)', watts: 560, defaultHours: 1, wave: 'inductive', icon: 'i-lucide-droplets' },
  { id: 'borehole-pump', name: 'Borehole pump (1.5 HP)', watts: 1100, defaultHours: 1, wave: 'inductive', icon: 'i-lucide-waves' },
  { id: 'microwave', name: 'Microwave', watts: 1000, defaultHours: 0.5, wave: 'resistive', icon: 'i-lucide-microwave' },
  { id: 'electric-iron', name: 'Electric iron', watts: 1000, defaultHours: 0.5, wave: 'resistive', icon: 'i-lucide-shirt' },
  { id: 'kettle', name: 'Electric kettle', watts: 1500, defaultHours: 0.3, wave: 'resistive', icon: 'i-lucide-coffee' },
  { id: 'blender', name: 'Blender', watts: 400, defaultHours: 0.3, wave: 'inductive', icon: 'i-lucide-blend' },
  { id: 'security-lights', name: 'Security lights (4 × 20 W)', watts: 80, defaultHours: 12, wave: 'electronic', icon: 'i-lucide-flashlight' },
  { id: 'pos-terminal', name: 'POS / card terminal', watts: 30, defaultHours: 10, wave: 'electronic', icon: 'i-lucide-credit-card' },
  { id: 'clinic-fridge', name: 'Vaccine fridge', watts: 120, defaultHours: 24, wave: 'inductive', icon: 'i-lucide-thermometer' },
  { id: 'cctv', name: 'CCTV system (8 cameras)', watts: 80, defaultHours: 24, wave: 'electronic', icon: 'i-lucide-cctv' },
]

export const defaultCalculatorAppliances: CalculatorAppliance[] = [
  {
    id: 'app-1',
    presetId: 'led-bulb',
    name: 'LED bulbs',
    watts: 10,
    quantity: 8,
    hours: 6,
    essential: true,
    wave: 'electronic',
  },
  {
    id: 'app-2',
    presetId: 'fridge',
    name: 'Refrigerator',
    watts: 150,
    quantity: 1,
    hours: 10,
    essential: true,
    wave: 'inductive',
  },
  {
    id: 'app-3',
    presetId: 'ceiling-fan',
    name: 'Ceiling fans',
    watts: 70,
    quantity: 2,
    hours: 8,
    essential: true,
    wave: 'inductive',
  },
  {
    id: 'app-4',
    presetId: 'led-tv',
    name: 'Television',
    watts: 90,
    quantity: 1,
    hours: 5,
    essential: false,
    wave: 'electronic',
  },
  {
    id: 'app-5',
    presetId: 'router',
    name: 'Router / ONT',
    watts: 15,
    quantity: 1,
    hours: 24,
    essential: true,
    wave: 'electronic',
  },
]

export const defaultCalculatorInputs: CalculatorInputs = {
  appliances: defaultCalculatorAppliances,
  backupHours: 10,
  budget: '3m-6m',
  systemPreference: 'hybrid',
  state: 'Lagos',
  gridAvailability: 'unreliable',
  sunHours: 4.5,
  depthOfDischarge: 0.9,
  systemEfficiency: 0.75,
  surgeAllowance: 1.25,
}

const standardInverterSizes = [1, 1.5, 2, 2.5, 3, 3.6, 4, 5, 6, 8, 10, 12, 15, 20, 30]
const standardBatterySizes = [2.56, 5.12, 7.68, 10.24, 15.36, 20.48, 25.6, 30.72]

export function surgeFactorFor(wave: string): number {
  if (wave === 'inductive') return 3
  if (wave === 'resistive') return 1.2
  return 1.5
}

export function calculateSizing(inputs: CalculatorInputs): SizingResult {
  const appliances = inputs.appliances

  const dailyWh = appliances.reduce(
    (total, appliance) => total + appliance.watts * appliance.quantity * appliance.hours,
    0,
  )
  const essentialWh = appliances
    .filter((appliance) => appliance.essential)
    .reduce((total, appliance) => total + appliance.watts * appliance.quantity * appliance.hours, 0)
  const optionalWh = dailyWh - essentialWh

  const peakWatts = appliances.reduce(
    (total, appliance) => total + appliance.watts * appliance.quantity,
    0,
  )

  let largestSurgeWatts = 0
  for (const appliance of appliances) {
    const running = appliance.watts * appliance.quantity
    const surge = running * surgeFactorFor(appliance.wave)
    largestSurgeWatts = Math.max(largestSurgeWatts, surge)
  }

  const continuousRequirement = peakWatts * inputs.surgeAllowance
  const surgeRequirement = peakWatts + Math.max(0, largestSurgeWatts - peakWatts) * 1.1
  const rawInverterKw = Math.max(continuousRequirement, surgeRequirement) / 1000
  const inverterKw =
    standardInverterSizes.find((size) => size >= rawInverterKw) ??
    Math.ceil(rawInverterKw / 5) * 5

  const backupWindowRatio = Math.min(1, inputs.backupHours / 24)
  const acBackupWh = essentialWh * backupWindowRatio
  const batteryNominalWh = acBackupWh / Math.max(0.5, inputs.depthOfDischarge) / 0.94
  const batteryNominalKwh = batteryNominalWh / 1000
  const batteryModule = standardBatterySizes.find((size) => size >= batteryNominalKwh) ?? batteryNominalKwh
  const usableBatteryKwh = batteryNominalKwh * inputs.depthOfDischarge * 0.94

  const solarKwp = dailyWh / (Math.max(2.5, inputs.sunHours) * Math.max(0.5, inputs.systemEfficiency)) / 1000
  const panelCount = Math.ceil((solarKwp * 1000) / 580)

  const recommendations: string[] = []
  const warnings: string[] = []

  if (inputs.systemPreference === 'grid-tied' && inputs.gridAvailability !== 'reliable') {
    warnings.push(
      'A grid-tied system provides no backup during an outage. Because your grid supply is unreliable, consider a hybrid or off-grid design if backup matters.',
    )
  }
  if (inputs.systemPreference === 'off-grid' && inputs.gridAvailability === 'reliable') {
    recommendations.push(
      'A hybrid system may be more cost-effective than off-grid if your grid supply is dependable and you only need selected backup circuits.',
    )
  }
  if (inputs.gridAvailability === 'none') {
    recommendations.push(
      'With no grid supply, the battery and array must cover the full daily load and cloudy periods. Generator backup may be worth planning for critical sites.',
    )
  }
  if (inputs.backupHours > 18) {
    recommendations.push(
      'Long backup windows require substantial storage. Reducing non-essential loads during extended outages can shrink the battery you need.',
    )
  }
  if (largestSurgeWatts > 3000) {
    warnings.push(
      'One of your appliances has a high start-up surge. Confirm its locked-rotor current with the installer, or use a soft starter where supported.',
    )
  }
  if (inputs.systemPreference === 'hybrid') {
    recommendations.push(
      'A hybrid inverter with a dedicated essential-load board lets you back up selected circuits without sizing for the whole building.',
    )
  }
  if (batteryNominalKwh > 20) {
    recommendations.push(
      'Storage is the largest part of this preliminary design. Consider a phased battery purchase if your budget is below the indicative range.',
    )
  }
  if (inputs.budget === 'under-1m' && (batteryNominalKwh > 2 || inverterKw > 2)) {
    warnings.push(
      'The estimated configuration is likely to exceed the selected budget once installation and protection are included. Consider a smaller essential-load package.',
    )
  }
  if (inputs.budget === '1m-3m' && (batteryNominalKwh > 5 || solarKwp > 4)) {
    warnings.push(
      'The selected budget may not cover this configuration with installation, mounting and protection. Treat the result as a starting point for discussion.',
    )
  }
  if (dailyWh === 0) {
    warnings.push('Add at least one appliance to calculate a preliminary configuration.')
  }

  if (!warnings.length) {
    warnings.push(
      'Preliminary only: running watts and start-up surges must be verified, and cable/protection sizing requires a site assessment.',
    )
  }

  const systemLabels: Record<string, string> = {
    hybrid: 'Hybrid solar system (grid + battery + solar)',
    'off-grid': 'Off-grid solar system (battery + solar)',
    'grid-tied': 'Grid-tied solar system (no battery backup)',
    'not-sure': 'System type to be confirmed after assessment',
  }

  return {
    dailyWh: Math.round(dailyWh),
    essentialWh: Math.round(essentialWh),
    optionalWh: Math.round(optionalWh),
    peakWatts: Math.round(peakWatts),
    largestSurgeWatts: Math.round(largestSurgeWatts),
    inverterKw,
    recommendedInverterLabel: `${inverterKw} kW ${systemLabels[inputs.systemPreference] ?? ''}`.trim(),
    batteryUsableKwh: Math.round(usableBatteryKwh * 10) / 10,
    batteryNominalKwh: Math.round(batteryModule * 10) / 10,
    solarKwp: Math.round(solarKwp * 100) / 100,
    panelCount,
    recommendations,
    warnings,
  }
}

export function calculatorSummary(inputs: CalculatorInputs, result: SizingResult): string {
  const essentialList = inputs.appliances
    .filter((appliance) => appliance.essential)
    .map((appliance) => `${appliance.quantity} × ${appliance.name} (${appliance.watts} W, ${appliance.hours} h)`)
  const optionalList = inputs.appliances
    .filter((appliance) => !appliance.essential)
    .map((appliance) => `${appliance.quantity} × ${appliance.name} (${appliance.watts} W, ${appliance.hours} h)`)

  return [
    `Preliminary solar sizing — ${new Date().toLocaleDateString('en-NG')}`,
    `Location: ${inputs.state} · Grid: ${inputs.gridAvailability}`,
    `Daily energy: ${(result.dailyWh / 1000).toFixed(2)} kWh (${(result.essentialWh / 1000).toFixed(2)} kWh essential)`,
    `Backup window: ${inputs.backupHours} hours`,
    `Indicative inverter: ${result.inverterKw} kW`,
    `Indicative storage: ${result.batteryNominalKwh} kWh nominal (~${result.batteryUsableKwh} kWh usable)`,
    `Indicative array: ${result.solarKwp} kWp (~${result.panelCount} × 580 Wp panels)`,
    '',
    `Essential loads: ${essentialList.join('; ') || 'None specified'}`,
    `Optional loads: ${optionalList.join('; ') || 'None specified'}`,
    '',
    'This is a preliminary estimate, not an engineering design or a quotation.',
  ].join('\n')
}
