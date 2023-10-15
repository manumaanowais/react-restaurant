import React, { useState, useEffect } from 'react';
import './AddCash.css';
import Header from './Header';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
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
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const AddCash = () => {

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed) and pad with leading zero if needed
    const year = today.getFullYear(); // Get the year

    return `${day}-${month}-${year}`;
  }

  const date = getCurrentDate();

  const [notesCollectionData, setNotesCollectionData] = useState([]);
  const apiUrl = `http://localhost:8080/noteCollection/${date}`;

  //Fetch Notes Collection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNotesCollectionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl, notesCollectionData]);

  const [showForm, setShowForm] = useState(true);

  const handleToggleView = () => {
    setShowForm((prevShowForm) => !prevShowForm);
    console.log("Notes collection : ", notesCollectionData)

  };

  //For getting all notes
  const [noteData, setNoteData] = useState([]);
  useEffect(() => {
    const apiUrl = 'http://localhost:8080/noteTypes';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => {
        setNoteData(result);
      })
      .catch((error) => {
        console.error('Error fetching notes :', error);
      });
  }, [noteData])
  const noteDataLength = noteData.length;
  const [inputValues, setInputValues] = useState(Array(noteDataLength).fill(0));
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setInputValues(Array(noteDataLength).fill(0));
  }, [noteDataLength]);

  const handleInputChange = (e, index) => {
    const inputValue = e.target.value;
    if (inputValue >= 0) {
      const count = isNaN(inputValue) ? 0 : inputValue;
      const newInputValues = [...inputValues];
      newInputValues[index] = count;
      setInputValues(newInputValues);
    }
  };

  const totalValue = inputValues.reduce((total, count, index) => {
    const notes = noteData.map((note) => note.type);
    return total + notes[index] * count;
  }, 0);

  const handleAddNotesForm = () => {
    openNote();
  }

  const handleClear = () => {
    setInputValues(Array(noteData.length).fill(0));
  };

  // Form for adding notes
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const openNote = () => {
    setIsNoteOpen(true);
  };

  const closeNote = () => {
    setIsNoteOpen(false);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (newNoteName.trim() === '') {
      return;
    }

    const formData = {
      type: newNoteName
    };

    const apiUrl = 'http://localhost:8080/noteType';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('New note added:', result);
        if (result.type) {
          Swal.fire({
            icon: 'success',
            title: `${result.type} Added Successfully`,
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
            title: `${result.type} Not Added, Try Again`,
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
        console.error('Error adding new note:', error);
      });

    setNewNoteName('');
    closeNote();
  };

  //For Editing Note
  const [editedNote, setEditedNote] = useState(0);
  const [isEditNoteFormOpen, setIsEditNoteFormOpen] = useState(false);

  const openEditNote = () => {
    setIsEditNoteFormOpen(true)
  }

  const closeEditNote = () => {
    setIsEditNoteFormOpen(false)
  }

  const handleEditNote = (tId) => {
    const noteToEdit = noteData.find((note) => note.id === tId);
    console.log("Note to edit is  : ", noteToEdit)
    setEditedNote(noteToEdit);
    openEditNote();
  };

  const handleEditNoteSubmit = async (e) => {
    e.preventDefault();
    console.log("Note data : ", editedNote);

    try {
      const response = await fetch("http://localhost:8080/noteType", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedNote),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Note Modified successfully:", data);
      Swal.fire({
        icon: 'success',
        title: `Note Modified To ${editedNote.type}`,
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
      closeEditNote();
    } catch (error) {
      closeEditNote();
      console.error("Error modifying note:", error);
      const existingNote = noteData.find((note) => note.id === editedNote.id);
      console.log("Existing note : ", existingNote)
      if (existingNote) {
        Swal.fire({
          icon: 'error',
          title: `Note Already Exists`,
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
          title: `Note Was Not Modified, Try Again!`,
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
    }
  };

  //For Deleting note
  const handleDeleteNote = (noteId) => {
    const noteToDelete = noteData.find((note) => note.id === noteId);
    console.log("Note to delete: ", noteToDelete.type);

    // Show a confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `You Want To Delete Note ${noteToDelete.type}`,
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
            const response = await fetch(`http://localhost:8080/noteType/${noteId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(noteToDelete),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove the deleted item from your state
            const updatedNoteData = noteData.filter((item) => item.id !== noteId);
            setNoteData(updatedNoteData);
            console.log('Note deleted successfully: ', noteToDelete);
            Swal.fire({
              icon: 'success',
              title: `${noteToDelete.type} Removed Successfully`,
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
            const existingNoteCollection = notesCollectionData.find((note) => note.noteType.id === noteToDelete.id);
            if (existingNoteCollection) {
              Swal.fire({
                icon: 'error',
                title: `RS.${existingNoteCollection.noteType.type} Note Exists In Collection, Can Not Be Deleted`,
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
                title: `RS.${noteToDelete.type} Note Was Not Deleted, Try Again!`,
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
            console.error('Error deleting note:', error);
          }
        }
      });
  };

  const handleAddNotesCollection = () => {
    console.log("total notes : ", totalValue)
    console.log("Note data : ", noteData)
    console.log("Note Collection : ", noteCollection)

    const apiUrl = 'http://localhost:8080/noteCollection';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteCollection),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log('Note collection added successfully:', result);
        Swal.fire({
          icon: 'success',
          title: `RS.${totalValue} Added Successfully`,
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
        handleClear();
      })
      .catch((error) => {
        console.error('Error adding note collection:', error);
        Swal.fire({
          icon: 'error',
          title: `RS.${totalValue} Was Not Added, Try Again!`,
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
      });
  }

  const extractNoteCollectionData = () => {
    const noteCollectionData = [];
    for (let index = 0; index < noteData.length; index++) {
      const noteType = noteData[index];
      const qty = inputValues[index] || 0;

      if (qty > 0) {
        // Include in the collection only if qty is greater than 0
        noteCollectionData.push({
          noteType: {
            id: noteType.id,
            type: noteType.type,
          },
          qty,
          id: noteType.id,
        });
      }
    }

    return noteCollectionData;
  };

  const noteCollection = extractNoteCollectionData();


  // For table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notesCollectionData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className="add-cash">
      <Header />
      <div className='enable-button'>
        <button
          onClick={() => setShowActions(!showActions)}
          className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}
        >
          {showActions ? 'Disable Actions' : 'Enable Actions'}
        </button>
        {showActions && (
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleAddNotesForm}
          >
            Add Notes
          </button>
        )}
        {showActions && (
          <button
            type='button'
            className='btn btn-success'
            onClick={handleToggleView}
          >
            {showForm ? 'Show Notes Collection' : 'Add Collection'}
          </button>
        )}
      </div>
      {showForm && (
        <div id='notes-form' className="Cash-form-container">
          <form className="Cash-form">
            <div className="Cash-form-content">
              <h3 className="Cash-form-title">Add Cash</h3>
              <div className='Cash-form-table'>
                <table className='Cash-table'>
                  <thead>
                    <tr>
                      <th className='note-th'>Notes</th>
                      <th className='x-th'></th>
                      <th className='input-th'>Count</th>
                      <th className='total-th'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noteData.map((note, index) => (
                      <tr key={index}>
                        <td className='note-td'>{note.type}</td>
                        <td className='x-td'>X</td>
                        <td className='input-td'>
                          <input
                            className='input-td-input'
                            type="number"
                            value={inputValues[index] || 0}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </td>
                        <td className='total-td'>
                          {isNaN(inputValues[index]) ? 0 : note.type * inputValues[index]}
                        </td>
                        <td className='actions-td'>
                          {showActions && (
                            <>
                              <EditIcon className='edit-btn' onClick={(e) => { e.stopPropagation(); handleEditNote(note.id) }} />
                              <DeleteIcon
                                className="delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='total-value'>
                <b>Total Amount In Cash : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" name="bi bi-currency-rupee" viewBox="0 0 16 16">
                  <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                </svg>{totalValue}</b>
              </div>
              <div className='action-buttons'>
                <button type='button' className={`btn btn-primary ${totalValue <= 0 ? 'disabled' : ''}`} onClick={handleAddNotesCollection}>Add Collection</button>
                <button type='button' className='btn btn-primary' onClick={handleClear}>Clear All</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div id='notes-collection' className='notes-collection'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell align="center">ENTERED TIME</StyledTableCell> */}
                  <StyledTableCell align="center">NOTE</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">TOTAL</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  (rowsPerPage > 0
                    ? notesCollectionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : notesCollectionData
                  ).map((noteData) => (
                    <StyledTableRow key={noteData.noteType.id}>
                      {/* <StyledTableCell align="center">{noteData.createdTime.toUpperCase()}</StyledTableCell> */}
                      <StyledTableCell align="center">{noteData.noteType.type}</StyledTableCell>
                      <StyledTableCell align="center">{noteData.qty}</StyledTableCell>
                      <StyledTableCell align="center">{(noteData.noteType.type) * (noteData.qty)}</StyledTableCell>
                    </StyledTableRow>
                  ))
                }

                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={5} />
                  </StyledTableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={notesCollectionData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* For Adding Notes */}
      <Dialog
        fullScreen={fullScreen}
        open={isNoteOpen}
        onClose={closeNote}
        className="custom-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleNoteSubmit}>
          <DialogTitle id="responsive-dialog-title" className="formHeading">
            {"Add Note"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <input
                className="formInput"
                type="number"
                placeholder="Enter Note Amount"
                value={newNoteName}
                autoFocus
                onChange={(e) => setNewNoteName(e.target.value)}
                required
              />
              <br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="formBtn" type='submit'>
              Add
            </Button>
            <Button className="formBtn" onClick={closeNote}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* For Editing Notes */}

      <Dialog
        fullScreen={fullScreen}
        open={isEditNoteFormOpen}
        onClose={closeEditNote}
        className="custom-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleEditNoteSubmit}>
          <DialogTitle id="responsive-dialog-title" className="formHeading">
            {"Modify Note"}
          </DialogTitle>
          <DialogContentText>
            <input
              className="formInput"
              type="number"
              placeholder="Enter Note Amount"
              value={editedNote.type ? editedNote.type : newNoteName}
              autoFocus
              onChange={(e) =>
                editedNote
                  ? setEditedNote({ ...editedNote, type: e.target.value })
                  : setNewNoteName(e.target.value)
              }
              required
            />
            <br />
          </DialogContentText>
          <DialogActions>
            <Button className="formBtn" type='submit'>
              {editedNote ? 'Update' : 'Add'}
            </Button>
            <Button className="formBtn" onClick={closeEditNote}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddCash;
