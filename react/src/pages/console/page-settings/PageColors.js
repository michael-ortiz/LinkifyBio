import { Container, Box, Link, Typography, IconButton, Breadcrumbs, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { GlobalContext } from '../../../context/GlobalContext';
import { ArrowBack } from '@mui/icons-material';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../utils/Styles';
import CircularProgress from '@mui/material/CircularProgress';
import { DefaultPageColors } from '../../../utils/DefaultColors';
import { CirclePicker } from 'react-color';
import { ColorPickerStyle } from '../../../utils/Styles';
import { updatePageColors } from '../../../api/admin/AdminApi';

function PageColors() {

    const navigate = useNavigate();

    const { state, dispatch } = useContext(GlobalContext);

    const pageColors = state.selectedPage.pageColors || {};

    const [isLoading, setIsLoading] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState(pageColors.backgroundColor || DefaultPageColors.backgroundColor);
    const [textColor, setTextColor] = React.useState(pageColors.textColor || DefaultPageColors.textColor);
    const [buttonColor, setButtonColor] = React.useState(pageColors.buttonColor || "#000000");
    const [buttonHoverColor, setButtonHoverColor] = React.useState(pageColors.buttonHoverColor || DefaultPageColors.buttonHoverColor);
    const [buttonTextColor, setButtonTextColor] = React.useState(pageColors.buttonTextColor || DefaultPageColors.buttonTextColor);
    const [buttonLinkIconColor, setButtonLinkIconColor] = React.useState(pageColors.buttonLinkIconColor || DefaultPageColors.buttonLinkIconColor);
    const [socialIconsColor, setSocialIconsColor] = React.useState(pageColors.socialIconsColor || DefaultPageColors.socialIconsColor);


    const [showBackgroundColorPicker, setShowBackgroundColorPicker] = React.useState(false);
    const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);
    const [showButtonColorPicker, setShowButtonColorPicker] = React.useState(false);
    const [showButtonHoverColorPicker, setShowButtonHoverColorPicker] = React.useState(false);
    const [showButtonTextColorPicker, setShowButtonTextColorPicker] = React.useState(false);
    const [showButtonLinkIconColorPicker, setShowButtonLinkIconColorPicker] = React.useState(false);
    const [showSocialIconsColor, setShowSocialIconsColor] = React.useState(false);

    const defaultPickerColors = [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#607d8b",
        '#ffffff',  // White
        '#f5f5f5', // Light Gray
        '#a9a9a9', // Dark Gray
        '#808080', // Gray
        '#696969', // Dim Gray
        '#000000', // Black
    ]


    const handleSubmit = () => {

        setIsLoading(true);

        const colors = {
            backgroundColor,
            textColor,
            buttonColor,
            buttonHoverColor,
            buttonTextColor,
            buttonLinkIconColor,
            socialIconsColor
        }

        updatePageColors(state.selectedPage.id, colors).then((data) => {

            dispatch({ type: 'SET_SELECTED_PAGE', payload: data })
            navigate(`/console/actions`)
            setIsLoading(false);


        }).catch((error) => {
            console.error('Failed to update page colors:', error);
            setIsLoading(false);
        });

    }

    const buttonColorChange = (color) => {
        setButtonColor(color.hex)
        setShowButtonColorPicker(false);
    }

    const buttonHoverColorChange = (color) => {
        setButtonHoverColor(color.hex)
        setShowButtonHoverColorPicker(false);
    }

    const buttonTextColorChange = (color) => {
        setButtonTextColor(color.hex)
        setShowButtonTextColorPicker(false);
    }

    const buttonLinkIconColorChange = (color) => {
        setButtonLinkIconColor(color.hex)
        setShowButtonLinkIconColorPicker(false);
    }

    const backgroundColorChange = (color) => {
        setBackgroundColor(color.hex)
        setShowBackgroundColorPicker(false);
    }

    const textColorChange = (color) => {
        setTextColor(color.hex)
        setShowTextColorPicker(false);
    }

    const socialIconsColorChange = (color) => {
        setSocialIconsColor(color.hex)
        setShowSocialIconsColor(false);
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Container maxWidth="true">

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
                        <Typography color="text.primary">colors</Typography>
                    </Breadcrumbs>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <h1>Page Colors</h1>
                </Box>

                <p>Choose colors to customize your LinkifyBio page!</p>

                {/* Background Color  */}

                <h2>Background Color</h2>

                <Modal
                    open={showBackgroundColorPicker}
                    onClose={() => setShowBackgroundColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={backgroundColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: backgroundColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowBackgroundColorPicker(true)}>Choose</Button>
                </Box>

                {/* Text Color  */}

                <h2>Text Color</h2>

                <Modal
                    open={showTextColorPicker}
                    onClose={() => setShowTextColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={textColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: textColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowTextColorPicker(true)}>Choose</Button>
                </Box>

                {/* Button Color  */}

                <h2>Button Color</h2>

                <Modal
                    open={showButtonColorPicker}
                    onClose={() => setShowButtonColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={buttonColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: buttonColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowButtonColorPicker(true)}>Choose</Button>
                </Box>

                {/* Button Hover  */}

                <h2>Button Hover</h2>

                <Modal
                    open={showButtonHoverColorPicker}
                    onClose={() => setShowButtonHoverColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={buttonHoverColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: buttonHoverColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowButtonHoverColorPicker(true)}>Choose</Button>
                </Box>


                {/* Button Text Color  */}

                <h2>Button Text Color</h2>

                <Modal
                    open={showButtonTextColorPicker}
                    onClose={() => setShowButtonTextColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={buttonTextColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: buttonTextColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowButtonTextColorPicker(true)}>Choose</Button>
                </Box>

                {/* Button Link Icon Color  */}

                <h2>Button Link Icon Color</h2>

                <Modal
                    open={showButtonLinkIconColorPicker}
                    onClose={() => setShowButtonLinkIconColorPicker(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={buttonLinkIconColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: buttonLinkIconColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowButtonLinkIconColorPicker(true)}>Choose</Button>
                </Box>

                {/* Social Icons Color  */}

                <h2>Social Icons Color</h2>

                <Modal
                    open={showSocialIconsColor}
                    onClose={() => setShowSocialIconsColor(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={ColorPickerStyle}>
                        <center>
                            <CirclePicker colors={defaultPickerColors} onChange={socialIconsColorChange} />
                        </center>
                    </Box>
                </Modal>

                <Box display="flex" alignItems="center">
                    <Box height={50} width={'100%'} border={1} marginRight={2} sx={{ backgroundColor: socialIconsColor, borderRadius: 10, borderColor: 'lightgray' }} />
                    <Button variant="contained" onClick={() => setShowSocialIconsColor(true)}>Choose</Button>
                </Box>

                <Box display="flex" justifyContent="center">
                    <Button
                        color="tertiary"
                        size="large"
                        variant="filled"
                        sx={{
                            marginTop: 5, marginBottom: 5, width: "100%", textAlign: "center", backgroundColor: "#000000", '&:hover': {
                                backgroundColor: "#808080",
                            }
                        }}
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>

                </Box>

            </Box>
        </Container>

    );
}

export default PageColors;

