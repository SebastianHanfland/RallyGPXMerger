export const isSameStreetName = (street1: string | undefined, street2: string | undefined): boolean => {
    if (street1 === undefined || street2 === undefined) {
        return false;
    }
    const elements1 = street1.split(',');
    const elements2 = street2.split(',');

    return (
        elements2.some((e2) => elements1.some((e1) => e1.includes(e2))) ||
        elements1.some((e1) => elements2.some((e2) => e2.includes(e1)))
    );
};
