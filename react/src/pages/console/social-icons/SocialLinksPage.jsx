import {
  ListItemText,
  ListItem,
  List,
  Box,
  Container,
  Divider,
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { GlobalContext } from '../../../context/GlobalContext';
import { ArrowBack, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorderSocialLinks } from '../../../api/admin/AdminApi';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';

function SocialLinksPage() {
  const navigate = useNavigate();

  document.body.scrollTop = document.documentElement.scrollTop = 0;

  const { state, dispatch } = useContext(GlobalContext);

  const { selectedPage } = state;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      selectedPage.socialMediaLinks,
      result.source.index,
      result.destination.index
    );

    dispatch({ type: 'SET_SOCIAL_LINKS', payload: items });

    let organizedLinks = [];
    items.forEach((element) => {
      organizedLinks.push(element.id);
    });

    reorderSocialLinks(selectedPage.id, organizedLinks);
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
              {selectedPage.id}
            </Link>
            <Typography color="text.primary">social icons</Typography>
          </Breadcrumbs>
        </Box>
        <h1>Social Icons Links</h1>
        <Button
          color="tertiary"
          size="large"
          variant="filled"
          href="/console/social/add"
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
          Create New Icon
        </Button>
        <nav>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links-droppable">
              {(provided, snapshot) => {
                return (
                  <List ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedPage.socialMediaLinks.length > 0 && <Divider />}
                    {selectedPage.socialMediaLinks.map((link, index) => (
                      <Draggable
                        key={link.id}
                        draggableId={link.id}
                        index={index}
                      >
                        {(provided) => (
                          <React.Fragment>
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                wordWrap: 'break-word',
                                width: '100%',
                                backgroundColor:
                                  snapshot.isDraggingOver &&
                                  link.id === snapshot.draggingOverWith
                                    ? '#1DA1F2'
                                    : 'inherit',
                                color:
                                  snapshot.isDraggingOver &&
                                  link.id === snapshot.draggingOverWith
                                    ? 'white'
                                    : 'inherit',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                              onClick={() => {
                                dispatch({
                                  type: 'SET_SELECTED_LINK',
                                  payload: link,
                                });
                                navigate(`/console/social/editor`);
                              }}
                            >
                              <ListItemIcon>
                                <DragIndicator
                                  style={{
                                    color:
                                      snapshot.isDraggingOver &&
                                      link.id === snapshot.draggingOverWith
                                        ? 'white'
                                        : 'inherit',
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={link.url} />
                              <ListItemIcon>
                                <SocialIcon
                                  url={`${link.url}`}
                                  bgColor="transparent"
                                  fgColor="black"
                                  style={{ height: 30, width: 30 }}
                                />
                              </ListItemIcon>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                );
              }}
            </Droppable>
          </DragDropContext>
        </nav>
      </Box>
    </Container>
  );
}

export default SocialLinksPage;
