import Head from "next/head";

export default function FourOhFour() {
  return (
    <div>
      <Head>
        <title>404 | Union</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="text-center pt-32 pb-64">
          <h1>This page doesn’t exist</h1>
          <p className="text-lg mt-4">
            You might have mistyped the address, or the page might have moved.
          </p>
        </div>
      </div>
    </div>
  );
}
