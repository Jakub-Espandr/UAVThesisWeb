<p align="center">
  <a href="https://i.ibb.co/nqg3zcBS/favicon.png">
    <img src="https://i.ibb.co/nqg3zcBS/favicon.png" alt="UAV Classification Logo" width="250"/>
  </a>
</p>

<h1 align="center">Interaktivní vizualizace výsledků klasifikace UAV dat</h1>
<p align="center"><em>(FlyCamCzech | UAV Classification Visualization)</em></p>

## Přehled
Moderní webová aplikace pro interaktivní vizualizaci výsledků klasifikace dat z bezpilotních letounů (UAV). Vyvinuta jako součást diplomové práce **Bc. Jakuba Ešpandra** (*Klasifikace UAV obrazových dat v rámci vybraných území*), tato aplikace poskytuje intuitivní rozhraní pro vizualizaci výstupů různých metod strojového učení aplikovaných na obrazová data pořízená drony.

---

## ✨ Funkce

- **Interaktivní vizualizace klasifikace**
  - Zobrazení výsledků klasifikace ze 7 komplexních případových studií
  - Podpora 6 algoritmů strojového učení se spektrálními indexy
  - Porovnání v reálném čase mezi klasifikací a původními výřezy území
  - Interaktivní přepínání mezi různými spektrálními reprezentacemi
  - Možnost zobrazit spektrální indexy v samostatném overlay a porovnat je s RGB snímkem
- **Pokročilý overlay systém**
  - Zobrazení výsledků klasifikace na celou obrazovku
  - Navigace mezi metodami a spektrálními indexy
  - Režim porovnání v reálném čase s původními výřezy území
  - Vizuální indikátory a zobrazení stavu metod
- **Komplexní vizualizace metrik**
  - Automatické načítání výkonnostních metrik z appendix složek
  - Interaktivní přepínání mezi tabulkami a grafy (_tabulka → _graf1 → _graf2)
  - Podpora metrik F1, Precision, Recall, Kappa a Přesnost
  - Cyklická navigace mezi více grafy na metriku
- **Moderní UI/UX design**
  - Glassmorphism design s průhlednými efekty
  - Gradientní pozadí s plynulými přechody
  - Vlastní FCC Typo fonty pro profesionální vzhled
  - Hardware-akcelerované animace a hover efekty
- **Responzivní design**
  - Desktop optimalizace s horizontálním posouváním pro metody
  - Tablet optimalizace s flexibilním layoutem
  - Mobilní optimalizace s ovládáním přátelským k dotyku
  - Adaptivní velikosti overlay pro různé velikosti obrazovek
- **Optimalizace výkonu**
  - Lazy loading obrázků pro rychlejší načítání stránek
  - Cachování obrázků s limitem 50 obrázků v paměti
  - Automatické čištění paměti každých 30 sekund
  - Hardware akcelerace pro plynulé animace
- **Informační systém**
  - Interaktivní nápověda s vysvětlením klasifikačních metod
  - Instrukce k použití a navigační průvodce
  - Hover efekty pro kontextové zobrazení informací

---

## 📦 Požadavky

