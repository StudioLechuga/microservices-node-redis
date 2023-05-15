import { NextFunction, Request, Response } from 'express';
import { LoginUserInput } from '../schemas/user.schema';
import ampqlib, { Channel } from 'amqplib';
import { ExhangeNames } from '../queues';
import config from 'config';

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rabbitmqConfig = config.get<{
      host: string;
      port: number;
      domain: string;
      username: string;
      password: string;
    }>('rabbitmqConfig');

    const rabbitMQSettings = {
      protocol: 'amqp',
      hostname: rabbitmqConfig.domain,
      port: rabbitmqConfig.port,
      username: rabbitmqConfig.username,
      password: rabbitmqConfig.password,
      vhost: '/',
      authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
    };
    const exchangeName = ExhangeNames.LOGIN;
    const connection = await ampqlib.connect(rabbitMQSettings);
    const channel: Channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: false });
    await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(req.body)));

    res.status(200).json({
      status: 'success',
      message: 'Login user successfully',
    });
  } catch (err: any) {
    next(err);
  }
};
