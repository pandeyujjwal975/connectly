<div align="center">

# 🔗 Connectly

### Connect instantly. No saving numbers.

A simple, modern way to connect through phone calls, WhatsApp, and Telegram — without saving contacts.

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/Data-JSON-5E8C61?style=for-the-badge&logo=json&logoColor=white)

<br>

[Features](#-features) ·
[Installation](#-installation) ·
[Usage](#-usage) ·
[Project Structure](#-project-structure) ·
[Author](#-author)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Country Search** | Search countries by name, ISO code, or international calling code. |
| 🏳️ **Country Flags** | Display the selected country's flag and calling code. |
| 📞 **Direct Calling** | Generate a phone link using the selected international calling code. |
| 💬 **WhatsApp** | Open a WhatsApp conversation without saving the contact first. |
| ✈️ **Telegram** | Open a Telegram profile using its username. |
| 🔎 **Input Validation** | Validate phone numbers and Telegram usernames before continuing. |
| 📱 **Responsive UI** | Use the interface on mobile devices and desktop browsers. |
| 📂 **JSON Dataset** | Load country information from a local JSON file. |

## 🖥️ Preview

The interface includes:

- A clean navigation header and introductory section.
- A phone and WhatsApp lookup card.
- A searchable international country selector.
- A Telegram username lookup card.
- A features section and footer.

> Screenshots can be added here after capturing the finished application.

## 🧰 Tech Stack

- **HTML5** — page structure
- **CSS3** — styling and responsive layout
- **Vanilla JavaScript** — search, selection, validation, and link generation
- **JSON** — country names, ISO codes, calling codes, and flags
- **Python 3** — local development server
- **Font Awesome** — interface icons
- **DM Sans** — interface typography

## 📁 Project Structure

```text
connectly/
├── index.html
├── style.css
├── script.js
├── build_countries.py
├── README.md
└── data/
    └── countries.json
```

| File | Purpose |
|---|---|
| `index.html` | Main website structure |
| `style.css` | Layout, components, dropdown, and responsive styling |
| `script.js` | Country search, selection, validation, and contact links |
| `build_countries.py` | Generates the country JSON from the downloaded source dataset |
| `data/countries.json` | Country names, ISO codes, calling codes, and flags |

## ⚙️ Installation

### Requirements

- Python 3
- A modern web browser
- Internet access for externally hosted fonts, icons, and external contact services

### 1. Open the project directory

```bash
cd ~/connectly
```

### 2. Start the local server

```bash
python3 -m http.server 8080
```

### 3. Open Connectly

Visit this address in your browser:

**http://127.0.0.1:8080**

Keep the terminal open while using the local server. Press `Ctrl + C` to stop it.

> Run the site through a local server instead of opening `index.html` directly, because JavaScript uses `fetch()` to load the JSON dataset.

## 🚀 Usage

### 📞 Phone & WhatsApp

1. Open the country selector.
2. Search by country name, ISO code, or calling code.
3. Select a country from the results.
4. Enter the phone number without repeating the country calling code.
5. Click **Show options**.
6. Choose **Call** or **WhatsApp**.

### ✈️ Telegram

1. Enter a Telegram username, with or without `@`.
2. Click **Open Telegram**.
3. Continue in the Telegram application or browser.

The application opens a Telegram profile URL; it does not guarantee that a profile exists or is accessible.

## 🌐 Country Dataset

Country records are stored in `data/countries.json`.

Example:

```json
{
  "name": "India",
  "iso2": "IN",
  "dialCode": "+91",
  "flag": "🇮🇳"
}
```

The selector can use these fields to match country names, ISO codes, and calling codes.

**Important data considerations:**

- Multiple countries can share the same calling code.
- Use ISO country codes to distinguish countries with shared calling codes.
- The current third-party dataset contains 242 source entries before filtering. It may not cover every territory or special numbering-plan entry.
- Verify and maintain the dataset before using it in production.

## 🔐 Privacy & Security

- Connectly is designed to generate contact links without requiring users to save phone numbers as contacts.
- The `tel:` link opens a compatible calling application; it does not place a call automatically.
- WhatsApp and Telegram links may send the user to external applications or websites.
- External services apply their own privacy policies and data-handling practices.

Avoid entering sensitive personal information into websites you do not trust.

## 🛠️ Troubleshooting

**Country list is empty**

- Check that `data/countries.json` exists.
- Confirm that the JSON contains valid records.
- Run the site through the Python local server.
- Check the browser console for loading errors.

**Calling code is incorrect**

- Select the correct country from the results.
- Enter only the national phone number in the phone input.
- Remember that some countries share calling codes.

**Changes are not visible**

- Refresh the page.
- If necessary, perform a hard refresh to reload the latest CSS and JavaScript.

## 🗺️ Roadmap

- [ ] Verify and expand international country coverage.
- [ ] Improve country search and keyboard accessibility.
- [ ] Add a screenshot of the finished interface.
- [ ] Test on different mobile and desktop browsers.
- [ ] Prepare the project for public release.

## 👨‍💻 Author

**Ujjwal Pandey**

[![GitHub](https://img.shields.io/badge/GitHub-pandeyujjwal975-181717?style=for-the-badge&logo=github)](https://github.com/pandeyujjwal975)

---

<div align="center">

Made with care by **Ujjwal Pandey**

🔗 **Connectly** — Simple connections, made easier.

</div>
