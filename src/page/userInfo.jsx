import {useLoaderData} from "react-router";
import axios from "axios";
import {HttpRequest} from "../api/util.js";

async function loader({params}) {

    let req = await HttpRequest.doProxy({
        url: `https://osu.ppy.sh/users/${params.uid}/scores/best`,
        method: "GET",
        parameter: {
            mode: "osu",
            limit: 100,
            offset: 0
        }
    });
    return {
        list: [...req]
    }
}

export default function UserInfo() {
    const {list} = useLoaderData();
    const mods = {};
    for (const i of list) {
        if (i.mods.length > 0) {
            for (const j of i.mods) {
                const mj = j.acronym;
                mods[mj] = mods[mj] ? mods[mj] + 1 : 1;
            }
        }
    }
    const mList = [];
    for (const modsKey in mods) {
        mList.push({mod:modsKey, size: mods[modsKey]});
    }
    mList.sort((a,b) => b.size - a.size);

    let avgbpm = 0;
    for (const i of list) {
        let x = 1;
        if (i.mods.length > 0) {
            for (const j of i.mods) {
                const mj = j.acronym;
                if (mj === "DT" || mj === "NC") x = 1.5;
                else if (mj==="HT") x = 0.75;
            }
        }
        avgbpm += (i.beatmap.bpm * x);
    }
    avgbpm /= 100;

    return <>
        Mod: {
            mList.map((d, index) => {
                return <div key={index}><samp>{d.mod}</samp>:<samp>{d.size}</samp></div>
            })
    }
        avgBpm: {avgbpm}

    </>
}