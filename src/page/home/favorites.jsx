import ErrorPage from "../../Err/error.jsx";
import { Space } from "antd";
import './favorites.css';
import FilterCard from "@/components/card/filter-card.jsx";

export const Router = {
    path: 'favorites', element: <Favorites/>, errorElement: <ErrorPage/>
}

export default function Favorites() {
    return <>
        <div style={{margin: '10px 10px'}}>
            <Space size={[10, 10]} align="start" wrap>
                <FilterCard/>
                {/*<MapCard bid={1972258} r={"a"}/>*/}
                {/*<MapCard bid={1972258} r={"ab"}/>*/}
                {/*<MapCard bid={1972258} r={"abc"}/>*/}
                {/*<MapCard bid={1972258} r={"abcd"}/>*/}
            </Space>
        </div>
    </>
}