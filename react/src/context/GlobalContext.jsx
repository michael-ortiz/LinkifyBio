import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types'

// Define your state and reducer
const globalState = {
    pages: [],
    selectedPage: JSON.parse(localStorage.getItem('selectedPage')) || {},
    selectedLink: JSON.parse(localStorage.getItem('selectedLink')) || {},
    alias: localStorage.getItem('alias') || '',
    didCreatePage: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PAGES':
            return { ...state, pages: action.payload };
        case 'SET_SELECTED_PAGE':
            localStorage.setItem('selectedPage', JSON.stringify(action.payload));
            return { ...state, selectedPage: action.payload };
        case 'SET_SELECTED_LINK':
            localStorage.setItem('selectedLink', JSON.stringify(action.payload));
            return { ...state, selectedLink: action.payload };
        case 'SET_LINKS':
            localStorage.setItem('selectedPage', JSON.stringify({
                ...state.selectedPage,
                links: action.payload
            }));
            return {
                ...state, selectedPage: {
                    ...state.selectedPage,
                    links: action.payload
                }
            };
        case 'SET_SOCIAL_LINKS':
            localStorage.setItem('selectedPage', JSON.stringify({
                ...state.selectedPage,
                socialMediaLinks: action.payload
            }));
            return {
                ...state, selectedPage: {
                    ...state.selectedPage,
                    socialMediaLinks: action.payload
                }
            };
        case 'SET_ALIAS':
            localStorage.setItem('alias', action.payload);
            return { ...state, alias: action.payload };
        case 'SET_DID_CREATE_PAGE':
            return { ...state, didCreatePage: action.payload };
        default:
            return state;
    }
};

// Create your context
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, globalState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};

GlobalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
