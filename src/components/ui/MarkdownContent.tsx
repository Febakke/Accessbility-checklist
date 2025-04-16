import { Paragraph, Heading, Link } from '@digdir/designsystemet-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface MarkdownContentProps {
  children: string
  size?: 'small' | 'medium' | 'large'
}

export function MarkdownContent({ children, size = 'medium' }: MarkdownContentProps) {
  const components: Components = {
    p: ({ children }) => (
      <Paragraph data-size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'}>
        {children}
      </Paragraph>
    ),
    h1: ({ children }) => <Heading level={1} data-size="xl">{children}</Heading>,
    h2: ({ children }) => <Heading level={2} data-size="lg">{children}</Heading>,
    h3: ({ children }) => <Heading level={3} data-size="md">{children}</Heading>,
    a: ({ href, children }) => (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    ul: ({ children }) => <ul className="markdown-list">{children}</ul>,
    ol: ({ children }) => <ol className="markdown-list">{children}</ol>,
    li: ({ children }) => <li className="markdown-list-item">{children}</li>,
  }

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
} 