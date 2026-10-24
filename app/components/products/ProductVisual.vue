<script setup lang="ts">
import type { CategorySlug } from '#shared/types'

const props = withDefaults(
  defineProps<{
    category: CategorySlug
    name?: string
    size?: 'card' | 'detail' | 'mini'
    class?: string
  }>(),
  { size: 'card' },
)

const backgrounds: Record<string, string> = {
  'solar-panels': 'bg-[#e8efe7]',
  'hybrid-inverters': 'bg-[#edf1ec]',
  'off-grid-inverters': 'bg-[#edf1ec]',
  'grid-tied-inverters': 'bg-[#edf1ec]',
  'lithium-batteries': 'bg-[#eef2ea]',
  'lead-acid-batteries': 'bg-[#f1efe7]',
  'charge-controllers': 'bg-[#edf1ec]',
  mounting: 'bg-[#f0eee6]',
  'cables-protection': 'bg-[#f0eee6]',
  'solar-kits': 'bg-[#f4f0e4]',
  accessories: 'bg-[#f1efe7]',
}

const isPanel = computed(() => props.category === 'solar-panels')
const isBattery = computed(() => ['lithium-batteries', 'lead-acid-batteries'].includes(props.category))
const isInverter = computed(() => props.category.includes('inverters'))
const isKit = computed(() => props.category === 'solar-kits')
const isController = computed(() => props.category === 'charge-controllers')
const isMounting = computed(() => props.category === 'mounting')
const isCable = computed(() => props.category === 'cables-protection')
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="[backgrounds[category] ?? 'bg-[#eef1e9]', size === 'detail' ? 'aspect-[4/3]' : size === 'mini' ? 'aspect-square' : 'aspect-[4/3]', $props.class]"
  >
    <div class="absolute inset-0 opacity-[0.55] grid-lines-dark" aria-hidden="true" />
    <div class="absolute left-4 top-4 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-forest-800/55">
      <span class="size-1 rounded-full bg-solar-500" />
      Illustrative visual
    </div>

    <svg
      v-if="isPanel"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      :aria-label="`Illustration of solar panel${name ? ` — ${name}` : ''}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="322" cy="82" r="28" fill="#fbc51f" opacity="0.92" />
      <g stroke="#f0ac08" stroke-width="1.5" stroke-linecap="round" opacity="0.65">
        <path d="M322 44v9M322 111v9M284 82h9M351 82h9M295 55l6 6M343 103l6 6M349 55l-6 6M301 103l-6 6" />
      </g>
      <ellipse cx="205" cy="259" rx="138" ry="15" fill="#0d3b2c" opacity="0.09" />
      <g transform="translate(62 88) rotate(-3 130 80)">
        <rect x="-6" y="-6" width="282" height="166" rx="5" fill="#0d3b2c" />
        <rect x="0" y="0" width="270" height="154" rx="2" fill="#184936" />
        <g stroke="#dcefe3" stroke-opacity="0.33" stroke-width="1">
          <path d="M45 0v154M90 0v154M135 0v154M180 0v154M225 0v154" />
          <path d="M0 38.5h270M0 77h270M0 115.5h270" />
        </g>
        <rect x="45" y="38.5" width="45" height="38.5" fill="#fbc51f" opacity="0.22" />
        <rect x="180" y="77" width="45" height="38.5" fill="#fbc51f" opacity="0.12" />
        <path d="M0 0h270" stroke="#fbc51f" stroke-width="2" opacity="0.6" />
      </g>
    </svg>

    <svg
      v-else-if="isBattery"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a solar battery module"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse cx="205" cy="262" rx="102" ry="12" fill="#0d3b2c" opacity="0.1" />
      <g transform="translate(138 54)">
        <rect x="0" y="0" width="132" height="192" rx="16" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.16" />
        <rect x="12" y="12" width="108" height="62" rx="8" fill="#0d3b2c" />
        <text x="24" y="40" fill="#fbc51f" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="700">5.12</text>
        <text x="24" y="58" fill="#dcefe3" font-family="Inter, sans-serif" font-size="9" letter-spacing="1.4">kWh · 51.2V</text>
        <g transform="translate(18 88)">
          <rect width="96" height="8" rx="4" fill="#0d3b2c" opacity="0.08" />
          <rect width="70" height="8" rx="4" fill="#338d64" />
        </g>
        <g fill="#338d64">
          <circle cx="24" cy="116" r="4" />
          <circle cx="40" cy="116" r="4" opacity="0.4" />
          <circle cx="56" cy="116" r="4" opacity="0.4" />
        </g>
        <g stroke="#0d3b2c" stroke-opacity="0.12" stroke-width="1">
          <path d="M18 140h96M18 150h96M18 160h96" />
        </g>
        <rect x="40" y="172" width="52" height="6" rx="3" fill="#0d3b2c" opacity="0.14" />
      </g>
      <g transform="translate(268 175)" fill="#0d3b2c" opacity="0.5">
        <circle cx="0" cy="0" r="4" />
        <circle cx="14" cy="0" r="4" opacity="0.65" />
        <circle cx="28" cy="0" r="4" opacity="0.35" />
      </g>
    </svg>

    <svg
      v-else-if="isInverter"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a solar inverter"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse cx="200" cy="267" rx="96" ry="11" fill="#0d3b2c" opacity="0.1" />
      <g transform="translate(128 46)">
        <rect x="0" y="0" width="148" height="204" rx="14" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.18" />
        <rect x="12" y="12" width="124" height="66" rx="7" fill="#0d3b2c" />
        <text x="24" y="39" fill="#fbc51f" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="700">5.0</text>
        <text x="64" y="39" fill="#dcefe3" font-family="Inter, sans-serif" font-size="10">kW</text>
        <text x="24" y="58" fill="#dcefe3" font-family="Inter, sans-serif" font-size="8" letter-spacing="1.2">HYBRID INVERTER</text>
        <circle cx="118" cy="47" r="5" fill="#338d64" />
        <g transform="translate(16 92)">
          <circle cx="10" cy="10" r="10" fill="#fbc51f" opacity="0.85" />
          <path d="M11 4 6 11h5l-1 6 5-8H10l1-5Z" fill="#0d3b2c" />
          <rect x="28" y="5" width="72" height="3" rx="1.5" fill="#0d3b2c" opacity="0.15" />
          <rect x="28" y="13" width="46" height="3" rx="1.5" fill="#0d3b2c" opacity="0.1" />
        </g>
        <g transform="translate(16 132)" stroke="#0d3b2c" stroke-opacity="0.12">
          <path d="M0 0h116M0 9h116M0 18h116M0 27h116M0 36h116M0 45h116" />
        </g>
        <circle cx="42" cy="186" r="6" fill="#0d3b2c" opacity="0.2" />
        <circle cx="74" cy="186" r="6" fill="#0d3b2c" opacity="0.12" />
        <circle cx="106" cy="186" r="6" fill="#0d3b2c" opacity="0.12" />
      </g>
    </svg>

    <svg
      v-else-if="isKit"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a complete solar kit"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="316" cy="72" r="26" fill="#fbc51f" opacity="0.9" />
      <ellipse cx="200" cy="263" rx="132" ry="12" fill="#0d3b2c" opacity="0.08" />
      <g transform="translate(62 82) rotate(-5 35 55)">
        <rect x="0" y="0" width="152" height="106" rx="4" fill="#184936" stroke="#0d3b2c" />
        <g stroke="#dcefe3" stroke-opacity="0.3">
          <path d="M30 0v106M61 0v106M91 0v106M122 0v106M0 35h152M0 70h152" />
        </g>
        <rect x="30" y="35" width="31" height="35" fill="#fbc51f" opacity="0.2" />
        <path d="M0 0h152" stroke="#fbc51f" stroke-width="2" opacity="0.55" />
      </g>
      <g transform="translate(228 114)">
        <rect width="62" height="104" rx="8" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.16" />
        <rect x="8" y="8" width="46" height="30" rx="4" fill="#0d3b2c" />
        <text x="13" y="27" fill="#fbc51f" font-size="9" font-family="Inter, sans-serif" font-weight="700">5.0 kW</text>
        <g stroke="#0d3b2c" stroke-opacity="0.14">
          <path d="M8 50h46M8 57h46M8 64h46M8 71h46" />
        </g>
        <circle cx="20" cy="88" r="4" fill="#338d64" />
      </g>
      <g transform="translate(300 154)">
        <rect width="44" height="66" rx="7" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.16" />
        <rect x="7" y="8" width="30" height="24" rx="3" fill="#0d3b2c" />
        <rect x="7" y="40" width="30" height="4" rx="2" fill="#338d64" />
        <rect x="7" y="49" width="20" height="4" rx="2" fill="#0d3b2c" opacity="0.14" />
      </g>
    </svg>

    <svg
      v-else-if="isController"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a solar charge controller"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse cx="200" cy="248" rx="94" ry="11" fill="#0d3b2c" opacity="0.1" />
      <g transform="translate(128 86)">
        <rect width="144" height="118" rx="11" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.17" />
        <rect x="12" y="12" width="120" height="44" rx="5" fill="#0d3b2c" />
        <text x="23" y="33" fill="#fbc51f" font-family="Inter, sans-serif" font-size="10" font-weight="700">MPPT 150/70</text>
        <path d="M22 43h62" stroke="#dcefe3" stroke-opacity="0.35" stroke-width="2" />
        <g transform="translate(16 70)" stroke="#0d3b2c" stroke-opacity="0.12">
          <path d="M0 0h112M0 9h112M0 18h112M0 27h112" />
        </g>
        <circle cx="40" cy="104" r="5" fill="#338d64" />
        <circle cx="62" cy="104" r="5" fill="#0d3b2c" opacity="0.18" />
      </g>
    </svg>

    <svg
      v-else-if="isMounting"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of solar mounting rails"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(52 110) rotate(-6 150 60)">
        <rect x="0" y="0" width="292" height="10" rx="3" fill="#0d3b2c" opacity="0.8" />
        <rect x="0" y="88" width="292" height="10" rx="3" fill="#0d3b2c" opacity="0.55" />
        <g fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.35">
          <rect x="24" y="10" width="10" height="78" rx="2" />
          <rect x="96" y="10" width="10" height="78" rx="2" />
          <rect x="168" y="10" width="10" height="78" rx="2" />
          <rect x="240" y="10" width="10" height="78" rx="2" />
        </g>
        <g fill="#fbc51f">
          <rect x="18" y="-4" width="22" height="8" rx="2" />
          <rect x="90" y="-4" width="22" height="8" rx="2" />
          <rect x="162" y="-4" width="22" height="8" rx="2" />
          <rect x="234" y="-4" width="22" height="8" rx="2" />
        </g>
        <g stroke="#0d3b2c" stroke-opacity="0.22" stroke-width="2">
          <path d="M60 49h32M132 49h32M204 49h32" />
        </g>
      </g>
      <circle cx="322" cy="84" r="18" fill="none" stroke="#0d3b2c" stroke-opacity="0.15" stroke-width="2" />
    </svg>

    <svg
      v-else-if="isCable"
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of solar DC cable and protection equipment"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(100 78)">
        <circle cx="100" cy="76" r="66" fill="none" stroke="#0d3b2c" stroke-opacity="0.6" stroke-width="14" />
        <circle cx="100" cy="76" r="48" fill="none" stroke="#faf7f0" stroke-opacity="0.75" stroke-width="9" />
        <circle cx="100" cy="76" r="30" fill="none" stroke="#0d3b2c" stroke-opacity="0.4" stroke-width="12" />
        <path d="M154 126c22 24 34 44 50 66" stroke="#0d3b2c" stroke-opacity="0.65" stroke-width="10" stroke-linecap="round" />
        <rect x="196" y="178" width="24" height="34" rx="4" fill="#fbc51f" />
        <rect x="202" y="170" width="12" height="12" rx="2" fill="#0d3b2c" opacity="0.6" />
      </g>
      <g transform="translate(272 88)" fill="none" stroke="#0d3b2c" stroke-opacity="0.28" stroke-width="2">
        <rect width="54" height="70" rx="6" />
        <path d="M14 14h26M14 26h26M14 38h26M14 50h16" />
      </g>
    </svg>

    <svg
      v-else
      viewBox="0 0 400 300"
      class="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a solar accessory"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse cx="200" cy="258" rx="76" ry="10" fill="#0d3b2c" opacity="0.08" />
      <g transform="translate(154 72)">
        <rect width="92" height="142" rx="14" fill="#faf7f0" stroke="#0d3b2c" stroke-opacity="0.18" />
        <rect x="14" y="16" width="64" height="42" rx="5" fill="#0d3b2c" />
        <text x="22" y="34" fill="#fbc51f" font-family="Inter, sans-serif" font-size="8" font-weight="700">MONITOR</text>
        <path d="M24 44h44" stroke="#dcefe3" stroke-opacity="0.35" stroke-width="2" />
        <g stroke="#0d3b2c" stroke-opacity="0.13">
          <path d="M14 76h64M14 84h64M14 92h64" />
        </g>
        <circle cx="46" cy="116" r="8" fill="#fbc51f" />
      </g>
    </svg>

    <div class="absolute bottom-3 right-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-forest-900/35">
      Not a product photo
    </div>
  </div>
</template>
