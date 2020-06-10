module.exports = class BaseEvent {
  constructor(type, timestamp, data) {
    this.type = type;
    this.timestamp = timestamp;
    this.data = data;
  }

  get json() {
    return {
      type: this.type,
      timestamp: this.timestamp,
      data: this.data,
    };
  }
};
