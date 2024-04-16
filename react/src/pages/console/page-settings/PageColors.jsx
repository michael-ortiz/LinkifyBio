import {
    Container,
    Box,
    Link,
    Typography,
    IconButton,
    Breadcrumbs,
    Modal,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material-next/Button";
import { GlobalContext } from "../../../context/GlobalContext";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../../components/Header";
import { MainBoxStyle } from "../../../constants/Styles";
import CircularProgress from "@mui/material/CircularProgress";
import {
    ColorPickerState,
    DefaultPageColors,
} from "../../../constants/DefaultColors";
import { CirclePicker } from "react-color";
import { ColorPickerStyle } from "../../../constants/Styles";
import { updatePageColors } from "../../../api/admin/AdminApi";
import { DefaultColorPickerColors } from "../../../constants/Colors";

function PageColors() {
    const navigate = useNavigate();

    const { state, dispatch } = useContext(GlobalContext);

    const statePageColors = state.selectedPage.pageColors || {};

    const [isLoading, setIsLoading] = React.useState(false);
    const [colors, setColors] = React.useState(
        statePageColors || DefaultPageColors
    );
    const [showColorPicker, setShowColorPicker] =
        React.useState(ColorPickerState);

    const handleSubmit = () => {
        setIsLoading(true);

        updatePageColors(state.selectedPage.id, colors)
            .then((data) => {
                dispatch({ type: "SET_SELECTED_PAGE", payload: data });
                navigate(`/console/actions`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Failed to update page colors:", error);
                setIsLoading(false);
            });
    };

    const colorsToPick = [
        {
            name: "Background Color",
            type: "backgroundColor",
        },
        {
            name: "Text Color",
            type: "textColor",
        },
        {
            name: "Button Color",
            type: "buttonColor",
        },
        {
            name: "Button Hover Color",
            type: "buttonHoverColor",
        },
        {
            name: "Button Text Color",
            type: "buttonTextColor",
        },
        {
            name: "Button Link Icon Color",
            type: "buttonLinkIconColor",
        },
        {
            name: "Social Icons Color",
            type: "socialIconsColor",
        },
    ];

    const toggleColorPicker = (type, shouldShow) => {
        setShowColorPicker({ ...showColorPicker, [type]: shouldShow });
    };

    const changeColor = (type, hex) => {
        setColors({ ...colors, [type]: hex });
        toggleColorPicker(type, false);
    };

    const isInLightColors = (color) => {
        return color === "#ffffff" || color === "#f5f5f5" || color === "#ffeb3b";
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="true">
            <Header />

            <Box sx={MainBoxStyle}>
                <Box display="flex" justifyContent="left" alignItems="center">
                    <IconButton onClick={() => navigate("/console/actions")}>
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

                {colorsToPick.map((item, index) => (
                    <React.Fragment key={index}>
                        <h2>{item.name}</h2>

                        <Modal
                            open={showColorPicker[item.type]}
                            onClose={() => toggleColorPicker(item.type, false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={ColorPickerStyle}>
                                <center>
                                    <CirclePicker
                                        colors={DefaultColorPickerColors}
                                        onChange={(e) => changeColor(item.type, e.hex)}
                                    />
                                </center>
                            </Box>
                        </Modal>

                        <Box display="flex" alignItems="center">
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height={50}
                                width={"100%"}
                                border={1}
                                marginRight={2}
                                sx={{
                                    backgroundColor: colors[item.type],
                                    borderRadius: 10,
                                    borderColor: "lightgray",
                                }}
                            >
                                <Button
                                    onClick={() => toggleColorPicker(item.type, true)}
                                    sx={{
                                        color: isInLightColors(colors[item.type])
                                            ? "black"
                                            : "white",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    Choose
                                </Button>
                            </Box>
                        </Box>
                    </React.Fragment>
                ))}

                <Box display="flex" justifyContent="center">
                    <Button
                        color="tertiary"
                        size="large"
                        variant="filled"
                        sx={{
                            marginTop: 5,
                            marginBottom: 5,
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: "#000000",
                            "&:hover": {
                                backgroundColor: "#808080",
                            },
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
