import ErrorPage from "../../Err/error.jsx";
import {useParams} from "react-router";

export const Router = {
    path: ':route',
    Component: Box,
    errorElement: <ErrorPage/>,
}

function Box(){
    const {route} = useParams();
    return <div>home - {route}</div>
}
