import WebflowPage from "../components/WebflowPage";
import { loadWebflowPage } from "../lib/loadWebflowPage";

export default function ContactPage(props) {
  return <WebflowPage {...props} />;
}

export async function getStaticProps() {
  const pageData = loadWebflowPage("contact.html");

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
