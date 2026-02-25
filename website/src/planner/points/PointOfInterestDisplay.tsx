import { PointOfInterest } from '../store/types.ts';

export function PointOfInterestDisplay({ pointOfInterest }: { pointOfInterest: PointOfInterest }) {
    const { title, description } = pointOfInterest;

    return (
        <tr>
            <td key={'title'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
        </tr>
    );
}
