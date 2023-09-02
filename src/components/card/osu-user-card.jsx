import style from '@/style/osu-user-card.module.scss'
import {useEffect, useReducer, useRef} from "react";
import {getUserCard} from "@/api/userinfo.js";
import {timeBetween} from "@/assets/utils/util.js";

const USER_INFO_TMP = {
    name:"",
    banner:"",
    avatar:"",
    country: "",
    online: "",
    lastVisit: "",
}

function userInfoReducer(state, action) {
    return {
        ...state,
        ...action
    }
}

export default function({uid}){
    const flagRef = useRef(null);


    const [userInfo, setInfo] = useReducer(userInfoReducer, USER_INFO_TMP);

    function setFlag(code) {
        code = code.toUpperCase();
        let bit_flag = 0x1f1e6;
        let char_code_A = 65;
        let n_1 = bit_flag + code.charCodeAt(0) - char_code_A;
        let n_2 = bit_flag + code.charCodeAt(1) - char_code_A;
        flagRef.current.style.setProperty("--width-height-ratio", 1.38888888);
        flagRef.current.style.backgroundImage =
            `url("https://osu.ppy.sh/assets/images/flags/${n_1.toString(16)}-${n_2.toString(16)}.svg")`;
    }

    async function initInfo() {
        const data = await getUserCard(uid);
        setFlag(data.country.code);

        let lastVisit = void 0;
        if (!data.is_online && data.last_visit) {
            lastVisit = timeBetween(new Date(data.last_visit));
        }
        return {
            name: data.username,
            banner: data.cover.url,
            avatar: data.avatar_url,
            country: data.country.code,
            online: data.is_online,
            lastVisit
        }
    }

    useEffect(()=>{
        initInfo().then(setInfo);
    },[]);

    return <div className={style.userCard} >
        <a className={style.backgroundContainer} href={`https://osu.ppy.sh/users/${uid}`}>
            <img alt={"banner"} src={userInfo.banner}/>
            <div className={style.overlay}/>
        </a>
        <div className={style.info}>
            <div className={style.details}>
                <div className={style.avatarSpace}>
                    <img alt={"avatar"} src={userInfo.avatar}/>
                </div>
                <div className={style.detailsInfo}>
                    <div className={style.detailsInfoRow}>
                        <div style={{display:"flex", pointerEvents:"auto"}}>
                            <span ref={flagRef} className={style.flag}></span>
                        </div>
                    </div>
                    <div className={style.detailsNameRow}>
                        <a art={"pre-overflow"}>{userInfo.name}</a>
                    </div>
                </div>
            </div>
            <div className={style.status}>
                <div className={style.statusOnline}>
                    <div className={style.iconContainer}>
                        <div className={userInfo.online ? `${style.icon} ${style.online}` : style.icon}></div>
                    </div>
                    <div className={style.message}>
                        { userInfo.lastVisit ?
                            <span art={"pre-overflow"} className={style.messageTop}>
                                {userInfo.lastVisit + "前"}
                            </span>
                            :
                            null
                        }
                        <span art={"pre-overflow"}>
                            {userInfo.online ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}