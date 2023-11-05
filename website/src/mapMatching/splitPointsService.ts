export function splitListIntoSections<T>(list: T[], maxNumberOfElements: number): T[][] {
    let listOfLists: T[][] = [];
    list.forEach((element, index) => {
        const subListIndex = Math.floor(index / maxNumberOfElements);
        if (listOfLists.length <= subListIndex) {
            listOfLists.push([]);
        }
        listOfLists[subListIndex].push(element);
    });
    return listOfLists;
}
