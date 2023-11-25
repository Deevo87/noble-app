import React, { useEffect, useState } from "react";
import "./winnersComponent.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { useNobelPrize } from "../../services/noblePrizesService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    cursor: "pointer",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const { loading, getRowData } = useNobelPrize();
  const { year, language } = useParams();
  const [order, setOrder] = useState("desc"); // śledzenie akutalnego kierunku sortowania
  const [orderBy, setOrderBy] = useState("category"); // śledzenie kolumny po której sortujemy
  const [rows, setRows] = useState(getRowData(year, language)); // śledzenie danych tabeli w rows

  useEffect(() => {
    if (!loading) {
      try {
        console.log(language);
        const data = getRowData(year, language);
        setRows(data);
      } catch (err) {
        throw new Error(
          `Error getting prizes from chosen year. Status: ${err.status}`
        );
      }
    }
  }, [loading, year]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSorting(property, order);
  };

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...rows].sort((a, b) => {
        console.log(sortOrder === "asc" ? 1 : -1);
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setRows(sorted);
    }
  };

  return (
    <div>
      <h1>Prizes from {year}</h1>
      <h1>To sort by certain column just click on it</h1>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Award Year</StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => handleRequestSort("category")}
              >
                Category
              </StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => handleRequestSort("dateAwarded")}
              >
                Date Awarded
              </StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => handleRequestSort("prizeAmount")}
              >
                Prize Amount
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.category}>
                <StyledTableCell component="th" scope="row">
                  {row.awardYear}
                </StyledTableCell>
                <StyledTableCell align="right">{row.category}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.dateAwarded}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.prizeAmount}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
