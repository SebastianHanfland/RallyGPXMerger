export const isSameStreetName = (street1: string, street2: string): boolean => {
    const elements1 = street1.split(',');
    const elements2 = street2.split(',');

    return elements2.some((e2) => elements1.includes(e2)) || elements1.some((e1) => elements2.includes(e1));
};
