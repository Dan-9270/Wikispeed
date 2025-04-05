import { useEffect, useState, useCallback, memo } from 'react';
import { useSnailArtifact, SnailArtifactOverlay, SnailTimer } from './SnailArtifact';

interface ArticleDisplayerProps {
  title: string;
  updateHistoryAndMap: (newTitle: string) => void;

  hasSnailArtifact?: boolean;
}

const MemoizedSnailTimer = memo(SnailTimer);
const MemoizedSnailArtifactOverlay = memo(SnailArtifactOverlay);

export const ArticleDisplayer = ({ title, updateHistoryAndMap, hasSnailArtifact = false}: ArticleDisplayerProps) => {
  const [content, setContent] = useState<string>('');
  const { isActive, activateSnail, remainingTime } = useSnailArtifact();

  const cleanArticle = useCallback((html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sectionsToRemove = [
      "Notes_et_références",
      "Annexes",
      "Voir_aussi",
      "Bibliographie",
      "Références",
      "Liens_externes",
      "Articles_connexes"
    ];

    sectionsToRemove.forEach(sectionId => {
      const section = doc.getElementById(sectionId);
      section?.parentElement?.remove();
    });

    const infobox = doc.querySelector('.infobox');
    let cleanedContent = '';

    if (infobox) {
      const parent = infobox.parentElement;
      if (parent) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('infobox-wrapper');

        const tables = infobox.querySelectorAll('table');
        tables.forEach((table, index) => {
          if (index >= 2) table.remove();
        });

        Array.from(parent.children).forEach(child => {
          if (child !== infobox) {
            wrapper.appendChild(child);
          }
        });

        parent.innerHTML = '';
        parent.appendChild(wrapper);
        parent.appendChild(infobox);

        parent.style.display = 'flex';
        parent.style.justifyContent = 'center';
        parent.style.alignItems = 'center';
        parent.style.flexDirection = 'row';
        parent.style.gap = '20px';
        parent.style.width = "100%";
      }
    }

    cleanedContent += doc.body.innerHTML;

    return cleanedContent;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${title}`);
        const data = await response.text();
        const cleanedContent = cleanArticle(data);
        if (isMounted) {
          setContent(cleanedContent);
          if (hasSnailArtifact) {
            activateSnail();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
      }
    };
    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [title, hasSnailArtifact, activateSnail, cleanArticle]);

  useEffect(() => {
    const articleTitle = document.getElementById("article_tit");
    if (articleTitle) {
      articleTitle.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [title]);

  useEffect(() => {
    const container = document.querySelector('.article-content');
    if (!container) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A') {
        if (isActive) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        const newTitle = target.getAttribute("title");
        if (newTitle) {
          updateHistoryAndMap(newTitle);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [content, isActive, updateHistoryAndMap, ]);

  useEffect(() => {
    const container = document.querySelector('.article-content');
    if (!container) return;

    if (isActive) {
      container.classList.add('links-disabled');
    } else {
      container.classList.remove('links-disabled');
    }
  }, [isActive]);

  return (
    <div className="article-container">
      <p id="article_tit" className="article_title">{title}</p>
      <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
      <MemoizedSnailArtifactOverlay isActive={isActive} remainingTime={remainingTime} />
      <MemoizedSnailTimer isActive={isActive} remainingTime={remainingTime} />
    </div>
  );
};
