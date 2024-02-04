import { Box } from '@mui/material';
import Button from '@mui/material-next/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify/utils';
import Settings from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { AccountSettings } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getCurrentUser } from '@aws-amplify/auth';

function Header() {

    const navigate = useNavigate();

    let authenticator

    if (import.meta.env.VITE_NODE_ENV !== 'local') {

        authenticator = useAuthenticator()
    }

    const [openSettings, setOpenSettings] = useState(false);

    const [isFederated, setIsFederated] = useState(false);

    const authListener = (data) => {

        if (data.payload.event === 'signedOut') {
            navigate('/');
        }
    };

    useEffect(() => {

        if (import.meta.env.VITE_NODE_ENV !== 'local') {

            getCurrentUser().then((data) => {
                const username = data.username.toLowerCase();
                if (username.includes('google')) {
                    setIsFederated(true);
                }
            }).catch((error) => {
                setIsFederated(false);
            });
        }

    }, []);

    Hub.listen('auth', authListener);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box onClick={() => navigate("/console")} sx={{ display: 'flex', alignItems: 'center' }}>

                <img
                    src={'/logox100.png'}
                    style={{ height: 30, width: 30, marginRight: 5, userSelect: 'none', userDrag: 'none' }}
                    draggable="false"
                    alt='linkifybio'
                    onClick={() => navigate('/console')}
                />

                <h3 style={{ userSelect: 'none', color: '#8f2f00' }}>LinkifyBio</h3>
            </Box>

            <Dialog open={openSettings} onClose={() => setOpenSettings(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <AccountSettings.ChangePassword onSuccess={() => {
                        alert('Password is successfully changed!')
                        setOpenSettings(false)
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSettings(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            { import.meta.env.VITE_NODE_ENV === 'local' ?
                 <h3>Local Environemnt</h3>
                 :
                 <Box sx={{ marginTop: 2, alignItems: 'right' }}>
                    <Button variant="outlined" sx={{ color: '#8f2f00', borderColor: '#8f2f00' }} onClick={() => authenticator.signOut()}>Sign Out</Button>

                    {!isFederated &&
                        <IconButton onClick={() => setOpenSettings(true)}>
                            <Settings sx={{ color: '#8f2f00' }} />
                        </IconButton>
                    }
                </Box>
            }



        </Box>
    );
}
export default Header