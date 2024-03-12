export function filterItems<T>(filterTerm: string | undefined, items: T[], getName: (item: T) => string | undefined) {
    const allFilterTerms = filterTerm?.split(',');
    console.log(filterTerm, allFilterTerms, 'filter two');
    if (!filterTerm || !allFilterTerms) {
        return items;
    } else {
        return items.filter((track) => {
            let match = false;
            allFilterTerms.forEach((term) => {
                if (term === '') {
                    return;
                }
                const matches = getName(track)
                    ?.replace(/\s/g, '')
                    .toLowerCase()
                    .includes(term.replace(/\s/g, '').toLowerCase());
                if (matches) {
                    match = true;
                }
            });
            return match;
        });
    }
}
