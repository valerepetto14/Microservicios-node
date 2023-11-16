import * as amqp from "amqplib";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function consumeMessage() {
  try {
    console.log(process.env.RABBITMQ_URL);
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    const queue = "user-events";

    await channel.assertQueue(queue);

    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log("Mensaje recibido:", message.content.toString());
        channel.ack(message);
        const user = JSON.parse(message.content.toString());
        prisma.post
          .create({
            data: {
              title:
                "El usuario " +
                user.name +
                " ha sido creado y tiene el email " +
                user.email +
                ".",
              published: true,
              authorId: user.id,
            },
          })
          .then((post) => {
            console.log(post);
          });
      }
    });
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
}
