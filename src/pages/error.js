import { Helmet } from "react-helmet";
import ErrorView from "views/error";
import { Wrapper } from "components-ui";

export default function Error() {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Error | Union</title>
        <meta property="og:title" content="404 | Union" />
        <meta name="twitter:title" content="404 | Union" />
      </Helmet>

      <Wrapper>
        <ErrorView
          title="Oh no! You just came across an error."
          content="Something broke while you were using the app. Try reloading the page or use one of the helpful links below."
        />
      </Wrapper>
    </div>
  );
}
