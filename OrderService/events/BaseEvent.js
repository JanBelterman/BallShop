module.exports = class BaseEvent {
    constructor(type, timestamp, body) {
      this.type = type;
      this.timestamp = timestamp;
      this.body = body;
    }
  
    get json() {
      return {
        type: this.type,
        timestamp: this.timestamp,
        body: this.body,
      };
    }
  };
  