import { Editor } from './editor';

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params; // 异步获取路径参数
  return (
    <div>
      DocumentI: {documentId}
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
