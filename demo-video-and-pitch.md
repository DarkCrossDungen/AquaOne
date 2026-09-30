# AquaLens: 3–5 Minute Hackathon Demo Video Script & Devpost Pitch

> **Target Hackathon:** OneAquaHealth IEEE Global Hackathon 2026  
> **Target Track:** Track 2 — Data-to-Insight (Cross-Cutting with Track 7: FHIR Interoperability & Track 6: Resilience Informatics)

---

## 1. 3–5 Minute Demo Video Script (Beat-by-Beat)

### ⏱️ 0:00 – 0:45: The Problem & The One Health Hook
* **Visual:** Speaker on camera or title slide with dramatic satellite river footage / contaminated water photos.
* **Script:**
  > *"Every year, thousands of kilometers of urban freshwater streams suffer from toxic cyanobacterial blooms and illegal industrial dumping. But ground testing only covers less than 1% of river networks.
  > 
  > More critically, environmental monitoring is completely disconnected from public health. When a toxic algae bloom erupts, doctors and emergency rooms don't find out until sick children and poisoned pets start filling hospital clinics days later.
  > 
  > To solve this, we built **AquaLens**: an autonomous space-to-clinic freshwater surveillance platform that monitors rivers from orbit using European Space Agency Copernicus satellites and immediately alerts hospitals using international medical standards."*

---

### ⏱️ 0:45 – 1:45: Live Demo — Orbital Reconnaissance & Multispectral AI
* **Visual:** Screen recording of AquaLens dashboard. Zooming into the satellite map and switching pilot basins.
* **Script:**
  > *"Here is the AquaLens Mission Control Deck. We are pulling open, high-resolution satellite imagery directly from ESA Copernicus Sentinel-2. 
  > 
  > Let's look at one of the official OneAquaHealth pilot locations: the **Canal du Midi and Touch River in Toulouse, France**. 
  > 
  > Right here, AquaLens has flagged an anomalous plume in red with 96% AI confidence. But satellites don't just see in regular color. With our **Multispectral Optical Analyzer**, we can switch between spectral wavelengths:
  > - **NDWI** isolates the river boundary.
  > - **NDCI (Chlorophyll-a)** reveals this massive spike of photosynthetic cyanobacteria at 78.4 µg/L.
  > - And **Turbidity** highlights suspended industrial sediment.
  > 
  > The system immediately calculates our Water Quality Index: a critical 28 out of 100, violating the EU Water Framework Directive."*

---

### ⏱️ 1:45 – 2:30: The Satellite Time Machine
* **Visual:** Dragging the interactive slider across the river back and forth.
* **Script:**
  > *"To verify if this is an acute spill or normal seasonal variation, we built the **Satellite Time Machine**.
  > 
  > By dragging this slider, we compare the historical baseline from May 2024 against our current incident pass. You can see the pristine clear water on the left instantly contrasted against the toxic green algal explosion on the right—a 620% spike in Chlorophyll-a across 4.8 hectares of waterway."*

---

### ⏱️ 2:30 – 3:30: Space-to-Clinic One Health Modeling & HL7 FHIR Bridge
* **Visual:** Clicking through the Downstream POIs, triggering the alert, and opening the FHIR modal.
* **Script:**
  > *"Now comes our core innovation: **The One Health Bridge**.
  > 
  > AquaLens models the river's flow velocity at 1.6 km/h and tracks the plume moving downstream:
  > - In **1.5 hours**, it will reach the **Prairie des Filtres kayak park**, exposing swimmers to toxic microcystins.
  > - In **3.6 hours**, it will reach the **Toulouse municipal drinking water intake**.
  > 
  > With one tap, we can transmit an automated health alert to city clinics.
  > 
  > Even better: for health systems, AquaLens has a built-in **HL7 FHIR R4 Interoperability Engine**. With one click, judges can inspect the standardized JSON bundle. We map the satellite observations directly to global **LOINC codes** (79177-2 for microcystins, 48421-2 for turbidity) and clinical **ICD-10 codes** (T65.8 for algae poisoning and A08.4 for gastroenteritis). Hospitals can ingest this directly into their electronic health records to prepare emergency triage."*

