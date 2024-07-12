import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  #loadingClass = "column-chart_loading";

  constructor(options = {}) {
    const { 
      label = '',
      link = '#',
      url = '/',
      range = { from: new Date(), to: new Date() },
      formatHeading = h => h 
    } = options; 

    this.url = new URL(url, BACKEND_URL);
    this.formatHeading = formatHeading;

    this.element = this.createElement(this.createTemplate(label, link));
    this.subElements.header = this.element.querySelector(".column-chart__header");
    this.subElements.body = this.element.querySelector(".column-chart__chart");

    this.update(range.from, range.to);
  }

  createTemplate(label, link) {
    const linkHTML = link ? `<a class="column-chart__link" href="${link}">View all</a>` : "";
    return `
            <div class="column-chart__title">Total ${label}${linkHTML}</div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header"></div>
                <div data-element="body" class="column-chart__chart"></div>
            </div>
        `;
  }

  createElement(innerHtml) {
    const el = document.createElement("div");
    el.classList.add("column-chart");
    el.innerHTML = innerHtml;
    return el;
  }

  async update(from, to) {
    this.element.classList.add(this.#loadingClass);

    this.url.searchParams.set('from', from);
    this.url.searchParams.set('to', to);

    const valuesByDays = await fetchJson(this.url);
    const values = Object.values(valuesByDays);
    const headerTotals = values.reduce((sum, n) => sum + n, 0);

    this.subElements.header.innerHTML = this.formatHeading(headerTotals);
    this.subElements.body.innerHTML = this.createChartTemplate(values);
    
    this.element.classList.remove(this.#loadingClass);
    return valuesByDays;
  }

  createChartBarTemplate(value, maxValue, scale) {
    const percent = (value / maxValue * 100).toFixed(0);
    const barHeight = Math.floor(value * scale);
    return `<div style="--value: ${barHeight}" data-tooltip="${percent}%"></div>`;
  }

  createChartTemplate(data) {
    if (data.length === 0) {
      return;
    }
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;
    return data
      .map(value => this.createChartBarTemplate(value, maxValue, scale))
      .join("");
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
