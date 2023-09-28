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

  //get all bills
  // useEffect(() => {
  //   const apiUrl = 'http://localhost:8080/bill/';

  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setBill(result);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching menu items :', error);
  //     });
  // });

  const [occupiedTimes, setOccupiedTimes] = useState({});
  //Get current time
  // const getCurrentTime = () => {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0');
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const hours = String(now.getHours()).padStart(2, '0'); // 24-hour format
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const seconds = String(now.getSeconds()).padStart(2, '0');
  //   return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  // }

  // useEffect(() => {
  //   //Calculating from how much time the table is occupied
  //   const getOccupiedTime = (tableId) => {
  //     const currentTable = tableData.find((table) => table.id === tableId);
  //     const createdTime = currentTable.bill.createdTime;
  //     const [datePart, timePart] = createdTime.split(' ');
  //     const [day, month, year] = datePart.split('-');
  //     const [hours, minutes, seconds] = timePart.split(':');
  //     const createTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  //     const currentTime = getCurrentTime();
  //     const [currentDatePart, currentTimePart] = currentTime.split(' ');
  //     const [currentDay, currentMonth, currentYear] = currentDatePart.split('-');
  //     const [currentHours, currentMinutes, currentSeconds] = currentTimePart.split(':');
  //     const currentTimeObj = new Date(`${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}:${currentSeconds}`);
  //     const timeDifference = currentTimeObj - createTime;
  //     const totalSeconds = Math.floor(timeDifference / 1000);
  //     const hoursDiff = Math.floor(totalSeconds / 3600);
  //     const minutesDiff = Math.floor((totalSeconds % 3600) / 60);
  //     const secondsDiff = totalSeconds % 60;

  //     const formattedTime = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}:${secondsDiff.toString().padStart(2, '0')}`;

  //     return formattedTime;
  // }

  // Get current time in 12-hour format with AM/PM
  const getCurrentTime12Hr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  useEffect(() => {
    // Calculate occupied time
    const getOccupiedTime = (tableId) => {
      const currentTable = tableData.find((table) => table.id === tableId);
      if (!currentTable || !currentTable.bill || !currentTable.bill.createdTime) {
        return "Bill doesn't exist";
      }
      const createdTime = currentTable.bill.createdTime;
      // Parse createdTime
      const [datePart, timePart] = createdTime.split(' ');
      const [day, month, year] = datePart.split('-');
      const [hours, minutes, seconds, ampm] = timePart.split(/:| /); // Split on ':' or space
      // Convert hours to 24-hour format
      let hours24 = parseInt(hours, 10);
      if (ampm === 'pm' && hours24 < 12) {
        hours24 += 12;
      } else if (ampm === 'am' && hours24 === 12) {
        hours24 = 0;
      }
      const createTime = new Date(year, month - 1, day, hours24, parseInt(minutes, 10), parseInt(seconds, 10));
      // Get current time in 12-hour format with AM/PM
      const currentTime = getCurrentTime12Hr();
      const [currentDatePart, currentTimePart] = currentTime.split(' ');
      const [currentDay, currentMonth, currentYear] = currentDatePart.split('-');
      const [currentHours, currentMinutes, currentSeconds, currentAmPm] = currentTimePart.split(/:| /); // Split on ':' or space
      // Convert current hours to 24-hour format
      let currentHours24 = parseInt(currentHours, 10);
      if (currentAmPm === 'pm' && currentHours24 < 12) {
        currentHours24 += 12;
      } else if (currentAmPm === 'am' && currentHours24 === 12) {
        currentHours24 = 0;
      }
      const currentTimeObj = new Date(currentYear, currentMonth - 1, currentDay, currentHours24, parseInt(currentMinutes, 10), parseInt(currentSeconds, 10));
      // Calculate time difference in seconds
      const timeDifference = currentTimeObj - createTime;
      const totalSeconds = Math.floor(timeDifference / 1000);
      // Calculate hours, minutes, and seconds
      const hoursDiff = Math.floor(totalSeconds / 3600);
      const minutesDiff = Math.floor((totalSeconds % 3600) / 60);
      const secondsDiff = totalSeconds % 60;
      // Format the result with AM/PM
      // const amPm = currentAmPm === 'am' ? 'AM' : 'PM';
      const formattedTime = `${hoursDiff.toString().padStart(2, '0')} : ${minutesDiff.toString().padStart(2, '0')} : ${secondsDiff.toString().padStart(2, '0')}`;
      return formattedTime;
    }

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

    return () => clearInterval(intervalId);
  }, [tableData]);

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
      const successMessage = `Successfully modified ${successCount} table(s)`;
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
      const errorMessage = `Failed to modify ${errorCount} table(s)`;
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
                          {table.bill?.status === 'open' && occupiedTimes[table.id]}
                          <br />
                          {/* {table.id}
                          <br /> */}
                          {table.name}
                          <br />
                          {table.bill?.status === 'open' && (`Order Value : ${table.bill?.price}`)}
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
                  {table.bill?.status === 'open' && occupiedTimes[table.id]}
                  <br />
                  {/* {table.id}
                  <br /> */}
                  {table.name}
                  <br />
                  {table.bill?.status === 'open' && (`Order Value : ${table.bill?.price}`)}
                </Link>
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
              onChange={(e) => setNewTableName(e.target.value)}
              required
            />
            <br />
            <input
              className="formInput"
              type="text"
              placeholder="Enter Table Sequence"
              value={newTableSequence}
              onChange={(e) => setNewTableSequence(e.target.value)}
              required
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="formBtn" onClick={handleTableSubmit}>
            Add
          </Button>
          <Button className="formBtn" onClick={closeTable}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* For Editing Tables */}

      <Dialog
        fullScreen={fullScreen}
        open={isEditFormOpen}
        onClose={closeEditTable}
        className="custom-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" className="formHeading">
          {"Modify Table"}
        </DialogTitle>
        <DialogContentText>
          <input
            className="formInput"
            type="text"
            placeholder="Enter Table Name"
            value={editedTable ? editedTable.name : newTableName}
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
            type="text"
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
          <Button className="formBtn" onClick={handleEditTableSubmit}>
            {editedTable ? 'Update' : 'Add'}
          </Button>
          <Button className="formBtn" onClick={closeEditTable}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* {isEditFormOpen && (
  <form onSubmit={handleTableSubmit}>
    <input
      className="formInput"
      type="text"
      placeholder="Enter Table Name"
      value={editedTable ? editedTable.name : newTableName}
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
      type="text"
      placeholder="Enter Table Sequence"
      value={editedTable ? editedTable.sequence : newTableSequence}
      onChange={(e) =>
        editedTable
          ? setEditedTable({ ...editedTable, sequence: e.target.value })
          : setNewTableSequence(e.target.value)
      }
      required
    />
    <DialogActions>
      <Button className="formBtn" type="submit">
        {editedTable ? 'Update' : 'Add'}
      </Button>
      <Button className="formBtn" onClick={closeTable}>
        Cancel
      </Button>
    </DialogActions>
  </form>
)} */}

    </div>
  );
}

export default Tables;
