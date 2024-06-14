export default class ColumnChart {
    element;
    chartHeight = 50;
    #chartElement;
    #loadingClass = "column-chart_loading";

    constructor(options = {}) {
        const { data = [] } = options;

        const elementHtml = this.createTemplate(options);
        this.element = this.createElement(elementHtml);
        this.#chartElement = this.element.querySelector(".column-chart__chart");

        this.update(data);
    }

    createTemplate({ label, link, value, formatHeading = h => h }) {
        const totalValue = formatHeading(value);
        const linkHTML = link ? `<a class="column-chart__link" href="${link}">View all</a>` : "";
        return `
            <div class="column-chart__title">Total ${label}${linkHTML}</div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${totalValue}</div>
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

    update(data) {
        if (data.length === 0) {
            this.element.classList.add(this.#loadingClass);
        } else {
            this.element.classList.remove(this.#loadingClass);
        }
        this.#chartElement.innerHTML = this.createChartTemplate(data);
    }

    createChartBarTemplate(value, maxValue, scale) {
        const percent = (value / maxValue * 100).toFixed(0);
        const barHeight = Math.floor(value * scale);
        return `<div style="--value: ${barHeight}" data-tooltip="${percent}%"></div>`
    }

    createChartTemplate(data) {
        if (data.length === 0) {
            return `<img src="./charts-skeleton.svg">`;
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
