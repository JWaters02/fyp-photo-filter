import axios from 'axios';

const axiosWithAuth = () => {
    const token = sessionStorage.getItem('idToken');
    return axios.create({
        headers: {
            //'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Post to /api/sort
export const postSort = async (uid: string, familyName: string) => {
    try {
        const response = await axiosWithAuth().post('/api/sort', {uid, familyName});
        return response.data;
    } catch (error) {
        return { status: 'error', message: 'Error posting sort.' };
    }
};
