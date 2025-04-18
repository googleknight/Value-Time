# ValueTime

A beautiful Chrome extension that transforms your new tab into a time management dashboard, helping you stay mindful of your remaining time each day. Inspired by the ["Motivation"](https://goo.gl/0jLNqw) Chrome extension.

## Features

- 🕒 **Dynamic Time Countdown**: Track hours, minutes, seconds, and milliseconds remaining in your day with precision.
- ⏱️ **Multiple Timer Management**: Create, edit, and switch between custom timers with personalized labels.
- ⚡ **Quick Timer Navigation**: Easily toggle between different countdowns with the "Next Timer" button.
- 💡 **Daily Inspiration**: Fresh motivational quotes with each new tab.
- 🌓 **Enhanced Themes**: Elegant dark mode and light mode with smooth transitions.
- 📱 **Responsive Design**: Mobile-optimized for perfect viewing on any device.
- 🔒 **Privacy Focused**: No personal data collection, only anonymous analytics.
- 🖌️ **Beautiful Design**: Clean, modern interface with refined typography.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/screens/Dark.png" alt="Dark Theme Screenshot"/>
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/screens/Light.png" alt="Light Theme Screenshot"/> 
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/screens/Custom%20timer.png" alt="Custom Timer Screenshot"/>
  <img src="https://raw.githubusercontent.com/googleknight/Value-Time/master/screens/Settings.png" alt="Settings Screenshot"/>
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

### Architecture Overview

ValueTime follows a modular architecture pattern to make the codebase maintainable and extensible:

- **Core Components (`app/components/`)**: Reusable UI components that handle specific features like timers, settings panels, and onboarding flows.

- **State Management (`app/managers/`)**: Service modules that handle specific functionality:

  - `timerManager.js`: Core timer logic and custom timer handling
  - `quoteManager.js`: Fetches and rotates motivational quotes
  - `themeManager.js`: Handles theme switching between light/dark modes
  - `storageManager.js`: Manages persistent data using Chrome's storage API
  - `settingsManager.js`: User preferences and configuration
  - `uiManager.js`: Controls UI updates and interactions

- **Page Controllers (`app/pages/`)**: Orchestrate components and manage page-specific logic for main view, settings, and onboarding.

- **Utilities (`app/utils/`)**: Shared helper functions, constants, DOM manipulation, and an event bus for communication between modules.

- **Entry Points**:
  - `home.html`: Main extension page that loads when opening a new tab
  - `app.js`: Application bootstrap that initializes the extension
  - `timeapp.js`: Core time calculation and display logic

### Key Files for New Contributors

If you're new to the project, start by exploring these files:

- `app/timeapp.js`: Main application logic for time calculations
- `app/managers/timerManager.js`: Custom timer implementation
- `app/components/timer.js`: Timer UI component
- `css/style.css`: Styling and theme definitions
- `manifest.json`: Extension configuration and permissions

## Use Cases

ValueTime helps you:

- Stay mindful of your time throughout the day
- Maintain productivity with visual time tracking
- Bring intention to your digital workflow
- Set custom countdowns for different projects or tasks
- Perfect for professionals, students, and anyone looking to make the most of their day

## Privacy

ValueTime takes your privacy seriously. We only collect anonymous usage statistics to improve the extension. Read our [Privacy Policy](PRIVACY.md) for more details.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

Copyright (c) 2025 Shubham Mathur. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or concerns, please contact:

- Email: shubham.mathur.wrk@gmail.com
- GitHub Issues: [Create an issue](https://github.com/googleknight/Value-Time/issues)
