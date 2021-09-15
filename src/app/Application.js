import config from "../config";
import EventEmitter from "eventemitter3";

const EVENTS = {
	APP_READY: "app_ready",
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
	constructor() {
		super();

		this.config = config;
		this.data = {
			planets: [],
		};

		this.init();
	}

	static get events() {
		return EVENTS;
	}

	/**
	 * Initializes the app.
	 * Called when the DOM has loaded. You can initiate your custom classes here
	 * and manipulate the DOM tree. Task data should be assigned to Application.data.
	 * The APP_READY event should be emitted at the end of this method.
	 */
	async init() {
		// Initiate classes and wait for async operations here.
		const fetchGeneral = await fetch("https://swapi.boom.dev/api/planets");
		const dataGeneral = await fetchGeneral.json();
		let next = dataGeneral.next;

		let count = 1;

		while (next !== null) {
			const fetchData = await fetch(`https://swapi.boom.dev/api/planets?page=${count}`);
			// eslint-disable-next-line newline-after-var
			const data = await fetchData.json();
			next = data.next;
			count++;
			this.data.planets = [...this.data.planets, ...data.results];
		}

		// set the count for the planets count
		this.data.count = dataGeneral.count;
		this.emit(Application.events.APP_READY);
	}
}
