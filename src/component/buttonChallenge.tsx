import React, { useEffect, useState } from 'react';

type WebViewButtonProps = {
  onClick: () => void;
};
const WebViewButton: React.FC<WebViewButtonProps> = ({ onClick }) => {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    const webview = isInWebView();
    setIsWebView(webview);
    console.log('User Agent:', navigator.userAgent);
    console.log('Is WebView:', webview);
  }, []);

  if (!isWebView) return null; // ⬅️ Cache tout si pas en WebView

  return (
      <div>
        <button onClick={onClick} className="button">
          CHALLENGE
        </button>
      </div>
  );
};
function isInWebView(): boolean {
  const userAgent: string = navigator.userAgent || navigator.vendor || (window as any).opera;
  const webViewRegex = /wv|WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android(?!.*Chrome)/i;
  return webViewRegex.test(userAgent);
}

export default WebViewButton;
