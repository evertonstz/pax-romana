import { MessageAbs } from '../../../core/messages/MessageAbs';
import { Devices } from '../../lib';

export type GetResponse = {
  device: Devices;
  message: MessageAbs;
};
