import { auth, database } from '../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { set, ref, get } from "firebase/database";

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

        const familyRef = ref(database, `${familyName}/${uid}`);
        const familySnapshot = await get(familyRef);

        if (familySnapshot.exists()) {
            sessionStorage.setItem('uid', uid);
            return { status: 'success', message: `Logged in with familyName: ${familyName}` };
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
};

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
};

export const getIsReadyForSort = async (uid: string) => {
    try {
        const familyMembers = await getFamilyMembers(uid);
        if (Array.isArray(familyMembers)) {
            for (const member of familyMembers) {
                const userInfo = await getUserInfo(member.uid);
                if (!userInfo.bIsReadyForSort) {
                    return { status: 'warning', message: 'Not all family members are ready for sort.' };
                }
            }
            return { status: 'success', message: 'All family members are ready for sort.' };
        }

        if (familyMembers.status === 'error') {
            return { status: 'error', message: familyMembers.message };
        }

    } catch (error) {
        return { status: 'error', message: 'Failed to fetch data.' };
    }
};


export const getUserInfo = async (uid: string) => {
    try {
        const userRef = ref(database, `${uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
            return userSnapshot.val();
        } else {
            return { status: 'error', message: 'User does not exist.' };
        }
    } catch (error: any) {
        return { status: 'error', message: `Error getting user info: ${error.message}` };
    }
};

export const getFamilyMembers = async (uid: string) => {
    try {
        const userInfo = await getUserInfo(uid);
        if (!userInfo || !userInfo.familyName) {
            return { status: 'error', message: 'Unable to find user or family name.' };
        }

        const familyName = userInfo.familyName;
        const familyRef = ref(database, `${familyName}`);
        const familySnapshot = await get(familyRef);
        if (!familySnapshot.exists()) {
            return { status: 'error', message: 'Family does not exist.' };
        }
        
        const familyMembersData = familySnapshot.val();
        const familyMemberList = [];
        for (const memberUid in familyMembersData) {
            const memberName = familyMembersData[memberUid];
            if (memberName !== 'admin') {
                const [firstName, lastName] = memberName.split(" ");
                familyMemberList.push({ uid: memberUid, firstName, lastName });
            }
        }

        return familyMemberList;
    } catch (error: any) {
        return { status: 'error', message: `Error getting family members: ${error.message}` };
    }
};

export const setUserInfo = async (uid: string, familyName: string, firstName: string, lastName: string, age: number, sex: string, ethnicity: string, familyRole: string, bIsReadyForSort: boolean) => {
    if (!uid || !familyName || !firstName || !lastName || !age || !sex || !ethnicity) {
        return { status: 'error', message: 'All fields are required.' };
    }

    try {
        await set(ref(database, `${uid}`), {
            role: 'user',
            uid,
            familyName,
            firstName,
            lastName,
            age,
            sex,
            ethnicity,
            bIsReadyForSort
        });

        await set(ref(database, `${familyName}/${uid}`), `${firstName} ${lastName}`);

        return { status: 'success', message: 'User info updated.' };
    } catch (error: any) {
        return { status: 'error', message: `Error setting user info: ${error.message}` };
    }
};

export const setAdminInfo = async (uid: string, familyName: string, bIsReadyForSort: boolean) => {
    if (!uid) {
        return { status: 'error', message: 'All fields are required.' };
    }

    try {
        await set(ref(database, `${uid}`), {
            role: 'admin',
            uid,
            familyName,
            bIsReadyForSort
        });

        return { status: 'success', message: 'Admin info updated.' };
    } catch (error: any) {
        return { status: 'error', message: `Error setting admin info.` };
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
            });

        const familyName = `${lastName}${Math.floor(1000 + Math.random() * 9000)}`;

        await set(ref(database, `${uid}`), {
            role: "admin",
            uid: uid,
            familyName: familyName
        });

        await set(ref(database, `${familyName}/${uid}`), `admin`);

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
        const familyRef = ref(database, `${familyName}`);
        const familySnapshot = await get(familyRef);

        if (familySnapshot.exists()) {
            let uid = "";
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    uid = userCredential.user.uid;
                });

            await set(ref(database, `${uid}`), {
                role: "user",
                familyName: familyName,
                firstName: firstName,
                lastName: lastName,
                uid: uid
            });

            await set(ref(database, `${familyName}/${uid}`), `${firstName} ${lastName}`);

            return { status: 'success', message: `Family user registered with family name: ${familyName}. Please log in!` };
        } else {
            return { status: 'error', message: 'Family name does not exist.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Error registering family user!' };
    }
};