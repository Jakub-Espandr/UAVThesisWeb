// === Memory management ===
let imageCache = new Map();
let currentOverlayImages = [];

export function cleanupMemory() {
  // Vyčistit reference na obrázky
  currentOverlayImages = [];
  
  // Vynulovat proměnné
  currentStudy = null;
  currentMethodIndex = 0;
  currentImageIndex = 0;
  currentTableIndex = 0;
  isOverviewMode = false;
  isCompareMode = false;
  
  if (imageCache.size > 50) imageCache.clear();
  if (window.gc) window.gc();
}

export function loadImageOptimized(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const img = new Image();
  img.src = src;
  imageCache.set(src, img);
  return img;
}

// === Overlay management ===
export function showOverlay(url) {
  document.getElementById('overlayFrame').src = url;
  document.getElementById('overlay').style.display = 'block';
}

export function hideOverlay() {
  document.getElementById('overlayFrame').src = '';
  document.getElementById('overlay').style.display = 'none';
  cleanupMemory();
}

// === State ===
const data = JSON.parse(document.getElementById('caseStudiesData').textContent);
let currentStudy = null;
let currentMethodIndex = 0;
let currentImageIndex = 0;
let currentTableIndex = 0;
let isOverviewMode = false;
let isCompareMode = false;

// === Overlay logic ===
export function showImageOverlay(studyName, methodIndex, imageIndex) {
  currentStudy = data.find(st => st.name === studyName);
  currentMethodIndex = methodIndex;
  currentImageIndex = imageIndex;
  isOverviewMode = false;
  isCompareMode = false;
  
  updateImageOverlay();
  document.getElementById('imageOverlay').style.display = 'block';
  if (window.innerWidth <= 768) hideBubbles();
}

export function toggleOverviewImages(studyName) {
  currentStudy = data.find(st => st.name === studyName);
  currentImageIndex = 0;
  isOverviewMode = true;
  isCompareMode = false;
  
  updateImageOverlay();
  document.getElementById('imageOverlay').style.display = 'block';
  if (window.innerWidth <= 768) hideBubbles();
}

export function hideImageOverlay() {
  document.getElementById('imageOverlay').style.display = 'none';
  isOverviewMode = false;
  isCompareMode = false;
  showBubbles();
}

export function toggleCompareWithCrop() {
  if (isOverviewMode) return;
  
  isCompareMode = !isCompareMode;
  updateImageOverlay();
  updateCompareButtonText();
}

export function updateImageOverlay() {
  const overlayImg = document.getElementById('overlayImg');
  const imageOverlay = document.getElementById('imageOverlay');
  
  if (isOverviewMode) {
    const image = currentStudy.overview[currentImageIndex];
    overlayImg.src = `data/${currentStudy.name}/${image}`;
    document.getElementById('methodIndicator').textContent = image.replace('.webp', '');
    imageOverlay.classList.remove('compare-mode');
    currentOverlayImages = [overlayImg.src];
  } else {
    const method = currentStudy.methods[currentMethodIndex];
    const image = method.images[currentImageIndex];
    
    if (isCompareMode) {
      // Porovnávací režim - zobrazit výřez místo metody
      overlayImg.src = `/data/${currentStudy.name}/vysec.webp`;
      overlayImg.alt = 'Výřez';
      imageOverlay.classList.add('compare-mode');
      currentOverlayImages = [image.fullPath, `/data/${currentStudy.name}/vysec.webp`];
    } else {
      // Normální režim - zobrazit jeden obrázek
      overlayImg.src = image.fullPath;
      overlayImg.alt = '';
      imageOverlay.classList.remove('compare-mode');
      currentOverlayImages = [overlayImg.src];
    }
    
    let spectralType = '';
    if (image.filename.includes('_rgb')) spectralType = ' (RGB)';
    else if (image.filename.includes('_tgi')) spectralType = ' (TGI)';
    document.getElementById('methodIndicator').textContent = `${method.name}${spectralType}`;
  }
}

export function updateCompareButtonText() {
  const compareButton = document.querySelector('.compare-button');
  if (compareButton) {
    if (isCompareMode) {
      compareButton.querySelector('.nav-button-label').textContent = 'Zobrazit metodu';
    } else {
      compareButton.querySelector('.nav-button-label').textContent = 'Zobrazit výřez';
    }
  }
}

