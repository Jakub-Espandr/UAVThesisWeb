# 📝 Changelog


## [1.0.0] - 2025-06-27

## 🎯 Základní funkcionalita

### Interaktivní vizualizace UAV dat
- Zobrazení výsledků klasifikace UAV dat v interaktivním prostředí
- Podpora pro 7 případových studií s kompletními daty
- Webová aplikace s Express.js backendem

### Navigace a routing
- Hlavní stránka se všemi studiemi
- Jednotlivé stránky studií (`případová studie 1`, `případová studie 2`, atd.)
- Navigační menu mezi studiemi s aktivními odkazy
- URL routing pro přímé odkazy na studie

## 🖼️ Zobrazení a overlay

### Overview obrázky
- Přepínání mezi územím, výřezem a rozměry
- Plynulé animace a přechody s hover efekty
- Automatické řazení (území → výřez → rozměry)

### Klasifikační metody overlay
- Fullscreen zobrazení výsledků klasifikace
- Navigace mezi metodami a obrázky pomocí tlačítek
- Indikátor aktuální metody s názvem a spektrálním typem

### Porovnávací mód
- Porovnání s výřezem pomocí dedikovaného tlačítka
- Přepínání mezi klasifikací a výřezem v reálném čase
- Zachování kontextu při přepínání
- Vizuální indikátory "Porovnat"

## 📊 Grafy a tabulky

### Automatické načítání
- Načítání z appendix složek
- Přepínání mezi tabulkami a grafy (_tabulka → _graf1 → _graf2)
- Cyklování mezi více grafy pro každou metriku

## 🎨 Uživatelské rozhraní

### Design
- Moderní glassmorphism design s průhlednými efekty
- Gradient pozadí s plynulými přechody
- Custom FCC Typo fonty
- Plynulé animace s hardwarovou akcelerací
- Hover efekty a interaktivní prvky

### Responzivní design
- Desktop optimalizace s horizontálním scroll pro metody
- Tablet optimalizace s flexibilním layoutem
- Mobilní optimalizace s touch-friendly ovládáním
- Adaptivní overlay velikosti

## ℹ️ Informační systém

### Nápověda a informace
- Informační bublina s vysvětlením zkratek klasifikačních metod
- Help bublina s návodem k ovládání aplikace
- Hover efekty pro zobrazení informací
- Umístění v rozích pro snadný přístup

## ⚡ Optimalizace výkonu

### Paměťová optimalizace
- Lazy loading obrázků
- Image caching s limitem 50 obrázků
- Automatické čištění paměti
- Periodické cleanup každých 30 sekund
- Garbage collection hints

### Výkonnostní optimalizace
- Hardware acceleration pro animace
- CSS optimalizace s `will-change` a `transform3d`
- Efektivní DOM manipulace
- Preload fontů pro rychlejší načítání

### SEO optimalizace
- Kompletní meta tagy pro vyhledávače
- Open Graph tagy pro sociální sítě
- Twitter Card podpora
- Canonical URL a favicon
- Theme color pro mobilní prohlížeče

## 🛠️ Technické funkce

### Backend (Node.js + Express.js)
- Automatické načítání souborů z appendix složek
- Podpora pro _graf1, _graf2 soubory
- Filtrování podle vzorů názvů souborů
- Statické soubory serving
- EJS template engine
- Route handling pro jednotlivé studie

### Frontend (HTML5 + CSS3 + JavaScript ES6+)
- Moderní JavaScript s ES6+ syntaxí
- Efektivní event handling
- Memory management a cleanup
- Error handling a fallbacky
- Progressive enhancement

## 📁 Správa dat

### Automatické načítání
- Automatické načítání případových studií
- Dynamické generování navigace
- Flexibilní struktura pro přidávání nových studií
- Podpora pro různé formáty obrázků (JPG, PNG, WebP)

### Konfigurace
- Pevně definované názvy studií v backendu
- Nezávislost na názvu složky
- Jednoduché přidávání nových studií