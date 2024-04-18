import {
  Container,
  TextField,
  Box,
  Link,
  Typography,
  IconButton,
  Breadcrumbs,
  Avatar,
  Modal,
  Slider,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { createPagte } from '../../../api/admin/AdminApi';
import { GlobalContext } from '../../../context/GlobalContext';
import { ArrowBack, Close } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import { uploadProfileImage } from '../../../api/admin/AdminApi';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import CircularProgress from '@mui/material/CircularProgress';

function CreatePage() {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(GlobalContext);

  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1.0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageEditor, setImageEditor] = useState(null);
  const [id] = React.useState(state.alias);
  const [name, setName] = React.useState('');
  const [descriptionTitle, setDescriptionTitle] = React.useState('');
  const [descriptionTitleLength, setDescriptionTitleLength] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const openPicEditor = () => {
    setSelectedImage(null);
    setOpen(true);
  };
  const closePicEditor = () => setOpen(false);

  const setEditorRef = (editor) => setImageEditor(editor);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handleImageUpload = async () => {
    if (imageEditor) {
      const scaledImage = imageEditor.getImageScaledToCanvas().toDataURL();

      const res = await fetch(scaledImage);
      const blob = await res.blob();

      setIsLoading(true);

      uploadProfileImage(id, blob).then((data) => {
        setSelectedImage(data.imageUrl);
        closePicEditor();
        setIsLoading(false);
      });
    }
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    createPagte(id, name, descriptionTitle, selectedImage).then(() => {
      dispatch({ type: 'SET_DID_CREATE_PAGE', payload: true });
      setIsLoading(false);
      navigate(`/console`);
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>
      <Header />

      <Box sx={MainBoxStyle}>
        <Box display="flex" justifyContent="left" alignItems="center">
          <IconButton onClick={() => navigate('/console/page/create/alias')}>
            <ArrowBack />
          </IconButton>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/console">
              home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/console/page/create/alias"
            >
              {id}
            </Link>
            <Typography color="text.primary">create</Typography>
          </Breadcrumbs>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h1>Page Details</h1>
        </Box>

        <Modal
          open={open}
          onClose={closePicEditor}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 10,
              p: 4,
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              onClick={closePicEditor}
              aria-label="close"
            >
              <Close />
            </IconButton>

            {selectedImage && (
              <Dropzone
                onDrop={(dropped) => setSelectedImage(dropped[0])}
                noClick
                noKeyboard
                style={{ width: '250px', height: '250px' }}
              >
                {({ getRootProps, getInputProps }) => (
                  <center>
                    <Box {...getRootProps()}>
                      <AvatarEditor
                        ref={setEditorRef}
                        image={selectedImage}
                        width={250}
                        height={250}
                        color={[255, 255, 255, 0.6]}
                        scale={zoom}
                        borderRadius={360}
                      />
                      <input {...getInputProps()} />
                    </Box>
                  </center>
                )}
              </Dropzone>
            )}

            {selectedImage && (
              <Slider
                min={1.0}
                max={3.0}
                step={0.01}
                value={zoom}
                onChange={handleZoomChange}
                disabled={selectedImage == null}
              />
            )}

            {selectedImage ? (
              <Button
                color="tertiary"
                size="large"
                variant="filled"
                onClick={handleImageUpload}
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: '#000000',
                  marginTop: 4,
                  marginBottom: 4,
                  '&:hover': {
                    backgroundColor: '#808080',
                  },
                }}
              >
                Upload
              </Button>
            ) : (
              <div>
                <Button
                  color="tertiary"
                  size="large"
                  variant="filled"
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#000000',
                    marginTop: 4,
                    marginBottom: 4,
                    '&:hover': {
                      backgroundColor: '#808080',
                    },
                  }}
                  component="label"
                >
                  Choose Image
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                  />
                </Button>
              </div>
            )}
          </Box>
        </Modal>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Change this line
            justifyContent: 'center',
            alignItems: 'center', // Add this line
            margin: '20px 0',
          }}
        >
          <Avatar
            src={selectedImage || ''}
            sx={{
              width: 100,
              height: 100,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable="false"
          />
          <Button variant="contained" color="primary" onClick={openPicEditor}>
            Select Picture
          </Button>
        </Box>

        <form
          autoComplete="off"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            id="name"
            label="Display Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ width: '100%', marginBottom: '20px' }}
          />

          <TextField
            id="descriptionTitle"
            label="Bio"
            variant="outlined"
            value={descriptionTitle}
            helperText={`${descriptionTitleLength}/80`}
            onChange={(e) => {
              if (e.target.value.length > 80) return;
              setDescriptionTitle(e.target.value);
              setDescriptionTitleLength(e.target.value.length);
            }}
            InputLabelProps={{ shrink: true }}
            style={{ width: '100%', marginBottom: '20px' }}
          />

          <Button
            color="tertiary"
            size="large"
            variant="filled"
            sx={{
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#000000',
              '&:hover': {
                backgroundColor: '#808080', // Change this to your desired highlight color
              },
            }}
            onClick={handleSubmit}
          >
            Create Page
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default CreatePage;
