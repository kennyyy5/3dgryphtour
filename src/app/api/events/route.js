import puppeteer from "puppeteer";

export async function GET() {
  const urls = [
    "https://news.uoguelph.ca/events/list/page/1/",
    "https://news.uoguelph.ca/events/list/page/2/",
    "https://news.uoguelph.ca/events/list/page/3/",
  ];

  const selector = ".tribe-events-calendar-list__event-header";

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    const allEvents = [];

    for (const url of urls) {
      console.log(`Scraping: ${url}`);
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (retries < maxRetries && !success) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 });
          success = true;
        } catch (err) {
          retries++;
          console.warn(`Retry ${retries} for ${url}...`);
          await page.reload({ waitUntil: "networkidle2" });
        }
      }

      if (!success) {
        console.error(`Failed to load events from ${url} after ${maxRetries} retries.`);
        continue; // Skip this page
      }

      const events = await page.evaluate(() => {
        const headers = document.querySelectorAll(
          ".tribe-events-calendar-list__event-header"
        );

        return Array.from(headers).map((header) => {
          const link = header.querySelector("h3 a");
          const time = header.querySelector("time");
          const venueTitle = header.querySelector(
            ".tribe-events-calendar-list__event-venue-title"
          );
          const venueAddress = header.querySelector(
            ".tribe-events-calendar-list__event-venue-address"
          );

          return {
            title: link?.innerText.trim() || "",
            url: link?.href || "",
            datetime: time?.innerText.trim() || "",
            location: [
              venueTitle?.innerText.trim(),
              venueAddress?.innerText.trim(),
            ]
              .filter(Boolean)
              .join(", "),
          };
        });
      });

      allEvents.push(...events);
    }

    await browser.close();
    return Response.json({ events: allEvents });
  } catch (error) {
    console.error("Scraping failed:", error);
    return Response.json({ events: [], error: error.message }, { status: 500 });
  }
}
