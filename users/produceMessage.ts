import * as amqp from "amqplib";

export async function produceMessage(message: any) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
  const channel = await connection.createChannel();
  const queue = "user-events";

  await channel.assertQueue(queue);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log("Mensaje enviado:", message);

  setTimeout(() => {
    connection.close();
  }, 500);
}
