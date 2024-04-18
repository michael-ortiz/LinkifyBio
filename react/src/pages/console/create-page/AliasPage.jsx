import {
  Container,
  TextField,
  Box,
  Link,
  Typography,
  IconButton,
  Breadcrumbs,
  InputAdornment,
} from '@mui/material';
import React, { useContext, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { GlobalContext } from '../../../context/GlobalContext';
import { ArrowBack, Check, Close } from '@mui/icons-material';
import { checkIfAliasIsAvailable } from '../../../api/admin/AdminApi';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import { validateAlias } from '../../../utils/CoreUtils';

function AliasPage() {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(GlobalContext);

  const [id, setId] = React.useState(state.alias || '');
  const [isAvailable, setIsAvailable] = React.useState(false);
  const latestIdChecked = useRef('');

  const isAliasAvailable = useCallback((alias) => {
    latestIdChecked.current = alias;

    if (!validateAlias(alias)) {
      setIsAvailable(false);
      return;
    }

    checkIfAliasIsAvailable(alias)
      .then((response) => {
        if (alias === latestIdChecked.current) {
          setIsAvailable(response.available);
        }
      })
      .catch(() => {
        if (alias === latestIdChecked.current) {
          setIsAvailable(false);
        }
      });
  }, []);

  const handleIdChange = (event) => {
    const newId = event.target.value;
    setId(newId);

    if (validateAlias(newId)) {
      isAliasAvailable(newId);
    } else {
      setIsAvailable(false);
    }
  };

  useEffect(() => {
    isAliasAvailable(id);
  });

  const handleContinue = async () => {
    if (validateAlias(id)) {
      dispatch({ type: 'SET_ALIAS', payload: id });
      navigate(`/console/page/create/details`);
    } else {
      alert(id + ' is invalid or not available.');
      setIsAvailable(false);
    }
  };

  return (
    <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>
      <Header />

      <Box sx={MainBoxStyle}>
        <Box display="flex" justifyContent="left" alignItems="center">
          <IconButton onClick={() => navigate('/console')}>
            <ArrowBack />
          </IconButton>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/console">
              home
            </Link>
            <Typography color="text.primary">alias</Typography>
          </Breadcrumbs>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h1>Choose Alias</h1>
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
            id="id"
            label="Alias"
            variant="outlined"
            value={id}
            onChange={handleIdChange}
            InputLabelProps={{ shrink: true }}
            style={{ width: '100%', marginBottom: '20px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {id !== '' && isAvailable ? (
                    <Check sx={{ color: 'green' }} />
                  ) : id !== '' ? (
                    <Close sx={{ color: 'red' }} />
                  ) : null}
                </InputAdornment>
              ),
            }}
            inputProps={{
              autoCorrect: 'none',
              autoCapitalize: 'none',
              autoComplete: 'none',
            }}
            helperText="Only letters, numbers, and dashes are allowed."
          />

          <Button
            color="tertiary"
            size="large"
            variant="filled"
            disabled={id === '' || !isAvailable}
            sx={{
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#000000',
              '&:hover': {
                backgroundColor: '#808080',
              },
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AliasPage;
