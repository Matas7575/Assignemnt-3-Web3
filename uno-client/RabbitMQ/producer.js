const amqp = require("amqplib");

async function sendMessage(queue, message) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));
  console.log("Message sent:", message);
}

sendMessage(
  "gameEvents",
  JSON.stringify({ type: "CARD_PLAYED", data: { card: "Red 5" } })
);
