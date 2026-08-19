import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
  const sanitized = DOMPurify.sanitize(html);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
