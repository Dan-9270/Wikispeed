import {useState, useEffect} from "react";
import { apiUrl } from "../config/endpoints";

interface rankingElement {
    username: string;
    steps: number;
}
function isInWebView(): boolean {
    const userAgent: string = navigator.userAgent || navigator.vendor || (window as any).opera;
    const webViewRegex = /wv|WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android(?!.*Chrome)/i;
    return webViewRegex.test(userAgent);
}
export const ChallengeRanking=()=>{
    const webview = isInWebView();
    const [fullScreen, setFullScreen] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [ranking, setRanking] = useState<rankingElement[]>([]);
    useEffect(() => {
        console.log("ranking", apiUrl(`/ranking?date=${today}`))
        fetch(apiUrl('/ranking?date=2025-04-09'))
            .then(res => res.json())
            .then(data => setRanking(data))
            .catch(err => console.error(err));
    }, []);
    if(!webview){
        return;
    }
    return <>
        {!fullScreen ? <button className="rankingButton" onClick={()=>setFullScreen(true)}>Ranking</button>:
            <div className="rankingBack" onClick={()=>setFullScreen(false)}>
            <div>
                <h2>Ranking of the Day</h2>
                <ul>
                {ranking.map((item,index)=>{
                return <div>
                    <p>{index}</p><p>{item.username}</p><p>{item.steps}</p>
                </div>})}
                </ul>
            </div>
            </div>
        }
    </>
}