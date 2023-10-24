import { useState } from 'react';

export function TimeSlider() {
    const [range, setRange] = useState<number>(0);
    console.log(range);
    return (
        <input
            type={'range'}
            min={0}
            max={10000}
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
        />
    );
}
