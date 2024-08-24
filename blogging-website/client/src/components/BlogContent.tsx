import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogContentProps {
    content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
    return (
        <div className='markdown-body'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
};

export default BlogContent;
