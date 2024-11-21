import {useOutlet, useParams} from "react-router";
import {Router as pageRouter} from "@/page/home/mappool/pool-page.jsx";

export const Router = {
    path: "mappool",
    Component: IndexPage,
    children: [pageRouter]
}


async function loader() {
    return {}
}

export default function IndexPage() {
    const {pid} = useParams();
    const outlet = useOutlet();
    return <div>{outlet || `>_<`}</div>
}
