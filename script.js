
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);

  // Country selector elements
  const countrySearch = $("#countrySearch");
  const countryToggle = $("#countryToggle");
  const countryResults = $("#countryResults");
  const selectedFlag = $("#selectedFlag");
  const dialCodePreview = $("#dialCodePreview");
  const countryError = $("#countryError");

  // Phone form elements
  const phoneForm = $("#phoneForm");
  const phoneNumber = $("#phoneNumber");
  const phoneError = $("#phoneError");
  const phoneResults = $("#phoneResults");
  const callLink = $("#callLink");
  const whatsappLink = $("#whatsappLink");
  const editPhoneButton = $("#editPhoneButton");
  const formStatus = $("#formStatus");

  // Telegram elements
  const telegramForm = $("#telegramForm");
  const telegramUsername = $("#telegramUsername");
  const telegramUsernameError = $("#telegramUsernameError");

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  let countries = [];
  let filteredCountries = [];
  let selectedCountry = null;
  let activeIndex = -1;
  let searchTimer = null;

  const MAX_RESULTS = 30;

  function showError(element, message) {
    if (!element) return;

    element.textContent = message;
    element.hidden = !message;
  }

  function clearPhoneErrors() {
    showError(phoneError, "");
    showError(countryError, "");

    if (formStatus) {
      formStatus.textContent = "";
    }
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function flagFromISO(iso) {
    if (!/^[A-Z]{2}$/.test(iso || "")) {
      return "🌐";
    }

    return [...iso]
      .map((letter) =>
        String.fromCodePoint(letter.charCodeAt(0) + 127397)
      )
      .join("");
  }

  function setDropdown(open) {
    countryResults.hidden = !open;
    countrySearch.setAttribute("aria-expanded", String(open));
    countryToggle.setAttribute("aria-expanded", String(open));

    if (!open) {
      activeIndex = -1;
      updateActiveOption();
    }
  }

  function getCountrySearchText(country) {
    return normalize(
      [
        country.name,
        country.iso2,
        country.dialCode,
        country.flag
      ].join(" ")
    );
  }

  function searchCountries(query) {
    const term = normalize(query);
    const digits = term.replace(/[^\d]/g, "");

    if (!term) {
      return [...countries].sort((a, b) => {
        if (a.iso2 === "IN") return -1;
        if (b.iso2 === "IN") return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return countries
      .map((country) => {
        const name = normalize(country.name);
        const iso = normalize(country.iso2);
        const dial = normalize(country.dialCode);
        const dialDigits = dial.replace(/[^\d]/g, "");

        let score = 0;

        if (name === term) score = 100;
        else if (iso === term) score = 95;
        else if (dial === term) score = 90;
        else if (name.startsWith(term)) score = 80;
        else if (iso.startsWith(term)) score = 75;
        else if (term.startsWith("+") && dial.startsWith(term)) score = 85;
        else if (digits && dialDigits === digits) score = 70;
        else if (digits && dialDigits.startsWith(digits)) score = 60;
        else if (name.includes(term)) score = 50;
        else if (iso.includes(term)) score = 45;
        else if (dial.includes(term)) score = 40;

        return { country, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) =>
        b.score - a.score ||
        a.country.name.localeCompare(b.country.name)
      )
      .map((item) => item.country);
  }

  function updateActiveOption() {
    const options = countryResults.querySelectorAll(".country-option");

    options.forEach((option, index) => {
      const active = index === activeIndex;

      option.classList.toggle("active", active);
      option.setAttribute("aria-selected", String(active));

      if (active) {
        countrySearch.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });

    if (activeIndex < 0) {
      countrySearch.removeAttribute("aria-activedescendant");
    }
  }

  function renderCountries(list) {
    filteredCountries = list;
    activeIndex = -1;
    countryResults.replaceChildren();

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "country-empty";
      empty.textContent = countries.length
        ? "No matching country found."
        : "Country data is not available.";

      countryResults.appendChild(empty);
      setDropdown(true);
      return;
    }

    const fragment = document.createDocumentFragment();
    const visibleCountries = list.slice(0, MAX_RESULTS);

    visibleCountries.forEach((country, index) => {
      const option = document.createElement("button");

      option.type = "button";
      option.className = "country-option";
      option.id = `country-option-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");

      const flag = document.createElement("span");
      flag.className = "country-option-flag";
      flag.textContent = country.flag;
      flag.setAttribute("aria-hidden", "true");

      const info = document.createElement("span");
      info.className = "country-option-info";

      const name = document.createElement("span");
      name.className = "country-option-name";
      name.textContent = country.name;

      const iso = document.createElement("span");
      iso.className = "country-option-iso";
      iso.textContent = country.iso2;

      const code = document.createElement("span");
      code.className = "country-option-code";
      code.textContent = country.dialCode;

      info.append(name, iso);
      option.append(flag, info, code);

      option.addEventListener("click", () => {
        selectCountry(country);
      });

      fragment.appendChild(option);
    });

    countryResults.appendChild(fragment);
    setDropdown(true);
  }

  function selectCountry(country) {
    selectedCountry = country;

    selectedFlag.textContent = country.flag;
    countrySearch.value = `${country.name} (${country.dialCode})`;
    countrySearch.placeholder = "Search country or code...";
    dialCodePreview.textContent = country.dialCode;

    showError(countryError, "");
    countrySearch.setCustomValidity("");

    setDropdown(false);

    if (phoneResults) {
      phoneResults.hidden = true;
    }

    if (formStatus) {
      formStatus.textContent = "";
    }
  }

  function updateSearch() {
    const query = countrySearch.value;

    // Typing after selecting a country requires a fresh selection.
    selectedCountry = null;
    selectedFlag.textContent = "🌐";
    dialCodePreview.textContent = "Select country";

    showError(countryError, "");
    countrySearch.setCustomValidity("");

    if (phoneResults) {
      phoneResults.hidden = true;
    }

    if (formStatus) {
      formStatus.textContent = "";
    }

    renderCountries(searchCountries(query));
  }

  async function loadCountries() {
    countrySearch.disabled = true;
    countryToggle.disabled = true;
    countrySearch.placeholder = "Loading countries...";

    try {
      const response = await fetch("data/countries.json", {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid country data format");
      }

      const seen = new Set();

      countries = data
        .filter((item) => {
          if (
            typeof item.name !== "string" ||
            typeof item.iso2 !== "string" ||
            typeof item.dialCode !== "string"
          ) {
            return false;
          }

          const name = item.name.trim();
          const iso2 = item.iso2.trim().toUpperCase();
          const dialCode = item.dialCode.trim();

          if (
            !name ||
            !/^[A-Z]{2}$/.test(iso2) ||
            !/^\+\d+$/.test(dialCode)
          ) {
            return false;
          }

          // Multiple countries can share a dial code.
          // Deduplicate by ISO code, not by dial code.
          if (seen.has(iso2)) {
            return false;
          }

          seen.add(iso2);
          return true;
        })
        .map((item) => {
          const iso2 = item.iso2.trim().toUpperCase();

          return {
            name: item.name.trim(),
            iso2,
            dialCode: item.dialCode.trim(),
            flag: item.flag || flagFromISO(iso2)
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      countrySearch.disabled = false;
      countryToggle.disabled = false;
      countrySearch.placeholder = "Search India, IN, +91...";

      // Prefer India as the initial selection when available.
      const india = countries.find((country) => country.iso2 === "IN");

      if (india) {
        selectCountry(india);
      } else {
        selectedCountry = null;
        selectedFlag.textContent = "🌐";
        dialCodePreview.textContent = "Select country";
      }
    } catch (error) {
      console.error("Unable to load countries:", error);

      countries = [];
      selectedCountry = null;

      countrySearch.disabled = true;
      countryToggle.disabled = true;
      countrySearch.placeholder = "Country data could not load";

      selectedFlag.textContent = "🌐";
      dialCodePreview.textContent = "Unavailable";

      showError(
        countryError,
        "Could not load country data. Check data/countries.json and run the site using a local server."
      );
    }
  }

  // Country search events
  countrySearch.addEventListener("input", () => {
    clearTimeout(searchTimer);

    selectedCountry = null;
    selectedFlag.textContent = "🌐";
    dialCodePreview.textContent = "Select country";

    showError(countryError, "");

    if (phoneResults) phoneResults.hidden = true;
    if (formStatus) formStatus.textContent = "";

    updateSearch();
  });

  countrySearch.addEventListener("focus", () => {
    if (!countries.length) return;

    if (selectedCountry) {
      countrySearch.select();
      renderCountries(searchCountries(""));
    } else {
      renderCountries(searchCountries(countrySearch.value));
    }
  });

  countryToggle.addEventListener("click", () => {
    if (!countries.length) return;

    if (!countryResults.hidden) {
      setDropdown(false);
      return;
    }

    countrySearch.focus();
    renderCountries(searchCountries(countrySearch.value));
  });

  countrySearch.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (countryResults.hidden) {
        renderCountries(searchCountries(countrySearch.value));
      }

      if (filteredCountries.length) {
        activeIndex = Math.min(activeIndex + 1, MAX_RESULTS - 1);
        activeIndex = Math.min(activeIndex, filteredCountries.length - 1);
        updateActiveOption();
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveOption();
    }

    if (event.key === "Enter" && !countryResults.hidden) {
      if (activeIndex >= 0 && filteredCountries[activeIndex]) {
        event.preventDefault();
        selectCountry(filteredCountries[activeIndex]);
      }
    }

    if (event.key === "Escape") {
      setDropdown(false);
    }
  });

  document.addEventListener("click", (event) => {
    const selector = $(".country-selector");

    if (selector && !selector.contains(event.target)) {
      setDropdown(false);
    }
  });

  // Phone validation and link generation
  function getPhoneDigits() {
    return phoneNumber.value.replace(/\D/g, "");
  }

  function validatePhone() {
    clearPhoneErrors();

    if (!selectedCountry) {
      showError(countryError, "Please search for and select a country.");
      countrySearch.focus();
      return null;
    }

    const raw = phoneNumber.value.trim();
    const digits = getPhoneDigits();

    if (!raw) {
      showError(phoneError, "Please enter a phone number.");
      phoneNumber.focus();
      return null;
    }

    if (!/^[\d\s().-]+$/.test(raw)) {
      showError(phoneError, "Enter a valid phone number using digits only.");
      phoneNumber.focus();
      return null;
    }

    if (digits.length < 4 || digits.length > 15) {
      showError(phoneError, "The phone number must contain 4–15 digits.");
      phoneNumber.focus();
      return null;
    }

    // Avoid accidentally adding the same calling code twice.
    const dialDigits = selectedCountry.dialCode.replace(/\D/g, "");

    if (
      dialDigits &&
      digits.startsWith(dialDigits) &&
      digits.length > dialDigits.length + 4
    ) {
      showError(
        phoneError,
        `Remove the country code ${selectedCountry.dialCode} from the phone field.`
      );
      phoneNumber.focus();
      return null;
    }

    return {
      nationalNumber: digits,
      internationalNumber: `${dialDigits}${digits}`
    };
  }

  phoneForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = validatePhone();

    if (!result) {
      if (phoneResults) phoneResults.hidden = true;
      return;
    }

    const telNumber = `+${result.internationalNumber}`;

    callLink.href = `tel:${telNumber}`;
    whatsappLink.href = `https://wa.me/${result.internationalNumber}`;

    phoneResults.hidden = false;

    if (formStatus) {
      formStatus.textContent = "Choose Call or WhatsApp to continue.";
    }
  });

  phoneNumber.addEventListener("input", () => {
    showError(phoneError, "");

    if (phoneResults) {
      phoneResults.hidden = true;
    }

    if (formStatus) {
      formStatus.textContent = "";
    }
  });

  if (editPhoneButton) {
    editPhoneButton.addEventListener("click", () => {
      phoneResults.hidden = true;
      phoneNumber.focus();

      if (formStatus) {
        formStatus.textContent = "";
      }
    });
  }

  // Telegram username validation
  telegramForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showError(telegramUsernameError, "");

    const username = telegramUsername.value.trim().replace(/^@+/, "");

    if (!username) {
      showError(
        telegramUsernameError,
        "Please enter a Telegram username."
      );
      telegramUsername.focus();
      return;
    }

    if (!/^[A-Za-z0-9_]{5,32}$/.test(username)) {
      showError(
        telegramUsernameError,
        "Username must be 5–32 characters and contain only letters, numbers, or underscores."
      );
      telegramUsername.focus();
      return;
    }

    window.open(
      `https://t.me/${encodeURIComponent(username)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  telegramUsername.addEventListener("input", () => {
    showError(telegramUsernameError, "");
  });

  // Start loading the JSON dataset.
  loadCountries();
});
