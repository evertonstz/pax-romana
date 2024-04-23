import { PaxPairing } from '@/components/Graphics';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks';
import { BluetoothIcon } from 'lucide-react';

export interface IConnectProps {
  connect: () => Promise<void>;
}

export function Connect(props: IConnectProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-6 self-center">
      <PaxPairing
        parallax={!isMobile}
        pulsatingLightSpeed={'slow'}
        pairingAnimation
      />

      <Button onClick={() => void props.connect()} variant="secondary">
        Connect
      </Button>
      <Alert>
        <BluetoothIcon className="h-4 w-4" />
        <AlertTitle>Pairing mode</AlertTitle>
        <AlertDescription>
          Shake your device ultil you see the blue light.
        </AlertDescription>
      </Alert>
    </div>
  );
}
