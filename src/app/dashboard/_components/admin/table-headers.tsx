import { TableSortableHeader } from '@/app/dashboard/_components/admin/table-sortable-header'

type TableHeader = {
  filters: { filter: string; text: string }[]
}

export const TableHeader = ({ filters }: TableHeader) => {
  return (
    <tr className="uppercase">
      {filters.map((filter) => {
        return (
          <TableSortableHeader key={filter.filter} filter={filter.filter}>
            {filter.text}
          </TableSortableHeader>
        )
      })}

      <th className="w-1/6 p-4">
        <span className="sr-only">Action buttons</span>
        <span aria-hidden="true">Controls</span>
      </th>
    </tr>
  )
}
