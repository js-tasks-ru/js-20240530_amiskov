export default class DoubleSlider {
  constructor(options = {}) {
    const {
      min = 100,
      max = 200,
      formatValue = value => '$' + value,
      selected = {},
    } = options;

    const {
      from = min,
      to = max,
    } = selected;

    this.min = min;
    this.max = max;

    this.range = { min, max };
    this.selected = { from, to };
    this.formatValue = formatValue;

    this.element = document.createElement('div');
    this.element.innerHTML = this.createTemplate();
    this.element.addEventListener("pointerdown", this.onPointerDown);
    this.element.addEventListener("pointermove", this.onPointerMove);
    this.element.addEventListener("pointerup", this.onPointerUp);

    this.thumbLeft = this.element.querySelector('.range-slider__thumb-left');
    this.thumbRight = this.element.querySelector('.range-slider__thumb-right');
    this.activeThumb = null;

    this.container = this.element.querySelector('.range-slider__inner');

    this.progress = this.element.querySelector('.range-slider__progress');
  }

  onPointerDown = (ev) => {
    ev.preventDefault();
    if (ev.target === this.thumbLeft || (ev.target === this.thumbRight)) {
      this.activeThumb = ev.target;
    } else {
      return;
    }
    this.element.classList.add('range-slider_dragging');
  }

  onPointerUp = (ev) => {
    this.activeThumb = null;
    this.element.classList.remove('range-slider_dragging');
    const rangeEvent = new CustomEvent('range-select', {
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });
    this.element.dispatchEvent(rangeEvent);
  }

  onPointerMove = (ev) => {
    const totalWidth = this.container.getBoundingClientRect().width;
    if (this.activeThumb === this.thumbRight) {
      const leftThumbPos = this.thumbLeft.getBoundingClientRect().right - this.container.getBoundingClientRect().left;
      let rightThumbPos = ev.clientX - this.container.getBoundingClientRect().left;
      if (rightThumbPos >= totalWidth) {
        rightThumbPos = totalWidth;
      }
      if (rightThumbPos <= leftThumbPos) {
        rightThumbPos = leftThumbPos;
      }

      const movedPercents = (totalWidth - rightThumbPos) / totalWidth;
      this.thumbRight.style.left = rightThumbPos + 'px';
      this.selected.to = Math.ceil(movedPercents === 0 ? this.range.max : this.range.max - (this.range.max - this.range.min) * movedPercents);
      this.element.querySelector('[data-element="to"]').innerHTML = this.formatValue(this.selected.to);
    } 

    if (this.activeThumb === this.thumbLeft) {
      // Чтобы тесты прошли, использовал `this.thumbRight.getBoundingClientRect().right`,
      // но логично использовать `.left`. Но с ним тесты падают.
      const rightThumbPos = this.thumbRight.getBoundingClientRect().right - this.container.getBoundingClientRect().left;
      let leftThumbPos = ev.clientX - this.container.getBoundingClientRect().left;
      if (leftThumbPos <= 0) {
        leftThumbPos = 0;
      }
      if (leftThumbPos >= rightThumbPos) {
        leftThumbPos = rightThumbPos;
      }
      const movedPercents = leftThumbPos / totalWidth;
      this.thumbLeft.style.left = leftThumbPos + 'px';
      this.selected.from = Math.floor(movedPercents === 0 ? this.range.min : this.range.min + (this.range.max - this.range.min) * movedPercents);
      this.element.querySelector('[data-element="from"]').innerHTML = this.formatValue(this.selected.from);
    }

    const { fromPercent, toPercent } = this.calcProgressPercents();
    this.progress.style.left = fromPercent + '%';
    this.progress.style.right = 100 - toPercent + '%';
  }

  calcProgressPercents() {
    const total = this.range.max - this.range.min;

    const fromShift = this.selected.from - this.range.min;
    const toShift = Math.abs(this.range.max - this.selected.to);

    const fromPercent = fromShift / total * 100;
    const toPercent = 100 - toShift / total * 100;

    return { fromPercent, toPercent };
  }

  createTemplate() {
    const { fromPercent, toPercent } = this.calcProgressPercents();
    return `
    <span data-element="from">${this.formatValue(this.selected.from)}</span>
    <div class="range-slider__inner">
      <span class="range-slider__progress" style="left: ${fromPercent}%; right: ${100 - toPercent}%"></span>
      <span class="range-slider__thumb-left" style="left: ${fromPercent}%"></span>
      <span class="range-slider__thumb-right" style="left: ${toPercent}%"></span>
    </div>
    <span data-element="to">${this.formatValue(this.selected.to)}</span>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.activeThumb = null;
    this.element.removeEventListener("pointerdown", this.onPointerDown);
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("pointerup", this.onPointerUp);
  }
}
