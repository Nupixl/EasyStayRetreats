import WebflowPage from "../../components/WebflowPage";
import { loadWebflowPage } from "../../lib/loadWebflowPage";

const SUPPORTED_PAGES = [
  "rental-management",
  "management-services",
  "about-property-management",
];

export default function PropertyOwnersPage(props) {
  return <WebflowPage {...props} />;
}

export async function getStaticPaths() {
  const paths = SUPPORTED_PAGES.map((page) => ({ params: { page } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { page } = params;
  if (!SUPPORTED_PAGES.includes(page)) {
    return { notFound: true };
  }

  const pageData = loadWebflowPage(`property-owners/${page}.html`);

  return {
    props: {
      title: pageData.title,
      description: pageData.description,
      bodyHtml: pageData.body,
      pageId: pageData.pageId,
      siteId: pageData.siteId,
    },
  };
}
