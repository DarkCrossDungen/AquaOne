# Project Blueprint: AegisAqua (One Health Sentinel)

**IEEE OneAquaHealth Global Hackathon 2026**  
*Target Track: Track 7 — Digital Health Standards (HL7 FHIR Interoperability)*  
*Secondary Tracks: Track 3 (AI-Supported Assessment) & Track 6 (Resilience Informatics)*

---

## 1. Executive Summary & Vision

**AegisAqua** is an intelligent, standards-compliant environmental surveillance and public health early-warning platform. It bridges the critical divide between **citizen science freshwater monitoring** and **clinical/municipal public health informatics**.

While thousands of environmental volunteers collect stream data (pH, turbidity, dissolved oxygen, benthic macroinvertebrates), this data currently sits locked in localized spreadsheets and siloed ecological databases. Meanwhile, municipal healthcare systems and epidemiologists track waterborne illnesses (e.g., *Campylobacter*, *Leptospirosis*, cyanotoxin exposure) in isolation.

**AegisAqua solves this by:**
1. Providing an intuitive citizen-science stream assessment interface with **multimodal AI triage** to identify bio-indicators and validate environmental data quality.
2. Converting all stream observations, citizen surveys, and ecological risks into standardized **HL7 FHIR R4 (OAH-FHIR)** resources (`Observation`, `QuestionnaireResponse`, `RiskAssessment`, `Bundle`).
3. Generating real-time **One Health Early Warning Alerts** connecting freshwater degradation indicators directly to downstream human disease risks and municipal response actions.

---

## 2. Core Modules & System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AEGISAQUA PLATFORM                              │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
┌──────────────┐             ┌──────────────┐              ┌──────────────┐
│   Module 1   │             │   Module 2   │              │   Module 3   │
│   Citizen    │             │   AI-Triage  │              │   HL7 FHIR   │
│  Inspection  │ ──────────► │ & Bio-Metric │ ───────────► │ Interop &    │
│    Portal    │             │  Diagnostic  │              │ OAH-Profile  │
└──────────────┘             └──────────────┘              └──────┬───────┘
                                                                  │
                                     ┌────────────────────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │           Module 4           │
                      │ One Health Early-Warning Map │
                      │  & Municipal Alert Engine    │
                      └──────────────────────────────┘
```

### Module 1: Citizen Science Stream Intake
- Mobile-responsive stream assessment form.
- Physical & chemical parameters: Water Temperature (°C), pH, Dissolved Oxygen (mg/L), Turbidity (NTU), Electrical Conductivity (µS/cm).
- Observational parameters: Odor, flow speed, algae coverage, riparian canopy health.
- Biological sampling: Macroinvertebrate bio-indicators (Mayfly, Stonefly, Caddisfly, Tubifex worms, Leech).

### Module 2: AI-Powered Ecological Triage & Bio-Assessment
- Automated calculation of the **Water Quality Index (WQI)** and **EPT Richness Index** (Ephemeroptera, Plecoptera, Trichoptera).
- AI Diagnostic Assistant:
  - Validates plausibility of citizen inputs (flags sensor errors or anomalies).
  - Translates complex chemical/biological readings into plain-language ecological health summaries.
  - Explains the biological reasoning behind water risk scores with confidence metrics.

### Module 3: Digital Health Standards Engine (HL7 FHIR R4 / OAH-FHIR)
- Maps freshwater observations directly to global healthcare terminology:
  - **LOINC 2713-6**: Water pH
  - **LOINC 2710-2**: Dissolved Oxygen
  - **LOINC 82810-3**: Water Temperature
  - **LOINC 48421-2**: Turbidity
  - **SNOMED CT 706893006**: Freshwater ecosystem
- Serializes data into FHIR R4 Bundles (`Observation`, `RiskAssessment`, `QuestionnaireResponse`).
- Built-in **Interactive FHIR Inspector** allowing hackathon judges to review, validate, and export raw FHIR JSON bundles with a single click.

### Module 4: One Health Risk Map & Resilience Alert Simulator
- Interactive GIS catchment overview simulating real OneAquaHealth pilot locations (e.g., Mondego River Basin, Toulouse Urban Streams, Ghent Canals).
- Predictive cascading risk modeling:
  - High E. coli / Enterococci -> Alerts for recreational gastrointestinal & ear infections.
  - High Nitrogen/Phosphorus + Temperature -> Cyanobacteria Harmful Algal Bloom (HAB) neurotoxin warning.
  - Stagnant water + Organic load -> Mosquito vector propagation index (*Culex* / West Nile risk).
- Automated dual-tier action plans:
  1. *Ecological/Riparian remediation* for environmental teams.
  2. *Public Health advisory alerts* for clinics and municipal water authorities.

---

## 3. Technology Stack

- **Frontend & App Framework:** Next.js 15 (React 19, TypeScript, App Router)
- **Styling & UI Components:** Tailwind CSS, Lucide Icons, clean modern card layouts
- **Data Visualization:** Recharts (WQI trends, Dissolved Oxygen vs. Temperature correlation, pathogen spike graphs)
- **Standards & Specifications:** HL7 FHIR R4, OAH-FHIR Implementation Guide models, LOINC, SNOMED CT
- **API & AI Logic:** Next.js Edge/Node Serverless Handlers with structured Zod schema validation
- **Deployment:** Vercel (zero-config, high performance, global CDN)

---

## 4. Why This Architecture Wins 1st Place

1. **Direct Alignment with Hackathon Organizers (30% Impact Score):**
   - The primary sponsors are **IEEE EMBS**, **EFMI**, and the EU Horizon **OneAquaHealth** initiative.
   - Most competitors will submit surface-level dashboards. By delivering genuine **FHIR R4 digital health interoperability**, AegisAqua proves real-world public health and environmental convergence.
2. **Explainable AI Integration (20% Innovation Score):**
   - Implements AI as a diagnostic assistant that empowers citizens without hallucinating or obscuring scientific confidence.
3. **Production-Ready Usability (15% UX + 15% Feasibility Score):**
   - Crisp, intuitive, modern interface that works seamlessly on mobile devices for field workers and desktop monitors for municipal regulators.
4. **Flawless Technical Execution (20% Technical Score):**
   - Zero-dependency mock fallbacks so the live demo runs flawlessly during judging even if external APIs or sandboxes experience downtime.

---

## 5. 48-Hour Implementation Plan

- [x] Project architecture & requirements finalized (`skill-note.md`, `project.md`).
- [ ] Install dependencies and initialize clean UI layout with header, navigation, and One Health theme.
- [ ] Build **Stream Assessment Portal** (data intake + preset demo scenarios).
- [ ] Build **AI Diagnostic & Triage Engine** (WQI, EPT bio-index, explainability card).
- [ ] Build **HL7 FHIR Interoperability Suite** (real-time FHIR R4 builder, JSON syntax viewer, copy/download bundle).
- [ ] Build **One Health Resilience Dashboard** (catchment map, timeseries analytics, alert simulator).
- [ ] Polish UI, dark/light theme, accessibility, and mobile responsiveness.
- [ ] Test build (`npm run build`) and deploy to Vercel.
- [ ] Record 3–5 minute high-impact demo video following the winning pitch script.
