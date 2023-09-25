import ErrorPage from "@/Err/error.jsx";
import {useOutlet, useParams} from "react-router";
import {Router as pageRouter} from "@/page/home/mappool/pool-page.jsx";

export const Router = {
    path: "mappool",
    Component: IndexPage,
    errorElement: <ErrorPage/>,
    children: [pageRouter]
}


async function loader() {
    return {}
}

function IndexPage() {
    const {pid} = useParams();
    const outlet = useOutlet();
    return <>{outlet || <div>{'>_<'}</div>}</>
}
