import { GapPoint } from '../store/types.ts';

export function GapPointDisplay({ gapPoint }: { gapPoint: GapPoint }) {
    const { title, description } = gapPoint;

    return (
        <tr>
            <td key={'key'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
        </tr>
    );
}
