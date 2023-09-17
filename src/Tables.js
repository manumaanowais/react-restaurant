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

  //Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  //Calculating from how much time the table is occupied
  const getOccupiedTime = (tableId) => {
    const currentTable = tableData.find((table) => table.id === tableId);
    const createdTime = currentTable.bill.createdTime;
    const [datePart, timePart] = createdTime.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
    const createTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    const currentTime = getCurrentTime();
    const [currentDatePart, currentTimePart] = currentTime.split(' ');
    const [currentDay, currentMonth, currentYear] = currentDatePart.split('-');
    const [currentHours, currentMinutes, currentSeconds] = currentTimePart.split(':');
    const currentTimeObj = new Date(`${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}:${currentSeconds}`);
    const timeDifference = currentTimeObj - createTime;
    const totalSeconds = Math.floor(timeDifference / 1000);
    const hoursDiff = Math.floor(totalSeconds / 3600);
    const minutesDiff = Math.floor((totalSeconds % 3600) / 60);
    const secondsDiff = totalSeconds % 60;
    const formattedTime = `${hoursDiff} : ${minutesDiff} : ${secondsDiff}`;
    return formattedTime;
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
    if (newTableName.trim() === '') {
      return;
    }

    const formData = {
      name: newTableName.toUpperCase(),
      sequence: newTableSequence,
      bill: {}
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
      })
      .catch((error) => {
        console.error('Error adding new table:', error);
      });

    setNewTableName('');
    closeTable();
  };

  //For Deleting Table

  const handleDeleteTable = (tableId) => {
    const tableToDelete = tableData.filter((table) => table.id === tableId).map((table) => table.name);
    console.log("Table to delete : ", tableToDelete);

    // // Show a confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete table ${tableToDelete}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        fetch(`http://localhost:8080/table`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Remove the deleted item from your state
            const updatedTableData = tableData.filter((item) => item.id !== tableId);
            setTableData(updatedTableData);
            console.log('Table deleted successfully: ', tableToDelete);
            Swal.fire({
              icon: 'success',
              title: `${tableToDelete} Removed Successfully`,
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
          })
          .catch((error) => {
            console.error('Error deleting table:', error);
            Swal.fire(
              `${tableToDelete} can not be deleted!`,
              `${tableToDelete} contains menu items or have items in an existing bill.`,
              'error'
            );
          });
      }
    })
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
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; // Item was dropped outside of the droppable area
    }

    const reorderedTableData = [...tableData];
    const [reorderedItem] = reorderedTableData.splice(result.source.index, 1);
    reorderedTableData.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the reordered data
    setTableData(reorderedTableData);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <button className={`btn ${showActions ? '' : 'displayNone'}`} onClick={() => setDragEnabled(!dragEnabled)}>
          {dragEnabled ? 'Stop Customization' : 'Customize Tables'}</button>
        <button className={`btn ${showActions ? '' : 'displayNone'}`} onClick={openTable}>Add Table</button>
        <button onClick={() => setShowActions(!showActions)} className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}>
          {showActions ? 'Disable Actions' : 'Enable Actions'}
        </button>
        <button className='btn' onClick={() => getTotalOrdervalue()}>Total Order Value</button>
        {tableData.length === 0 ? (
          <p>No Tables Found</p>
        ) : dragEnabled ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tableList">
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
                          className={`grid-3-columns ${table.bill?.price > 0 ? 'occupied' : 'empty'}`}
                        >
                          {table.bill?.price > 0 && (getOccupiedTime(table.id))}
                          <br />
                          {table.id}
                          <br />
                          {table.name}
                          <br />
                          {table.sequence}
                          <br />
                          {table.bill?.price > 0 && (`Order Value : ${table.bill?.price}`)}
                          {showActions && (
                            <>
                              <EditIcon onClick={(e) => e.stopPropagation()} />
                              <DeleteIcon
                                className="delete-menu-item-btn"
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
              <div key={table.id} className={`grid-item ${table.bill?.price > 0 ? 'occupied' : 'empty'}`}>
                <Link to={`/table/${table.id}`}>
                  {table.bill?.price > 0 && (getOccupiedTime(table.id))}
                  <br />
                  {table.id}
                  <br />
                  {table.name}
                  <br />
                  {table.sequence}
                  <br />
                  {table.bill?.price > 0 && (`Order Value : ${table.bill?.price}`)}
                </Link>
                {showActions && (
                  <>
                    <EditIcon onClick={(e) => e.stopPropagation()} />
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
    </div>
  );
}

export default Tables;
