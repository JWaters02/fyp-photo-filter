import { database } from '../../firebase-config';
import { set, ref, query, orderByChild, equalTo, get } from "firebase/database";

/* nosql db structure for rules
"rules": {
    "Waters4369": {
        "YB33CE3UHuTySq8qq89brsvYQ593": {
            "action": "hidePhotosContaining",
            "subject": "Bobby Waters",
            "from": "Charlie Waters"
        },
        "7HMQj00RyHabDZOxKd7mnLnBa2E2": {
            "action": "hidePhotosUploadedBy",
            "subject": "Amanda Waters",
            "from": "Paul Waters"
        },
        "ANDJonTydjfH0f7RYpo2RGkbMvg2": {
            "action": "hidePhotosContaining",
            "subject": "Paul Waters",
            "from": "Amanda Waters"
        }
    }
},
*/

export const getRules = async (familyName: string) => {
    const rulesRef = ref(database, `rules/${familyName}`);
    const rulesSnapshot = await get(rulesRef);
    if (rulesSnapshot.exists()) {
        return { status: 'success', message: rulesSnapshot.val() };
    } else {
        return { status: 'error', message: 'No rules found.' };
    }
};

export const addRule = async (familyName: string, uid: string, action: string, subject: string, from: string) => {
    const ruleRef = ref(database, `rules/${familyName}/${uid}`);
    const ruleData = {
        action: action,
        subject: subject,
        from: from
    };

    try {
        await set(ruleRef, ruleData);
        return { status: 'success', message: 'Rule added.' };
    } catch (error) {
        return { status: 'error', message: 'Error adding rule.' + error };
    }
};
