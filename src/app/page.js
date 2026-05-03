import { defaultHomePage } from '../data/defaultPages';
import PageRenderer from '../components/PageRenderer';

export default function Home() {
  return <PageRenderer pageData={defaultHomePage} />;
}
