import { PaxPacket } from '../../models/Packet';
import { hexToBuffer } from '../../utils/hexToBuffer';

describe('packet.ts', () => {
  describe('PaxPacket', () => {
    it('should convert buffer to hex', () => {
      const hexPacket =
        '63d33e940e5246f4a4f891b834e3654ff20d5cb4e3d880d13a236ecb30626bec';
      const paxPacket = new PaxPacket(hexToBuffer(hexPacket));
      expect(paxPacket.toHex()).toBe(hexPacket);
    });
  });
});
