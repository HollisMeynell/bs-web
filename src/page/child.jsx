import ErrorPage from "../Err/error.jsx";
import {useParams} from "react-router";

export const Router = {
    path: ':route',
    element: <Box/>,
    errorElement: <ErrorPage/>,
}

export default function Box(){
    const {route} = useParams();
    return <div>{route}</div>
}
