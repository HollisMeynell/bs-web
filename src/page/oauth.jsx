import ErrorPage from "../Err/error.jsx";

function Oauth() {
    
}

export const Router = {
    path: '/oauth',
    element: <Oauth/>,
    errorElement: <ErrorPage/>,
}