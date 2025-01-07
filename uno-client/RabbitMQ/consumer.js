async function consumeMessages(queue) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    if (msg) {
      console.log("Received:", msg.content.toString());
      channel.ack(msg);
    }
  });
}

consumeMessages("gameEvents");
