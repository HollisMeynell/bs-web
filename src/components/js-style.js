
export const tipsStyle = {lineHeight: "100%", fontSize: 18};
export const hiddenStyle = {transition: "visibility 0s, opacity ease-in-out 1s", opacity:0, visibility: 'hidden'};
export function showHiddenStyle(el) {
    if (el?.style) {
        setTimeout(()=>{
            el.style.removeProperty("visibility");
            el.style.opacity = 1;
        }, 300);
    }
}