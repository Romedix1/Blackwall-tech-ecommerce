export const getTableFilters = (
  mode: 'inventory' | 'directives' | 'operatives',
) => {
  switch (mode) {
    case 'inventory':
      return [
        { filter: 'id', text: 'Id' },
        { filter: 'name', text: 'Name' },
        { filter: 'category', text: 'Category' },
        { filter: 'quantity', text: 'Quantity' },
        { filter: 'price', text: 'Price' },
      ]
    case 'directives':
      return [
        { filter: 'id', text: 'Id' },
        { filter: 'fullName', text: 'Full name' },
        { filter: 'totalAmount', text: 'Total amount' },
        { filter: 'city', text: 'City' },
        { filter: 'status', text: 'Status' },
      ]
    case 'operatives':
      return [
        { filter: 'id', text: 'Id' },
        { filter: 'userName', text: 'Username' },
        { filter: 'email', text: 'Email' },
        { filter: 'city', text: 'City' },
      ]
  }
}
