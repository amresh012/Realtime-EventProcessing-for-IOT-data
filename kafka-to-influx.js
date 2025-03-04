const { Kafka } = require('kafkajs');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Kafka consumer setup
const kafka = new Kafka({
  clientId: 'iot-consumer',
  brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'iot-group' });

// InfluxDB setup
const influxUrl = 'http://localhost:8086';
const influxToken = ''; // If you set up authentication, provide your token here.
const org = '';         // Your organization name (if applicable)
const bucket = 'iot_data'; // The bucket we created in our docker-compose
const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });
const writeApi = influxDB.getWriteApi(org, bucket, 's'); // 's' for seconds timestamp precision

async function run() {
  // Connect Kafka consumer
  await consumer.connect();
  await consumer.subscribe({ topic: 'sensor-data', fromBeginning: true });
  console.log('Kafka consumer connected and subscribed to sensor-data');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = message.value.toString();
      console.log(`Received Kafka message: ${msg}`);

      // Create an InfluxDB point
      const point = new Point('temperature')
        .floatField('value', parseFloat(msg))
        .timestamp(new Date());

      // Write point to InfluxDB
      try {
        writeApi.writePoint(point);
        console.log('Data written to InfluxDB');
      } catch (err) {
        console.error('Error writing to InfluxDB:', err);
      }
    },
  });
}

run().catch(console.error);