---

### ⏱️ 3:30 – 4:00: Summary, Scalability & Call to Action
* **Visual:** Opening the EU Regulatory Dossier modal, then concluding on the live dashboard.
* **Script:**
  > *"Finally, for environmental enforcement, AquaLens generates an official **EU Regulatory Dossier** ready to send to regulatory agencies under Directive 2000/60/EC.
  > 
  > Best of all, AquaLens uses 100% legal, open-access satellite data from Copernicus and NASA. It requires zero expensive hardware on the ground and can be deployed to any freshwater river on Earth tomorrow.
  > 
  > By connecting satellites in space to doctors in clinics, AquaLens protects our waters, our ecosystems, and our communities. Thank you!"*

---

## 2. Devpost Submission Text (Ready to Copy-Paste)

### Project Title
**AquaLens — Satellite AI River Sentinel & One Health Early-Warning Platform**

### Tagline
Autonomous space-to-clinic freshwater surveillance powered by Copernicus Sentinel-2 satellite imagery, AI plume anomaly detection, and HL7 FHIR clinical interoperability.

### Track Selection
**Primary Track:** Track 2: Data-to-Insight  
**Cross-Cutting Tracks:** Track 7: Digital Health Standards, Track 6: Resilience Informatics

### Inspiration
Ground-based river monitoring leaves over 99% of urban stream networks unmonitored. When illegal industrial effluent dumps or toxic cyanobacterial blooms occur, environmental data sits trapped in localized spreadsheets while downstream communities swim, kayak, and draw drinking water completely unaware. We wanted to build a bridge from earth observation in space directly to clinical health prevention in communities.

### What it does
AquaLens is an autonomous, space-to-clinic freshwater surveillance platform:
1. **Orbital Surveillance:** Analyzes open Copernicus Sentinel-2 satellite data across 13 spectral bands.
2. **Multispectral Anomaly Detection:** Computes NDWI (water boundaries), NDCI (Chlorophyll-a / cyanobacteria), and Red-band turbidity (SPM) at 10m spatial resolution.
3. **Satellite Time Machine:** Features an interactive split-screen slider comparing historical baselines against recent incident passes to prove acute degradation.
4. **Hydrological Transport Modeling:** Calculates plume velocity and forecasts arrival ETAs for downstream drinking water intakes, public beaches, and recreation parks.
5. **HL7 FHIR R4 Standards:** Serializes satellite optical telemetry into clinical FHIR resources (`Observation`, `RiskAssessment`) using LOINC and ICD-10 codes for electronic health records.
6. **Regulatory Enforcement:** Generates 1-click printable investigation dossiers compliant with the EU Water Framework Directive (2000/60/EC).

### How we built it
- **Frontend & App Framework:** Next.js 15 App Router, React 19, TypeScript
- **Styling & UI:** Tailwind CSS with dark aerospace mission control glassmorphism
- **Mapping & GIS:** Leaflet & ESRI World Imagery high-resolution satellite tiles
- **Data Standards:** HL7 FHIR R4, LOINC, ICD-10, EU Water Framework Directive
- **Data Sources:** ESA Copernicus Sentinel-2 MSI open data, NASA GIBS, OneAquaHealth European pilot study basins (Toulouse, Coimbra, Ghent, Benevento, Maribor)

### Challenges we ran into
Handling large multispectral satellite data client-side without bogging down the browser. We solved this by developing responsive optical index algorithms and vectorizing the downstream contaminant trajectories for instantaneous rendering.

### Accomplishments that we're proud of
- Delivering a functioning, interactive satellite GIS experience with zero API billing friction.
- Becoming one of the only teams to connect environmental earth observation directly to international hospital standards (HL7 FHIR R4).
- Creating an intuitive, gorgeous user experience that judges can explore effortlessly.

### What's next for AquaLens
Expanding our automated satellite ingestion pipeline to ingest daily NASA Landsat 9 and MODIS thermal infrared passes, while piloting direct webhook integrations with municipal drinking water filtration SCADA systems.
