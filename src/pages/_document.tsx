import Document, { Html, Head, Main, NextScript} from 'next/document';

export default class MyDocument extends Document {
  render(){
    return(
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
          <link rel="icon" href="/favicon.png" type="image/png" />
          <link rel="icon" href="/favicon.svg" type="image/svg" />
          <link rel="mask-icon" href="/favicon.svg" color="#6489e8" />
          <meta name="theme-color" content="#6489e8"></meta>

          {/* preload icons */}
          {[
            "/repeat-one.svg",
            "/shuffle.svg",
            "/playing.anim.svg",
            "/playing.svg",
            "/pause.svg",
            "/play.svg",
          ].map((url) => (
            <link rel="preload" href={url} as="image" />
          ))}
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}
