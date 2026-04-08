import { HexColorInput, HexColorPicker } from 'react-colorful';

interface Props {
    color: string;
    setColor: (color: string) => void;
}

export const ColorPicker = ({ color, setColor }: Props) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={'mt-2'}>
                <HexColorInput color={color} onChange={setColor} />
            </div>
        </div>
    );
};
