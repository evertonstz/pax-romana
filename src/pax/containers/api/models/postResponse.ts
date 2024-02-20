import { Messages } from '@/pax/shared/enums';

import { PaxEncryptedPacket } from '../../lib';

export interface PostResponse {
  message: Messages;
  packet: PaxEncryptedPacket;
}
