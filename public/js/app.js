// === Memory management ===
let imageCache = new Map();
let currentOverlayImages = [];

// === Simple queue-based state protection ===
let operationQueue = [];
let isExecuting = false;
let lastOperationTime = 0;
const MIN_OPERATION_INTERVAL = 150; // minimum time between operations

let isImageLoading = false;
let lastImageRequestId = 0;

function queueOperation(operation, key) {
  // Prevent queuing updateImageOverlay if currentStudy is null
  if (key === 'image-overlay' && typeof currentStudy !== 'undefined' && currentStudy === null) {
    return;
  }
  const now = Date.now();
  
  // Remove any existing operation with same key
  operationQueue = operationQueue.filter(op => op.key !== key);
  
  // Add new operation
  operationQueue.push({
    operation,
    key,
    timestamp: now
  });
  
  processQueue();
}

function processQueue() {
  if (isExecuting || operationQueue.length === 0) return;
  
  const now = Date.now();
  if (now - lastOperationTime < MIN_OPERATION_INTERVAL) {
    setTimeout(processQueue, MIN_OPERATION_INTERVAL - (now - lastOperationTime));
    return;
  }
  
  isExecuting = true;
  const operation = operationQueue.shift();
  
  try {
    operation.operation();
    lastOperationTime = Date.now();
  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    isExecuting = false;
    
    // Process next operation if queue not empty
    if (operationQueue.length > 0) {
      setTimeout(processQueue, MIN_OPERATION_INTERVAL);
    }
  }
}

