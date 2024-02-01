import { PaxDecryptedPacket } from '../../containers/lib';
import { Messages } from '../../shared/enums';

export abstract class MessageAbs {
  abstract readonly messageType: Messages;
  abstract readonly packet: PaxDecryptedPacket;
}
