import { MessageAbs } from '../../../core/messages/MessageAbs';
import { Devices } from '../../lib';

export interface GetResponse {
  device: Devices;
  message: MessageAbs;
}
