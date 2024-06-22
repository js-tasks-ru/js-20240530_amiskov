export default class NotificationMessage {
  static instance = null;

  constructor(message = "", {type = "success", duration = 2000} = {}) {
    this.type = type;
    this.duration = duration;
    this.message = message;
    this.element = this.createElement(this.createTemplate());
  }

  getRootElement() {
    if (!NotificationMessage.instance) {
      NotificationMessage.instance = document.createElement('div');
    }
    return NotificationMessage.instance;
  }

  createElement(html) {
    const el = this.getRootElement();
    el.style.cssText = `--value: ${this.duration / 1000}s`;
    el.innerHTML = html;
    el.classList.value = "notification"; // keep only `notification`
    el.classList.add(this.type);
    return el;
  }

  show(target) {
    if (target) {
      target.appendChild(this.element);
    } else {
      document.body.appendChild(this.element);
    }

    clearTimeout(this.timeoutId);
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
    NotificationMessage.instance = null;
  }

  remove() {
    this.element.remove();
  }
}
