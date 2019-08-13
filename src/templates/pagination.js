import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


const Pagination = ({ device }) => {
  const useStyles1 = makeStyles(theme => ({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(2.5),
    },
  }));

  function TablePaginationActions(props) {

    //console.log("props", props)

    const classes = useStyles1();
    const theme = useTheme();
    const count = device.result.length
    const { page, rowsPerPage, onChangePage } = props;
    //console.log(">>>>", page, rowsPerPage, onChangePage)

    function handleFirstPageButtonClick(event) {
      onChangePage(event, 0);
    }

    function handleBackButtonClick(event) {
      onChangePage(event, page - 1);
    }

    function handleNextButtonClick(event) {
      onChangePage(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }

  ////////////////////////////////////////////////
  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
  }

  const headRows = [
    { id: 'productName', numeric: false, disablePadding: false, label: 'Product name' },
    { id: 'producent', numeric: false, disablePadding: true, label: 'Producent' },
    { id: 'energyClass', numeric: false, disablePadding: true, label: 'Energy class' },
    { id: 'powerConsumption', numeric: false, disablePadding: true, label: 'Power consumption [kWh]' },
    { id: 'powerConsumptionStandby', numeric: false, disablePadding: true, label: 'Power consumption standby [kWh]' },
    { id: 'annualEnergyConsumption', numeric: false, disablePadding: true, label: 'Annual energy consumption [kWh]' },
    { id: 'noiseLevel', numeric: false, disablePadding: true, label: 'Noise level [dB]' },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          {headRows.map(row => (
            <TableCell
              key={row.id}
              align={'center'}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
                {/* {orderBy === row.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null} */}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  ///////////////////////////////////////////

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  function createData(device) {
    let data = []
    device.result.forEach((item) => {

      // if (item.deviceType === 'fridge') {

      //   if (item.powerConsumption === 'no data' && item.annualEnergyConsumption === 'no data') {
      //     data.push({
      //       productName: item.productName,
      //       producent: item.producent,
      //       energyClass: item.energyClass,
      //       powerConsumption: item.powerConsumption,
      //       powerConsumptionStandby: item.powerConsumptionStandby,
      //       annualEnergyConsumption: item.annualEnergyConsumption,
      //       noiseLevel: item.noiseLevel,
      //       deviceType: item.deviceType
      //     })

      //   }
      //   if (item.powerConsumption === 'no data' && item.annualEnergyConsumption !== 'no data') {
      //     let annualEnergyConsumptionTemp = (item.annualEnergyConsumption.split(" ", 1)[0]) / 366
      //     let annualEnergyTemp = item.annualEnergyConsumption.split(" ", 1)[0]
      //     //console.log(annualEnergyTemp)
      //     annualEnergyConsumptionTemp = Math.round(annualEnergyConsumptionTemp * 100) / 100
      //     annualEnergyConsumptionTemp = annualEnergyConsumptionTemp
      //     data.push({
      //       productName: item.productName,
      //       producent: item.producent,
      //       energyClass: item.energyClass,
      //       powerConsumption: annualEnergyConsumptionTemp,
      //       powerConsumptionStandby: item.powerConsumptionStandby,
      //       annualEnergyConsumption: annualEnergyTemp,
      //       noiseLevel: item.noiseLevel,
      //       deviceType: item.deviceType
      //     })

      //   } else {
      //     data.push({
      //       productName: item.productName,
      //       producent: item.producent,
      //       energyClass: item.energyClass,
      //       powerConsumption: item.powerConsumption,
      //       powerConsumptionStandby: item.powerConsumptionStandby,
      //       annualEnergyConsumption: item.annualEnergyConsumption,
      //       noiseLevel: item.noiseLevel,
      //       deviceType: item.deviceType
      //     })
      //   }
      // } else {
      let annualEnergyTemp
      item.annualEnergyConsumption === 'no data' ? annualEnergyTemp = 'no data' : annualEnergyTemp = item.annualEnergyConsumption.split(" ", 1)[0]
      data.push({
        productName: item.productName,
        producent: item.producent,
        energyClass: item.energyClass,
        powerConsumption: item.powerConsumption,
        powerConsumptionStandby: item.powerConsumptionStandby,
        annualEnergyConsumption: annualEnergyTemp,
        noiseLevel: item.noiseLevel,
        deviceType: item.deviceType
      })
      //}
    })
    return { data };
  }

  const rows = [
    createData(device),
  ]

  const useStyles2 = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    table: {
      minWidth: 500,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
  }));

  function CustomPaginationActionsTable() {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('powerConsumption');

    function handleRequestSort(event, property) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }

    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    function handleChangePage(event, newPage) {
      setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>

            {/* <TableHead>
              <TableRow>
                <TableCell align="center">Product name</TableCell>
                <TableCell align="center">Device type</TableCell>
                <TableCell align="center">Energy class</TableCell>
                <TableCell align="center">Power consumption</TableCell>
                <TableCell align="center">Power consumption standby</TableCell>
                <TableCell align="center">Annual energy consumption</TableCell>
                <TableCell align="center">Noise Level</TableCell>
              </TableRow>
            </TableHead> */}

            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {stableSort(rows[0].data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, k) => (
                  <TableRow id={k} >
                    <TableCell align="center">{row.productName}</TableCell>
                    <TableCell align="center">{row.producent}</TableCell>
                    <TableCell align="center">{row.energyClass}</TableCell>
                    <TableCell align="center">{row.powerConsumption}</TableCell>
                    <TableCell align="center">{row.powerConsumptionStandby}</TableCell>
                    <TableCell align="center">{row.annualEnergyConsumption}</TableCell>
                    <TableCell align="center">{row.noiseLevel}</TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  //colSpan={3}
                  count={rows[0].data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>

          </Table>
        </div>
      </Paper>
    );
  }

  return (
    TablePaginationActions,
    CustomPaginationActionsTable()
  )
}

export default Pagination