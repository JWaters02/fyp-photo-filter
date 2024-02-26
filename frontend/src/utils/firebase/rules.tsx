import { database } from '../../firebase-config';
import { set, ref, query, orderByChild, equalTo, get } from "firebase/database";
import { Rule, RuleType } from '../../interfaces/rules';

export const getRulesByUid = async (uid: string) => {
    const userRef = ref(database, `${uid}/rules`);
    const rulesSnapshot = await get(userRef);
    if (rulesSnapshot.exists()) {
        return { status: 'success', message: rulesSnapshot.val() };
    } else {
        return { status: 'error', message: 'No rules found for this user.' };
    }
};

export const setRulesDb = async (uid: string, rules: Rule[]) => {
    console.log('setRulesDb', uid, rules);
    const newRules = rules.reduce((acc, rule) => {
        const { type, uid, user } = rule;

        if (!acc[type]) {
            acc[type] = {};
        }

        acc[type][uid] = user;

        return acc;
    }, {} as { [key in RuleType]: { [key: string]: string } });

    console.log('newRules', newRules);

    try {
        await set(ref(database, `${uid}/rules`), newRules);
        return { status: 'success', message: 'Rules updated successfully.' };
    } catch (error) {
        return { status: 'error', message: `Error setting rules.` };
    }
};
