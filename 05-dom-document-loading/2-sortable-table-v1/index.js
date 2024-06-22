export default class SortableTable {
  subElements = {
    header: null,
    body: null
  }
  columns = ['images', 'title', 'quantity', 'price', 'sales'];
  cellTemplates = {
    default: (cellData) => `<div class="sortable-table__cell">${cellData}</div>`,
  };

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();
    this.subElements.header = this.element.querySelector('.sortable-table .sortable-table__header');
    this.subElements.body = this.element.querySelector('.sortable-table .sortable-table__body');
    this.subElements.header.innerHTML = this.createHeaderTemplate();
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  sort(field, order) {
    const sortingMultiplier = order === 'desc' ? -1 : 1;
    if (["quantity", "price", "sales"].includes(field)) {
      this.data.sort((a, b) => (a[field] - b[field]) * sortingMultiplier);
    } else if (["title"].includes(field)) {
      this.data.sort((a, b) => a[field].localeCompare(
        b[field], ['ru', 'en'], {caseFirst: 'upper'}
      ) * sortingMultiplier);
    }
    this.subElements.body.innerHTML = this.createBodyTemplate();
    const $sortedCol = this.subElements.header.querySelector(`[data-id="${field}"]`);
    $sortedCol.dataset.order = order;
  }

  createHeaderTemplate() {
    let headerHtml = '';
    for (const {id, sortable, template, title} of this.headerConfig) {
      if (template) { // add `template` for body-cells formatting of type `id`
        this.cellTemplates[id] = template;
      }
      headerHtml += `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>
      `;
    }
    return headerHtml;
  }

  createRowTemplate(rowData) {
    let rowHtml = '';
    for (const columnId of this.columns) {
      if (!rowData[columnId]) {
        continue;
      }
      const templateId = Object.hasOwn(this.cellTemplates, columnId) ? columnId : 'default';
      rowHtml += this.cellTemplates[templateId](rowData[columnId]);
    }
    return rowHtml;
  }

  createBodyTemplate() {
    let bodyHtml = '';
    for (const rowData of this.data) {
      bodyHtml += `
        <a href="/products/${rowData.id}" class="sortable-table__row">
          ${this.createRowTemplate(rowData)}
        </a>
      `;
    }
    return bodyHtml;
  }

  createElement() {
    const $root = document.createElement('div');
    $root.dataset.element = "productsContainer";
    $root.classList.add("products-list__container");
    $root.innerHTML = `
        <div class="sortable-table">
            <div class="sortable-table__header sortable-table__row" data-element="header"></div>
            <div class="sortable-table__body" data-element="body"></div>
        </div>
      `;
    return $root;
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}

