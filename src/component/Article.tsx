import { useEffect, useState } from 'react';

export const ArticleDisplayer = (props: { title: string; setTitle: (newTitle: string) => void }) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${props.title}`);
            const data = await response.text();

            const cleanedContent = cleanArticle(data);
            setContent(cleanedContent);
        };
        fetchArticle();
    }, [props.title]);

    useEffect(() => {
        const container = document.querySelector('.article-content');
        if (!container) return;

        const handleClick = (event: Event) => {
            const target = event.target as HTMLAnchorElement;
            if (target.tagName === 'A') {
                event.preventDefault(); 
                
                const newTitle = target.getAttribute("title"); 
                if (newTitle) {
                    props.setTitle(newTitle); 
                }
            }
        };

        container.addEventListener('click', handleClick);

        return () => {
            container.removeEventListener('click', handleClick);
        };
    }, [content]);

    const cleanArticle = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const notes = doc.getElementById("Notes_et_références");
        notes?.parentElement?.remove();
        const annexe = doc.getElementById("Annexes");
        annexe?.parentElement?.remove();
        const other = doc.getElementById("Voir_aussi");
        other?.parentElement?.remove();
        const bibli = doc.getElementById("Bibliographie");
        bibli?.parentElement?.remove();
        

        const unwantedElements = doc.querySelectorAll('.reflist, .reference, .toc');
        unwantedElements.forEach((element) => element.remove());

        const infobox = doc.querySelector('.infobox');

        let cleanedContent = '';
        if (infobox) {
            cleanedContent += infobox.outerHTML; // Ajoute l'Infobox au début
        }

        // Ajouter le reste du contenu (corps de l'article)
        cleanedContent += doc.body.innerHTML;

        return cleanedContent;
    };


    return (
        <div className="article-container">
            <p className="article_title">{props.title}</p>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};
