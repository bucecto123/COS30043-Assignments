const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      searchText: "",
      tableCategory: "All",
      categories: ["Technology", "Business", "Marketing", "Finance"],
      username: "",
      password: "",
      confirmPassword: "",
      regCategory: "Business",
      regEventName: "",
      submittedSummary: null,
      loadError: ""
    };
  },
  computed: {
    filteredEvents() {
      const query = this.searchText.trim().toLowerCase();
      return this.events.filter((event) => {
        const matchesCategory =
          this.tableCategory === "All" || event.category === this.tableCategory;

        const matchesQuery =
          !query ||
          event.eventid.toLowerCase().includes(query) ||
          event.eventname.toLowerCase().includes(query) ||
          String(event.durationhour).includes(query);

        return matchesCategory && matchesQuery;
      });
    },
    passwordMismatch() {
      return (
        this.password.length > 0 &&
        this.confirmPassword.length > 0 &&
        this.password !== this.confirmPassword
      );
    },
    eventsForRegistration() {
      return this.events.filter((event) => event.category === this.regCategory);
    }
  },
  watch: {
    regCategory() {
      const list = this.eventsForRegistration;
      this.regEventName = list.length > 0 ? list[0].eventname : "";
    }
  },
  methods: {
    async loadEvents() {
      try {
        const response = await fetch("../events.txt");
        if (!response.ok) {
          throw new Error("Unable to load events.txt");
        }
        const text = await response.text();
        const normalized = text
          .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
          .replace(/'/g, '"');
        const data = JSON.parse(normalized);
        this.events = data;
        if (!this.regEventName && this.eventsForRegistration.length > 0) {
          this.regEventName = this.eventsForRegistration[0].eventname;
        }
      } catch (error) {
        this.loadError = "Unable to load events. Please check events.txt.";
        console.error(error);
      }
    },
    handleSubmit() {
      if (this.passwordMismatch) {
        this.submittedSummary = null;
        return;
      }
      this.submittedSummary = {
        username: this.username.trim(),
        category: this.regCategory,
        eventName: this.regEventName
      };
    }
  },
  mounted() {
    this.loadEvents();
  }
}).mount("#app");
