const mqtt = require('mqtt');

// Connect to the broker with authentication
const client = mqtt.connect('mqtt://localhost', {
  username: 'yourusername',
  password: '$7$101$uZ7Lmk07dFZ3wM9z$tELFsfiUezjGfxnhD28Y7dfWIWoC9ghPUg6h54WwEPq9QpJo7mKU9aZuOpwvU7thlQUpVbyispVbZQ3aZW4gSA=='
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Publish messages every 2 seconds
  setInterval(() => {
    const temperature = (Math.random() * 10 + 20).toFixed(2);
    console.log(`Publishing temperature: ${temperature}°C`);
    client.publish('sensor/temperature', temperature);
  }, 2000);
});
