const mqtt = require('mqtt');
const { Kafka } = require('kafkajs');

// Initialize Kafka producer
const kafka = new Kafka({
  clientId: 'iot-app',
  brokers: ['localhost:9092']
});
const producer = kafka.producer();

async function initKafkaProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}

initKafkaProducer();

// Connect to MQTT broker with authentication
const mqttClient = mqtt.connect('mqtt://localhost', {
  username: 'yourusername',    // Replace with your actual username
  password: 'qwerty'     // Replace with your actual password
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('sensor/temperature', (err) => {
    if (!err) {
      console.log('Subscribed to sensor/temperature topic');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  const msg = message.toString();
  console.log(`Received MQTT message on ${topic}: ${msg}`);
  
  // Forward the received message to Kafka topic 'sensor-data'
  try {
    await producer.send({
      topic: 'sensor-data',
      messages: [
        { value: msg },
      ],
    });
    console.log('Message forwarded to Kafka topic "sensor-data"');
  } catch (err) {
    console.error('Error sending message to Kafka:', err);
  }
});
