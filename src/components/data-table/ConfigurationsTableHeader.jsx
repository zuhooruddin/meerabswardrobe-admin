import {
    Checkbox,
    styled,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
  } from "@mui/material";
  import UpDown from "components/icons/UpDown";
  // styled components
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    padding: "16px 20px",
    color: theme.palette.grey[900],
  })); // ----------------------------------------------------------------------
  
  // ----------------------------------------------------------------------
  const ConfigurationsTableHeader = (props) => {
    const {
      order,
      heading,
      orderBy,
      rowCount,
      numSelected,
      onRequestSort,
      onSelectAllClick = () => {},
      hideSelectBtn = false,
    } = props;
    return (
      <TableHead
        sx={{
          backgroundColor: "grey.200",
        }}
      >
        <TableRow>
          {!hideSelectBtn && (
            <StyledTableCell align="left">
              <Checkbox
                color="info"
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={(event) =>
                  onSelectAllClick(event.target.checked, "")
                }
              />
            </StyledTableCell>
          )}
  
          {heading.map((headCell) => (
            <StyledTableCell
              key={headCell.id}
              align={headCell.align}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                sx={{
                  "& .MuiTableSortLabel-icon": {
                    opacity: 1,
                  },
                }}
                IconComponent={() => (
                  <UpDown
                    sx={{
                      fontSize: 14,
                      ml: 1,
                      color: "grey.600",
                    }}
                  />
                )}
              >
                {headCell.label}
              </TableSortLabel>
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  
  export default ConfigurationsTableHeader;
  