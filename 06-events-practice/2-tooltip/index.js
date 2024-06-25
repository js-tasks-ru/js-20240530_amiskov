class Tooltip {
  static instance = null;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
    return Tooltip.instance;
  }

  initialize() {
    this.element = document.createElement("div");
    this.element.classList.add('tooltip');

    document.addEventListener('pointerover', this.onDocumentPointerOver);
    document.addEventListener('pointerout', this.onDocumentPointerOut);
  }

  onDocumentPointerOver = (ev) => {
    const $base = ev.target.closest('[data-tooltip]');
    if (!$base) {
      return;
    }
    this.render($base.dataset.tooltip);
    document.addEventListener("pointermove", this.onDocumentPointerMove);
  }

  onDocumentPointerOut = () => {
    this.remove();
    document.removeEventListener("pointermove", this.onDocumentPointerMove);
  }

  render(text) {
    this.element.innerHTML = text;
    document.body.appendChild(this.element);
  }

  onDocumentPointerMove = (ev) => {
    this.element.style.left = ev.clientX + 5 + "px";
    this.element.style.top = ev.clientY + 10 + "px";
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.onDocumentPointerOver);
    document.removeEventListener('pointerout', this.onDocumentPointerOut);
  }
}

export default Tooltip;
