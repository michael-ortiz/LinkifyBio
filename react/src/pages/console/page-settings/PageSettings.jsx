import { Container, TextField, Box, Link, Typography, IconButton, Breadcrumbs, Avatar, Modal, Slider, InputAdornment } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { updateBioInfo, deletePage, updatePageid, checkIfAliasIsAvailable, getPage } from '../../../api/admin/AdminApi';
import { GlobalContext } from '../../../context/GlobalContext';
import { Delete, ArrowBack, Close, Check } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import { uploadProfileImage } from '../../../api/admin/AdminApi';
import { useConfirm } from "material-ui-confirm";
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import CircularProgress from '@mui/material/CircularProgress';
import { validateAlias } from '../../../utils/CoreUtils';

function PageSettings() {

    const navigate = useNavigate();
    const confirm = useConfirm();

    const { state, dispatch } = useContext(GlobalContext);

    const [open, setOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState(1.0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageEditor, setImageEditor] = useState(null);
    const [name, setName] = React.useState(state.selectedPage.bioInfo.name || '');
    const [imageUrl, setImageUrl] = useState(state.selectedPage.bioInfo.imageUrl || '');
    const [pageId, setPageId] = React.useState(state.selectedPage.id || '');
    const [editingPageId, setEditingPageId] = React.useState(false);
    const [isAvailable, setIsAvailable] = React.useState(false);


    const [descriptionTitle, setDescriptionTitle] = React.useState(state.selectedPage.bioInfo.descriptionTitle || '');
    const [descriptionTitleLength, setDescriptionTitleLength] = React.useState(state.selectedPage.bioInfo.descriptionTitle.length || '');
    const [isLoading, setIsLoading] = React.useState(false);


    const openPicEditor = () => {
        setSelectedImage(null)
        setOpen(true)
    };
    const closePicEditor = () => setOpen(false);

    const setEditorRef = (editor) => (setImageEditor(editor));

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
    };

    const handleImageUpload = async () => {

        if (imageEditor) {

            const scaledImage = imageEditor.getImageScaledToCanvas().toDataURL()

            const res = await fetch(scaledImage)
            const blob = await res.blob()

            setIsLoading(true);

            uploadProfileImage(state.selectedPage.id, blob).then((data) => {
                setSelectedImage(null);
                closePicEditor();
                setImageUrl(data.imageUrl);
                setIsLoading(false)
            })
        }

    };

    const removeImage = () => {
        setImageUrl('');
        closePicEditor();
    }

    const handleZoomChange = (event, newValue) => {
        setZoom(newValue);
    };

    const handleSubmit = async () => {

        setIsLoading(true);

        updateBioInfo(state.selectedPage.id, {
            name: name,
            imageUrl: imageUrl,
            descriptionTitle: descriptionTitle,
        }).then((data) => {

            getPage(state.selectedPage.id).then((data) => {
                dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
                navigate('/console/actions');
                setIsLoading(false);
            }).catch(() =>
                setIsLoading(false)
            );

        });
    };

    const handleEditPageAlias = () => {

        setEditingPageId(editingPageId ? false : true);

    };

    const handleSubmitEditPageAlias = async () => {

        if (state.selectedPage.id !== pageId) {

            setIsLoading(true);

            if (!validateAlias(pageId)) {
                alert('This alias is invalid. Please choose another one.');
                return;
            }

            await checkIfAliasIsAvailable(pageId).then((data) => {
                if (!data.available) {
                    alert('This alias is already taken. Please choose another one.');
                    return;
                }
            });

            await updatePageid(state.selectedPage.id, pageId).then((data) => {
                dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
                setEditingPageId(editingPageId ? false : true);
                setIsLoading(false);
            });
        } else {
            setEditingPageId(editingPageId ? false : true);

        }
    };

    const isAliasAvailable = async (alias) => {

        if (alias !== '') {
            checkIfAliasIsAvailable(alias).then((data) => {
                setIsAvailable(data.available)
                return true
            }).catch(() => {
                setIsAvailable(false);
                return false
            });
        }

        return false;
    };

    const shouldShowAliasCheck = () => {
        return editingPageId && pageId !== state.selectedPage.id && pageId !== ''
    }

    const deleteLinkAction = async () => {

        confirm({ title: state.selectedPage.id, description: `Are you sure you want to delete this page? This operation is non-reversible.` })
            .then(() => {

                setIsLoading(true);

                try {
                    deletePage(state.selectedPage.id).then((data) => {
                        dispatch({ type: 'SET_SELECTED_PAGE', payload: {} });
                        navigate(`/console`)
                        setIsLoading(false);
                    });

                } catch (error) {
                    setIsLoading(false);
                    console.error('Failed to delete page:', error);
                    alert('Could not delete page. Please try again later.');
                }
            })
            .catch(() => {

            });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Header />

            <Box sx={MainBoxStyle}>

                <Box display="flex" justifyContent="left" alignItems="center">
                    <IconButton onClick={() => navigate('/console/actions')}>
                        <ArrowBack />
                    </IconButton>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/console">
                            home
                        </Link>
                        <Link underline="hover" color="inherit" href="/console/actions">
                            {state.selectedPage.id}
                        </Link>
                        <Typography color="text.primary">settings</Typography>
                    </Breadcrumbs>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <h1>Page Settings</h1>
                    <IconButton onClick={deleteLinkAction}>
                        <Delete />
                    </IconButton>
                </Box>

                <Modal
                    open={open}
                    onClose={closePicEditor}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 10,
                        p: 4,
                    }}>

                        <IconButton edge="end" color="inherit" onClick={closePicEditor} aria-label="close">
                            <Close />
                        </IconButton>

                        {selectedImage && <Dropzone
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
                        </Dropzone>}

                        {selectedImage && <Slider min={1.0} max={3.0} step={0.01} value={zoom} onChange={handleZoomChange} disabled={selectedImage == null} />}

                        {selectedImage ? <Button
                            color="tertiary"
                            size="large"
                            variant="filled"
                            onClick={handleImageUpload}
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                backgroundColor: "#000000",
                                marginTop: 4,
                                marginBottom: 4,
                                '&:hover': {
                                    backgroundColor: "#808080"
                                }
                            }}
                        >
                            Upload
                        </Button> : <div>
                            <Button
                                color="tertiary"
                                size="large"
                                variant="filled"
                                sx={{
                                    width: "100%",
                                    textAlign: "center",
                                    backgroundColor: "#000000",
                                    marginTop: 4,
                                    marginBottom: 4,
                                    '&:hover': {
                                        backgroundColor: "#808080"
                                    }
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

                            {imageUrl && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button onClick={removeImage}>Remove Picture</Button>
                            </Box>}

                        </div>}
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
                        src={imageUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            userSelect: 'none',
                            pointerEvents: 'none'
                        }}
                        draggable="false"
                    />
                    <Button variant="contained" color="primary" onClick={openPicEditor}>Edit Picture</Button>
                </Box>

                <h2>Alias</h2>

                <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
                    <TextField
                        id="alias"
                        disabled={!editingPageId}
                        label="Alias"
                        variant="outlined"
                        value={pageId}
                        onChange={(e) => {
                            setPageId(e.target.value)
                            isAliasAvailable(e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {shouldShowAliasCheck() && isAvailable ? <Check sx={{ color: 'green' }} /> : shouldShowAliasCheck() ? <Close sx={{ color: 'red' }} /> : null}
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            autoCorrect: 'none',
                            autoCapitalize: 'none',
                            autoComplete: 'none',
                        }}
                        style={{ flex: 1, marginRight: '10px' }}
                    />
                    <Button variant="contained" color="primary" onClick={editingPageId ? handleSubmitEditPageAlias : handleEditPageAlias}>{editingPageId ? "Save" : "Edit"}</Button>
                </Box>
                <h2>Details</h2>

                <form autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

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
                            setDescriptionTitle(e.target.value)
                            setDescriptionTitleLength(e.target.value.length)
                        }}
                        InputLabelProps={{ shrink: true }}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                    <Box sx={{ marginBottom: 5, width: '100%' }}>
                        <Button
                            color="tertiary"
                            size="large"
                            variant="filled"
                            sx={{
                                width: "100%", textAlign: "center", backgroundColor: "#000000", '&:hover': {
                                    backgroundColor: "#808080", // Change this to your desired highlight color
                                }
                            }}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>

    );
}

export default PageSettings;

