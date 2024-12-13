interface ITableSortValue {
  column: string;
  direction: "asc" | "desc";
}

interface ITableInitialSort {
  label: string;
  value: ITableSortValue;
}

export default ITableInitialSort;
