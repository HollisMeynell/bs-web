import ErrorPage from "@/Err/error.jsx";
import {useLoaderData, useOutlet, useParams} from "react-router";

export const Router = {
    path: "mappool",
    Component: IndexPage,
    errorElement: <ErrorPage/>,
    children: [
        {
            path: ":pid",
            loader: loader,
            Component: PoolPage,
            errorElement: <ErrorPage/>,
        }
    ]
}


async function loader(){
    return {}
}
function IndexPage(){
    const  {pid} = useParams();
    const outlet = useOutlet();
    return <div>{pid?outlet:"none"}</div>
}
function PoolPage() {
    const  {pid} = useParams();
    const {data} = useLoaderData();
    return <div>{pid}- </div>
}