# ValueTime

A beautiful Chrome extension that transforms your new tab into a time management dashboard, helping you stay mindful of your remaining time each day. Inspired by the ["Motivation"](https://goo.gl/0jLNqw) Chrome extension.

## Features

- 🕒 **Time Remaining Display**: Shows precise countdown of hours, minutes, seconds, milliseconds left in your day.
- 💡 **Motivational Quotes**: Fresh inspirational quotes with each new tab.
- 🌓 **Theme Options**: Elegant light and dark themes with smooth transitions.
- 📱 **Responsive Design**: Beautiful on all screen sizes.
- 🔒 **Privacy Focused**: No personal data collection, only anonymous analytics.
- ⚡ **Lightweight**: Fast loading with minimal resource usage.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/Dark.png" alt="Dark Theme Screenshot"/>
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/Light.png" alt="Light Theme Screenshot"/> 
</p>

## Installation

### Chrome Web Store
The easiest way to install ValueTime is through the [Chrome Web Store](https://chrome.google.com/webstore/detail/valuetime/badapfgpjjaagnahmlfkhpomblifhiaj).

### Manual Installation
1. Download the latest release from the [releases page](https://github.com/googleknight/Value-Time/releases)
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

## Development

### Prerequisites
- Google Chrome (v88 or higher)
- Basic knowledge of HTML, CSS, and JavaScript

### Local Setup
1. Clone this repository
```bash
git clone https://github.com/googleknight/Value-Time.git
cd Value-Time
```

2. Load the extension in Chrome:
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked" and select the project directory

### Project Structure
```
Value-Time/
├── app/
│   ├── timeapp.js    # Main application logic
│   └── quotes.json   # Quotes database
├── css/
│   └── style.css     # Styles and theming
├── js/
│   └── analytics.js  # Analytics implementation
├── manifest.json     # Extension configuration
└── home.html        # New tab page template
```

## Privacy

ValueTime takes your privacy seriously. We only collect anonymous usage statistics to improve the extension. Read our [Privacy Policy](PRIVACY.md) for more details.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or concerns, please contact:
- Email: shubham.mathur.wrk@gmail.com
- GitHub Issues: [Create an issue](https://github.com/googleknight/Value-Time/issues)
