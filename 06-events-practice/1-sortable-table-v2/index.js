import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1";

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.createEventListeners();
    if (sorted.id && sorted.order) {
      this.sort(sorted.id, sorted.order);
    }
  }

  sort(fieldId, order) {
    super.sort(fieldId, order);

    const $colHeader = this.subElements.header.querySelector(`[data-id="${fieldId}"]`);
    $colHeader.dataset.order = order;

    // Arrow icon.
    this.subElements.header.querySelectorAll('[data-element="arrow"]').forEach(($el) => $el.remove());
    const $arrow = document.createElement('span');
    $arrow.classList.add('sortable-table__sort-arrow');
    $arrow.dataset.element = "arrow";
    $arrow.innerHTML = `<span class="sort-arrow"></span>`;
    $colHeader.appendChild($arrow);
  }

  onHeaderPointerDown = (event) => {
    const $columnHeader = event.target.closest(".sortable-table__cell");
    const isSortable = $columnHeader && $columnHeader.dataset.sortable === "true";
    if (!isSortable) {
      return;
    }

    let sortOrder = $columnHeader.dataset.order;
    if (sortOrder === "desc") {
      sortOrder = "asc";
    } else {
      sortOrder = "desc";
    }

    this.sort($columnHeader.dataset.id, sortOrder);
  }

  createEventListeners() {
    this.subElements.header.addEventListener("pointerdown", this.onHeaderPointerDown);
  }

  removeEventListeners() {
    this.element.removeEventListener("pointerdown", this.onHeaderPointerDown);
  }

  destroy() {
    super.destroy();
    this.removeEventListeners();
  }
}