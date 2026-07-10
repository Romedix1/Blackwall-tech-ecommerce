import { TableSortableHeader } from '@/app/dashboard/_components/admin/table-sortable-header'

type TableHeader = {
  filters: { filter: string; text: string }[]
}

export const TableHeader = ({ filters }: TableHeader) => {
  return (
    <tr className="uppercase">
      <TableSortableHeader filter={filters[0].filter}>
        {filters[0].text}
      </TableSortableHeader>

      <TableSortableHeader filter={filters[1].filter}>
        {filters[1].text}
      </TableSortableHeader>

      <TableSortableHeader filter={filters[2].filter}>
        {filters[2].text}
      </TableSortableHeader>

      <TableSortableHeader filter={filters[3].filter}>
        {filters[3].text}
      </TableSortableHeader>

      <TableSortableHeader filter={filters[4].filter}>
        {filters[4].text}
      </TableSortableHeader>

      <th className="w-1/6 p-4">
        <span className="sr-only">Action buttons</span>
        <span aria-hidden="true">Controls</span>
      </th>
    </tr>
  )
}
