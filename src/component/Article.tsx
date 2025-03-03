import { useEffect, useState } from 'react';

export const ArticleDisplayer = (props: { title: string; setTitle: (newTitle: string) => void }) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${props.title}`);
            const data = await response.text();

            const cleanedContent = removeInfobox(data);
            setContent(cleanedContent);
        };
        fetchArticle();
    }, [props.title]);

    useEffect(() => {
        // Attendre que le contenu soit mis à jour
        const container = document.querySelector('.article-content');
        if (!container) return;

        // Écouter les clics sur les liens
        const handleClick = (event: Event) => {
            const target = event.target as HTMLAnchorElement;
            if (target.tagName === 'A') {
                event.preventDefault(); // Empêche l'ouverture du lien dans une nouvelle page
                
                const newTitle = target.innerText; // Récupère le texte du lien comme nouveau titre
                props.setTitle(newTitle); // Change l'article affiché
            }
        };

        container.addEventListener('click', handleClick);

        return () => {
            container.removeEventListener('click', handleClick);
        };
    }, [content]);

    const removeInfobox = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Supprime l'infobox
        const infoboxElements = doc.querySelectorAll('.infobox');
        infoboxElements.forEach((element) => element.remove());

        return doc.body.innerHTML;
    };

    return (
        <div className="article-container">
            <p className="article_title">{props.title}</p>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};