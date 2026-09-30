# AquaLens: Satellite AI River Sentinel & One Health Early-Warning Platform

> **IEEE OneAquaHealth Global Hackathon 2026**  
> **Track:** Track 2 — Data-to-Insight *(with cross-cutting Track 6: Resilience Informatics & Track 7: Digital Health Standards)*  
> **Theme:** *"Healthy Waters · Healthy Ecosystems · Healthy Communities"*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Standards: HL7 FHIR R4](https://img.shields.io/badge/Standards-HL7%20FHIR%20R4-emerald.svg)](https://hl7.org/fhir/)
[![Earth Observation: Copernicus Sentinel-2](https://img.shields.io/badge/Copernicus-Sentinel--2%20MSI-cyan.svg)](https://dataspace.copernicus.eu/)
[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015%20App%20Router-white.svg)](https://nextjs.org/)
[![Developer Handbook: Complete](https://img.shields.io/badge/Developer%20Handbook-Complete-FFE500.svg)](HACKATHON_DEVELOPER_HANDBOOK.md)

> 📘 **Looking for the complete developer and judge guide?** See the [Master Hackathon & Developer Handbook (HACKATHON_DEVELOPER_HANDBOOK.md)](HACKATHON_DEVELOPER_HANDBOOK.md) for full rubric breakdowns, mathematical formulas, API endpoints, setup instructions, and AI prompt handoffs.

---

## 1. Executive Summary

Ground-based river monitoring leaves over 99% of urban stream networks unmonitored. When illegal industrial effluent dumps or toxic cyanobacterial blooms occur, environmental data sits trapped in localized spreadsheets while downstream communities swim, kayak, and draw drinking water completely unaware.

**AquaLens** is an autonomous, space-to-clinic freshwater surveillance platform. Operating on open **European Space Agency (ESA) Copernicus Sentinel-2** satellite data, AquaLens continuously scans urban watersheds from orbit using optical multispectral imaging (Chlorophyll-a, Turbidity, and NDWI water indices).

When a contamination plume or algal bloom is detected, AquaLens:
1. **Pinpoints the Anomaly from Orbit:** Identifies pollutant concentration, affected surface area, and coordinates.
2. **Models Downstream Hydrological Transport:** Simulates contaminant propagation velocity toward downstream drinking water intakes, public beaches, and recreation parks with arrival ETAs.
3. **Bridges Space to Clinical EHRs (HL7 FHIR R4):** Automatically translates environmental telemetry into standardized **HL7 FHIR R4** clinical bundles (`Observation`, `RiskAssessment`) with LOINC and ICD-10 codes, notifying municipal health authorities hours before hospital outbreaks occur.

---

## 2. Key Capabilities & Features

### 🛰️ Orbital Reconnaissance Deck
- High-resolution satellite imagery powered by **ESRI World Imagery** and **OpenStreetMap**.
- Pre-configured navigation to the 5 official **OneAquaHealth European pilot river basins**:
  - **Toulouse, France:** Canal du Midi & River Touch *(Microcystis cyanobacterial bloom)*
  - **Coimbra, Portugal:** Mondego River Catchment *(Agricultural phosphate & enteric silt)*
  - **Ghent, Belgium:** Leie & Scheldt Urban Canals *(Chemical turbidity & surfactants)*
  - **Benevento, Italy:** Calore & Sabato River Basins *(Flash flood sediment & organic runoff)*
  - **Maribor, Slovenia:** Drava River Urban Corridors *(Thermal effluent & recreation hazard)*
- Interactive click-to-pinpoint coordinate inspector and GPS location locator.

### 🔬 Multispectral Optical Analyzer
Real-time band synthesis across Sentinel-2 Multispectral Instrument (MSI) wavelengths:
- **True Color (RGB):** Bands 4 (Red), 3 (Green), 2 (Blue) natural surface reflectance.
- **NDWI Water Index:** `(B3_Green - B8_NIR) / (B3_Green + B8_NIR)` for water boundary and flood pooling.
- **NDCI / Chlorophyll-a:** `(B5_RedEdge - B4_Red) / (B5_RedEdge + B4_Red)` isolating toxic photosynthetic cyanobacteria.
- **Turbidity (SPM):** Suspended particulate matter and industrial sediment cloudiness.
- **Thermal Anomaly:** Industrial coolant discharge and warm water incubation tracking.

### ⏳ Satellite Time Machine Slider
- Interactive split-screen visual slider comparing baseline historical passes against current incident passes.
- Instant percentage delta calculations for Chlorophyll-a spikes, turbidity increases, and plume spread.

### 🏥 Space-to-Clinic One Health Simulator
- Hydrological vector tracking calculating river travel velocity and time-to-impact (ETA).
- Translates environmental hazards directly into clinical disease advisories:
  - **ICD-10 T65.8:** Toxic effect of algae & cyanobacterial dermatotoxin poisoning.
  - **ICD-10 A08.4:** Acute waterborne infectious gastroenteritis.
  - **ICD-10 J45.9:** Asthma exacerbation from aerosolized microcystins.
  - **ICD-10 A27.0:** Urban rodent-burrow floodwater Leptospirosis.
- One-click transmission of precautionary advisories to municipal clinics and park authorities.

### 📄 Standards & Regulatory Compliance
- **HL7 FHIR R4 Inspector:** Formatted JSON viewer with copy and download capabilities for medical informatics systems.
  - **LOINC 79177-2:** Microcystin [Mass/volume] in Water
  - **LOINC 48421-2:** Turbidity of Water
  - **LOINC 82810-3:** Surface Water Temperature
- **EU Regulatory Enforcement Dossier:** Automated, printable violation report referencing the **EU Water Framework Directive (2000/60/EC)** and **Bathing Water Directive (2006/7/EC)**.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COPERNICUS SENTINEL-2                           │
│                 (ESA Multispectral Instrument - MSI)                   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ 13 Spectral Bands (10m Resolution)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     AQUALENS MULTISPECTRAL ENGINE                      │
│   • NDWI Water Delineation       • NDCI Chlorophyll-a / Cyanobacteria  │
│   • Red-Band Turbidity (SPM)     • Surface Thermal Radiometry          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
┌──────────────────────────────┐                   ┌──────────────────────────────┐
│  ONE HEALTH RESILIENCE HUD   │                   │    STANDARDS & ENFORCEMENT   │
│  • Contaminant Trajectory    │                   │  • HL7 FHIR R4 Bundles       │
│  • Downstream Arrival ETAs   │                   │  • LOINC & ICD-10 Medical    │
│  • Public Health Alerts      │                   │  • EU Directive 2000/60/EC   │
└──────────────────────────────┘                   └──────────────────────────────┘
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24 LTS)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aqualens-sentinel.git

# Enter project directory
cd aqualens-sentinel

# Install dependencies
npm install

# Start local mission control server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the mission deck.

---

## 5. API Endpoints

- `GET /api/satellite?basinId=toulouse-canal`: Returns real-time satellite telemetry, coordinates, and spectral calculations.
- `GET /api/fhir?basinId=toulouse-canal`: Generates a standards-compliant HL7 FHIR R4 Bundle (`application/fhir+json`).

---

## 6. Hackathon Judging Alignment

| Evaluation Criterion (Weight) | AquaLens Implementation |
| :--- | :--- |
| **Impact & Mission Alignment (30%)** | Fully embodies the One Health paradigm by bridging European Space Agency earth observation directly to downstream community disease prevention and clinical triage. |
| **Innovation & Creativity (20%)** | Autonomous space-based monitoring replacing slow manual field sampling. Features multispectral optical band analysis, an interactive satellite time machine, and hydrological travel velocity modeling. |
| **Technical Implementation (20%)** | Built with Next.js 15, TypeScript, Leaflet ESRI GIS mapping, Recharts telemetry, and real HL7 FHIR R4 serialization using LOINC and ICD-10 medical standards. |
| **Usability & UX (15%)** | High-performance aerospace HUD interface with dark glassmorphism, 1-click pilot basin presets, interactive drag comparison slider, and responsive layout. |
| **Feasibility & Scalability (15%)** | 100% legal, open-source, and free satellite imagery (EU Copernicus + NASA GIBS + ESRI). Zero API paywalls; infinitely scalable to any freshwater basin worldwide. |

---

## 7. License

Distributed under the **MIT License**. See `LICENSE` for details.
