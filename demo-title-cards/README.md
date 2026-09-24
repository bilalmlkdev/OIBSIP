# Demo title cards

Static first-frame cards for OIBSIP demo videos (2 seconds each).

## Files

| File | Task |
|------|------|
| `01-LandingPage.png` | L1 Task 1 - Landing Page |
| `02-PersonalPortfolio.png` | L1 Task 2 - Personal Portfolio |
| `03-TemperatureConverter.png` | L1 Task 3 - Temperature Converter |
| `04-Calculator.png` | L2 Task 1 - Calculator |
| `05-TributePage.png` | L2 Task 2 - Tribute Page |
| `06-TodoApp.png` | L2 Task 3 - To-Do App |
| `07-LoginAuth.png` | L2 Task 4 - Login Auth |

Each `.png` is **1920x1080**, ready to drop into a video editor.

## How to use in the demo video

1. Place the matching `.png` as the first clip, duration **2 seconds**.
2. Cut straight to the screen recording (page walkthrough, 15-45s).
3. Export MP4 1080p.
4. Upload unlisted (Drive/YouTube) and link in README / LinkedIn.

## Regenerate PNGs

Open the matching `.html` in a browser and screenshot at 1920x1080, or:

```bash
cd demo-title-cards
# example with headless Chrome/Brave
brave --headless=new --screenshot=01-LandingPage.png --window-size=1920,1080 \
  "file://$PWD/01-LandingPage.html"
```

## Author

Bilal Malik · `#oasisinfobyte`
