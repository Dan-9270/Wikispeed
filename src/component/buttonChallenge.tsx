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

  return (
    <div>
      <button disabled={!isWebView} onClick={onClick}>
        {isWebView ? 'Bouton actif (WebView)' : 'Désactivé (pas WebView)'}
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
