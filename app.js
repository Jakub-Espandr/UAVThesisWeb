const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Nastavení EJS jako view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const studyTitles = {
  "1)klasifikace_vegetace-Vraclav": "Klasifikace vegetace – Vraclav",
  "2)klasifikace_spaleneho_porostu-Albanie": "Klasifikace spáleného porostu – Albánie",
  "3)klasifikace_poskozeni_obilnin-Loucky": "Klasifikace poškození obilnin – Loučky",
  "4)klasifikace_vegetacnich_slozek-Hradek": "Klasifikace vegetačních složek – Hrádek",
  "5)klasifikace_zaplavene_plochy-Cestice": "Klasifikace zaplavené plochy – Čestice",
  "6)porovnani_klasifikacnich_modelu-Cestice": "Porovnání klasifikačních modelů – Čestice",
  "7)detekce_objektu-sad-Trpik": "Detekce objektů – sad Trpík"
};

// Pomocná funkce pro načtení případových studií
function loadCaseStudies(baseDir) {
  const caseStudies = [];

  const studyDirs = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const study of studyDirs) {
    const studyPath = path.join(baseDir, study.name);
    const files = fs.readdirSync(studyPath);

    // Najdi snímky území a výseče (včetně webp)
    const overview = files
      .filter(f => {
        const filePath = path.join(studyPath, f);
        return f.match(/\.(jpg|jpeg|png|webp)$/i) &&
               !fs.lstatSync(filePath).isDirectory() &&
               (f.toLowerCase().includes("uzemi") || 
                f.toLowerCase().includes("vysec") || 
                f.toLowerCase().includes("rozmery"));
      })
      .sort((a, b) => {
        // Seřadit: uzemi -> vysec -> rozmery
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const getPriority = (filename) => {
          if (filename.includes("uzemi")) return 1;
          if (filename.includes("vysec")) return 2;
          if (filename.includes("rozmery")) return 3;
          return 4;
        };
        return getPriority(aLower) - getPriority(bLower);
      });

    // Najdi tabulky (obrázky v appendix adresáři)
    const appendixPath = path.join(studyPath, 'appendix');
    let tables = [];
    
    if (fs.existsSync(appendixPath)) {
      const appendixFiles = fs.readdirSync(appendixPath);
      const tablePatterns = ['f1', 'precision', 'recall', 'kappa', 'presnost'];
      
      tables = appendixFiles
        .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
        .filter(f => {
          const fileName = f.replace(/\.[^/.]+$/, ''); // odstranit příponu
          return tablePatterns.some(pattern => 
            fileName.startsWith(pattern) && 
            (fileName.endsWith('_tabulka') || fileName.match(/_graf\d*$/))
          );
        })
        .sort((a, b) => {
          // Seřadit podle priority: f1, precision, recall, kappa, presnost
          const getPriority = (filename) => {
            if (filename.startsWith('f1')) return 1;
            if (filename.startsWith('precision')) return 2;
            if (filename.startsWith('recall')) return 3;
            if (filename.startsWith('kappa')) return 4;
            if (filename.startsWith('presnost')) return 5;
            return 6;
          };
          return getPriority(a) - getPriority(b);
        })
        .map(file => ({
          filename: file,
          fullPath: `data/${study.name}/appendix/${file}`
        }));
    }

    // Najdi indexy
    const indicesPath = path.join(studyPath, 'indices');
    let indices = [];
    
    if (fs.existsSync(indicesPath)) {
      const indicesFiles = fs.readdirSync(indicesPath);
      indices = indicesFiles
        .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
        .sort(); // Seřadit abecedně
    }

    // Najdi metody klasifikace
    const allDirs = fs.readdirSync(studyPath, { withFileTypes: true })
      .filter(d => d.isDirectory());
    
    const methods = allDirs
      .filter(d => !d.name.endsWith('.fld') && d.name !== 'appendix' && d.name !== 'indices')
      .map(method => {
        const methodPath = path.join(studyPath, method.name);
        const allFiles = fs.readdirSync(methodPath, { withFileTypes: true });
        // Pouze platné obrázky (webp) a pouze soubory
        const images = allFiles
          .filter(f => f.isFile() && f.name.toLowerCase().endsWith('.webp') && !f.name.toLowerCase().includes('_thumb'))
          .map(f => ({
            filename: f.name,
            fullPath: `data/${study.name}/${method.name}/${f.name}`
          }));
        return {
          name: method.name,
          images
        };
      });

    const title = studyTitles[study.name] || study.name;

    caseStudies.push({
      name: study.name,
      title,
      overview,
      tables,
      indices,
      methods
    });
  }

  return caseStudies;
}

// Hlavní stránka
app.get('/', (req, res) => {
  const dataPath = path.join(__dirname, 'public', 'data');
  const caseStudies = loadCaseStudies(dataPath);
  res.render('index', { caseStudies, allCaseStudies: caseStudies });
});

// Jednotlivé případové studie
app.get('/study/:studyId', (req, res) => {
  const studyId = parseInt(req.params.studyId);
  const dataPath = path.join(__dirname, 'public', 'data');
  const allCaseStudies = loadCaseStudies(dataPath);
  
  if (studyId >= 1 && studyId <= allCaseStudies.length) {
    const selectedStudy = allCaseStudies[studyId - 1];
    // Předáme všechny studie pro navigaci, ale zobrazíme pouze vybranou
    res.render('index', { 
      caseStudies: [selectedStudy],
      allCaseStudies: allCaseStudies 
    });
  } else {
    // Pokud neexistuje, přesměruj na hlavní stránku
    res.redirect('/');
  }
});

// API endpoint for case studies data
app.get('/api/case-studies', (req, res) => {
  const dataPath = path.join(__dirname, 'public', 'data');
  const caseStudies = loadCaseStudies(dataPath);
  res.json(caseStudies);
});

app.listen(PORT, () => {
  console.log(`UAVThesisWeb běží na http://localhost:${PORT}`);
}); 