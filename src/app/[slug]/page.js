import { getPage } from '../../lib/storage';
import PageRenderer from '../../components/PageRenderer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function SlugPage({ params }) {
  const pageData = getPage(params.slug);
  if (!pageData) notFound();
  return <PageRenderer pageData={pageData} />;
}
