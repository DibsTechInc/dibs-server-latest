/**
 * @param {Array<Object>} data transaction table data for open section
 * @param {string} query text filter query
 * @returns {Array<Object>} filtered table data
 */
export default function applyTransactionTableTextFilter(data, query) {
    if (!query) return data;
    const regEx = /[a-z,0-9]/i;
    const sanitizedQuery = query
        .trim()
        .split('')
        .filter((c) => regEx.test(c))
        .join('');

    const isStringOrNumber = (obj) => ['string', 'number'].includes(typeof obj);
    const mapToAlphaNumerics = (item) =>
        String(item)
            .split('')
            .filter((c) => regEx.test(c))
            .join('');

    return data.filter(({ tableRowData, expandedRowData }) => {
        const tableRowStr = tableRowData.filter(isStringOrNumber).map(mapToAlphaNumerics).join('');
        const expandedRowStr = Object.values(expandedRowData.summary.items).filter(isStringOrNumber).map(mapToAlphaNumerics).join('');
        return tableRowStr.toLowerCase().includes(sanitizedQuery) || expandedRowStr.toLowerCase().includes(sanitizedQuery);
    });
}
