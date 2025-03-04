const mqtt = require('mqtt');

// Connect to the broker with authentication
const client = mqtt.connect('mqtt://localhost', {
  username: 'yourusername',
  password: 'qwerty'
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sensor/temperature', (err) => {
    if (!err) {
      console.log('Subscribed to temperature topic');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}°C`);
});
