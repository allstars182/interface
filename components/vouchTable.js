import { useGetInvitedModalToggle } from "@contexts/Application";
import { useMemo } from "react";
import { useSortBy, useTable } from "react-table";
import Address from "./address";
import Button from "./button";
import HealthBar from "./healthBar";

const VouchTable = ({
  columns = useMemo(
    () => [
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Percentage",
        accessor: "percentage",
      },
      {
        Header: "Vouched",
        accessor: "vouched",
      },
      {
        Header: "Used",
        accessor: "used",
      },
      {
        Header: "Health",
        accessor: "health",
      },
    ],
    []
  ),
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const toggleGetInvitedModal = useGetInvitedModalToggle();

  return (
    <div className="bg-white border rounded p-4 sm:p-6 h-full">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : " ⏺"}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(
                  ({ getCellProps, render, value, column: { Header } }) => {
                    let cellRenderer = render("Cell");

                    if (Header === "Address")
                      cellRenderer = <Address address={value} />;

                    if (Header === "Percentage")
                      cellRenderer = (
                        <span>
                          {Number(value).toLocaleString(undefined, {
                            style: "percent",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      );

                    if (Header === "Used" || Header === "Vouched")
                      cellRenderer = <span>{value} DAI</span>;

                    if (Header === "Health")
                      cellRenderer = <HealthBar health={value} />;

                    return <td {...getCellProps()}>{cellRenderer}</td>;
                  }
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="flex items-center flex-col my-6 md:mt-16 md:mb-12">
          <img src="/images/table-empty.svg" alt="" />
          <p className="text-lg md:text-xl text-center mt-6  mb-4 md:mb-6 max-w-md">
            You need 3 people to vouch for you
          </p>
          <Button onClick={toggleGetInvitedModal}>Get invited</Button>
        </div>
      )}
    </div>
  );
};

export default VouchTable;