- Node.js 14.0+ (doporučená LTS verze)
- [Express.js](https://expressjs.com/) >= 4.18.0 – Framework pro webové aplikace
- [EJS](https://ejs.co/) >= 3.1.0 – Template engine pro dynamický obsah
- Moderní webový prohlížeč s podporou JavaScript ES6+
- Minimum 2GB RAM (doporučeno 4GB pro velké datasety)

---

## 🚀 Instalace

```bash
# Klonování repozitáře
git clone https://github.com/Jakub-Espandr/UAVThesisWeb.git
cd UAVThesisWeb

# Instalace závislostí
npm install

# Spuštění aplikace
node app.js

# Otevření v prohlížeči
# Přejděte na http://localhost:3001
```

---

## 🛠️ Použití

```bash
node app.js
```

1. Přejděte na hlavní stránku pro zobrazení všech případových studií
2. Klikněte na jednotlivé studie pro přístup k detailní analýze (`/study/1`, `/study/2`, atd.)
3. Interagujte s přehledovými obrázky pro přepínání mezi územím, výřezem a rozměry
4. Klikněte na klasifikační metody pro zobrazení detailních výsledků v overlay režimu
5. Použijte tlačítko "Porovnat" pro přepínání mezi klasifikací a původním výřezem území
6. Přistupte k grafům a tabulkám prostřednictvím appendix overlay systému

---

## 📁 Struktura projektu

```
UAVThesisWeb/
├── app.js                   # Vstupní bod Express serveru
├── views/
│   └── index.ejs           # Hlavní EJS template
├── public/
│   ├── css/                # Styly aplikace
│   ├── icons/              # Ikony a favicony
│   ├── js/                 # JavaScript aplikace
│   └── data/               # Data případových studií
│       ├── studie1/
│       │   ├── appendix/   # Výkonnostní metriky a grafy
│       │   ├── metoda1/    # Výsledky klasifikačních metod
│       │   ├── indices/    # Spektrální indexy (NDVI, NDWI, atd.) pro danou studii
│       │   ├── uzemi.webp       # Přehledové obrázky uzemi
│       │   ├── vysec.webp       # Přehledové obrázky vyseci
│       │   └── rozloha.webp     # Přehledové obrázky rozlohy
│       └── studie[2-7]/    # Další případové studie
├── assets/
│   └──                    # (ikony jsou nyní pouze v public/icons/)
└── package.json            # Node.js závislosti
├── package-lock.json       # Zámek verzí závislostí (generuje npm)
```

Každá složka `indices/` obsahuje spektrální indexy (např. NDVI, NDWI) a RGB snímek pro porovnání.

---

## 🎯 Případové studie

| Studie | Oblast zaměření | Popis |
|--------|----------------|-------|
| **Studie 1** | Klasifikace vegetace | Komplexní klasifikace vegetace ve Vraclavi |
| **Studie 2** | Analýza požárů | Mapování spálené vegetace v Albánii |
| **Studie 3** | Poškození obilnin | Hodnocení škod v zemědělství v Loučkách |
| **Studie 4** | Poškození obilnin | Hodnocení škod v zemědělství v Hrádku |
| **Studie 5** | Analýza záplav | Klasifikace zaplavených oblastí v Česticích |
| **Studie 6** | Porovnání modelů | Srovnávací analýza metod v Česticích |
| **Studie 7** | Detekce objektů | Analýza ovocného sadu v oblasti Trpík |

Každá studie obsahuje:
- **Přehledové snímky** (území, výřez oblasti, rozměry)
- **Výsledky klasifikace** z více ML algoritmů
- **Výkonnostní metriky** s interaktivními grafy a tabulkami
- **Spektrální analýzu** napříč různými indexy

---

## 🔐 Licence

This project is licensed under the **Non-Commercial Public License (NCPL v1.0)**  
© 2025 Jakub Ešpandr - Born4Flight, FlyCamCzech  
See the [LICENSE](https://github.com/Jakub-Espandr/UAVThesisWeb/raw/main/LICENSE) file for full terms.

---

## 🙏 Poděkování

- Vytvořeno s ❤️ pro vizualizaci a analýzu UAV dat
- Poháněno moderními webovými technologiemi a algoritmy strojového učení

---

---

# Interactive UAV Data Classification Results Visualization

<h1 align="center">Interactive UAV Data Classification Results Visualization</h1>
<p align="center"><em>(FlyCamCzech | Interaktivní vizualizace UAV dat)</em></p>

## Overview
A modern web application for interactive visualization of UAV (Unmanned Aerial Vehicle) data classification results. Developed as part of the thesis of **Bc. Jakub Ešpandr** (*Classification of UAV Image Data within Selected Areas*), this application provides an intuitive interface for visualizing outputs of different machine learning classification methods applied to drone-captured imagery data.

---

## ✨ Features

- **Interactive Classification Visualization**
  - View classification results from 7 comprehensive case studies
  - Support for 6 machine learning algorithms with spectral indices
  - Real-time comparison between classification and original crop areas
  - Display spectral indices in a dedicated overlay and compare them with the RGB image
- **Classification Methods Support**
  - Comprehensive support for multiple machine learning algorithms
  - Integration with spectral indices for enhanced analysis
  - Interactive switching between different spectral representations
- **Advanced Overlay System**
  - Fullscreen classification results display
  - Navigation between methods and spectral indices
  - Real-time comparison mode with original crop areas
  - Visual indicators and method status display
- **Comprehensive Metrics Visualization**
  - Automatic loading of performance metrics from appendix folders
  - Interactive switching between tables and charts (_table → _chart1 → _chart2)
  - Support for F1, Precision, Recall, Kappa, and Accuracy metrics
  - Cyclic navigation through multiple charts per metric
- **Modern UI/UX Design**
  - Glassmorphism design with transparent effects
  - Gradient backgrounds with smooth transitions
  - Custom FCC Typo fonts for professional appearance
  - Hardware-accelerated animations and hover effects
- **Responsive Design**
  - Desktop optimization with horizontal scroll for methods
  - Tablet optimization with flexible layout
  - Mobile optimization with touch-friendly controls
  - Adaptive overlay sizing for different screen sizes
- **Information System**
  - Interactive help bubble with classification method explanations
  - Usage instructions and navigation guidance
  - Hover effects for contextual information display

---

## 📦 Requirements

- Node.js 14.0+ (LTS recommended)
- [Express.js](https://expressjs.com/) >= 4.18.0 – Web application framework
- [EJS](https://ejs.co/) >= 3.1.0 – Template engine for dynamic content
- Modern web browser with JavaScript ES6+ support
- Minimum 2GB RAM (recommended 4GB for large datasets)

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Jakub-Espandr/UAVThesisWeb.git
cd UAVThesisWeb

# Install dependencies
npm install

# Start the application
node app.js

# Open in browser
# Navigate to http://localhost:3001
```

---

## 🛠️ Usage

```bash
node app.js
```

1. Navigate to the main page to view all case studies
2. Click on individual studies to access detailed analysis (`/study/1`, `/study/2`, etc.)
3. Interact with overview images to switch between territory, crop, and dimensions views
4. Click classification methods to view detailed results in overlay mode
5. Use "Compare" button to toggle between classification and original crop area
6. Access charts and tables through the appendix overlay system

---

## 📁 Project Structure

```
UAVThesisWeb/
├── app.js # Express server entry point
├── views/
│ └── index.ejs # Main EJS template
├── public/
│ ├── css/      # Application styles
│ ├── icons/    # Icons and favicons
│ ├── js/       # Application JavaScript
│ └── data/     # Case study data
│   ├── study1/
│   │ ├── appendix/ # Performance metrics and charts
│   │ ├── method1/ # Classification method results
│   │ ├── indices/ # Spectral indices (e.g. NDVI, NDWI) for the given study
│   │ ├── uzemi.webp # Area overview images
│   │ ├── vysec.webp # Section overview images
│   │ └── rozloha.webp # Extent overview images
│   └── study[2-7]/ # Additional case studies
├── assets/
│ └──       # (icons are now only in public/icons/)
└── package.json # Node.js dependencies
├── package-lock.json # Dependency version lock (generated by npm)
```

Each `indices/` folder contains spectral indices (e.g. NDVI, NDWI) and an RGB image for comparison.

---

## 🎯 Case Studies

| Study | Focus Area | Description |
|-------|------------|-------------|
| **Study 1** | Vegetation Classification | Comprehensive vegetation classification in Vraclav |
| **Study 2** | Burn Analysis | Burned vegetation mapping in Albania |
| **Study 3** | Crop Damage | Agricultural damage assessment in Loučky |
| **Study 4** | Crop Damage | Agricultural damage assessment in Hrádek |
| **Study 5** | Flood Analysis | Flooded area classification in Čestice |
| **Study 6** | Model Comparison | Comparative analysis of methods in Čestice |
| **Study 7** | Object Detection | Fruit orchard analysis in Trpík region |

Each study includes:
- **Overview imagery** (territory, crop area, dimensions)
- **Classification results** from multiple ML algorithms
- **Performance metrics** with interactive charts and tables
- **Spectral analysis** across different indices

---

## 🔐 License

This project is licensed under the **Non-Commercial Public License (NCPL v1.0)**  
© 2025 Jakub Ešpandr - Born4Flight, FlyCamCzech  
See the [LICENSE](https://github.com/Jakub-Espandr/UAVThesisWeb/raw/main/LICENSE) file for full terms.

---

## 🙏 Acknowledgments

- Built with ❤️ for visualizing UAV data classification outputs
- Part of a thesis on UAV image data classification