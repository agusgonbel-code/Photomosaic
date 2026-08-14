(() => {
  'use strict';

  function createCustomShapeController(canvas, clearButton, onChange = () => {}) {
    if (!canvas || !clearButton) throw new Error('Faltan los controles del contorno personalizado');
    const context = canvas.getContext('2d');
    let points = [], drawing = false, pointerId = null;

    function render() {
      const width = canvas.width, height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#f8fafc';
      context.fillRect(0, 0, width, height);
      context.strokeStyle = '#dbeafe';
      context.lineWidth = 1;
      for (let x = width / 8; x < width; x += width / 8) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = height / 8; y < height; y += height / 8) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }
      if (!points.length) {
        context.fillStyle = '#64748b';
        context.font = '600 28px -apple-system, BlinkMacSystemFont, sans-serif';
        context.textAlign = 'center';
        context.fillText('Dibuja aquí el contorno', width / 2, height / 2);
        return;
      }
      context.strokeStyle = '#2563eb';
      context.lineWidth = 9;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      points.forEach((point, index) => index ? context.lineTo(point.x * width, point.y * height) : context.moveTo(point.x * width, point.y * height));
      if (!drawing && points.length >= 3) context.closePath();
      context.stroke();
    }

    function pointFromEvent(event) {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
        y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
      };
    }

    canvas.addEventListener('pointerdown', event => {
      if (canvas.dataset.disabled === 'true') return;
      event.preventDefault();
      points = [pointFromEvent(event)];
      drawing = true;
      pointerId = event.pointerId;
      onChange(false);
      canvas.setPointerCapture?.(pointerId);
      render();
    });
    canvas.addEventListener('pointermove', event => {
      if (!drawing || event.pointerId !== pointerId) return;
      event.preventDefault();
      const point = pointFromEvent(event), previous = points.at(-1);
      if (Math.hypot(point.x - previous.x, point.y - previous.y) >= 0.006) {
        points.push(point);
        render();
      }
    });
    function finish(event) {
      if (!drawing || event.pointerId !== pointerId) return;
      drawing = false;
      pointerId = null;
      render();
      onChange(points.length >= 3);
    }
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
    clearButton.addEventListener('click', () => {
      points = [];
      render();
      onChange(false);
    });
    render();

    return {
      getPoints: () => points.map(point => ({ ...point })),
      hasDrawing: () => points.length >= 3,
      setDisabled(disabled) {
        canvas.dataset.disabled = String(Boolean(disabled));
        clearButton.disabled = Boolean(disabled);
      }
    };
  }

  globalThis.PhotoMosaicCustomShapeUI = { createCustomShapeController };
})();