export function navigateImage(direction) {
  // Pokud je zapnutý výřez, nejdříve ho vypnout
  if (isCompareMode) {
    isCompareMode = false;
    updateImageOverlay();
    updateCompareButtonText();
    return;
  }
  
  if (isOverviewMode) {
    currentImageIndex = (currentImageIndex + direction + currentStudy.overview.length) % currentStudy.overview.length;
  } else {
    const method = currentStudy.methods[currentMethodIndex];
    currentImageIndex = (currentImageIndex + direction + method.images.length) % method.images.length;
  }
  updateImageOverlay();
}

export function navigateMethod(direction) {
  if (isOverviewMode) return;
  
  // Pokud je zapnutý výřez, nejdříve ho vypnout
  if (isCompareMode) {
    isCompareMode = false;
    updateImageOverlay();
    updateCompareButtonText();
    return;
  }
  
  currentMethodIndex = (currentMethodIndex + direction + currentStudy.methods.length) % currentStudy.methods.length;
  currentImageIndex = 0;
  updateImageOverlay();
}

// --- Tabulky a grafy ---
export function toggleTableGraph(imgElement, baseName, studyName) {
  const tableItem = imgElement.closest('.table-item');
  const isTable = tableItem.dataset.isTable === 'true';
  const currentIndex = parseInt(tableItem.dataset.currentIndex) || 0;
  const tables = JSON.parse(tableItem.dataset.tables || '[]');
  const graphs = JSON.parse(tableItem.dataset.graphs || '[]');
  
  // Vytvořit seznam všech souborů v pořadí: tabulky, pak grafy
  const allFiles = [...tables, ...graphs];
  
  if (allFiles.length > 1) {
    // Přepnout na další soubor v cyklu
    const nextIndex = (currentIndex + 1) % allFiles.length;
    imgElement.src = '/' + allFiles[nextIndex];
    tableItem.dataset.currentIndex = nextIndex;
    
    // Určit typ aktuálního souboru pro zobrazení správné instrukce
    const currentFile = allFiles[nextIndex];
    const isCurrentTable = tables.includes(currentFile);
    tableItem.dataset.isTable = isCurrentTable.toString();
    
    // Aktualizovat instrukci
    const instructionDiv = tableItem.querySelector('div');
    if (instructionDiv) {
      if (isCurrentTable) {
        instructionDiv.textContent = 'Klikněte pro přepnutí na graf';
      } else {
        instructionDiv.textContent = 'Klikněte pro přepnutí na tabulku';
      }
    }
  }
}

export function hideTablesOverlay() {
  document.getElementById('tablesOverlay').style.display = 'none';
  showBubbles();
}

export function showTablesOverlay(studyName) {
  currentStudy = data.find(st => st.name === studyName);
  currentTableIndex = 0;
  
  if (currentStudy && currentStudy.tables && currentStudy.tables.length > 0) {
    const tablesContainer = document.querySelector('.tables-container');
    tablesContainer.innerHTML = '';
    
    // Seskupit tabulky a grafy podle základního názvu
    const groupedData = {};
    currentStudy.tables.forEach(table => {
      const filename = table.filename;
      let baseName = '';
      let type = '';
      
      if (filename.includes('_tabulka')) {
        baseName = filename.replace('_tabulka.webp', '');
        type = 'table';
      } else if (filename.includes('_graf')) {
        // Najít základní název pro graf (může být _graf, _graf1, _graf2, atd.)
        baseName = filename.replace(/_graf\d*\.webp$/, '');
        type = 'graph';
      }
      
      if (baseName) {
        if (!groupedData[baseName]) {
          groupedData[baseName] = { tables: [], graphs: [] };
        }
        if (type === 'table') {
          groupedData[baseName].tables.push(table);
        } else if (type === 'graph') {
          groupedData[baseName].graphs.push(table);
        }
      }
    });
    
    // Vytvořit elementy pro každou skupinu
    Object.keys(groupedData).forEach(baseName => {
      const group = groupedData[baseName];
      const tableItem = document.createElement('div');
      tableItem.className = 'table-item';
      
      // Zobrazit první tabulku, pokud existuje
      const displayTable = group.tables.length > 0 ? group.tables[0] : group.graphs[0];
      const hasGraphs = group.graphs.length > 0;
      const hasTables = group.tables.length > 0;
      const canToggle = hasGraphs && hasTables;
      
      tableItem.innerHTML = `
        <img src="/${displayTable.fullPath}" alt="${displayTable.filename}" 
             ${canToggle ? 'onclick="toggleTableGraph(this, \'' + baseName + '\', \'' + studyName + '\')" style="cursor: pointer;"' : ''} />
        ${canToggle ? '<div style="text-align: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Klikněte pro přepnutí na graf</div>' : ''}
      `;
      
      // Uložit data pro přepínání
      tableItem.dataset.baseName = baseName;
      tableItem.dataset.studyName = studyName;
      tableItem.dataset.currentIndex = '0';
      tableItem.dataset.isTable = 'true';
      tableItem.dataset.tables = JSON.stringify(group.tables.map(t => t.fullPath));
      tableItem.dataset.graphs = JSON.stringify(group.graphs.map(g => g.fullPath));
      
      tablesContainer.appendChild(tableItem);
    });
    
    // Aktualizuj indikátor s názvem studie
    document.getElementById('tablesIndicator').textContent = `${studyName} - Grafy a metriky`;
    
    document.getElementById('tablesOverlay').style.display = 'block';
    if (window.innerWidth <= 768) hideBubbles();
  }
}

