// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	type Nullable<T> = T | null;

	namespace Firestore {
		type Link = {
			id: string;
			url: string;
			timestamp: number;
		};

		type CreateLink = {
			url: string;
		};
	}
}

export {};
