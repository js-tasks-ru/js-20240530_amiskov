export default class SortableTable {
  subElements = {
    header: null,
    body: null
  }

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();
    this.subElements.header = this.element.querySelector('.sortable-table .sortable-table__header');
    this.subElements.body = this.element.querySelector('.sortable-table .sortable-table__body');
    this.subElements.header.innerHTML = this.createHeaderTemplate();
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  sortData(field, order) {
    let fieldSortType = null;
    for (const {id, sortable, sortType} of this.headerConfig) {
      if (id === field && sortable) {
        fieldSortType = sortType;
        break; // the 1st occurrence
      }
    }
    if (!fieldSortType) {
      return;
    }

    const sortingMultiplier = order === 'desc' ? -1 : 1;
    switch (fieldSortType) {
    case "number":
      this.data.sort((a, b) => (a[field] - b[field]) * sortingMultiplier);
      break;
    case "string":
      this.data.sort((a, b) => a[field].localeCompare(
        b[field], ['ru', 'en'], {caseFirst: 'upper'}
      ) * sortingMultiplier);
      break;
    }
  }

  sort(field, order) {
    this.sortData(field, order);
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  createHeaderTemplate() {
    let headerHtml = '';
    for (const {id, sortable, title} of this.headerConfig) {
      headerHtml += `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>
      `;
    }
    return headerHtml;
  }

  createRowTemplate(rowData) {
    const defaultTemplate = (cellData) => `<div class="sortable-table__cell">${cellData}</div>`;
    let rowHtml = '';
    for (const {id, template} of this.headerConfig) {
      const rowTemplate = template ? template : defaultTemplate;
      rowHtml += rowTemplate(rowData[id]);
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

