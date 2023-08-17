import {useEffect, useState} from "react";
import {getMapInfo} from "@/api/mapinfo.js";
import {Card, Col, Row} from "antd";
import {FavoriteBox} from "@/components/favorite/favorite.jsx";
import {EditOutlined, SaveOutlined, SettingOutlined} from "@ant-design/icons";
import {TagBox} from "@/components/tag.jsx";
import Markdown from "@/components/markdown.jsx";

/***
 *
 * @param data = {
 *     basic: {length: 0, bpm: 0, sliders: 0, circles: 0,},
 *     stats: {cs: 0, hp: 0, od: 0, ar: 0, star: 0,},
 *     mid:0
 * }
 * @param onClick 点击事件
 * @returns {JSX.Element}
 * @constructor
 */
function Banner({data, onClick}) {
    const [basic, setBasic] = useState(data.basic);
    const [stats, setStats] = useState(data.stats);
    const background = useRef(null);
    const barCs = useRef(null);
    const barHp = useRef(null);
    const barOd = useRef(null);
    const barAr = useRef(null);
    const barStar = useRef(null);

    const lable = [
        {text: '圆圈大小', type: 'cs', ref: barCs},
        {text: '掉血速度', type: 'hp', ref: barHp},
        {text: '准度要求', type: 'od', ref: barOd},
        {text: '缩圈速度', type: 'ar', ref: barAr},
        {text: '难度星级', type: 'star', ref: barStar},
    ];

    function handleClick() {
        if (typeof onClick === "function") {
            onClick();
        }
    }

    useEffect(() => {
        const basic = data.basic;
        const stats = data.stats;
        setBasic(basic);
        setStats(stats);
        background.current.style.setProperty("--background-url", 'url("https://assets.ppy.sh/beatmaps/' + data.mid + '/covers/cover.jpg")');
        barCs.current.style.setProperty("--fill", Math.min(stats.cs / 10, 1));
        barHp.current.style.setProperty("--fill", Math.min(stats.hp / 10, 1));
        barOd.current.style.setProperty("--fill", Math.min(stats.od / 10, 1));
        barAr.current.style.setProperty("--fill", Math.min(stats.ar / 10, 1));
        barStar.current.style.setProperty("--fill", Math.min(stats.star / 10, 1));
    }, [data]);

    return <div className={"banner"} onDoubleClickCapture={handleClick}>
        <div className={"card-bg"} ref={background}/>
        <div className={"banner-title"}>
            <a target={'_blank'} href={`https://osu.ppy.sh/b/${data.bid}`}>
                <h2>{data.title}</h2>
            </a>
        </div>
        <div className={"banner-artist"}>
            <a target={'_blank'} href={`https://osu.ppy.sh/beatmapsets?q=${data.artist}`}>
                <h6>{data.artist}</h6>
            </a>
        </div>
        <div className={"banner-bid"}><h2>bid: {data.bid}</h2></div>
        <div className={"banner-basic"}>
            <div>
                <img alt={"length"} src={IconLength}/>
                <samp>{`${Math.floor(basic.length / 60)}:${basic.length % 60}`}</samp>
            </div>
            <div>
                <img alt={"bpm"} src={IconBpm}/>
                <samp>{basic.bpm}</samp>
            </div>
            <div>
                <img alt={"circles"} src={IconCountCircles}/>
                <samp>{basic.circles}</samp>
            </div>
            <div>
                <img alt={"sliders"} src={IconCountSliders}/>
                <samp>{basic.sliders}</samp>
            </div>
        </div>
        <div className={"banner-stats"}>
            <table>
                <tbody>
                {lable.map((v, i) => <tr key={i}>
                    <th>{v.text}</th>
                    <td>
                        <div className={"bar bar-" + v.type} ref={v.ref}/>
                    </td>
                    <td>{stats[v.type]}</td>
                </tr>)}

                </tbody>
            </table>
        </div>
    </div>
}

function BannerLite({data, onClick}) {
    const background = useRef(null);

    function handleClick() {
        if (typeof onClick === "function") {
            onClick();
        }
    }

    useEffect(() => {
        background.current.style.setProperty("--background-url", 'url("https://assets.ppy.sh/beatmaps/' + data.mid + '/covers/cover.jpg")');
    }, [data]);

    return <div className={"banner-lite"} onClick={handleClick}>
        <div className={"card-bg"} ref={background}/>
        <div className={"banner-title"}>
            <a target={'_blank'} href={`https://osu.ppy.sh/b/${data.bid}`}>
                <h2>{data.title}</h2>
            </a>
        </div>
        <div className={"banner-artist"}>
            <a target={'_blank'} href={`https://osu.ppy.sh/beatmapsets?q=${data.artist}`}>
                <h6>{data.artist}</h6>
            </a>
        </div>
        <div className={"banner-lite-bid"}><h2>b/{data.bid}</h2></div>
    </div>
}
function MapCard({bid}) {
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [bannerDate, setBannerDate] = useState({
        basic: {length: 0, bpm: 0, sliders: 0, circles: 0,},
        stats: {cs: 0, hp: 0, od: 0, ar: 0, star: 0,},
        mid: 0,
        bid: 0,
        title: "",
    });
    const [editMarkdown, setEditMarkdown] = useState(false);
    const [banner, setBanner] = useState(false);
    const rowGutter = {xs: 8, sm: 16, md: 0};

    function setMarkdown() {
        setEditMarkdown((r) => (!r));
    }

    useEffect(() => {
        setLoading(true);

        const basic = {
            length: 237, bpm: 168, sliders: 712, circles: 288,
        }
        const stats = {
            cs: 3.6, hp: 5, od: 8.4, ar: 9, star: 5.94,
        }
        getMapInfo(bid).then((data) => {
            console.log(data);
        })
        const mid = bid;
        const title = "Only for you~";
        const artist = "アニスフィア (CV: 千本木彩花), ユフィリア (CV: 石見舞菜香)";
        const data = {basic, stats, mid, bid, title, artist};
        setBannerDate(data);
        setTimeout(() => setLoading(false), 30);
    }, []);
    return <Card
        loading={loading}
        bordered={false}
        hoverable
        style={{width: 600, overflow: "hidden"}}
        cover={banner ?
            <Banner data={bannerDate} onClick={() => {
                setBanner(r => !r)
            }}/>
            :
            <BannerLite data={bannerDate} onClick={() => {
                setBanner(r => !r)
            }}/>
        }
        actions={[<FavoriteBox defaultValue={true} onChange={(e) => setIsFavorite(e)}/>,
            <SettingOutlined key="setting"/>,
            editMarkdown ?
                <SaveOutlined key="save" onClick={setMarkdown}/>
                :
                <EditOutlined key="edit" onClick={setMarkdown}/>,
        ]}
    >
        <Row gutter={rowGutter}>
            {/*第一行 收藏/标签页*/}
            <Col>{isFavorite ? <TagBox tagList={['ac', 'bc', 'cc']}/> : <div></div>}</Col>
        </Row>
        <Row gutter={rowGutter}>
            <Col flex={'auto'}>
                <Markdown edit={editMarkdown}/>
            </Col>
        </Row>

    </Card>
}