function ErrorPage({ statusCode }) {
  const message =
    statusCode === 404
      ? "Sorry, we couldn’t find that page."
      : "Something went wrong on our end.";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
        {statusCode || "Error"}
      </h1>
      <p style={{ fontSize: "1.125rem", maxWidth: "28rem", color: "#4a5568" }}>
        {message}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
