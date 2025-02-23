import { useEffect, useState } from 'react';

export const ArticleDisplayer = (props: {title: string}) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchArticle = async () => {
              const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${props.title}`);
              const data = await response.text(); 
              setContent(data);
        };
        fetchArticle();
    }, [props.title]);

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
