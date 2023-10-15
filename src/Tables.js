import React, { useState, useEffect } from 'react';
import './Tables.css';
import Header from './Header';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from 'react-modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

Modal.setAppElement('#root');

function Tables() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [tableData, setTableData] = useState([]);
  const [dragEnabled, setDragEnabled] = useState(false);
  // const [bill, setBill] = useState({});
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    // Fetch data from localhost:8080/tables
    fetch('http://localhost:8080/tables')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort the data based on the 'sequence' property
          data.sort((a, b) => a.sequence - b.sequence);
          setTableData(data);
        } else {
          console.error('Fetched data is not in the expected array format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Calculate occupied time
  const [occupiedTimes, setOccupiedTimes] = useState({});
  const getOccupiedTime = (tableId) => {
    const currentTable = tableData.find((table) => table.id === tableId);
    if (!currentTable || !currentTable.bill || !currentTable.bill.createdTime) {
      console.log("Occupied Times : ", occupiedTimes)
      return "Bill doesn't exist";
    }
    const createdTime = currentTable.bill.createdTime;

    // Calculate and display the time difference
    const timeDifference = calculateTimeDifference(createdTime);
    return timeDifference;
  }

  //To render the exact occupied time on tables
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedOccupiedTimes = {};
      // Calculate occupied times for each table
      tableData.forEach((table) => {
        if (table.bill && table.bill.createdTime) {
          const occupiedTime = getOccupiedTime(table.id);
          updatedOccupiedTimes[table.id] = occupiedTime;
        }
      });
      // Update the state with the new occupied times
      setOccupiedTimes(updatedOccupiedTimes);
    }, 1000); // Update every 1000ms (1 second)
    checkAllTablesHaveBills();

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  function convertTo24HourFormat(timeString) {
    const [datePart, timePart] = timeString.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");
    let hour = parseInt(hours, 10);

    if (timeString.toLowerCase().includes("pm") && hour !== 12) {
      hour += 12;
    } else if (timeString.toLowerCase().includes("am") && hour === 12) {
      hour = 0;
    }

    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour, parseInt(minutes, 10), parseInt(seconds, 10));
  }

  function calculateTimeDifference(createdTime) {
    const currentDateTime = new Date();
    const createdDateTime = convertTo24HourFormat(createdTime);

    const timeDifferenceMilliseconds = currentDateTime - createdDateTime;

    const hoursDifference = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const secondsDifference = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000);

    return `${hoursDifference} : ${minutesDifference} : ${secondsDifference}`;
  }

  // Form for adding table
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSequence, setNewTableSequence] = useState('');

  const openTable = () => {
    setIsTableOpen(true);
  };

  const closeTable = () => {
    setIsTableOpen(false);
  };

  const handleTableSubmit = (e) => {
    e.preventDefault();
    if (newTableName.trim() === '') {
      return;
    }

    const formData = {
      name: newTableName.toUpperCase(),
      sequence: newTableSequence
    };

    const apiUrl = 'http://localhost:8080/table';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('New table added:', result);
        if (result.name) {
          Swal.fire({
            icon: 'success',
            title: `${result.name} Added Successfully`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: `${result.name} Not Added, Try Again`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error adding new table:', error);
      });

    setNewTableName('');
    setNewTableSequence('');
    closeTable();
  };

  //For Editing Table
  const [editedTable, setEditedTable] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const openEditTable = () => {
    setIsEditFormOpen(true)
  }

  const closeEditTable = () => {
    setIsEditFormOpen(false)
  }

  const handleEditTable = (tId) => {
    const tableToEdit = tableData.find((table) => table.id === tId);
    console.log("Table to edit is  : ", tableToEdit)
    setEditedTable(tableToEdit);
    openEditTable();
  };

  const handleEditTableSubmit = async (e) => {
    e.preventDefault();
    console.log("Table data : ", editedTable);

    try {
      const response = await fetch("http://localhost:8080/table", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTable),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Table Modified successfully:", data);
      Swal.fire({
        icon: 'success',
        title: 'Table Modified',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      closeEditTable();
    } catch (error) {
      console.error("Error modifying table:", error);
    }
  };

  //For Deleting Table
  const handleDeleteTable = (tableId) => {
    const tableToDelete = tableData.find((table) => table.id === tableId);
    console.log("Table to delete: ", tableToDelete);

    // Show a confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete table ${tableToDelete.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // User confirmed, proceed with deletion
            const response = await fetch(`http://localhost:8080/table`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(tableToDelete),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove the deleted item from your state
            const updatedTableData = tableData.filter((item) => item.id !== tableId);
            setTableData(updatedTableData);
            console.log('Table deleted successfully: ', tableToDelete);
            Swal.fire({
              icon: 'success',
              title: `${tableToDelete.name} Removed Successfully`,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          } catch (error) {
            console.error('Error deleting table:', error);
            Swal.fire(
              `${tableToDelete.name} cannot be deleted!`,
              `${tableToDelete.name} contains menu items or has items in an existing bill.`,
              'error'
            );
          }
        }
      });
  };

  //Get total order value
  function calculateTotalPrice(tableData) {
    let total = 0;
    for (const table of tableData) {
      if (table.bill && table.bill.price > 0) {
        total += table.bill.price;
      }
    }
    return total;
  }

  const getTotalOrdervalue = () => {
    const total = calculateTotalPrice(tableData);
    console.log(`Total Price on All Tables: ${total}`);
    Swal.fire({
      icon: 'success',
      title: `Total Order Value is RS.${total.toFixed(2)}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  // Function to handle drag-and-drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return; // Item was dropped outside of the droppable area
    }

    const reorderedTableData = [...tableData];
    const [reorderedItem] = reorderedTableData.splice(result.source?.index, 1);
    reorderedTableData.splice(result.destination.index, 0, reorderedItem);

    setTableData(reorderedTableData);

    const updatedSequence = reorderedTableData.map((table, index) => ({
      id: table.id,
      name: table.name,
      bill: table.bill,
      sequence: index + 1,
    }));

    let successCount = 0;
    let errorCount = 0;

    for (const table of updatedSequence) {
      try {
        const response = await fetch("http://localhost:8080/table", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(table),
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error("Error modifying tables:", error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      const successMessage = `Successfully Modified Tables`;
      console.log(successMessage);
      Swal.fire({
        icon: 'success',
        title: successMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    }

    if (errorCount > 0) {
      const errorMessage = `Failed To Modify Tables, Try Again`;
      console.error(errorMessage);
      Swal.fire({
        icon: 'error',
        title: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    }
  };

  //Method to check all tables are having bills or not
  const checkAllTablesHaveBills = () => {
    const allTablesHaveBills = tableData.every((table) => table.bill !== null);

    if (allTablesHaveBills && tableData.length > 0) {
      Swal.fire({
        icon: 'success',
        title: 'ALL TABLES ARE OCCUPIED',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={() => setDragEnabled(!dragEnabled)}>
          {dragEnabled ? 'Stop Customization' : 'Customize Tables'}</button>
        <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={openTable}>Add Table</button>
        <button className='btn' onClick={() => getTotalOrdervalue()}>Total Order Value</button>
        <button onClick={() => { setShowActions(!showActions); setDragEnabled(false) }} className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}>
          {showActions ? 'Disable Actions' : 'Enable Actions'}
        </button>
        {tableData.length === 0 ? (
          <p>No Tables Found</p>
        ) : dragEnabled && showActions ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tableList" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='grid-3-columns'
                  data-margin="20"
                  data-item="grid-item"
                  data-lightbox="gallery"
                >
                  {tableData.map((table, index) => (
                    <Draggable
                      key={table.id}
                      draggableId={table.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`grid-item ${table.bill?.status === 'open' ? 'occupied' : 'empty'}`}
                        >
                          {dragEnabled ? `Sequence: ${table.sequence}` : ''}
                          <br />
                          {table.bill?.status === 'open' && getOccupiedTime(table.id)}
                          <br />
                          {/* {table.id}
                          <br /> */}
                          {table.name}
                          <br />
                          {table.bill?.status === 'open' && (
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                              </svg> {table.bill?.price}
                            </div>
                          )}
                          <div className="table-actions">
                            {showActions && (
                              <>
                                <EditIcon onClick={(e) => { e.stopPropagation(); handleEditTable(table.id) }} />
                                <DeleteIcon
                                  className="delete-table-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTable(table.id);
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div
            className='grid-3-columns'
            data-margin="20"
            data-item="grid-item"
            data-lightbox="gallery"
          >
            {tableData.map((table) => (
              <div key={table.id} className={`grid-item ${table.bill?.status === 'open' ? 'occupied' : 'empty'}`}>
                <Link to={`/table/${table.id}`}>
                  {dragEnabled ? `Sequence: ${table.sequence}` : ''}
                  <br />
                  {table.bill?.status === 'open' && getOccupiedTime(table.id)}
                  <br />
                  {/* {table.id}
                  <br /> */}
                  {table.name}
                  <br />
                  {table.bill?.status === 'open' && (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" name="bi bi-currency-rupee" viewBox="0 0 16 16">
                        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                      </svg> {table.bill?.price}<br />
                    </div>
                  )}

                </Link>
                <div className="table-actions">
                  {showActions && (
                    <>
                      <EditIcon onClick={(e) => { e.stopPropagation(); handleEditTable(table.id) }} />
                      <DeleteIcon
                        className="delete-table-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table.id);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* For Adding Tables */}
      <Dialog
        fullScreen={fullScreen}
        open={isTableOpen}
        onClose={closeTable}
        className="custom-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleTableSubmit}>
          <DialogTitle id="responsive-dialog-title" className="formHeading">
            {"Add Table"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <input
                className="formInput"
                type="text"
                placeholder="Enter Table Name"
                value={newTableName}
                autoFocus
                onChange={(e) => setNewTableName(e.target.value)}
                required
              />
              <br />
              <input
                className="formInput"
                type="number"
                placeholder="Enter Table Sequence"
                value={newTableSequence}
                onChange={(e) => setNewTableSequence(e.target.value)}
                required
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="formBtn" type='submit'>
              Add
            </Button>
            <Button className="formBtn" onClick={closeTable}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* For Editing Tables */}

      <Dialog
        fullScreen={fullScreen}
        open={isEditFormOpen}
        onClose={closeEditTable}
        className="custom-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleEditTableSubmit}>
          <DialogTitle id="responsive-dialog-title" className="formHeading">
            {"Modify Table"}
          </DialogTitle>
          <DialogContentText>
            <input
              className="formInput"
              type="text"
              placeholder="Enter Table Name"
              value={editedTable ? editedTable.name : newTableName}
              autoFocus
              onChange={(e) =>
                editedTable
                  ? setEditedTable({ ...editedTable, name: e.target.value })
                  : setNewTableName(e.target.value)
              }
              required
            />
            <br />
            <input
              className="formInput"
              type="number"
              placeholder="Enter Table Sequence"
              value={editedTable ? editedTable.sequence : newTableSequence}
              onChange={(e) =>
                editedTable
                  ? setEditedTable({ ...editedTable, sequence: e.target.value })
                  : setNewTableSequence(e.target.value)
              }
              required
            />
          </DialogContentText>
          <DialogActions>
            <Button className="formBtn" type='submit'>
              {editedTable ? 'Update' : 'Add'}
            </Button>
            <Button className="formBtn" onClick={closeEditTable}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Tables;
