import PoolCard from "@/page/home/poolCard.jsx";
import OsuUserCard from "@/components/card/osu-user-card.jsx";
export default function () {
    return <div style={{overflow: "auto", maxHeight:"100%"}}>
        <PoolCard id={1}/>
        <OsuUserCard uid={2}/>
    </div>
}