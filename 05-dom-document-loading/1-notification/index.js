export default class NotificationMessage {
  timeoutId = -1;

  constructor(message = "", {type = "success", duration = 2000} = {}) {
    this.type = type;
    this.duration = duration;
    this.message = message;
    this.element = this.createElement(this.createTemplate());
  }

  createElement(html) {
    const el = document.createElement('div');
    el.style.cssText = `--value: ${this.duration / 1000}s`;
    el.innerHTML = html;
    el.classList.value = "notification"; // keep only `notification` className
    el.classList.add(this.type);
    return el;
  }

  show(target = document.body) {
    // `target` must have only one notification element.
    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.destroy();
    }
    NotificationMessage.lastShownComponent = this;

    target.appendChild(this.element);
    this.timeoutId = setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  createTemplate() {
    return `
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
    `;
  }

  destroy() {
    this.remove();
    clearTimeout(this.timeoutId);
    NotificationMessage.lastShownComponent = null;
  }

  remove() {
    this.element.remove();
  }
}
