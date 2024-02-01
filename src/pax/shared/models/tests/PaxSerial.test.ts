import { Devices } from '../../enums';
import { InvalidSerialException } from '../../exceptions';
import { PaxSerial } from '../PaxSerial';

describe('PaxSerial.ts', () => {
  const device = Devices.PAX3;
  it('should build PaxSerial with valid input', () => {
    const validSerial = 'KRZQ2NW9';
    const serialClass = new PaxSerial(validSerial, device);
    expect(serialClass.serial).toBe(validSerial);
  });
  it('should not build PaxSerial with invalid input', () => {
    const invalidSerial = 'KRZQ29';
    const serialClassBuilder = () => new PaxSerial(invalidSerial, device);
    expect(serialClassBuilder).toThrow(InvalidSerialException);
  });
});
