import React, { useState, useEffect } from 'react';
import './Tables.css';
import Header from './Header';
import { Link } from 'react-router-dom';
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
  const [bill, setBill] = useState({});

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
  useEffect(() => {
    const apiUrl = 'http://localhost:8080/bill/28';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => {
        setBill(result);
      })
      .catch((error) => {
        console.error('Error fetching menu items :', error);
      });
  });

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
      bill: bill,
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
        <button onClick={() => setDragEnabled(!dragEnabled)} className="btn">
          {dragEnabled ? 'Stop Customization' : 'Customize Tables'}
        </button>
        <button className="btn" onClick={openTable}>
          Add Table
        </button>
        {tableData.length === 0 ? (
          <p>No Tables Found</p>
        ) : dragEnabled ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tableList">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid-3-columns"
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
                          className="grid-item"
                        >
                          {table.id}
                          <br />
                          {table.name}
                          <br />
                          {table.sequence}
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
            className="grid-3-columns"
            data-margin="20"
            data-item="grid-item"
            data-lightbox="gallery"
          >
            {tableData.map((table) => (
              <Link to={`/table/${table.id}`} key={table.id} className="grid-item">
                {table.id}
                <br />
                {table.name}
                <br />
                {table.sequence}
              </Link>
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
