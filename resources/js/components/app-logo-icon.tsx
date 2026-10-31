import type { SVGAttributes } from 'react';
import { PolluTrackSymbol } from '@/components/PolluTrackLogo';

export default function AppLogoIcon(props: SVGAttributes<SVGSVGElement>) {
    return <PolluTrackSymbol {...props} />;
}
