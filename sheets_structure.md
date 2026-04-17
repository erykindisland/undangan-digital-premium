# Google Sheets Structure for Digital Invitation

To make the system work, create a Google Sheet and name the first tab `Customers`. Set the following headers in the first row (Row 1):

| Column | Header Name | Description |
| :--- | :--- | :--- |
| A | `Slug` | Unique URL identifier (e.g., `budi-ani-wedding`) |
| B | `GroomName` | Name of the groom |
| C | `BrideName` | Name of the bride |
| D | `Date` | Wedding date (YYYY-MM-DD) |
| E | `Time` | Wedding time (HH:mm) |
| F | `LocationName` | Name of the venue |
| G | `MapURL` | Google Maps embed URL or coordinate string |
| H | `GalleryURLs` | Comma-separated image URLs |
| I | `MusicURL` | Background music URL (optional) |
| J | `RSVPData` | JSON string of RSVP responses (handled by script) |
| K | `Status` | `Pending` or `Published` |

> [!TIP]
> The `Slug` should be lowercase and unique. The script will search for this slug to fetch the data.
