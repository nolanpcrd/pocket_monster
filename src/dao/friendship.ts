import {API_ROUTES} from '../constants/apiRoutes';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Friend extends User {
    id: number;
    friendship_id?: number;
}

interface FriendRequest {
    id: number;
    user_id1?: number;
    user_id2?: number;
    status?: number;
    created_at: string;
    username: string;
    email?: string;
}

export const sendFriendRequest = async (friendId: number): Promise<any> => {
    const response = await fetch(API_ROUTES.FRIENDSHIPS.SEND_REQUEST, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ friend_id: friendId })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi de la demande d\'ami');
    }

    return data;
};

export const acceptFriendRequest = async (friendshipId: number): Promise<any> => {
    const response = await fetch(API_ROUTES.FRIENDSHIPS.ACCEPT_REQUEST.replace(':id', friendshipId.toString()), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'acceptation de la demande d\'ami');
    }

    return data;
};

export const deleteFriendRequest = async (friendshipId: number): Promise<void> => {
    const response = await fetch(API_ROUTES.FRIENDSHIPS.DELETE_REQUEST.replace(':id', friendshipId.toString()), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression de la demande d\'ami');
    }
};

export const getFriends = async (): Promise<Friend[]> => {
    try {
        const response = await fetch(API_ROUTES.FRIENDSHIPS.GET_FRIENDS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Non autorisé. Veuillez vous reconnecter.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la récupération des amis');
        }

        const data: Friend[] = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur dans getFriends:', error);
        throw error;
    }
};

export const getSentRequests = async (): Promise<FriendRequest[]> => {
    const response = await fetch(API_ROUTES.FRIENDSHIPS.GET_SENT_REQUESTS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Non autorisé. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des demandes envoyées');
    }

    return await response.json();
};

export const getReceivedRequests = async (): Promise<FriendRequest[]> => {
    const response = await fetch(API_ROUTES.FRIENDSHIPS.GET_RECEIVED_REQUESTS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Non autorisé. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des demandes reçues');
    }

    return await response.json();
};

export const searchFriends = async (query: string): Promise<User[]> => {
    const response = await fetch(`${API_ROUTES.FRIENDSHIPS.SEARCH}?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Non autorisé. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la recherche d\'utilisateurs');
    }

    return await response.json();
};