import { auth, database } from '../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { set, ref, query, orderByChild, equalTo, get } from "firebase/database";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const idToken = await getIdToken(user, true);
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('uid', user.uid);
    } else {
        sessionStorage.removeItem('idToken');
        sessionStorage.removeItem('uid');
    }
});

export const login = async (familyName: string, email: string, password: string) => {
    if (!familyName || !email || !password) {
        return { status: 'error', message: 'All fields are required.' };
    }

    try {
        let uid = "";
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                uid = userCredential.user.uid;
            })
            .catch((error) => {
                return { status: 'error', message: error.message || 'Error logging in.' };
            });

        const familyRef = ref(database, `user_profiles/${familyName}`);
        const familySnapshot = await get(familyRef);

        if (familySnapshot.exists()) {
            const userRef = ref(database, `user_profiles/${familyName}/admin`);
            const userQuery = query(userRef, orderByChild('uid'), equalTo(uid));
            const userSnapshot = await get(userQuery);

            if (userSnapshot.exists()) {
                return { status: 'success', message: `Admin logged in with familyName: ${familyName}` };
            } else {
                const userRef = ref(database, `user_profiles/${familyName}/user`);
                const userQuery = query(userRef, orderByChild('uid'), equalTo(uid));
                const userSnapshot = await get(userQuery);

                if (userSnapshot.exists()) {
                    return { status: 'success', message: `User logged in with familyName: ${familyName}` };
                } else {
                    return { status: 'error', message: 'User does not exist in family.' };
                }
            }
        } else {
            return { status: 'error', message: 'Family name does not exist.' };
        }

    } catch (error) {
        return { status: 'error', message: 'Error logging in.' + error };
    }
};

export const logout = async () => {
    signOut(auth).then(() => {
        console.log('User signed out successfully.');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

export const reauthenticate = async () => {
    try {
        const idToken = sessionStorage.getItem('idToken');
        if (idToken) {
            return { status: 'success', message: 'User is authenticated.' };
        } else {
            return { status: 'error', message: 'User is not authenticated.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Error reauthenticating.' };
    }
}

const findUserPath = async (uid: string): Promise<string | null> => {
    const userProfilesRef = ref(database, 'user_profiles');
    const userProfilesSnapshot = await get(userProfilesRef);
    if (userProfilesSnapshot.exists()) {
        const userProfiles = userProfilesSnapshot.val();
        for (const familyName in userProfiles) {
            for (const role in userProfiles[familyName]) {
                if (userProfiles[familyName][role][uid]) {
                    return `user_profiles/${familyName}/${role}/${uid}`;
                }
            }
        }
    }
    return null;
};

export const getUserInfo = async (uid: string) => {
    try {
        const userPath = await findUserPath(uid);
        if (userPath) {
            const userRef = ref(database, userPath);
            const userSnapshot = await get(userRef);
            return userSnapshot.val();
        } else {
            return { status: 'error', message: 'User does not exist.' };
        }
    } catch (error: any) {
        return { status: 'error', message: `Error getting user info: ${error.message}` };
    }
};

export const setUserInfo = async (uid: string, firstName: string, lastName: string, age: number, sex: string, ethnicity: string, familyRole: string) => {
    if (!uid || !firstName || !lastName || !age || !sex || !ethnicity || !familyRole) {
        return { status: 'error', message: 'All fields are required.' };
    }

    try {
        const userPath = await findUserPath(uid);
        if (userPath) {
            await set(ref(database, userPath), {
                uid,
                firstName,
                lastName,
                age,
                sex,
                ethnicity,
                familyRole
            });
            return { status: 'success', message: 'User info updated.' };
        } else {
            return { status: 'error', message: 'User does not exist.' };
        }
    } catch (error: any) {
        return { status: 'error', message: `Error setting user info: ${error.message}` };
    }
};

export const registerFamilyAdmin = async (lastName: string, email: string, password: string, password2: string) => {
    if (!lastName || !email || !password || !password2) {
        return { status: 'error', message: 'All fields are required.' };
    }

    if (password !== password2) {
        return { status: 'error', message: 'Passwords do not match.' };
    }

    try {
        let uid = "";
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                uid = userCredential.user.uid;
            })
            .catch((error) => {
                return { status: 'error', message: error.message || 'Error authenticating.' };
            });

        const familyName = `${lastName}${Math.floor(1000 + Math.random() * 9000)}`;

        await set(ref(database, `user_profiles/${familyName}/admin/${uid}`), {
            uid: uid,
            role: "admin"
        });

        return { status: 'success', message: `Family admin registered with familyName: ${familyName}. Please log in!` };
    } catch (error) {
        return { status: 'error', message: 'Error registering family admin!' };
    }
};

export const registerFamilyUser = async (familyName: string, firstName: string, lastName: string, email: string, password: string, password2: string) => {
    if (!firstName || !lastName || !email || !password || !password2) {
        return { status: 'error', message: 'All fields are required.' };
    }

    if (password !== password2) {
        return { status: 'error', message: 'Passwords do not match.' };
    }

    try {
        const familyRef = ref(database, `user_profiles/${familyName}`);
        const familySnapshot = await get(familyRef);

        if (familySnapshot.exists()) {
            let uid = "";
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    uid = userCredential.user.uid;
                })
                .catch((error) => {
                    return { status: 'error', message: error.message || 'Error authenticating.' };
                });

            await set(ref(database, `user_profiles/${familyName}/user/${uid}`), {
                uid: uid,
                firstName: firstName,
                lastName: lastName,
                role: 'user'
            });

            return { status: 'success', message: `Family user registered with family name: ${familyName}. Please log in!` };
        } else {
            return { status: 'error', message: 'Family name does not exist.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Error registering family user!' };
    }
};