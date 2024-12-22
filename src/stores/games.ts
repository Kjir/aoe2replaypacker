import { ref } from 'vue'
import { defineStore } from 'pinia'
import wasm from 'aoe2rec-js?init'

export const useGamesStore = defineStore('games', () => {
	const games = ref({});
	async function parseGame(file: File) {
		const reader = new FileReader();
		reader.addEventListener('loadend', (event) => {
			wasm().then((instance: any) => {
				if (!event.target || !event.target.result) {
					console.log("Could not find target");
					return;
				}
				try {
					const rec = instance.parse_rec(event.target.result);
					games.value = { ...games.value, [file.name]: rec };
				} catch (error) {
					console.error("Failed to parse");
					console.error(error);
				}
			})
		}, false);
		reader.readAsArrayBuffer(file);
	}
	return { games, parseGame };
})
