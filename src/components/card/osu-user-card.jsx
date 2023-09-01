import style from '@/style/osu-user-card.module.scss'
export default function({uid}){
    return <div className={style.userCard}>
        <a className={style.backgroundContainer} href={`https://osu.ppy.sh/users/${uid}`}>
            <img />
            <div className={style.overlay}/>
        </a>
        <div></div>
    </div>
}