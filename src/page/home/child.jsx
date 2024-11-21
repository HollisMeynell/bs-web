import {useParams} from "react-router";

export default function Box(){
    const {route} = useParams();
    return <div>home - {route}</div>
}
