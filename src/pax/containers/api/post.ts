import { ReadAndWriteMessageAbs } from '@/pax/core/messages';

import { PaxSerial } from '../../shared/models/PaxSerial';
import { PostResponse } from './models';
import { buildPaxCryptClassFromDevice } from './utils/buildPaxCryptClassFromDevice';

export const post = (
  message: ReadAndWriteMessageAbs,
  paxSerial: PaxSerial,
): PostResponse => {
  const paxClass = buildPaxCryptClassFromDevice(paxSerial);
  const encryptedPacket = paxClass.encrypt(message.packet);

  // use this packet to send to the device via the blutooth implementation
  return { message: message.messageType, packet: encryptedPacket };
};
