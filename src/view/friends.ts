import {
    getFriends,
    getSentRequests,
    searchFriends,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    type User,
    type Friend, getReceivedRequests,
} from '../dao/friendship';
import { getToken } from '../dao/auth';

if (!getToken()) {
    window.location.href = '/public/login.html';
}

const createFriendsButton = () => {
    const button = document.createElement('div');
    button.className = 'friends-button';
    button.innerHTML = `
    <div class="friends-button-content">
      <i class="fa fa-users"></i>
      <span>Friends</span>
    </div>
  `;
    document.body.appendChild(button);
    return button;
};

const addStyles = () => {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/friends.css';

    document.head.appendChild(fontAwesome);
    document.head.appendChild(style);
};

const createFriendsPanel = () => {
    const panel = document.createElement('div');
    panel.className = 'friends-panel';
    panel.innerHTML = `
    <div class="friends-panel-content">
      <div class="friends-panel-header">
        <span class="friends-panel-title">Friends</span>
        <span class="friends-panel-close"><i class="fas fa-times"></i></span>
      </div>
      <div class="friends-panel-body">
        <div class="friends-panel-tabs">
          <div class="friends-panel-tab active" data-tab="friends">My Friends</div>
          <div class="friends-panel-tab" data-tab="requests">Requests</div>
          <div class="friends-panel-tab" data-tab="search">Search</div>
        </div>
        <div class="friends-panel-tab-content" id="friends">
          <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>
        </div>
        <div class="friends-panel-tab-content" id="requests">
          <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>
        </div>
        <div class="friends-panel-tab-content" id="search">
          <input type="text" class="search-input" placeholder="Search for friends...">
          <div id="search-results"></div>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(panel);
    return panel;
};

const loadFriends = async (container: Element) => {
    try {
        const friends: Friend[] = await getFriends();

        if (friends.length === 0) {
            container.innerHTML = '<div class="empty-state">You don\'t have any friends yet</div>';
            return;
        }

        container.innerHTML = '';

        friends.forEach(friend => {
            const initials = friend.username ? friend.username.substring(0, 2).toUpperCase() : '??';
            const friendshipId = friend.friendship_id || friend.id;

            const friendElement = document.createElement('div');
            friendElement.className = 'friend-item';
            friendElement.innerHTML = `
        <div class="friend-avatar">${initials}</div>
        <div class="friend-info">
          <div class="friend-username">${friend.username || 'Friend'}</div>
        </div>
        <button class="decline-btn" data-friendship-id="${friendshipId}">
          <i class="fas fa-user-times"></i>
        </button>
      `;
            container.appendChild(friendElement);
        });

        container.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    const friendshipId = (button as HTMLElement).dataset.friendshipId;
                    if (friendshipId && confirm('Are you sure you want to remove this friend?')) {
                        await deleteFriendRequest(parseInt(friendshipId));
                        const friendItem = button.closest('.friend-item') as HTMLElement;
                        friendItem.classList.add('removing');

                        setTimeout(() => {
                            friendItem.remove();
                            if (container.children.length === 0) {
                                container.innerHTML = '<div class="empty-state">You don\'t have any friends yet</div>';
                            }
                        }, 300);
                    }
                } catch (error: any) {
                    console.error('Error:', error);
                    alert(error instanceof Error ? error.message : 'An error occurred');
                }
            });
        });
    } catch (error: any) {
        console.error('Error loading friends:', error);
        container.innerHTML = '<div class="empty-state">Error loading friends</div>';
    }
};

const loadRequests = async (container: Element) => {
    try {
        const sentRequestsPromise = getSentRequests();
        const receivedRequestsPromise = getReceivedRequests();

        const [sentRequests, receivedRequests] = await Promise.all([sentRequestsPromise, receivedRequestsPromise]);

        container.innerHTML = '';

        if (receivedRequests.length > 0) {
            const receivedSection = document.createElement('div');
            receivedSection.className = 'requests-section';
            receivedSection.innerHTML = '<h4 class="section-title">Received Requests</h4>';
            container.appendChild(receivedSection);

            receivedRequests.forEach(request => {
                const initials = request.username ? request.username.substring(0, 2).toUpperCase() : '??';

                const requestElement = document.createElement('div');
                requestElement.className = 'request-item';
                requestElement.innerHTML = `
                    <div class="request-avatar">${initials}</div>
                    <div class="request-info">
                        <div class="request-username">${request.username || 'User'}</div>
                        <div class="request-email">${request.email || ''}</div>
                    </div>
                    <div class="request-actions">
                        <button class="accept-btn" data-request-id="${request.id}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="decline-btn" data-request-id="${request.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                receivedSection.appendChild(requestElement);
            });
        } else {
            const receivedSection = document.createElement('div');
            receivedSection.className = 'requests-section';
            receivedSection.innerHTML = `
                <h4 class="section-title">Received Requests</h4>
                <div class="empty-state">No friend requests received</div>
            `;
            container.appendChild(receivedSection);
        }

        if (sentRequests.length > 0) {
            const sentSection = document.createElement('div');
            sentSection.className = 'requests-section';
            sentSection.innerHTML = '<h4 class="section-title">Sent Requests</h4>';
            container.appendChild(sentSection);

            sentRequests.forEach(request => {
                const initials = request.username ? request.username.substring(0, 2).toUpperCase() : '??';

                const requestElement = document.createElement('div');
                requestElement.className = 'request-item';
                requestElement.innerHTML = `
                    <div class="request-avatar">${initials}</div>
                    <div class="request-info">
                        <div class="request-username">${request.username || 'User'}</div>
                        <div class="request-email">${request.email || ''}</div>
                    </div>
                    <button class="decline-btn" data-request-id="${request.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                sentSection.appendChild(requestElement);
            });
        } else {
            const sentSection = document.createElement('div');
            sentSection.className = 'requests-section';
            sentSection.innerHTML = `
                <h4 class="section-title">Sent Requests</h4>
                <div class="empty-state">No pending sent requests</div>
            `;
            container.appendChild(sentSection);
        }

        container.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    const requestId = (button as HTMLElement).dataset.requestId;
                    if (requestId) {
                        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        (button as HTMLButtonElement).disabled = true;
                        await acceptFriendRequest(parseInt(requestId));

                        const requestItem = button.closest('.request-item') as HTMLElement;
                        requestItem.classList.add('accepting');

                        setTimeout(() => {
                            loadRequests(container);
                            const friendsContainer = document.querySelector('#friends');
                            if (friendsContainer) {
                                loadFriends(friendsContainer);
                            }
                        }, 300);
                    }
                } catch (error: any) {
                    console.error('Error:', error);
                    alert(error instanceof Error ? error.message : 'An error occurred');
                }
            });
        });

        container.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    const requestId = (button as HTMLElement).dataset.requestId;
                    if (requestId) {
                        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        (button as HTMLButtonElement).disabled = true;
                        await deleteFriendRequest(parseInt(requestId));

                        const requestItem = button.closest('.request-item') as HTMLElement;
                        requestItem.classList.add('declining');

                        setTimeout(() => {
                            loadRequests(container);
                        }, 300);
                    }
                } catch (error: any) {
                    console.error('Error:', error);
                    alert(error instanceof Error ? error.message : 'An error occurred');
                }
            });
        });

    } catch (error: any) {
        console.error('Error loading requests:', error);
        container.innerHTML = '<div class="empty-state">Error loading friend requests</div>';
    }
};

const setupSearch = (
    input: HTMLInputElement,
    resultsContainer: Element,
    requestsContainer: Element
) => {
    input.addEventListener('input', async (e: Event) => {
        const query = (e.target as HTMLInputElement).value.trim();

        if (!query) {
            resultsContainer.innerHTML = '';
            return;
        }

        resultsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';

        try {
            const results: User[] = await searchFriends(query);

            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="empty-state">No users found</div>';
                return;
            }

            resultsContainer.innerHTML = '';

            results.forEach(user => {
                const initials = user.username ? user.username.substring(0, 2).toUpperCase() : '??';

                const userElement = document.createElement('div');
                userElement.className = 'search-result-item';
                userElement.innerHTML = `
          <div class="search-avatar">${initials}</div>
          <div class="search-info">
            <div class="search-username">${user.username || 'User'}</div>
          </div>
          <div class="search-actions">
            <button class="add-friend-btn" data-user-id="${user.id}">
              <i class="fas fa-user-plus"></i>
            </button>
          </div>
        `;
                resultsContainer.appendChild(userElement);
            });

            resultsContainer.querySelectorAll('.add-friend-btn').forEach(button => {
                button.addEventListener('click', async () => {
                    try {
                        const userId = (button as HTMLElement).dataset.userId;
                        if (userId) {
                            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                            (button as HTMLButtonElement).disabled = true;
                            await sendFriendRequest(parseInt(userId));
                            button.innerHTML = '<i class="fas fa-check"></i>';
                            button.classList.add('request-sent');

                            setTimeout(() => {
                                loadRequests(requestsContainer);
                                const userItem = button.closest('.search-result-item') as HTMLElement;
                                userItem.classList.add('removing');
                                userItem.classList.add('friend-item');
                                setTimeout(() => {
                                    userItem.remove();
                                    if (resultsContainer.children.length === 0) {
                                        resultsContainer.innerHTML = '<div class="empty-state">No users found</div>';
                                    }
                                }, 300);
                            }, 1000);
                        }
                    } catch (error: any) {
                        console.error('Error:', error);
                        alert(error instanceof Error ? error.message : 'An error occurred');
                    }
                });
            });

        } catch (error: any) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<div class="empty-state">Search error</div>';
        }
    });
};

const initFriends = () => {
    addStyles();
    const friendsButton = createFriendsButton();

    friendsButton.addEventListener('click', () => {
        const panel = createFriendsPanel();

        const closeButton = panel.querySelector('.friends-panel-close');
        closeButton?.addEventListener('click', () => {
            panel.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => panel.remove(), 300);
        });

        const tabs = panel.querySelectorAll('.friends-panel-tab');
        const tabContents = {
            friends: panel.querySelector('#friends') as HTMLElement | null,
            requests: panel.querySelector('#requests') as HTMLElement | null,
            search: panel.querySelector('#search') as HTMLElement | null
        };

        const showTab = (tabName: string) => {
            tabs.forEach(tab => {
                const tabElement = tab as HTMLElement;
                tabElement.classList.toggle('active', tabElement.dataset.tab === tabName);
            });

            Object.values(tabContents).forEach(content => {
                if (content) {
                    (content as HTMLElement).style.display = 'none';
                }
            });

            const selectedTab = tabContents[tabName as keyof typeof tabContents];
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }

            if (tabName === 'friends' && tabContents.friends) {
                loadFriends(tabContents.friends);
            } else if (tabName === 'requests' && tabContents.requests) {
                loadRequests(tabContents.requests);
            }
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabElement = tab as HTMLElement;
                const tabName = tabElement.dataset.tab;
                if (tabName) {
                    showTab(tabName);
                }
            });
        });

        const searchInput = panel.querySelector('.search-input') as HTMLInputElement;
        const searchResults = panel.querySelector('#search-results') as HTMLElement;
        if (searchInput && searchResults && tabContents.requests) {
            setupSearch(searchInput, searchResults, tabContents.requests);
        }

        showTab('friends');
    });
};

initFriends();