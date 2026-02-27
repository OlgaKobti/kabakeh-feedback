export default function Head() {
    return (
      <>
        <title>Kabakeh Menu</title>
        <meta name="description" content="Kabakeh Restaurant Menu" />
  
        {/* Force favicon with a NEW filename to bypass all cache */}
        <link rel="icon" href="/kabakeh-favicon.png" />
        <link rel="apple-touch-icon" href="/kabakeh-favicon.png" />
      </>
    );
  }