// --- Bubliny a mobilní toggle ---
export function setupMobileBubbleToggle(bubbleClass, contentClass) {
  document.querySelectorAll(bubbleClass).forEach(bubble => {
    const content = bubble.querySelector(contentClass);
    const icon = bubble.querySelector('.bubble-icon');
    if (icon) {
      icon.removeEventListener('click', icon.mobileClickHandler);
      icon.mobileClickHandler = function(e) {
        if (window.innerWidth <= 768) {
          e.stopPropagation();
          if (content.style.display === 'block') {
            content.style.setProperty('display', 'none', 'important');
            content.style.setProperty('opacity', '0', 'important');
            content.style.setProperty('visibility', 'hidden', 'important');
          } else {
            document.querySelectorAll('.bubble-content').forEach(c => {
              c.style.setProperty('display', 'none', 'important');
              c.style.setProperty('opacity', '0', 'important');
              c.style.setProperty('visibility', 'hidden', 'important');
            });
            content.style.setProperty('display', 'block', 'important');
            content.style.setProperty('opacity', '1', 'important');
            content.style.setProperty('visibility', 'visible', 'important');
            content.style.setProperty('transform', 'translateY(0)', 'important');
          }
        }
      };
      icon.addEventListener('click', icon.mobileClickHandler);
    }
    content.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) e.stopPropagation();
    });
  });
  document.removeEventListener('click', document.mobileBubbleCloseHandler);
  document.mobileBubbleCloseHandler = function(e) {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.bubble-content').forEach(content => {
        content.style.setProperty('display', 'none', 'important');
        content.style.setProperty('opacity', '0', 'important');
        content.style.setProperty('visibility', 'hidden', 'important');
      });
    }
  };
  document.addEventListener('click', document.mobileBubbleCloseHandler);
}

export function hideBubbles() {
  document.querySelectorAll('.bubble').forEach(bubble => {
    bubble.style.display = 'none';
  });
}

export function showBubbles() {
  document.querySelectorAll('.bubble').forEach(bubble => {
    bubble.style.display = 'flex';
  });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  const studyLinks = document.querySelectorAll('.study-nav a');
  studyLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
  setupMobileBubbleToggle('.help-bubble', '.help-content');
  setupMobileBubbleToggle('.info-bubble', '.info-content');
});

window.addEventListener('beforeunload', function() {
  imageCache.clear();
  currentOverlayImages = [];
});

setInterval(cleanupMemory, 30000);

// === Zpřístupnění funkcí globálně pro onclick atributy ===
window.showOverlay = showOverlay;
window.hideOverlay = hideOverlay;
window.showImageOverlay = showImageOverlay;
window.toggleOverviewImages = toggleOverviewImages;
window.toggleMainImages = toggleMainImages;
window.hideImageOverlay = hideImageOverlay;
window.navigateImage = navigateImage;
window.navigateMethod = navigateMethod;
window.toggleTableGraph = toggleTableGraph;
window.hideTablesOverlay = hideTablesOverlay;
window.toggleCompareWithCrop = toggleCompareWithCrop;
window.updateCompareButtonText = updateCompareButtonText;
window.showTablesOverlay = showTablesOverlay;

export function toggleMainImages(studyName) {
  const study = data.find(st => st.name === studyName);
  const container = event.currentTarget;
  const images = container.querySelectorAll('.overview-image');
  const currentVisible = container.querySelector('.overview-image.visible');
  const currentIndex = Array.from(images).indexOf(currentVisible);
  const nextIndex = (currentIndex + 1) % images.length;
  
  currentVisible.classList.remove('visible');
  currentVisible.classList.add('hidden');
  images[nextIndex].classList.remove('hidden');
  images[nextIndex].classList.add('visible');
} 