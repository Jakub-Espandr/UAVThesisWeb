# 📝 Changelog

## [1.1.1] - 2025-07-23

### Opraveno
- **Názvy studií** Aktualizovány názvy případových studií
- Odstraněno periodické volání `cleanupMemory`, které způsobovalo zamrzání nebo neočekávané chování při přepínání obrázků.
- Přidána ochrana do fronty operací, která zabrání frontování `updateImageOverlay`, pokud není vybraná žádná studie (`currentStudy` je null).
- Výrazně zlepšena stabilita a plynulost přepínání obrázků a ovládacích prvků bez zamrzání UI.

---

## [1.1.0] - 2025-07-08

### Nové
- **Tlačítko pro zobrazení indexů:** Přidáno nové tlačítko "Zobrazit indexy" pro každou případovou studii, které otevírá samostatný overlay pro porovnání spektrálních indexů a RGB snímku.

### Vylepšeno
- **Sticky footer:** Footer je nyní vždy viditelný (fixed) na spodní části obrazovky na všech zařízeních.
- **Glassmorphism efekt:** Footer má průhledné pozadí s rozmazáním (glassmorphism), které dynamicky ladí s pozadím stránky.
- **Lepší UX na mobilech:** Na mobilních zařízeních je větší mezera pod obsahem (`padding-bottom`), aby footer nepřekrýval tlačítka nebo jiné prvky.
- **Větší a čitelnější text ve footeru:** Text ve footeru je větší a černý pro lepší čitelnost na světlém i tmavém pozadí.
- **Odstranění inline stylů:** Všechny styly footeru jsou nyní v CSS, což zajišťuje lepší správu a konzistenci vzhledu.
- **Celkové vylepšení responzivity a moderního vzhledu:** Footer je nyní plně responzivní a lépe zapadá do celkového designu aplikace.

---

## [1.0.3] - 2025-07-07

### Opraveno
- **Zabránění zamrznutí UI při rychlém přepínání:** Kompletně přepracována logika načítání obrázků a přepínání mezi spektrálními indexy, metodami a náhledy. Nově je zajištěno, že se nikdy nespustí více načítání obrázků současně a uživatelské rozhraní zůstává vždy responzivní.
- **Ošetření race conditions a správná správa stavu:** Přidána blokace dalších akcí během načítání obrázku pomocí událostí `onload`/`onerror` a paměťového Image objektu. Zajištěno, že se zpracuje pouze poslední požadavek uživatele.
- **Timeout pro načítání obrázků:** Pokud se obrázek nenačte do 5 sekund, UI se automaticky odblokuje a uživatel může pokračovat.
- **Oprava generování neplatných cest k obrázkům:** Backend nyní filtruje pouze platné obrázky s příponou `.webp` a v šabloně EJS jsou všechny cesty správně escapovány.
- **Ošetření chybného stavu `currentStudy`:** Přidán fallback mechanismus, který vždy obnoví platnou studii z globálních dat, pokud dojde k chybě nebo neplatnému indexu.
- **Oprava indexů a hranic při navigaci:** Zajištěno, že při přepínání obrázků nikdy nedojde k přetečení nebo podtečení indexů.

### Vylepšení
- **Podrobné logování:** Přidány detailní logy pro sledování změn stavu a událostí načítání obrázků.
- **Zvýšení limitu cache obrázků v JS:** Limit pro počet cachovaných obrázků zvýšen z 50 na 200 pro plynulejší uživatelský zážitek.
- **Odstranění preload warningů:** Odstraněny zbytečné preloady pro favicon a ikony, které způsobovaly varování v konzoli.
- **Vyčištění dat a odstranění neplatných souborů:** Odstraněny neplatné nebo prázdné soubory z adresářů s obrázky.
- **Vylepšený nadpis případové studie nad grafy:** Název případové studie je nyní nad grafy vždy dobře viditelný – na desktopu větší, tučnější a vycentrovaný, na mobilu decentní. Odstraněn zbytečný rámeček/indikátor v overlay s grafy.

---

## [1.0.2] - 2025-07-03

### Opraveno
- **Image overlay problém**: Opraveno načítání obrázků při zobrazení jednotlivých studií
  - Změna relativních cest na absolutní cesty (přidání `/` na začátek cest)
  - Oprava funkčnosti `showImageOverlay()` pro všechny URL kontexty
  - Obrázky se nyní správně načítají jak na hlavní stránce (`/`) tak na jednotlivých studiích (`/study/1`, `/study/2`, atd.)
- **CSS metodový indikátor**: Odstraněn `display: none` z `.method-indicator` pro správné zobrazení

---

## [1.0.1] - 2025-06-28

### Odebráno
- Odstraněno tlačítko "Porovnat" a související funkce z uživatelského rozhraní i JavaScriptu.

### Opraveno
- Opraveno zobrazování bublin (info a help) na mobilu po zavření overlay
- Opraveno vertikální centrování obrázků (metody a výřez) na mobilu pomocí flexbox
- Odstraněny transition efekty při přepínání mezi výřezem a metodou pro okamžité přepínání

### Optimalizováno
- **CSS konsolidace**: Sloučeny duplicitní styly pro obrázky a tlačítka do společných selektorů
- **CSS modularizace**: Přesunut inline CSS do samostatného souboru `public/css/style.css`
- **Preload optimalizace**: Přidány preload a prefetch tagy pro fonty, favicony a hlavní obrázky studií
- **DNS optimalizace**: Přidány DNS prefetch a preconnect pro externí zdroje
- **JavaScript modularizace**: Přesunut inline JavaScript do samostatného modulu `public/js/app.js`
- **Funkční rozdělení**: Rozděleny velké funkce na menší, znovupoužitelné části
- **Globální expozice**: Funkce vystaveny globálně pro podporu existujících onclick handlerů

### Vylepšeno
- **Mobilní UX**: Lepší pozicování a velikosti obrázků na mobilních zařízeních
- **Konzistence**: Sjednoceny styly mezi normálními obrázky a porovnávacím režimem
- **Výkon**: Odstraněny zbytečné animace a transition efekty pro rychlejší odezvu
- **Kódová struktura**: Lepší organizace CSS a JavaScript kódu pro snadnější údržbu

---

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