import { useEffect, useState } from 'react';

export const ArticleDisplayer = (props: {title: string}) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${props.title}`);
            const data = await response.text(); 

            // Manipulation du HTML pour enlever l'infobox
            const cleanedContent = removeInfobox(data);
            setContent(cleanedContent);
        };
        fetchArticle();
    }, [props.title]);

    const removeInfobox = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Supprimer les éléments ayant la classe 'infobox'
        const infoboxElements = doc.querySelectorAll('.infobox');
        infoboxElements.forEach((element) => {
            element.remove(); // Retirer ces éléments du DOM
        });

        return doc.body.innerHTML;
    };

    return (
        <div className="article-container">
            <p className="article_title">{props.title}</p>
            <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};
