import ErrorPage from "../../Err/error.jsx";
import {Card, Col, Row, Slider, Space, Tag, theme} from "antd";
import './favorites.css';
import IconLength from '../../assets/icon-length.svg';
import IconBpm from '../../assets/icon-bpm.svg';
import IconCountCircles from '../../assets/icon-count-circles.svg';
import IconCountSliders from '../../assets/icon-count-sliders.svg';
import { useEffect, useRef, useState} from "react";
import {TagBox} from "../../components/tag.jsx";
import {FavoriteBox} from '../../components/favorite/favorite.jsx'
import {EditOutlined, ReloadOutlined, SaveOutlined, SettingOutlined} from "@ant-design/icons";
import Markdown from "../../components/markdown.jsx";

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


function MapCard({bid, r}) {
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
        setEditMarkdown((r)=>(!r));

    }

    useEffect(() => {
        setLoading(true);

        const basic = {
            length: 237, bpm: 168, sliders: 712, circles: 288,
        }
        const stats = {
            cs: 3.6, hp: 5, od: 8.4, ar: 9, star: 5.94,
        }
        const mid = bid;
        const title = "Only for you~" + r;
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
            editMarkdown?
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

/***
 * 回调 onChange 注意: 当 value.length[1] 为750时逻辑为无上限
 * @returns {JSX.Element}
 * @constructor
 */
function FilterCard({onChange}) {
    const defaultValue = {
        length: [0, 750],
        star: [0, 10],
        cs: [0, 10],
        hp: [0, 10],
        od: [0, 10],
        ar: [0, 10],
    };
    const [data, setData] = useState(defaultValue);
    const timeMarks = {}
    for (let i = 0; i <= 12; i++) {
        timeMarks[i * 60] = i;
    }

    const show = [];
    for (let key in defaultValue) {
        // 长度单独处理
        key === 'length' || show.push({
            key: key,
            values: defaultValue[key],
        })
    }

    function change(type) {
        return (value) => {
            setData(v => {
                const newValue = {
                    ...v
                };
                newValue[type] = value;
                return newValue;
            });
        }
    }


    function reload() {
        setData(defaultValue);
    }

    function reanchMin(v) {
        return `${Math.floor(v / 60)}:${v % 60 === 0 ? '00' : '30'}`
    }

    return <Card style={{width: 300}} actions={[<ReloadOutlined key="reload" onClick={reload}/>]}>
        <h2>FILTER:</h2>
        {
            show.map((v, i) => {
                return <>
                    <h4 key={i}>{`${v.key}: ${data[v.key][0]}-${data[v.key][1]}`}</h4>
                    <Slider min={defaultValue[v.key][0]} max={defaultValue[v.key][1]} step={0.1} range
                            value={data[v.key]}
                            onChange={change(v.key)}
                            key={v.key}
                    />
                </>
            })
        }
        <h4>{`length: ${reanchMin(data.length[0])}-${data.length[1] <= 720 ? reanchMin(data.length[1]) : '不上限'}`}</h4>
        <Slider min={defaultValue.length[0]} max={defaultValue.length[1]} step={30} range
                value={data.length}
                marks={timeMarks}
                tooltip={{formatter: (v) => v <= 720 ? reanchMin(v) : '不上限'}}
                onChange={change('length')}
        />
    </Card>
}

export default function Favorites() {
    return <>
        <div style={{margin: '10px 10px'}}>
            <Space size={[10, 10]} align="start" wrap>
                <FilterCard/>
                <MapCard bid={1972258} r={"a"}/>
                {/*<MapCard bid={1972258} r={"ab"}/>*/}
                {/*<MapCard bid={1972258} r={"abc"}/>*/}
                {/*<MapCard bid={1972258} r={"abcd"}/>*/}
            </Space>
        </div>
    </>
}

export const Router = {
    path: 'favorites', element: <Favorites/>, errorElement: <ErrorPage/>
}