export function cleanupMemory() {
  // Vyčistit reference na obrázky
  currentOverlayImages = [];
  
  // Vynulovat proměnné
  currentStudy = null;
  currentMethodIndex = 0;
  currentImageIndex = 0;
  currentTableIndex = 0;
  currentIndexIndex = 0;
  isOverviewMode = false;
  isCompareMode = false;
  
  // Vyčistit operace queue
  operationQueue = [];
  isExecuting = false;
  lastOperationTime = 0;
  
  if (imageCache.size > 200) imageCache.clear();
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
window.data = data;
console.log('Data loaded, studies count:', data.length);
let currentStudy = null;
let currentMethodIndex = 0;
let currentImageIndex = 0;
let currentTableIndex = 0;
let currentIndexIndex = 0;
let isOverviewMode = false;
let isCompareMode = false;
let isIndicesMode = false;

// === Indices overlay variables ===
let indicesCurrentStudy = null;
let indicesCurrentIndex = 0;
let isIndicesRGBMode = false;

// === Overlay logic ===
export function showImageOverlay(studyName, methodIndex, imageIndex) {
  const foundStudy = data.find(st => st.name === studyName);
  if (!foundStudy) return;
  if (!foundStudy.methods || !foundStudy.methods[methodIndex]) return;
  const method = foundStudy.methods[methodIndex];
  if (!method.images || !method.images[imageIndex]) return;
  currentStudy = foundStudy;
  currentMethodIndex = methodIndex;
  currentImageIndex = imageIndex;
  isOverviewMode = false;
  isCompareMode = false;
  queueOperation(() => updateImageOverlay(), 'image-overlay');
  updateNavButtonLabels();
  document.getElementById('imageOverlay').style.display = 'block';
  if (window.innerWidth <= 768) hideBubbles();
}

export function toggleOverviewImages(studyName) {
  const foundStudy = data.find(st => st.name === studyName);
  if (!foundStudy) return;
  currentStudy = foundStudy;
  currentImageIndex = 0;
  isOverviewMode = true;
  isCompareMode = false;
  queueOperation(() => updateImageOverlay(), 'image-overlay');
  updateNavButtonLabels();
  document.getElementById('imageOverlay').style.display = 'block';
  if (window.innerWidth <= 768) hideBubbles();
}

export function hideImageOverlay() {
  isImageLoading = false;
  document.getElementById('imageOverlay').style.display = 'none';
  isOverviewMode = false;
  isCompareMode = false;
  showBubbles();
}

export function toggleCompareWithCrop() {
  if (isOverviewMode) return;
  isCompareMode = !isCompareMode;
  queueOperation(() => updateImageOverlay(), 'image-overlay');
  updateCompareButtonText();
}

export function updateImageOverlay() {
  console.log('updateImageOverlay start', {currentStudy, currentMethodIndex, currentImageIndex, isImageLoading});
  if (!currentStudy) return;
  try {
    const overlayImg = document.getElementById('overlayImg');
    const imageOverlay = document.getElementById('imageOverlay');
    if (!overlayImg || !imageOverlay) return;
    let newSrc = null;
    if (isOverviewMode) {
      if (!currentStudy.overview || !currentStudy.overview[currentImageIndex]) return;
      const image = currentStudy.overview[currentImageIndex];
      newSrc = `/data/${currentStudy.name}/${image}`;
      const methodIndicator = document.getElementById('methodIndicator');
      if (methodIndicator) {
        methodIndicator.textContent = image.replace('.webp', '');
      }
      imageOverlay.classList.remove('compare-mode');
      currentOverlayImages = [newSrc];
    } else {
      if (!currentStudy.methods || !currentStudy.methods[currentMethodIndex]) return;
      const method = currentStudy.methods[currentMethodIndex];
      if (!method.images || !method.images[currentImageIndex]) return;
      const image = method.images[currentImageIndex];
      if (isCompareMode) {
        newSrc = `/data/${currentStudy.name}/vysec.webp`;
        overlayImg.alt = 'Výřez';
        imageOverlay.classList.add('compare-mode');
        currentOverlayImages = [`/${image.fullPath}`, `/data/${currentStudy.name}/vysec.webp`];
      } else {
        newSrc = `/${image.fullPath}`;
        overlayImg.alt = '';
        imageOverlay.classList.remove('compare-mode');
        currentOverlayImages = [newSrc];
      }
      let spectralType = '';
      if (image.filename.includes('_rgb')) spectralType = ' (RGB)';
      else if (image.filename.includes('_tgi')) spectralType = ' (TGI)';
      const methodIndicator = document.getElementById('methodIndicator');
      if (methodIndicator) {
        methodIndicator.textContent = `${method.name}${spectralType}`;
      }
    }
    if (newSrc) {
      isImageLoading = true;
      const thisRequestId = ++lastImageRequestId;
      const tempImg = new window.Image();
      let timeoutId = setTimeout(() => {
        if (thisRequestId === lastImageRequestId) {
          isImageLoading = false;
          console.error('Image load timeout:', {newSrc, thisRequestId, lastImageRequestId, isImageLoading});
          updateCompareButtonText();
          // Only retry if currentStudy is still valid
          if (currentStudy) {
            updateImageOverlay();
          }
        }
      }, 5000); // 5 sekund timeout

      tempImg.onload = () => {
        clearTimeout(timeoutId);
        console.log('onload', {newSrc, isImageLoading, thisRequestId, lastImageRequestId});
        if (thisRequestId === lastImageRequestId) {
          overlayImg.src = encodeURI(newSrc);
          isImageLoading = false;
          console.log('Image loaded:', newSrc);
          updateCompareButtonText();
          updateNavButtonLabels();
        }
        console.log('updateImageOverlay end', {isImageLoading});
      };
      tempImg.onerror = () => {
        clearTimeout(timeoutId);
        console.log('onerror', {newSrc, isImageLoading, thisRequestId, lastImageRequestId});
        if (thisRequestId === lastImageRequestId) {
          isImageLoading = false;
          console.error('Image failed to load:', newSrc);
          updateCompareButtonText();
        }
        console.log('updateImageOverlay end', {isImageLoading});
      };
      tempImg.src = newSrc;
    }
  } catch (error) {
    isImageLoading = false;
    console.error('updateImageOverlay error', error);
  }
}

export function updateCompareButtonText() {
  try {
    const compareButton = document.querySelector('.compare-button');
    if (compareButton) {
      const label = compareButton.querySelector('.nav-button-label');
      if (label) {
        if (isCompareMode) {
          label.textContent = 'Zobrazit metodu';
        } else {
          label.textContent = 'Zobrazit výřez';
        }
      }
    }
  } catch (error) {
    console.error('Error in updateCompareButtonText:', error);
  }
}

export function updateNavButtonLabels() {
  try {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
      const label = button.querySelector('.nav-button-label');
      if (label) {
        if (isIndicesMode) {
          if (button.onclick.toString().includes('navigateImage(-1)')) {
            label.textContent = 'Předchozí index';
          } else if (button.onclick.toString().includes('navigateImage(1)')) {
            label.textContent = 'Další index';
          } else if (button.onclick.toString().includes('navigateMethod(-1)')) {
            label.textContent = 'Předchozí metoda';
          } else if (button.onclick.toString().includes('navigateMethod(1)')) {
            label.textContent = 'Další metoda';
          }
        } else if (isOverviewMode) {
          if (button.onclick.toString().includes('navigateImage(-1)')) {
            label.textContent = 'Předchozí index';
          } else if (button.onclick.toString().includes('navigateImage(1)')) {
            label.textContent = 'Další index';
          } else if (button.onclick.toString().includes('navigateMethod(-1)')) {
            label.textContent = 'Předchozí metoda';
          } else if (button.onclick.toString().includes('navigateMethod(1)')) {
            label.textContent = 'Další metoda';
          }
        } else {
          if (button.onclick.toString().includes('navigateImage(-1)')) {
            label.textContent = 'Předchozí index';
          } else if (button.onclick.toString().includes('navigateImage(1)')) {
            label.textContent = 'Další index';
          } else if (button.onclick.toString().includes('navigateMethod(-1)')) {
            label.textContent = 'Předchozí metoda';
          } else if (button.onclick.toString().includes('navigateMethod(1)')) {
            label.textContent = 'Další metoda';
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in updateNavButtonLabels:', error);
  }
}

function getValidStudy() {
  if (currentStudy) return currentStudy;
  // Pokus o fallback na první studii z dat
  if (window.data && window.data.length > 0) {
    currentStudy = window.data[0];
    currentMethodIndex = 0;
    currentImageIndex = 0;
    console.warn('currentStudy was null, fallback to first study');
    return currentStudy;
  }
  alert('Nastala chyba: žádná platná studie není k dispozici. Načtěte stránku znovu.');
  window.location.reload();
  return null;
}

export function navigateImage(direction) {
  if (!getValidStudy()) return;
  console.log('navigateImage', {currentStudy, currentMethodIndex, currentImageIndex, isImageLoading, direction});
  if (isCompareMode) {
    isCompareMode = false;
    queueOperation(() => updateImageOverlay(), 'image-overlay');
    updateCompareButtonText();
    return;
  }
  if (isOverviewMode) {
    if (currentStudy.overview && currentStudy.overview.length > 0) {
      let newIndex = (currentImageIndex + direction + currentStudy.overview.length) % currentStudy.overview.length;
      if (newIndex < 0 || newIndex >= currentStudy.overview.length) newIndex = 0;
      currentImageIndex = newIndex;
    }
  } else {
    if (!currentStudy.methods || !currentStudy.methods[currentMethodIndex]) return;
    const method = currentStudy.methods[currentMethodIndex];
    if (method.images && method.images.length > 0) {
      let newIndex = (currentImageIndex + direction + method.images.length) % method.images.length;
      if (newIndex < 0 || newIndex >= method.images.length) newIndex = 0;
      currentImageIndex = newIndex;
    }
  }
  queueOperation(() => updateImageOverlay(), 'image-overlay');
}

export function navigateMethod(direction) {
  if (isOverviewMode || !getValidStudy()) return;
  console.log('navigateMethod', {currentStudy, currentMethodIndex, currentImageIndex, isImageLoading, direction});
  if (isCompareMode) {
    isCompareMode = false;
    queueOperation(() => updateImageOverlay(), 'image-overlay');
    updateCompareButtonText();
    return;
  }
  if (!currentStudy.methods || !currentStudy.methods.length) return;
  let newIndex = (currentMethodIndex + direction + currentStudy.methods.length) % currentStudy.methods.length;
  if (newIndex < 0 || newIndex >= currentStudy.methods.length) newIndex = 0;
  currentMethodIndex = newIndex;
  currentImageIndex = 0;
  queueOperation(() => updateImageOverlay(), 'image-overlay');
}

// --- Tabulky a grafy ---
export function toggleTableGraph(imgElement, baseName, studyName) {
  const tableItem = imgElement.closest('.table-item');
  if (!tableItem) return;
  const isTable = tableItem.dataset.isTable === 'true';
  const currentIndex = parseInt(tableItem.dataset.currentIndex) || 0;
  const tables = JSON.parse(tableItem.dataset.tables || '[]');
  const graphs = JSON.parse(tableItem.dataset.graphs || '[]');
  const allFiles = [...tables, ...graphs];
  if (allFiles.length > 1) {
    const nextIndex = (currentIndex + 1) % allFiles.length;
    imgElement.src = '/' + allFiles[nextIndex];
    tableItem.dataset.currentIndex = nextIndex;
    const currentFile = allFiles[nextIndex];
    const isCurrentTable = tables.includes(currentFile);
    tableItem.dataset.isTable = isCurrentTable.toString();
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

export function showIndicesOverlay(studyName) {
  const foundStudy = data.find(st => st.name === studyName);
  if (!foundStudy) return;
  if (!foundStudy.indices || !foundStudy.indices.length) return;
  
  indicesCurrentStudy = foundStudy;
  indicesCurrentIndex = 0;
  isIndicesRGBMode = false;
  updateIndicesOverlay();
  updateIndicesRGBButtonText();
  document.getElementById('indicesOverlay').style.display = 'block';
  if (window.innerWidth <= 768) hideBubbles();
}

export function hideIndicesOverlay() {
  document.getElementById('indicesOverlay').style.display = 'none';
  indicesCurrentStudy = null;
  indicesCurrentIndex = 0;
  isIndicesRGBMode = false;
  showBubbles();
}

export function navigateIndices(direction) {
  if (!indicesCurrentStudy || !indicesCurrentStudy.indices.length) return;
  indicesCurrentIndex = (indicesCurrentIndex + direction + indicesCurrentStudy.indices.length) % indicesCurrentStudy.indices.length;
  isIndicesRGBMode = false; // Reset RGB mode when navigating
  updateIndicesOverlay();
  updateIndicesRGBButtonText();
}

function updateIndicesOverlay() {
  if (!indicesCurrentStudy) return;
  const img = document.getElementById('indicesOverlayImg');
  const indicator = document.getElementById('indicesIndicator');
  const indicesOverlay = document.getElementById('indicesOverlay');
  
  if (isIndicesRGBMode) {
    img.src = `/data/${indicesCurrentStudy.name}/indices/rgb.webp`;
    indicator.textContent = 'RGB';
    indicesOverlay.classList.add('compare-mode');
  } else {
    const filename = indicesCurrentStudy.indices[indicesCurrentIndex];
    img.src = `/data/${indicesCurrentStudy.name}/indices/${filename}`;
    indicator.textContent = filename.replace('.webp', '');
    indicesOverlay.classList.remove('compare-mode');
  }
}

export function toggleIndicesRGB() {
  isIndicesRGBMode = !isIndicesRGBMode;
  updateIndicesOverlay();
  updateIndicesRGBButtonText();
}

export function updateIndicesRGBButtonText() {
  try {
    const compareButton = document.querySelector('#indicesOverlay .compare-button');
    if (compareButton) {
      const label = compareButton.querySelector('.nav-button-label');
      if (label) {
        if (isIndicesRGBMode) {
          label.textContent = 'Zobrazit index';
        } else {
          label.textContent = 'Zobrazit RGB';
        }
      }
    }
  } catch (error) {
    console.error('Error in updateIndicesRGBButtonText:', error);
  }
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
    const tablesIndicator = document.getElementById('tablesIndicator');
    if (tablesIndicator) tablesIndicator.textContent = '';

    // Přidej název studie nad grafy na všech zařízeních
    const tablesOverlayContent = document.querySelector('.tables-overlay-content');
    let mobileTitle = tablesOverlayContent.querySelector('.tables-mobile-title');
    if (!mobileTitle) {
      mobileTitle = document.createElement('div');
      mobileTitle.className = 'tables-mobile-title';
      tablesOverlayContent.insertBefore(mobileTitle, tablesOverlayContent.firstChild);
    }
    mobileTitle.textContent = currentStudy && currentStudy.title ? currentStudy.title : studyName;
    
    document.getElementById('tablesOverlay').style.display = 'block';
    if (window.innerWidth <= 768) hideBubbles();
  }
}

// --- Bubliny a mobilní toggle ---
export function setupMobileBubbleToggle(bubbleClass, contentClass) {
  document.querySelectorAll(bubbleClass).forEach(bubble => {
    const content = bubble.querySelector(contentClass);
    const icon = bubble.querySelector('.bubble-icon');
    if (icon && content) {
      // Remove existing handler if it exists
      if (icon.mobileClickHandler) {
        icon.removeEventListener('click', icon.mobileClickHandler);
      }
      
      // Create new handler
      icon.mobileClickHandler = function(e) {
        queueOperation(() => {
          if (window.innerWidth <= 768) {
            e.stopPropagation();
            const isVisible = content.style.display === 'block';
            
            if (isVisible) {
              content.style.setProperty('display', 'none', 'important');
              content.style.setProperty('opacity', '0', 'important');
              content.style.setProperty('visibility', 'hidden', 'important');
            } else {
              // Close all other bubbles first
              document.querySelectorAll('.bubble-content').forEach(c => {
                if (c !== content) {
                  c.style.setProperty('display', 'none', 'important');
                  c.style.setProperty('opacity', '0', 'important');
                  c.style.setProperty('visibility', 'hidden', 'important');
                }
              });
              
              // Open this bubble
              content.style.setProperty('display', 'block', 'important');
              content.style.setProperty('opacity', '1', 'important');
              content.style.setProperty('visibility', 'visible', 'important');
              content.style.setProperty('transform', 'translateY(0)', 'important');
            }
          }
        }, `bubble-toggle-${bubbleClass}`);
      };
      
      icon.addEventListener('click', icon.mobileClickHandler);
      
      // Prevent event bubbling on content clicks
      if (!content.hasClickHandler) {
        content.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) e.stopPropagation();
        });
        content.hasClickHandler = true;
      }
    }
  });
  
  // Setup global close handler with debouncing
  if (document.mobileBubbleCloseHandler) {
    document.removeEventListener('click', document.mobileBubbleCloseHandler);
  }
  
  document.mobileBubbleCloseHandler = function(e) {
    queueOperation(() => {
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.bubble-content').forEach(content => {
          content.style.setProperty('display', 'none', 'important');
          content.style.setProperty('opacity', '0', 'important');
          content.style.setProperty('visibility', 'hidden', 'important');
        });
      }
    }, 'bubble-close-global');
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
  // Clean up everything on page unload
  operationQueue = [];
  isExecuting = false;
  imageCache.clear();
  currentOverlayImages = [];
});

// Add visibility change handler to pause processing when tab is hidden
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Clear any pending operations when tab becomes hidden
    operationQueue = [];
    isExecuting = false;
  }
});

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
window.showIndicesOverlay = showIndicesOverlay;
window.hideIndicesOverlay = hideIndicesOverlay;
window.navigateIndices = navigateIndices;
window.toggleIndicesRGB = toggleIndicesRGB;
window.updateIndicesRGBButtonText = updateIndicesRGBButtonText;
window.updateNavButtonLabels = updateNavButtonLabels;

export function toggleMainImages(studyName) {
  const study = data.find(st => st.name === studyName);
  const container = event.currentTarget;
  const images = container.querySelectorAll('.overview-image');
  const currentVisible = container.querySelector('.overview-image.visible');
  if (!currentVisible || images.length <= 1) return;
  const currentIndex = Array.from(images).indexOf(currentVisible);
  const nextIndex = (currentIndex + 1) % images.length;
  currentVisible.classList.remove('visible');
  currentVisible.classList.add('hidden');
  images[nextIndex].classList.remove('hidden');
  images[nextIndex].classList.add('visible');
} 