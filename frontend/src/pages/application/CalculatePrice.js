export default function calculateItemPrice(item, taxes, distance, zoneId) {

    let taxId = taxes.find(t => t.stateDto.id == zoneId);

    console.log(item);
    console.log(taxId.percentage);
    console.log(distance);
    console.log(item.category.taxRate);
    console.log(zoneId);
console.log("#########")

    let res = item.cost * (1 + taxId.percentage / 100) + (distance * item.category.taxRate);
    return res.toFixed(2);

};


export function recalculateItems(items, taxes, distance, zoneId) {

    items.forEach(i => {
        i.price = calculateItemPrice(i, taxes, distance, zoneId);
    });
    return items;

}

