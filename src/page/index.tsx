import { useEffect, useRef } from "react";
import style from "@/style/index.module.scss";
import { Button, theme } from "antd";
import { useNavigate } from "react-router";
import Setter from "../components/page-setter";
import imgCard1 from "../assets/images/card1.jpg";
import imgCard2 from "../assets/images/card2.jpg";
import imgCard3 from "../assets/images/card3.jpg";
import TypeIt from "typeit";
import { hiddenStyle, showHiddenStyle } from "@/styles";

// 常量配置
const CONSTANTS = {
  TITLE: "PASSACAGLIA",
  INFO: "一个关于OSU的比赛管理网站",
  INFO_ITEMS: ["创建比赛", "招募成员", "管理图池", "成绩统计"] as const,
  BACKGROUNDS: [imgCard1, imgCard2, imgCard3] as const,
  ANIMATION_DELAYS: {
    INFO_INITIAL: 3000,
    INFO_ITEM: 2000,
  },
} as const;

export default function Index() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Refs
  const mainBox = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);
  const buttonBoxRef = useRef<HTMLDivElement>(null);

  // 初始化背景
  useEffect(() => {
    if (mainBox.current) {
      const randomBg = CONSTANTS.BACKGROUNDS[
        Math.floor(Math.random() * CONSTANTS.BACKGROUNDS.length)
      ];
      mainBox.current.style.backgroundImage = `url(${randomBg})`;
    }
  }, []); // 空依赖数组，只在挂载时执行一次

  // 初始化主题色
  useEffect(() => {
    if (mainBox.current) {
      mainBox.current.style.setProperty("--main-color", token.colorPrimaryBg);
    }
  }, [token.colorPrimaryBg]);

  // 动画相关函数
  const buttonShow = () => {
    if (buttonBoxRef.current) {
      showHiddenStyle(buttonBoxRef.current);
    }
  };

  const titleShow = () => {
    if (!titleRef.current) return;

    new TypeIt(titleRef.current, {
      strings: CONSTANTS.TITLE,
      speed: 50,
      cursorChar: "",
      afterComplete: infoShow,
    }).go();
  };

  function infoShow() {
    buttonShow();

    if (!infoRef.current) return;

    const infoType = new TypeIt(infoRef.current, {
      speed: 80,
      cursorChar: "",
      loop: false,
    })
      .type(CONSTANTS.INFO, { delay: CONSTANTS.ANIMATION_DELAYS.INFO_INITIAL })
      .delete()
      .type("你可以: ");

    CONSTANTS.INFO_ITEMS.forEach((item) => {
      infoType
        .type(item, { delay: CONSTANTS.ANIMATION_DELAYS.INFO_ITEM })
        .delete(item.length);
    });

    infoType.delete().type(CONSTANTS.INFO).go();
  }

  // 导航函数
  const navigationHandlers = {
    userEnter: () => navigate("/home"),
    guestEnter: () => navigate("/test"),
    developerEnter: () => navigate("/dev"),
  };

  // 初始化动画
  useEffect(() => {
    titleShow();

    // 清理函数
    return () => {
      // 如果需要清理 TypeIt 实例
      if (titleRef.current) {
        const instance = titleRef.current.querySelector(".ti-cursor");
        instance?.remove();
      }
    };
  }, []);

  return (
    <div ref={mainBox} className={style.main}>
      <div className={style.box}>
        <div className={style.title} ref={titleRef} />
        <span className={style.info} ref={infoRef} />
        <div ref={buttonBoxRef} className={style.bottom} style={hiddenStyle}>
          <Button
            size="large"
            shape="round"
            type="primary"
            onClick={navigationHandlers.userEnter}
          >
            进入主页
          </Button>
          <Button
            size="large"
            shape="round"
            ghost
            onClick={navigationHandlers.guestEnter}
          >
            公开信息
          </Button>
        </div>
      </div>
      <Setter />
    </div>
  );
}
