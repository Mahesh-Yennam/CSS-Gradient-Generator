/**
 * ============================================================================
 * CSS Gradient Studio & Generator — Gamility Tools
 * Standalone pure client-side multi-stop gradient engine & design studio.
 * Copyright © 2026 Gamility (All Rights Reserved)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Constants & Preset Palettes ---
  const PRESETS = [
    { name: 'Neon Cyberpunk', type: 'linear', angle: 90, stops: [{ color: '#ec4899', pos: 0 }, { color: '#8b5cf6', pos: 50 }, { color: '#06b6d4', pos: 100 }] },
    { name: 'Sunset Blaze', type: 'linear', angle: 135, stops: [{ color: '#f97316', pos: 0 }, { color: '#ef4444', pos: 50 }, { color: '#ec4899', pos: 100 }] },
    { name: 'Ocean Breeze', type: 'linear', angle: 90, stops: [{ color: '#06b6d4', pos: 0 }, { color: '#3b82f6', pos: 100 }] },
    { name: 'Purple Velvet', type: 'linear', angle: 135, stops: [{ color: '#7c3aed', pos: 0 }, { color: '#c026d3', pos: 100 }] },
    { name: 'Emerald Aurora', type: 'linear', angle: 90, stops: [{ color: '#10b981', pos: 0 }, { color: '#06b6d4', pos: 100 }] },
    { name: 'Solar Flare', type: 'linear', angle: 45, stops: [{ color: '#fbbf24', pos: 0 }, { color: '#f97316', pos: 50 }, { color: '#dc2626', pos: 100 }] },
    { name: 'Cosmic Nebula', type: 'linear', angle: 135, stops: [{ color: '#4f46e5', pos: 0 }, { color: '#7c3aed', pos: 50 }, { color: '#ec4899', pos: 100 }] },
    { name: 'Midnight Obsidian', type: 'linear', angle: 180, stops: [{ color: '#090e1a', pos: 0 }, { color: '#1e293b', pos: 50 }, { color: '#334155', pos: 100 }] },
    { name: 'Lush Forest', type: 'linear', angle: 90, stops: [{ color: '#059669', pos: 0 }, { color: '#10b981', pos: 50 }, { color: '#84cc16', pos: 100 }] },
    { name: 'Rose Gold', type: 'linear', angle: 135, stops: [{ color: '#f43f5e', pos: 0 }, { color: '#fb7185', pos: 50 }, { color: '#fda4af', pos: 100 }] },
    { name: 'Electric Blue', type: 'linear', angle: 90, stops: [{ color: '#1d4ed8', pos: 0 }, { color: '#38bdf8', pos: 100 }] },
    { name: 'Lavender Mist', type: 'linear', angle: 90, stops: [{ color: '#a855f7', pos: 0 }, { color: '#e879f9', pos: 100 }] },
    { name: 'Molten Gold', type: 'linear', angle: 45, stops: [{ color: '#d97706', pos: 0 }, { color: '#f59e0b', pos: 50 }, { color: '#fde047', pos: 100 }] },
    { name: 'Northern Lights', type: 'linear', angle: 90, stops: [{ color: '#06b6d4', pos: 0 }, { color: '#10b981', pos: 50 }, { color: '#6366f1', pos: 100 }] },
    { name: 'Candy Pop', type: 'linear', angle: 135, stops: [{ color: '#f43f5e', pos: 0 }, { color: '#a855f7', pos: 50 }, { color: '#3b82f6', pos: 100 }] },
    { name: 'Radial Flare', type: 'radial', radialShape: 'circle', radialPos: 'center', stops: [{ color: '#38bdf8', pos: 0 }, { color: '#1e1b4b', pos: 100 }] }
  ];

  // --- State ---
  let state = {
    type: 'linear', // 'linear' | 'radial' | 'conic'
    angle: 90,
    radialShape: 'circle',
    radialPos: 'center',
    conicAngle: 0,
    stops: [
      { id: 1, color: '#ec4899', pos: 0 },
      { id: 2, color: '#8b5cf6', pos: 50 },
      { id: 3, color: '#06b6d4', pos: 100 }
    ],
    selectedStopId: 1,
    activeOverlay: 'none',
    codeFormat: 'css'
  };

  let nextStopId = 4;
  let isDraggingStop = false;
  let activeDragHandle = null;
  let toastTimer = null;

  // --- DOM Elements ---
  const gradientCanvas = document.getElementById('gradient-canvas');
  const canvasOverlay = document.getElementById('canvas-overlay');
  const stopsTrackBg = document.getElementById('stops-track-bg');
  const stopsTrackContainer = document.getElementById('stops-track-container');
  const stopsHandlesHolder = document.getElementById('stops-handles-holder');
  const stopsCount = document.getElementById('stops-count');

  // Selected Stop Controls
  const selectedStopSwatch = document.getElementById('selected-stop-swatch');
  const stopColorPicker = document.getElementById('stop-color-picker');
  const stopHexInput = document.getElementById('stop-hex-input');
  const stopPosSlider = document.getElementById('stop-pos-slider');
  const stopPosInput = document.getElementById('stop-pos-input');
  const btnDeleteStop = document.getElementById('btn-delete-stop');

  // Gradient Type Controls
  const typePills = document.querySelectorAll('.type-pill');
  const paramsLinear = document.getElementById('params-linear');
  const paramsRadial = document.getElementById('params-radial');
  const paramsConic = document.getElementById('params-conic');

  // Linear Controls
  const linearAngleNumber = document.getElementById('linear-angle-number');
  const linearAngleSlider = document.getElementById('linear-angle-slider');
  const aimButtons = document.querySelectorAll('.aim-btn');

  // Radial Controls
  const radialShapeSelect = document.getElementById('radial-shape-select');
  const radialPosSelect = document.getElementById('radial-pos-select');

  // Conic Controls
  const conicAngleNumber = document.getElementById('conic-angle-number');
  const conicAngleSlider = document.getElementById('conic-angle-slider');

  // Code Display
  const codeOutputText = document.getElementById('code-output-text');
  const codePills = document.querySelectorAll('.code-pill');
  const btnCopyCode = document.getElementById('btn-copy-code');

  // Canvas Header Actions
  const overlayPills = document.querySelectorAll('.overlay-pill');
  const btnRandomGradient = document.getElementById('btn-random-gradient');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const presetCardsGrid = document.getElementById('preset-cards-grid');

  // Toast
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // --- CSS Generator Core ---
  function getSortedStops() {
    return [...state.stops].sort((a, b) => a.pos - b.pos);
  }

  function getStopsCssString() {
    return getSortedStops()
      .map(s => `${s.color} ${s.pos}%`)
      .join(', ');
  }

  function getFullGradientCss() {
    const stopsStr = getStopsCssString();
    switch (state.type) {
      case 'linear':
        return `linear-gradient(${state.angle}deg, ${stopsStr})`;
      case 'radial':
        return `radial-gradient(${state.radialShape} at ${state.radialPos}, ${stopsStr})`;
      case 'conic':
        return `conic-gradient(from ${state.conicAngle}deg, ${stopsStr})`;
      default:
        return `linear-gradient(90deg, ${stopsStr})`;
    }
  }

  // --- Render & Update Pipeline ---
  function updateGradient() {
    const gradientCss = getFullGradientCss();

    // 1. Update main canvas background
    gradientCanvas.style.background = gradientCss;

    // 2. Update color stops track slider background (always horizontal linear)
    const trackStopsStr = getStopsCssString();
    stopsTrackBg.style.background = `linear-gradient(90deg, ${trackStopsStr})`;

    // 3. Update handles on track
    renderStopHandles();

    // 4. Update selected stop inspector
    updateSelectedStopInspector();

    // 5. Update generated code box
    updateCodeDisplay(gradientCss);

    // 6. Update stop count indicator
    stopsCount.textContent = `${state.stops.length} Stops`;
  }

  // --- Stop Handles Renderer ---
  function renderStopHandles() {
    stopsHandlesHolder.innerHTML = '';

    state.stops.forEach(stop => {
      const handle = document.createElement('div');
      handle.className = 'stop-handle';
      if (stop.id === state.selectedStopId) {
        handle.classList.add('active-stop');
      }
      handle.style.left = `${stop.pos}%`;
      handle.dataset.stopId = stop.id;

      handle.innerHTML = `
        <div class="stop-handle-marker-top"></div>
        <div class="stop-handle-pill" style="background-color: ${stop.color};"></div>
      `;

      // Select stop on click / mousedown
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        selectStop(stop.id);
        startDragging(handle, stop.id);
      });

      handle.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        selectStop(stop.id);
        startDraggingTouch(handle, stop.id);
      }, { passive: false });

      stopsHandlesHolder.appendChild(handle);
    });
  }

  function selectStop(id) {
    state.selectedStopId = id;
    renderStopHandles();
    updateSelectedStopInspector();
  }

  function getSelectedStop() {
    return state.stops.find(s => s.id === state.selectedStopId) || state.stops[0];
  }

  function updateSelectedStopInspector() {
    const stop = getSelectedStop();
    if (!stop) return;

    selectedStopSwatch.style.backgroundColor = stop.color;
    stopColorPicker.value = stop.color;
    stopHexInput.value = stop.color.toUpperCase();
    stopPosSlider.value = stop.pos;
    stopPosInput.value = stop.pos;

    // Disable delete if only 2 stops
    btnDeleteStop.disabled = state.stops.length <= 2;
    btnDeleteStop.style.opacity = state.stops.length <= 2 ? '0.4' : '1';
    btnDeleteStop.style.cursor = state.stops.length <= 2 ? 'not-allowed' : 'pointer';
  }

  // --- Drag Stop Handles Logic ---
  function startDragging(handleEl, stopId) {
    isDraggingStop = true;
    activeDragHandle = { el: handleEl, id: stopId };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!isDraggingStop || !activeDragHandle) return;
    const rect = stopsTrackContainer.getBoundingClientRect();
    let pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    pct = Math.max(0, Math.min(100, pct));

    const stop = state.stops.find(s => s.id === activeDragHandle.id);
    if (stop) {
      stop.pos = pct;
      updateGradient();
    }
  }

  function onMouseUp() {
    isDraggingStop = false;
    activeDragHandle = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function startDraggingTouch(handleEl, stopId) {
    isDraggingStop = true;
    activeDragHandle = { el: handleEl, id: stopId };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }

  function onTouchMove(e) {
    if (!isDraggingStop || !activeDragHandle || !e.touches[0]) return;
    e.preventDefault();
    const rect = stopsTrackContainer.getBoundingClientRect();
    let pct = Math.round(((e.touches[0].clientX - rect.left) / rect.width) * 100);
    pct = Math.max(0, Math.min(100, pct));

    const stop = state.stops.find(s => s.id === activeDragHandle.id);
    if (stop) {
      stop.pos = pct;
      updateGradient();
    }
  }

  function onTouchEnd() {
    isDraggingStop = false;
    activeDragHandle = null;
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  }

  // Add stop on clicking track
  stopsTrackContainer.addEventListener('click', (e) => {
    // If clicked a handle, ignore
    if (e.target.closest('.stop-handle')) return;

    const rect = stopsTrackContainer.getBoundingClientRect();
    let pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    pct = Math.max(0, Math.min(100, pct));

    // Choose interpolated or random color
    const newColor = getRandomHex();
    const newStop = {
      id: nextStopId++,
      color: newColor,
      pos: pct
    };

    state.stops.push(newStop);
    selectStop(newStop.id);
    updateGradient();
    showToast(`Added stop at ${pct}%!`);
  });

  // --- Code Export Generator ---
  function updateCodeDisplay(gradientCss) {
    let out = '';
    const fallbackColor = state.stops[0].color;

    if (state.codeFormat === 'css') {
      out = `/* Fallback color for legacy browsers */\nbackground-color: ${fallbackColor};\n\n/* Modern Gradient */\nbackground: ${gradientCss};`;
    } else if (state.codeFormat === 'inline') {
      out = `style="background: ${gradientCss};"`;
    } else if (state.codeFormat === 'svg') {
      const stopsXml = getSortedStops()
        .map(s => `  <stop offset="${s.pos}%" stop-color="${s.color}" />`)
        .join('\n');
      out = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\n  <defs>\n    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">\n${stopsXml}\n    </linearGradient>\n  </defs>\n  <rect width="100%" height="100%" fill="url(#g)" />\n</svg>`;
    }

    codeOutputText.textContent = out;
  }

  // --- Overlay Switcher ---
  function setOverlay(overlayType) {
    state.activeOverlay = overlayType;
    overlayPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.overlay === overlayType);
    });

    switch (overlayType) {
      case 'card':
        canvasOverlay.innerHTML = `
          <div class="overlay-glass-card">
            <h4>Frosted UI Card</h4>
            <p>Inspect how your vibrant gradient behaves beneath modern glassmorphic web containers.</p>
          </div>
        `;
        break;
      case 'button':
        canvasOverlay.innerHTML = `
          <div class="overlay-btn-sample">
            Get Started Now &rarr;
          </div>
        `;
        break;
      case 'text':
        canvasOverlay.innerHTML = `
          <h2 class="overlay-hero-title">
            NEXT-GEN WEB EXPERIENCES
          </h2>
        `;
        break;
      default:
        canvasOverlay.innerHTML = '';
        break;
    }
  }

  // --- Random Gradient Engine ---
  function getRandomHex() {
    const chars = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  }

  function generateRandomGradient() {
    const count = Math.random() > 0.5 ? 3 : 2;
    const newStops = [];

    if (count === 2) {
      newStops.push({ id: nextStopId++, color: getRandomHex(), pos: 0 });
      newStops.push({ id: nextStopId++, color: getRandomHex(), pos: 100 });
    } else {
      newStops.push({ id: nextStopId++, color: getRandomHex(), pos: 0 });
      newStops.push({ id: nextStopId++, color: getRandomHex(), pos: 50 });
      newStops.push({ id: nextStopId++, color: getRandomHex(), pos: 100 });
    }

    const randAngle = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, ...
    state.type = 'linear';
    state.angle = randAngle;
    state.stops = newStops;
    state.selectedStopId = newStops[0].id;

    // Update UI controls
    typePills.forEach(p => p.classList.toggle('active', p.dataset.type === 'linear'));
    paramsLinear.classList.remove('hidden');
    paramsRadial.classList.add('hidden');
    paramsConic.classList.add('hidden');
    linearAngleNumber.value = randAngle;
    linearAngleSlider.value = randAngle;

    updateGradient();
    showToast(`Generated random gradient (${randAngle}°)!`);
  }

  // --- High-Resolution PNG Exporter ---
  function downloadGradientPng() {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    const sortedStops = getSortedStops();

    if (state.type === 'linear') {
      // Calculate linear coordinates based on angle
      const rad = (state.angle - 90) * (Math.PI / 180);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.sqrt(cx * cx + cy * cy);
      const x0 = cx - Math.cos(rad) * r;
      const y0 = cy - Math.sin(rad) * r;
      const x1 = cx + Math.cos(rad) * r;
      const y1 = cy + Math.sin(rad) * r;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      sortedStops.forEach(s => grad.addColorStop(s.pos / 100, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

    } else if (state.type === 'radial') {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.max(cx, cy);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      sortedStops.forEach(s => grad.addColorStop(s.pos / 100, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

    } else {
      // Conic gradient on canvas context
      if (ctx.createConicGradient) {
        const rad = (state.conicAngle * Math.PI) / 180;
        const grad = ctx.createConicGradient(rad, canvas.width / 2, canvas.height / 2);
        sortedStops.forEach(s => grad.addColorStop(s.pos / 100, s.color));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Fallback linear
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        sortedStops.forEach(s => grad.addColorStop(s.pos / 100, s.color));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = 'gamility-gradient.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Downloaded 1920×1080 PNG wallpaper!');
  }

  // --- Render Preset Cards ---
  function renderPresetCards() {
    presetCardsGrid.innerHTML = '';

    PRESETS.forEach(preset => {
      const card = document.createElement('div');
      card.className = 'preset-card';

      const stopsStr = preset.stops.map(s => `${s.color} ${s.pos}%`).join(', ');
      let css = `linear-gradient(${preset.angle || 90}deg, ${stopsStr})`;
      if (preset.type === 'radial') {
        css = `radial-gradient(circle at center, ${stopsStr})`;
      }

      card.innerHTML = `
        <div class="preset-swatch" style="background: ${css};"></div>
        <div class="preset-info">
          <span class="preset-name">${preset.name}</span>
          <span class="preset-stops-desc">${preset.stops.length} stops</span>
        </div>
      `;

      card.addEventListener('click', () => {
        loadPreset(preset);
        showToast(`Loaded ${preset.name} preset!`);
      });

      presetCardsGrid.appendChild(card);
    });
  }

  function loadPreset(preset) {
    state.type = preset.type;
    state.stops = preset.stops.map(s => ({
      id: nextStopId++,
      color: s.color,
      pos: s.pos
    }));
    state.selectedStopId = state.stops[0].id;

    if (preset.type === 'linear') {
      state.angle = preset.angle || 90;
      linearAngleNumber.value = state.angle;
      linearAngleSlider.value = state.angle;
    }

    // Update Type Pills
    typePills.forEach(p => p.classList.toggle('active', p.dataset.type === preset.type));
    paramsLinear.classList.toggle('hidden', preset.type !== 'linear');
    paramsRadial.classList.toggle('hidden', preset.type !== 'radial');
    paramsConic.classList.toggle('hidden', preset.type !== 'conic');

    updateGradient();
  }

  // --- Toast Notification ---
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Copy failed. Please copy manually.');
    }
    document.body.removeChild(temp);
  }

  // --- Event Listeners Setup ---
  function initEvents() {
    // 1. Selected Stop Form Inputs
    stopColorPicker.addEventListener('input', (e) => {
      const stop = getSelectedStop();
      if (stop) {
        stop.color = e.target.value;
        updateGradient();
      }
    });

    stopHexInput.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        const stop = getSelectedStop();
        if (stop) {
          stop.color = val;
          updateGradient();
        }
      }
    });

    stopPosSlider.addEventListener('input', (e) => {
      const stop = getSelectedStop();
      if (stop) {
        stop.pos = parseInt(e.target.value, 10);
        updateGradient();
      }
    });

    stopPosInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 0;
      val = Math.max(0, Math.min(100, val));
      const stop = getSelectedStop();
      if (stop) {
        stop.pos = val;
        updateGradient();
      }
    });

    btnDeleteStop.addEventListener('click', () => {
      if (state.stops.length <= 2) {
        showToast('Minimum 2 color stops required.');
        return;
      }
      state.stops = state.stops.filter(s => s.id !== state.selectedStopId);
      state.selectedStopId = state.stops[0].id;
      updateGradient();
      showToast('Removed color stop.');
    });

    // 2. Type Pills Switcher
    typePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const type = pill.dataset.type;
        state.type = type;
        typePills.forEach(p => p.classList.toggle('active', p === pill));

        paramsLinear.classList.toggle('hidden', type !== 'linear');
        paramsRadial.classList.toggle('hidden', type !== 'radial');
        paramsConic.classList.toggle('hidden', type !== 'conic');

        updateGradient();
      });
    });

    // 3. Linear Angle Controls
    linearAngleSlider.addEventListener('input', (e) => {
      state.angle = parseInt(e.target.value, 10);
      linearAngleNumber.value = state.angle;
      updateGradient();
    });

    linearAngleNumber.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 0;
      val = Math.max(0, Math.min(360, val));
      state.angle = val;
      linearAngleSlider.value = val;
      updateGradient();
    });

    aimButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const deg = parseInt(btn.dataset.angle, 10);
        state.angle = deg;
        linearAngleNumber.value = deg;
        linearAngleSlider.value = deg;
        updateGradient();
        showToast(`Angle set to ${deg}°`);
      });
    });

    // 4. Radial Selects
    radialShapeSelect.addEventListener('change', () => {
      state.radialShape = radialShapeSelect.value;
      updateGradient();
    });

    radialPosSelect.addEventListener('change', () => {
      state.radialPos = radialPosSelect.value;
      updateGradient();
    });

    // 5. Conic Angle Controls
    conicAngleSlider.addEventListener('input', (e) => {
      state.conicAngle = parseInt(e.target.value, 10);
      conicAngleNumber.value = state.conicAngle;
      updateGradient();
    });

    conicAngleNumber.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 0;
      val = Math.max(0, Math.min(360, val));
      state.conicAngle = val;
      conicAngleSlider.value = val;
      updateGradient();
    });

    // 6. Code Format Pills
    codePills.forEach(pill => {
      pill.addEventListener('click', () => {
        state.codeFormat = pill.dataset.fmt;
        codePills.forEach(p => p.classList.toggle('active', p === pill));
        updateGradient();
      });
    });

    btnCopyCode.addEventListener('click', () => {
      copyToClipboard(codeOutputText.textContent, 'Code copied to clipboard!');
    });

    // 7. Overlay Pills
    overlayPills.forEach(pill => {
      pill.addEventListener('click', () => setOverlay(pill.dataset.overlay));
    });

    // 8. Random & PNG
    btnRandomGradient.addEventListener('click', generateRandomGradient);
    btnDownloadPng.addEventListener('click', downloadGradientPng);
  }

  // --- Bootstrap ---
  function initApp() {
    initEvents();
    renderPresetCards();
    updateGradient();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
