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
        const reference = doc.getElementById("Références");
        reference?.parentElement?.remove();
        const externalLink = doc.getElementById("Liens_externes");
        externalLink?.parentElement?.remove();
        const articleConnexe = doc.getElementById("Articles_connexes");
        articleConnexe?.parentElement?.remove();
        const infobox = doc.querySelector('.infobox');

        let cleanedContent = '';
        if (infobox) {
            cleanedContent +=""; // Ajoute l'Infobox au début
            const parent = infobox.parentElement
            if(parent){

                const wrapper = document.createElement('div');
                wrapper.classList.add('infobox-wrapper');

                const tables = infobox.querySelectorAll('table');

                // Garder seulement les 2 premières tables (par exemple)
                tables.forEach((table, index) => {
                    if (index >= 2) {
                        table.remove(); // Supprime toutes les tables après les 2 premières
                    }
                });

                // Ajouter tous les frères de l'info box dans le wrapper, sauf l'info box elle-même
                Array.from(parent.children).forEach(child => {
                    if (child !== infobox) {
                        wrapper.appendChild(child);
                    }
                });

                // Vider le parent et ajouter le wrapper contenant les frères de l'info box
                parent.innerHTML = '';
                parent.appendChild(wrapper);

                // Insérer l'info box de retour dans le parent (après les frères)
                parent.appendChild(infobox);
                parent.style.display = 'flex';
                parent.style.justifyContent = 'center';
                parent.style.alignItems = 'center';
                parent.style.flexDirection = 'row'; // Aligner les éléments horizontalement
                parent.style.gap = '20px';
                parent.style.width="100%";
            }
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
