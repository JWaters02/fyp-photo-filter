import { auth, database } from '../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref, query, orderByChild, equalTo, get } from "firebase/database";

export const registerFamilyAdmin = async (lastName: string, email: string, password: string, password2: string) => {
    if (!lastName || !email || !password || !password2) {
        console.error('All fields are required.');
        return { status: 'error', message: 'All fields are required.' };
    }
    
    if (password !== password2) {
        console.error('Passwords do not match.');
        return { status: 'error', message: 'Passwords do not match.' };
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        const familyName = `${lastName}${Math.floor(1000 + Math.random() * 9000)}`;

        await set(ref(database, `user_profiles/${familyName}/admin/${uid}`), {
            uid: uid,
            role: "admin"
        });

        console.log('Family admin registered with familyName:', familyName);
        return { status: 'success', message: `Family admin registered with familyName: ${familyName}` };
    } catch (error) {
        console.error('Error registering family admin:', error);
        return { status: 'error', message: 'Error registering family admin!' };
    }
};

export const registerFamilyUser = async (familyName: string, firstName: string, lastName: string, email: string, password: string, password2: string) => {
    if (!firstName || !lastName || !email || !password || !password2) {
        console.error('All fields are required.');
        return { status: 'error', message: 'All fields are required.' };
    }

    if (password !== password2) {
        console.error('Passwords do not match.');
        return { status: 'error', message: 'Passwords do not match.' };
    }

    try {
        const familyRef = ref(database, `user_profiles/${familyName}`);
        const familySnapshot = await get(familyRef);

        if (familySnapshot.exists()) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await set(ref(database, `user_profiles/${familyName}/user/${uid}`), {
                uid: uid,
                firstName: firstName,
                lastName: lastName,
                role: 'user'
            });

            console.log('Family user registered under familyName:', familyName);
            return { status: 'success', message: `Family user registered with family name: ${familyName}` };
        } else {
            console.error('FamilyName does not exist.');
            return { status: 'error', message: 'Family name does not exist.' };
        }
    } catch (error) {
        console.error('Error registering family user:', error);
        return { status: 'error', message: 'Error registering family user!' };
    }
};