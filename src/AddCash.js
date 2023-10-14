import React, { useState } from 'react';
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

const AddCash = () => {
  const [inputValues, setInputValues] = useState(Array(6).fill(0));
  const notes = [500, 200, 100, 50, 20, 10];

  const [showActions, setShowActions] = useState(false);

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
    return total + notes[index] * count;
  }, 0);

  const handleAddNotesForm = () => {
    openNote();
  }

  const handleClear = () => {
    setInputValues(Array(6).fill(0));
  };

  // Form for adding notes
  const [noteData, setNoteData] = useState([]);
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
  const [editedNote, setEditedNote] = useState(null);
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
      const response = await fetch("http://localhost:8080/note", {
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
        title: 'Note Modified',
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
      console.error("Error modifying note:", error);
    }
  };

  //For Deleting note
  const handleDeleteNote = (noteId) => {
    const noteToDelete = noteData.find((note) => note.id === noteId);
    console.log("Note to delete: ", noteToDelete.type);

    // Show a confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete note ${noteToDelete.type}`,
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
            const response = await fetch(`http://localhost:8080/note`, {
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
            console.error('Error deleting note:', error);
            Swal.fire(
              `${noteToDelete.type} cannot be deleted! Try Again`,
              'error'
            );
          }
        }
      });
  };

  const handleAddNotes = () => {

  }

  return (
    <div className="add-cash">
      <Header />
      <button
        onClick={() => setShowActions(!showActions)}
        className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}
      >
        {showActions ? 'Disable Actions' : 'Enable Actions'}
      </button>
      {showActions ? (<button type='button' className={`${showActions ? 'btn btn-primary' : 'displayNone'}`} onClick={handleAddNotesForm}>Add Notes</button>) : ('')}
      <div className="Cash-form-container">
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
                  {notes.map((note, index) => (
                    <tr key={index}>
                      <td className='note-td'>{note}</td>
                      <td className='x-td'>X</td>
                      <td className='input-td'>
                        <input
                          className='input-td-input'
                          type="number"
                          value={inputValues[index]}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </td>
                      <td className='total-td'>{note * inputValues[index]}</td>
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
              <button type='button' className='btn btn-primary' onClick={handleAddNotes}>Add Collection</button>
              <button type='button' className='btn btn-primary' onClick={handleClear}>Clear All</button>
            </div>
          </div>
        </form>
      </div>


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
              value={editedNote ? editedNote.name : newNoteName}
              autoFocus
              onChange={(e) =>
                editedNote
                  ? setEditedNote({ ...editedNote, name: e.target.value })
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
