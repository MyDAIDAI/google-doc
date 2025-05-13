interface DocumentIdPageProps {
  params: Promise<{documentId: string}>
}

const DocumentIdPage = ({params}: DocumentIdPageProps) => {
  const documentId = params.documentId;
  return <>DocumentI: {documentId}</>;
}

export default DocumentIdPage