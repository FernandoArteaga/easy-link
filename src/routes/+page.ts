import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/firebase';

export const load = async () => {
	if (!auth.currentUser) {
		throw redirect(302, '/login');
	}

	return { user: auth.currentUser };
};
